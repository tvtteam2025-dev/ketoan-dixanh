import json
import os
import sys
import uuid
from datetime import datetime

import main


def is_uuid(value: str) -> bool:
    try:
        uuid.UUID(str(value).strip())
        return True
    except (ValueError, AttributeError):
        return False


worksheet = main.incident_tracking_worksheet()
values = worksheet.get_all_values()
stamp = datetime.now().strftime("%Y%m%d%H%M%S")
backup_path = f"/opt/quanlycuocxe/data/incident-sheet-before-id-migration-{stamp}.json"
os.makedirs(os.path.dirname(backup_path), exist_ok=True)
with open(backup_path, "w", encoding="utf-8") as backup_file:
    json.dump(values, backup_file, ensure_ascii=False, indent=2)

updates = []
migrated = 0
ids_added = 0
for row_number, source in enumerate(values[1:], start=2):
    row = source + [""] * max(0, len(main.INCIDENT_HEADERS) - len(source))
    if not any(str(value).strip() for value in row[1:]):
        continue
    current_id = str(row[1]).strip()
    if is_uuid(current_id):
        continue
    generated_id = str(uuid.uuid4())
    if current_id:
        # Old layout: A=stt, B=department ... H=violator. Move it one column right.
        updates.extend(
            [
                {"range": f"A{row_number}", "values": [[""]]},
                {"range": f"B{row_number}:G{row_number}", "values": [[generated_id] + row[1:6]]},
                {"range": f"H{row_number}", "values": [[""]]},
                {"range": f"I{row_number}:X{row_number}", "values": [row[7:23]]},
            ]
        )
        migrated += 1
    else:
        updates.append({"range": f"B{row_number}", "values": [[generated_id]]})
        ids_added += 1

if "--apply" in sys.argv and updates:
    worksheet.batch_update(updates, value_input_option="RAW")
if "--apply" in sys.argv:
    worksheet.batch_update(
        [
            {"range": "A1", "values": [["stt"]]},
            {"range": "H1", "values": [["tienDoBienBan"]]},
        ],
        value_input_option="RAW",
    )
    worksheet.batch_update(
        [
            {"range": "A2", "values": [['=ARRAYFORMULA(IF(E2:E="";"";ROW(E2:E)-1))']]},
            {
                "range": "H2",
                "values": [[
                    '=ARRAYFORMULA(IF(E2:E="";"";IF(R2:R="";'
                    'IF(G2:G>=NOW();"Còn lại "&INT(G2:G-NOW())&" ngày "&INT(MOD((G2:G-NOW())*24;24))&" giờ";'
                    '"Trễ hạn "&INT(NOW()-G2:G)&" ngày "&INT(MOD((NOW()-G2:G)*24;24))&" giờ");'
                    'IF(R2:R<=G2:G;"Đúng hạn";"Trễ hạn"))))'
                ]]},
        ],
        value_input_option="USER_ENTERED",
    )

print(json.dumps({"migrated": migrated, "idsAdded": ids_added, "applied": "--apply" in sys.argv, "backup": backup_path}))
