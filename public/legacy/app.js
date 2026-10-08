const state = {
  authToken: window.localStorage.getItem("diXanhAuthToken") || "",
  currentUser: null,
  permissions: { views: [], actions: [] },
  roles: {},
  users: [],
  reopenRequests: [],
  systemLogs: [],
  systemCatalogs: [],
  systemCatalogsLoaded: false,
  roster: [],
  calendarVehicleOrder: [],
  franchiseVehicles: [],
  customers: [],
  contracts: [],
  contractPricing: null,
  vouchers: [],
  selectedVoucherIds: new Set(),
  promotions: [],
  orders: [],
  orderFeedback: [],
  cskhShiftReports: [],
  invoiceOrders: [],
  invoiceGroupCandidates: [],
  invoiceGroupSelection: new Set(),
  invoiceGroupSearch: "",
  debtOrders: [],
  commissionOrders: [],
  attendance: { month: "", contracts: [], roster: [] },
  cargoAttendance: { month: "", roster: [] },
  driverSalaries: { drivers: [], rows: [] },
  driverAreas: { drivers: [], rows: [], areas: [] },
  payroll: { month: "", viewType: "travel", rows: [] },
  payrollHolidays: { month: "", rows: [], locked: false, locks: {} },
  payrollNotes: {},
  closedPayroll: { month: "", viewType: "travel", rows: [], locked: false },
  payrollDeductions: { month: "", rows: [], drivers: [] },
  deductionTypes: [],
  carWash: { rows: [], drivers: [], onShiftDrivers: [], fromDate: "", toDate: "", vehicleCount: 0, washCount: 0 },
  fuel: { rows: [], drivers: [], prices: [], standard: [], standardMonth: "", standardRate: 0.075, price: 0, priceDeclared: false, standardLocked: false, standardLockedBy: "", standardLockedAt: "" },
  allowanceTypes: [],
  editingOrderId: "",
  filters: {
    customer: "",
    contract: "",
    voucher: "",
    voucherCampaign: "",
    promotion: "",
    order: "",
    orderStatus: "",
    driverNotificationStatus: "",
    invoiceOrder: "",
    invoiceStatus: "",
    debtOrder: "",
    debtStatus: "",
    commissionOrder: "",
    commissionStatus: "",
    orderFeedback: "",
    orderFeedbackStatus: "",
    vehicle: "",
    franchiseVehicle: "",
    driverSalary: "",
    driverArea: "",
    dashboardDate: "",
    systemLog: "",
    systemLogAction: "",
  },
  orderBenefits: {
    voucherIds: [],
    promotionIds: [],
    voucherOpen: false,
    promotionOpen: false,
    voucherSearch: "",
    promotionSearch: "",
  },
  activeView: "dashboard",
  loadedSources: new Set(),
};

const APP_VERSION_STORAGE_KEY = "diXanhAppVersion";
const APP_VERSION_CHECK_INTERVAL_MS = 60 * 1000;

const pageMeta = {
  dashboard: ["Tổng quan", "Theo dõi khách hàng, hợp đồng/tuyến và đơn hàng điều xe."],
  customers: ["Khách hàng", "Mỗi số điện thoại chỉ được khai báo một lần."],
  contracts: ["Hợp đồng/tuyến", "Khai báo các tuyến/hợp đồng mẫu để tạo đơn hàng."],
  contractPricing: ["Tra cứu giá hợp đồng", "Nhập quãng đường để xem giá 1 chiều, 2 chiều và thời gian chờ miễn phí."],
  overnightCalculator: ["Tính chi phí sử dụng xe", "Tính tổng giờ sử dụng, giờ chờ tính phí và chi phí lưu đêm."],
  vouchers: ["Voucher", "Quản lý mã voucher còn hạn, hết hạn và lịch sử sử dụng."],
  promotions: ["Khuyến mãi", "Quản lý chương trình khuyến mãi có thể áp dụng cho đơn hàng."],
  orders: ["Đơn hàng", "Gán khách hàng vào tuyến, điều xe và theo dõi hóa đơn."],
  attendance: ["Chấm Công Lái Xe", "Chọn nhóm tài xế để xem bảng công Travel hoặc Xe Hàng."],
  cargoAttendance: ["Chấm Công Xe Hàng", "Bảng công riêng cho lái xe Tải Van 945KG."],
  driverSalaries: ["Khai báo lương lái xe", "Lưu tài khoản nhận lương và mức lương theo từng tháng hiệu lực."],
  driverAreas: ["Khu vực hoạt động lái xe", "Kế toán khai báo khu vực theo mã nhân viên để dùng khi xuất Lệnh nộp tiền."],
  payroll: ["Bảng lương lái xe", "Tổng hợp lương Travel và Xe Hàng theo từng tháng."],
  closedPayroll: ["Bảng lương đã chốt", "Lưu lịch sử bảng lương đã khóa và xác nhận chuyển lương."],
  payrollDeductions: ["Quản lý khoản trừ lương", "Khai báo các khoản trừ theo từng tài xế và tháng."],
  fuel: ["Quản lý xăng Travel", "Theo dõi nhiên liệu, định mức 0,075 lít/km và chi phí của lái xe Travel."],
  fuelStandard: ["Tính định mức xăng Travel", "Đối chiếu kilomet, số lít đã đổ và định mức tiêu hao của lái xe Travel."],
  fuelPrices: ["Khai báo giá xăng theo tháng", "Lưu đơn giá xăng áp dụng cho việc tính định mức theo từng tháng."],
  carWash: ["Quản lý rửa xe", "Xác nhận lượt rửa theo danh sách tài xế Travel lên ca trong ngày."],
  invoiceOrders: ["Hóa đơn", "Theo dõi các đơn khách hàng yêu cầu xuất hóa đơn."],
  debtOrders: ["Công nợ", "Theo dõi và xác nhận thu hồi công nợ của từng đơn hàng."],
  commissionOrders: ["Hoa hồng xe thương quyền", "Theo dõi và xác nhận các khoản hoa hồng phải thu từ xe thương quyền hợp tác."],
  orderFeedback: ["Phản hồi khách hàng", "Theo dõi đánh giá, nội dung phản hồi và kết quả chăm sóc sau chuyến đi."],
  cskhShiftReports: ["Báo cáo ca CSKH", "Nhập và theo dõi các chỉ số làm việc theo từng ca CSKH."],
  reports: ["Báo cáo", "Chọn loại báo cáo và xuất file Excel."],
  reopenApprovals: ["Duyệt mở lại", "Duyệt hoặc từ chối yêu cầu mở lại đơn hàng đã hoàn thành."],
  calendar: ["Lịch điều xe", "Xem xe trống và xe đang phục vụ theo từng ngày."],
  vehicles: ["Xe lên ca", "Dữ liệu lấy từ sheet DANH_SACH_LEN_CA."],
  franchiseVehicles: ["Xe thương quyền", "Khai báo xe hợp tác ngoài và tỷ lệ nộp lại công ty."],
  permissions: ["Tài khoản Kế toán", "Admin tạo tài khoản Kế toán và reset mật khẩu khi cần."],
  systemLogs: ["Lịch sử thay đổi", "Theo dõi tài khoản và nội dung đã thay đổi trên hệ thống."],
  systemCatalogs: ["Quản trị hệ thống", "Quản lý các danh mục dùng chung trong toàn bộ ứng dụng."],
};

const systemLogActionLabels = {
  update_order: "Cập nhật đơn hàng",
  assign_order_vehicle: "Điều xe",
  complete_order: "Hoàn thành đơn",
  delete_order: "Xóa đơn hàng",
  request_reopen: "Yêu cầu mở lại",
  approve_reopen: "Duyệt mở lại",
  reject_reignName(row.tenVoucher))}</td>
            <td>${escapeHtml(benefitValueText(row))}</td>
            <td>${escapeHtml(row.ngayBatDau || row.ngayHetHan ? [row.ngayBatDau, row.ngayHetHan || "Không giới hạn"].filter(Boolean).join(" - ") : "Không giới hạn")}</td>
            <td><span class="pill ${normalize(row.trangThaiSuDung).includes("da su dung") ? "done" : benefitIsSelectable(row) ? "running" : "cancelled"}">${escapeHtml(row.trangThaiSuDung || row.trangThai || "")}</span></td>
            <td>${row.donHangId ? `<strong>${escapeHtml(row.tenKhach || "")}</strong><div class="muted">${escapeHtml(row.donHangId)}</div>` : '<span class="muted">Chưa sử dụng</span>'}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="8" class="empty">Chưa có voucher.</td></tr>`;
  const visibleIds = rows.map((row) => String(row.id));
  const selectedVisibleCount = visibleIds.filter((id) => state.selectedVoucherIds.has(id)).length;
  if (els.selectAllVouchersCheckbox) {
    els.selectAllVouchersCheckbox.checked = visibleIds.length > 0 && selectedVisibleCount === visibleIds.length;
    els.selectAllVouchersCheckbox.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < visibleIds.length;
  }
  if (els.printSelectedVouchersButton) {
    const count = state.selectedVoucherIds.size;
    els.printSelectedVouchersButton.disabled = count === 0;
    els.printSelectedVouchersButton.textContent = count ? `In ${count} voucher đã chọn` : "In voucher đã chọn";
  }
  if (els.deleteVoucherCampaignButton) {
    const campaign = state.filters.voucherCampaign || "";
    const campaignCount = state.vouchers.filter((row) => voucherCampaignName(row.tenVoucher) === campaign).length;
    els.deleteVoucherCampaignButton.hidden = !campaign || !can("manage_benefits");
    els.deleteVoucherCampaignButton.disabled = !campaignCount;
    els.deleteVoucherCampaignButton.textContent = campaignCount
      ? `Xóa toàn bộ chiến dịch (${campaignCount})`
      : "Xóa toàn bộ chiến dịch";
  }
}

function renderPromotions() {
  const rows = state.promotions.filter((row) => matches(row, state.filters.promotion));
  els.promotionTable.innerHTML =
    rows
      .map(
        (row, index) => `
          <tr data-detail-type="promotion" data-id="${escapeHtml(row.id)}">
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(row.tenChuongTrinh)}</strong></td>
            <td>${escapeHtml(benefitValueText(row))}</td>
            <td>${escapeHtml(row.ngayBatDau || row.ngayHetHan ? [row.ngayBatDau, row.ngayHetHan || "Không giới hạn"].filter(Boolean).join(" - ") : "Không giới hạn")}</td>
            <td><span class="pill ${benefitIsSelectable(row) ? "running" : "cancelled"}">${escapeHtml(row.trangThaiHieuLuc || row.trangThai || "")}</span></td>
            <td>${escapeHtml(row.ghiChu || "")}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="6" class="empty">Chưa có chương trình khuyến mãi.</td></tr>`;
}

function renderVehicles() {
  const rows = uniqueRosterVehicles().filter((row) => matches(row, state.filters.vehicle));
  els.vehicleTable.innerHTML =
    rows
      .map(
        (row) => `
          <tr>
            <td><strong>${escapeHtml(row.bienKiemSoat)}</strong></td>
            <td>${escapeHtml(formatDate(row.thoiGianTao))}</td>
            <td>${escapeHtml(row.soHieuXe)}</td>
            <td>${escapeHtml(row.loai_xe || row.loaiXe)}</td>
            <td>${escapeHtml(row.so_cho || row.soCho)}</td>
            <td>${escapeHtml(driverText(row))}</td>
            <td>${escapeHtml(row.khuVucHoatDong)}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="7" class="empty">Chưa có xe lên ca.</td></tr>`;
}

function renderFranchiseVehicles() {
  const rows = state.franchiseVehicles.filter((row) => matches(row, state.filters.franchiseVehicle));
  els.franchiseVehicleTable.innerHTML =
    rows
      .map(
        (row) => `
          <tr data-detail-type="franchiseVehicle" data-id="${escapeHtml(row.id)}">
            <td><strong>${escapeHtml(row.bienKiemSoat)}</strong></td>
            <td>${escapeHtml(row.dongXe || "")}</td>
            <td>${escapeHtml(row.hieuXe || "")}${row.soCho ? `<div class="muted">${escapeHtml(row.soCho)}</div>` : ""}</td>
            <td><strong>${escapeHtml(row.tenChuXe || "")}</strong><div class="muted">${escapeHtml(row.soDienThoaiChuXe || "")}</div></td>
            <td><strong>${escapeHtml(row.hoTenLaiXe || "")}</strong><div class="muted">${escapeHtml(row.soDienThoaiLaiXe || "")}</div>${row.diaChiLaiXe ? `<div class="muted">${escapeHtml(row.diaChiLaiXe)}</div>` : ""}</td>
            <td><span class="pill ${normalize(row.trangThai).includes("ngung") ? "" : "done"}">${escapeHtml(row.trangThai || "Đang hợp tác")}</span></td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="6" class="empty">Chưa có xe thương quyền.</td></tr>`;
}

function renderInvoiceOrders() {
  if (!els.invoiceOrderTable) return;
  const fromDate = nativeDateValue(els.invoiceReportDateInput?.value || "");
  const toDate = nativeDateValue(els.invoiceReportDateToInput?.value || "");
  const rows = state.invoiceOrders
    .filter((row) => matches(row, state.filters.invoiceOrder))
    .filter((row) => dateKeyInRange(orderDateKey(row), fromDate, toDate))
    .filter((row) => !state.filters.invoiceStatus || invoiceOrderStatus(row) === state.filters.invoiceStatus);
  const invoiceBeforeVatTotal = rows.reduce((total, row) => total + invoiceFinancialAmounts(row).beforeVat, 0);
  const invoiceVatTotal = rows.reduce((total, row) => total + invoiceFinancialAmounts(row).vat, 0);
  const invoiceAfterVatTotal = rows.reduce((total, row) => total + invoiceFinancialAmounts(row).total, 0);
  const issuedCount = rows.filter((row) => normalize(invoiceOrderStatus(row)) === "da xuat").length;
  renderReportViewSummary(els.invoiceReportSummary, [
    ["Tổng tiền chưa VAT", formatMoney(invoiceBeforeVatTotal) || "0"],
    ["Số tiền VAT", formatMoney(invoiceVatTotal) || "0"],
    ["Tổng sau VAT", formatMoney(invoiceAfterVatTotal) || "0"],
    ["Số hóa đơn", rows.length],
    ["Đã xuất", issuedCount],
    ["Chưa xuất", rows.length - issuedCount],
  ]);
  els.invoiceOrderTable.innerHTML =
    rows
      .map((row) => {
        const status = invoiceOrderStatus(row);
        const isIssued = normalize(status) === "da xuat";
        const financial = invoiceFinancialAmounts(row);
        const routeText = row.tuyen || row.loaiHopDong || "";
        const points = [row.diemDon, row.diemTra].filter(Boolean).join(" -> ");
        const action = can("manage_invoices")
          ? `<button class="small ${isIssued ? "secondary" : ""}" data-action="mark-invoice-status" data-order-id="${escapeHtml(row.id)}" data-entity-type="${escapeHtml(row.invoiceEntityType || "order")}" data-status="${isIssued ? "Chưa xuất" : "Đã xuất"}" type="button">${isIssued ? "Đánh dấu chưa xuất" : "Xác nhận đã xuất"}</button>`
          : "";
        return `
          <tr ${row.invoiceEntityType === "invoiceGroup" ? "" : `data-detail-type="order" data-id="${escapeHtml(row.id)}"`}>
            <td><strong>${escapeHtml(row.orderCode || row.id)}</strong>${row.invoiceEntityType === "sharedPassenger" ? `<div class="muted">Khách ghép: ${escapeHtml(row.id)}</div>` : ""}${row.invoiceEntityType === "invoiceGroup" ? `<div class="muted">${escapeHtml(row.soDonTrongNhom || 0)} đơn hàng</div>` : ""}</td>
            <td class="date-time-cell">${formatDateTimeCell(row.ngayGioDi)}</td>
            <td><strong>${escapeHtml(row.tenKhach || "")}</strong><div class="muted">${escapeHtml(row.soDienThoai || "")}</div></td>
            <td><strong>${escapeHtml(row.tenCongTy || row.tenKhach || "")}</strong><div class="muted">MST: ${escapeHtml(row.maSoThue || "")}</div>${row.nhomHoaDonId ? `<div class="muted">Nhóm HĐ: ${escapeHtml(row.nhomHoaDonId)}</div>` : ""}<div class="muted">${escapeHtml(row.diaChiHoaDon || "")}</div><div class="muted">${escapeHtml(row.emailHoaDon || "")}</div></td>
            <td><strong>${escapeHtml(routeText)}</strong><div class="muted">${escapeHtml(points)}</div></td>
            <td>
              <div>Chưa VAT: <strong>${escapeHtml(formatMoney(financial.beforeVat)) || "0"}</strong></div>
              <div class="muted">VAT: ${escapeHtml(formatMoney(financial.vat)) || "0"}</div>
              <div>Sau VAT: <strong>${escapeHtml(formatMoney(financial.total)) || "0"}</strong></div>
            </td>
            <td><span class="pill ${isIssued ? "done" : "running"}">${escapeHtml(status)}</span>${row.ngayXuatHoaDon ? `<div class="muted">${escapeHtml(formatDateTime(row.ngayXuatHoaDon))}</div>` : ""}${row.nguoiXuatHoaDon ? `<div class="muted">${escapeHtml(row.nguoiXuatHoaDon)}</div>` : ""}</td>
            <td class="action-cell">${action}</td>
          </tr>
        `;
      })
      .join("") || `<tr><td colspan="8" class="empty">Không có hóa đơn trong ngày đã chọn.</td></tr>`;
}

function debtOrderStatus(row) {
  return row.trangThaiCongNo || "Chưa thu hồi";
}

function renderReportViewSummary(container, items) {
  if (!container) return;
  container.innerHTML = items.map(([label, value]) => `
    <article>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");
}

function renderDebtOrders() {
  if (!els.debtOrderTable) return;
  const fromDate = nativeDateValue(els.debtReportDateInput?.value || "");
  const toDate = nativeDateValue(els.debtReportDateToInput?.value || "");
  const rows = state.debtOrders
    .filter((row) => matches(row, state.filters.debtOrder))
    .filter((row) => dateKeyInRange(orderDateKey(row), fromDate, toDate))
    .filter((row) => !state.filters.debtStatus || debtOrderStatus(row) === state.filters.debtStatus);
  const debtTotal = rows.reduce((total, row) => total + parseMoney(row.soTienCongNo), 0);
  const recoveredTotal = rows
    .filter((row) => normalize(debtOrderStatus(row)) === "da thu hoi")
    .reduce((total, row) => total + parseMoney(row.soTienCongNo), 0);
  renderReportViewSummary(els.debtReportSummary, [
    ["Số đơn công nợ", rows.length],
    ["Tổng công nợ", formatMoney(debtTotal) || "0"],
    ["Đã thu hồi", formatMoney(recoveredTotal) || "0"],
    ["Chưa thu hồi", formatMoney(Math.max(debtTotal - recoveredTotal, 0)) || "0"],
  ]);
  els.debtOrderTable.innerHTML =
    rows
      .map((row) => {
        const status = debtOrderStatus(row);
        const recovered = normalize(status) === "da thu hoi";
        const routeLabel = row.tuyen || [row.diemDon, row.diemTra].filter(Boolean).join(" -> ");
        const entityType = row.debtEntityType || "order";
        const orderCode = row.orderCode || row.id || "";
        const sharedPassengerLabel = entityType === "sharedPassenger"
          ? `<div class="muted">Khách ghép: ${escapeHtml(row.id || "")}</div>`
          : "";
        const action = can("manage_debts")
          ? `<button class="small ${recovered ? "secondary" : ""}" data-action="mark-debt-status" data-order-id="${escapeHtml(row.id)}" data-entity-type="${escapeHtml(entityType)}" data-status="${recovered ? "Chưa thu hồi" : "Đã thu hồi"}" type="button">${recovered ? "Chuyển về chưa thu hồi" : "Xác nhận đã thu hồi"}</button>`
          : "";
        return `
          <tr data-detail-type="order" data-id="${escapeHtml(orderCode)}">
            <td><strong>${escapeHtml(orderCode)}</strong>${sharedPassengerLabel}</td>
            <td class="date-time-cell">${formatDateTimeCell(row.ngayGioDi)}</td>
            <td><strong>${escapeHtml(row.tenKhach || "")}</strong><div class="muted">${escapeHtml(row.soDienThoai || "")}</div></td>
            <td><strong>${escapeHtml(row.congNoChoAi || "")}</strong></td>
            <td><strong>${escapeHtml(routeLabel)}</strong></td>
            <td><strong>${escapeHtml(formatMoney(row.soTienCongNo)) || "0"}</strong><div class="muted">VAT ${escapeHtml(formatMoney(row.thueVAT)) || "0"} · Cọc ${escapeHtml(formatMoney(row.daCoc)) || "0"}</div></td>
            <td><span class="pill ${recovered ? "done" : "running"}">${escapeHtml(status)}</span>${row.ngayThuHoiCongNo ? `<div class="muted">${escapeHtml(formatDateTime(row.ngayThuHoiCongNo))}</div>` : ""}${row.nguoiThuHoiCongNo ? `<div class="muted">${escapeHtml(row.nguoiThuHoiCongNo)}</div>` : ""}</td>
            <td class="action-cell">${action}</td>
          </tr>
        `;
      })
      .join("") || `<tr><td colspan="8" class="empty">Không có đơn công nợ trong ngày đã chọn.</td></tr>`;
}

function commissionOrderStatus(row) {
  return row.trangThaiHoaHong || "Chưa thu";
}

function renderCommissionOrders() {
  if (!els.commissionOrderTable) return;
  const fromDate = nativeDateValue(els.commissionReportDateInput?.value || "");
  const toDate = nativeDateValue(els.commissionReportDateToInput?.value || "");
  const rows = state.commissionOrders
    .filter((row) => matches(row, state.filters.commissionOrder))
    .filter((row) => dateKeyInRange(orderDateKey(row), fromDate, toDate))
    .filter((row) => !state.filters.commissionStatus || commissionOrderStatus(row) === state.filters.commissionStatus);
  const commissionTotal = rows.reduce((total, row) => total + parseMoney(row.soTienNopLai), 0);
  const collectedTotal = rows
    .filter((row) => normalize(commissionOrderStatus(row)) === "da thu")
    .reduce((total, row) => total + parseMoney(row.soTienNopLai), 0);
  renderReportViewSummary(els.commissionReportSummary, [
    ["Số đơn xe thương quyền", rows.length],
    ["Tổng hoa hồng", formatMoney(commissionTotal) || "0"],
    ["Đã thu", formatMoney(collectedTotal) || "0"],
    ["Chưa thu", formatMoney(Math.max(commissionTotal - collectedTotal, 0)) || "0"],
  ]);
  els.commissionOrderTable.innerHTML =
    rows
      .map((row) => {
        const status = commissionOrderStatus(row);
        const collected = normalize(status) === "da thu";
        const routeLabel = row.tuyen || [row.diemDon, row.diemTra].filter(Boolean).join(" → ");
        const action = can("manage_commissions")
          ? `<button class="small ${collected ? "secondary" : ""}" data-action="mark-commission-status" data-order-id="${escapeHtml(row.id)}" data-status="${collected ? "Chưa thu" : "Đã thu"}" type="button">${collected ? "Chuyển về chưa thu" : "Xác nhận đã thu"}</button>`
          : "";
        return `
          <tr data-detail-type="order" data-id="${escapeHtml(row.id)}">
            <td><strong>${escapeHtml(row.id || "")}</strong></td>
            <td class="date-time-cell">${formatDateTimeCell(row.ngayGioDi)}</td>
            <td><strong>${escapeHtml(row.tenKhach || "")}</strong><div class="muted">${escapeHtml(row.soDienThoai || "")}</div></td>
            <td><strong>${escapeHtml(row.bienKiemSoat || "")}</strong><div class="muted">${escapeHtml(row.hoTenLaiXe || "")}</div></td>
            <td><strong>${escapeHtml(routeLabel)}</strong></td>
            <td><strong>${escapeHtml(formatMoney(row.soTienNopLai)) || "0"}</strong><div class="muted">${escapeHtml(row.tyLeNopLai || "0")}%</div></td>
            <td><span class="pill ${collected ? "done" : "running"}">${escapeHtml(status)}</span>${row.ngayThuHoaHong ? `<div class="muted">${escapeHtml(formatDateTime(row.ngayThuHoaHong))}</div>` : ""}${row.nguoiThuHoaHong ? `<div class="muted">${escapeHtml(row.nguoiThuHoaHong)}</div>` : ""}</td>
            <td class="action-cell">${action}</td>
          </tr>
        `;
      })
      .join("") || `<tr><td colspan="8" class="empty">Không có hoa hồng xe thương quyền trong ngày đã chọn.</td></tr>`;
}

function renderOrderFeedback() {
  if (!els.orderFeedbackTable) return;
  const feedbackByOrder = new Map(state.orderFeedback.map((row) => [String(row.donHangId || ""), row]));
  const rows = state.orders
    .filter((order) => orderIsDone(order))
    .map((order) => ({ order, feedback: feedbackByOrder.get(String(order.id || "")) || null }))
    .filter(({ order, feedback }) => matches({ ...order, ...(feedback || {}) }, state.filters.orderFeedback))
    .filter(({ order }) => dateKeyInRange(orderDateKey(order), els.orderFeedbackDateFromInput?.value, els.orderFeedbackDateToInput?.value))
    .filter(({ feedback }) => {
      if (state.filters.orderFeedbackStatus === "done") return Boolean(feedback);
      if (state.filters.orderFeedbackStatus === "pending") return !feedback;
      return true;
    })
    .sort((left, right) => {
      const leftTime = parseDateTime(left.order.ngayGioHoanThanh || left.order.ngayGioDi)?.getTime() || 0;
      const rightTime = parseDateTime(right.order.ngayGioHoanThanh || right.order.ngayGioDi)?.getTime() || 0;
      return rightTime - leftTime;
    });

  els.orderFeedbackTable.innerHTML =
    rows
      .map(({ order, feedback }) => {
        const hasFeedback = Boolean(feedback);
        const route = order.tuyen || [order.diemDon, order.diemTra].filter(Boolean).join(" → ");
        const response = feedback
          ? `<strong>${escapeHtml(feedback.noiDungPhanHoi || "")}</strong>${feedback.ketQuaXuLy ? `<div class="muted">Kết quả: ${escapeHtml(feedback.ketQuaXuLy)}</div>` : ""}`
          : `<span class="muted">Chưa ghi nhận phản hồi</span>`;
        return `
          <tr data-detail-type="order" data-id="${escapeHtml(order.id)}">
            <td><strong>${escapeHtml(order.id || "")}</strong></td>
            <td><strong>${escapeHtml(formatDateTime(order.ngayGioDi))}</strong></td>
            <td>${escapeHtml(formatDateTime(order.ngayGioHoanThanh))}</td>
            <td><strong>${escapeHtml(order.tenKhach || "")}</strong><div class="muted">${escapeHtml(order.soDienThoai || "")}</div></td>
            <td><strong>${escapeHtml(route)}</strong></td>
            <td>${feedback?.diemDanhGia ? `<strong>${escapeHtml(feedback.diemDanhGia)}/10</strong><div class="muted">${escapeHtml(feedback.kenhChamSoc || "")}</div>` : "—"}</td>
            <td>${response}</td>
            <td><span class="pill ${hasFeedback ? "done" : "running"}">${hasFeedback ? "Đã phản hồi" : "Chưa phản hồi"}</span></td>
            <td class="action-cell"><button class="small ${hasFeedback ? "secondary" : ""}" data-action="open-order" data-order-id="${escapeHtml(order.id)}" type="button">${hasFeedback ? "Xem / cập nhật" : "Nhập phản hồi"}</button></td>
          </tr>
        `;
      })
      .join("") || `<tr><td colspan="9" class="empty">Chưa có đơn hàng hoàn thành phù hợp trong khoảng ngày đã chọn.</td></tr>`;
}

function syncCskhShiftForm() {
  if (!els.cskhShiftReportForm) return;
  const form = els.cskhShiftReportForm;
  const isMarketing = state.currentUser?.role === "marketing";
  form.elements.nhanVienTruc.value = state.currentUser?.displayName || state.currentUser?.username || "";
  if (!form.elements.ngay.value) form.elements.ngay.value = localDateForInput();
  form.elements.thoiGian.value = form.elements.caLamViec.value === "2" ? "14:30 - 22:00" : "07:00 - 14:30";
  [...form.querySelectorAll("label")].forEach((label) => {
    label.hidden = isMarketing && !label.querySelector('[name="ngay"]');
  });
  if (els.cskhShiftReportSubmitButton) els.cskhShiftReportSubmitButton.hidden = isMarketing;
  if (els.cskhShiftReportStatus) {
    els.cskhShiftReportStatus.textContent = isMarketing
      ? "Chọn ngày để xem và xuất báo cáo ca CSKH."
      : "";
  }
}

function orderCreatedDateKey(order) {
  const createdAt = String(order?.createdAt || "").trim();
  if (!createdAt) return "";
  const parsed = new Date(createdAt);
  return Number.isNaN(parsed.getTime()) ? nativeDateValue(createdAt) : localDateForInput(parsed);
}

function prefillCskhB2cOrderTotal() {
  const form = els.cskhShiftReportForm;
  const input = form?.elements?.tongSoLuongDonChot;
  const selectedDate = form?.elements?.ngay?.value;
  if (!input || !selectedDate) return;
  const total = state.orders.reduce((count, order) => {
    if (orderCreatedDateKey(order) !== selectedDate) return count;
    if (!orderIsSharedRide(order)) {
      return count + (normalize(order.loaiKhach) === "b2c" ? 1 : 0);
    }
    const passengers = Array.isArray(order.khachXeGhep) ? order.khachXeGhep : [];
    return count + passengers.filter((passenger) => (
      normalize(passenger.loaiKhach || "B2C") === "b2c"
    )).length;
  }, 0);
  input.value = String(total);
}

function renderCskhShiftReports() {
  if (!els.cskhShiftReportTable) return;
  const numericHeaders = [
    "Số lượng tin nhắn meta", "Số lượng khách phản hồi", "Số lượng cuộc gọi", "Số lượng chat zalo",
    "Số lượng khách từ website", "Số lượng khách từ Email", "Số lượng tin nhắn khách vãng lai",
    "Số lượng khách phản hồi từ tiktok", "Tổng số lượng đơn chốt",
  ];
  const fromDate = els.cskhShiftReportFromInput?.value || localDateForInput();
  const toDate = els.cskhShiftReportToInput?.value || fromDate;
  const currentEmployee = state.currentUser?.displayName || state.currentUser?.username || "";
  els.cskhShiftReportTable.innerHTML = state.cskhShiftReports
    .filter((row) => dateKeyInRange(row["Ngày"], fromDate, toDate))
    .slice()
    .reverse()
    .map((row) => {
      const canDelete = state.currentUser?.role === "admin"
        || (state.currentUser?.role === "cskh" && normalize(row["Nhân Viên Trực"]) === normalize(currentEmployee));
      return `<tr>
      <td>${escapeHtml(row["Ngày"] || "")}</td><td><strong>${escapeHtml(row["Nhân Viên Trực"] || "")}</strong></td>
      <td>${escapeHtml(row["Ca Làm Việc"] || "")}</td><td>${escapeHtml(row["Thời Gian"] || "")}</td>
      ${numericHeaders.map((header) => `<td>${escapeHtml(row[header] ?? 0)}</td>`).join("")}
      <td>${canDelete ? `<button class="small danger" data-action="delete-cskh-shift-report" data-report-date="${escapeHtml(row["Ngày"] || "")}" data-report-shift="${escapeHtml(row["Ca Làm Việc"] || "")}" data-report-employee="${escapeHtml(row["Nhân Viên Trực"] || "")}" type="button">Xóa</button>` : "—"}</td>
    </tr>`;
    })
    .join("") || `<tr><td colspan="14" class="empty">Chưa có báo cáo ca.</td></tr>`;
  syncCskhShiftForm();
}

function renderCalendar() {
  if (!els.calendarDateInput.value) els.calendarDateInput.value = localDateForInput();
  const date = els.calendarDateInput.value;
  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59`);
  const rosterVehicles = rosterVehiclesForDate(date).map((vehicle) => ({
    plate: vehicle.bienKiemSoat,
    code: vehicle.soHieuXe || "",
    type: vehicle.loai_xe || vehicle.loaiXe || "",
    seats: vehicle.so_cho || vehicle.soCho || "",
    driver: driverText(vehicle),
    source: "Xe công ty",
  }));
  const franchiseVehicles = activeFranchiseVehicles().map((vehicle) => ({
    plate: vehicle.bienKiemSoat,
    code: vehicle.dongXe || "",
    type: vehicle.hieuXe || "",
    seats: vehicle.soCho || vehicle.so_cho || "",
    driver: vehicle.hoTenLaiXe || "",
    source: "Xe thương quyền",
  }));
  const vehicleMap = new Map();
  [...rosterVehicles, ...franchiseVehicles]
    .filter((vehicle) => !normalize([vehicle.code, vehicle.type, vehicle.seats].filter(Boolean).join(" ")).includes("tai van 945 kg"))
    .forEach((vehicle) => {
      if (vehicle.plate && !vehicleMap.has(normalize(vehicle.plate))) vehicleMap.set(normalize(vehicle.plate), vehicle);
    });
  const orderIndex = new Map(
    state.calendarVehicleOrder.map((row, index) => [normalize(row.bienKiemSoat || row), Number(row.thuTu || index + 1)]),
  );
  const orderedVehicles = [...vehicleMap.values()]
    .map((vehicle, originalIndex) => ({ vehicle, originalIndex }))
    .sort((left, right) => {
      const leftOwnershipOrder = left.vehicle.source === "Xe công ty" ? 0 : 1;
      const rightOwnershipOrder = right.vehicle.source === "Xe công ty" ? 0 : 1;
      if (leftOwnershipOrder !== rightOwnershipOrder) return leftOwnershipOrder - rightOwnershipOrder;
      const leftOrder = orderIndex.get(normalize(left.vehicle.plate));
      const rightOrder = orderIndex.get(normalize(right.vehicle.plate));
      if (leftOrder != null && rightOrder != null) return leftOrder - rightOrder;
      if (leftOrder != null) return -1;
      if (rightOrder != null) return 1;
      return left.originalIndex - right.originalIndex;
    })
    .map(({ vehicle }) => vehicle);
  const vehicles = orderedVehicles.map((vehicle) => {
    const orders = state.orders.filter((order) => {
      if (orderIsCancelled(order) || normalize(order.bienKiemSoat) !== normalize(vehicle.plate)) return false;
      const range = orderRange(order);
      return !range || rangesOverlap(range.start, range.end, dayStart, dayEnd);
    });
    return { vehicle, orders, busy: orders.length > 0 };
  });
  const filter = els.calendarAvailabilityFilter.value;
  const ownershipFilter = els.calendarOwnershipFilter?.value || "";
  const canReorder = canView("calendar") && !filter && !ownershipFilter;
  els.calendarResetOrderButton?.classList.toggle("hidden", !canView("calendar"));
  const rows = vehicles
    .filter((row) => (filter === "available" ? !row.busy : filter === "busy" ? row.busy : true))
    .filter((row) => (
      ownershipFilter === "company"
        ? row.vehicle.source === "Xe công ty"
        : ownershipFilter === "franchise"
          ? row.vehicle.source === "Xe thương quyền"
          : true
    ));
  const busyCount = vehicles.filter((row) => row.busy).length;
  const minutesInDay = 24 * 60;
  els.dispatchSummary.innerHTML = `
    <article><span>Tổng xe khả dụng</span><strong>${vehicles.length}</strong></article>
    <article><span>Trống cả ngày</span><strong>${vehicles.length - busyCount}</strong></article>
    <article><span>Có lịch bận</span><strong>${busyCount}</strong></article>
    <article><span>Ngày xem</span><strong>${date.split("-").reverse().join("/")}</strong></article>
  `;
  els.dispatchTable.innerHTML =
    `
      <div class="timeline-head">
        <div></div>
        <div class="timeline-hours">
          ${Array.from({ length: 13 }, (_, index) => `<span style="left:${(index / 12) * 100}%">${String(index * 2).padStart(2, "0")}:00</span>`).join("")}
        </div>
      </div>
      ${
        rows
          .map(({ vehicle, orders, busy }) => {
            const rawSeats = String(vehicle.seats || "").trim();
            const seatsLabel = rawSeats ? (normalize(rawSeats).includes("cho") ? rawSeats : `${rawSeats} chỗ`) : "Chưa có số chỗ";
            const blocks = orders
              .map((order) => {
                const range = orderRange(order);
                if (!range) return "";
                const start = new Date(Math.max(range.start.getTime(), dayStart.getTime()));
                const end = new Date(Math.min(range.end.getTime(), dayEnd.getTime()));
                const startMinutes = start.getHours() * 60 + start.getMinutes();
                const endMinutes = Math.max(end.getHours() * 60 + end.getMinutes(), startMinutes + 20);
                const left = Math.max((startMinutes / minutesInDay) * 100, 0);
                const width = Math.min(((endMinutes - startMinutes) / minutesInDay) * 100, 100 - left);
                const done = orderIsDone(order);
                const tourLabel = order.tuyen || order.loaiHopDong || "Chưa có tuyến";
                return `<button class="timeline-block ${done ? "done" : ""}" data-action="open-order" data-order-id="${escapeHtml(order.id)}" style="left:${left}%;width:${Math.max(width, 2)}%" type="button" title="${escapeHtml(tourLabel)} - ${escapeHtml(formatDateTime(order.ngayGioDi))} đến ${escapeHtml(formatDateTime(order.ngayGioHoanThanh || order.ngayGioDuKienKetThuc))}">
                  <strong>${escapeHtml(tourLabel)}</strong>
                  <span>${escapeHtml(formatTime(order.ngayGioDi))} - ${escapeHtml(formatTime(order.ngayGioHoanThanh || order.ngayGioDuKienKetThuc))}${done ? " · Đã hoàn thành" : ""}</span>
                </button>`;
              })
              .join("");
            return `
              <div class="timeline-row ${busy ? "busy" : ""} ${canReorder ? "calendar-sortable-row" : ""}" data-vehicle-plate="${escapeHtml(vehicle.plate)}" data-vehicle-source="${escapeHtml(vehicle.source)}" draggable="${canReorder ? "true" : "false"}">
                <div class="timeline-vehicle">
                  <strong>${escapeHtml(vehicle.plate)}</strong>
                  <span>${escapeHtml([vehicle.code, seatsLabel, vehicle.source].filter(Boolean).join(" · "))}</span>
                  <span>${escapeHtml(vehicle.driver || "Chưa có lái xe")}</span>
                  ${canReorder ? '<span class="calendar-drag-hint">⋮⋮ Kéo để sắp xếp</span>' : ""}
                </div>
                <div class="timeline-track">
                  ${blocks || '<span class="timeline-free">Trống cả ngày</span>'}
                </div>
              </div>
            `;
          })
          .join("") || `<div class="empty">Không có xe phù hợp.</div>`
      }
    `;
}

let draggedCalendarRow = null;
let draggedCalendarInitialOrder = "";

function calendarVehiclePlateOrder() {
  return [...els.dispatchTable.querySelectorAll(".timeline-row[data-vehicle-plate]")]
    .map((row) => row.dataset.vehiclePlate || "")
    .filter(Boolean);
}

async function saveCalendarVehicleOrder() {
  const plates = calendarVehiclePlateOrder();
  state.calendarVehicleOrder = plates.map((bienKiemSoat, index) => ({ bienKiemSoat, thuTu: index + 1 }));
  try {
    await fetchJson("/api/proxy/calendar-vehicle-order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bienKiemSoat: plates }),
    });
    if (els.syncStatus) els.syncStatus.textContent = "Đã lưu thứ tự xe trong lịch điều xe.";
  } catch (error) {
    if (els.syncStatus) els.syncStatus.textContent = error.message;
    await loadData();
  }
}

function selectedBenefitIds(container) {
  if (!container) return [];
  if (container === els.orderVoucherPicker) return [...state.orderBenefits.voucherIds];
  if (container === els.orderPromotionPicker) return [...state.orderBenefits.promotionIds];
  return [...container.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value).filter(Boolean);
}

function benefitDateText(row) {
  const start = row.ngayBatDau ? `Từ ${row.ngayBatDau}` : "";
  const end = row.ngayHetHan ? `Đến ${row.ngayHetHan}` : "Không giới hạn";
  return [start, end].filter(Boolean).join(" · ");
}

function renderBenefitPicker(container, rows, selectedIds, emptyText, kind) {
  if (!container) return;
  if (!rows.length) {
    container.innerHTML = `<div class="empty compact-empty">${escapeHtml(emptyText)}</div>`;
    return;
  }
  container.innerHTML = rows
    .map((row) => {
      const title =
        kind === "voucher"
          ? `${row.maVoucher || ""} - ${voucherCampaignName(row.tenVoucher)}`.replace(/^ - /, "")
          : row.tenChuongTrinh || "";
      const key = benefitKey(row, kind);
      const checked = selectedIds.has(key) ? "checked" : "";
      const meta = [benefitValueText(row), benefitDateText(row)].filter(Boolean).join(" · ");
      return `
        <label class="benefit-option">
          <input type="checkbox" value="${escapeHtml(key)}" ${checked} />
          <span>
            <strong>${escapeHtml(title)}</strong>
            <small>${escapeHtml(meta || "Đang áp dụng")}</small>
          </span>
        </label>
      `;
    })
    .join("");
}

function benefitTitle(row, kind) {
  return kind === "voucher" ? `${row.maVoucher || ""} - ${voucherCampaignName(row.tenVoucher)}`.replace(/^ - /, "") : row.tenChuongTrinh || "";
}

function renderCompactBenefitPicker(container, rows, kind) {
  if (!container) return;
  const isVoucher = kind === "voucher";
  const selectedIds = new Set(isVoucher ? state.orderBenefits.voucherIds : state.orderBenefits.promotionIds);
  const open = isVoucher ? state.orderBenefits.voucherOpen : state.orderBenefits.promotionOpen;
  const search = isVoucher ? state.orderBenefits.voucherSearch : state.orderBenefits.promotionSearch;
  const selectedRows = rows.filter((row) => selectedIds.has(benefitKey(row, kind)));
  const selectedHtml = selectedRows.length
    ? selectedRows
        .map((row) => {
          const key = benefitKey(row, kind);
          return `<span class="benefit-chip">${escapeHtml(benefitTitle(row, kind))} <button type="button" data-action="remove-benefit" data-kind="${kind}" data-id="${escapeHtml(key)}">×</button></span>`;
        })
        .join("")
    : `<span class="benefit-empty">Chưa chọn ${isVoucher ? "voucher" : "khuyến mãi"}</span>`;
  const matchingRows = rows.filter((row) => normalize(benefitTitle(row, kind)).includes(normalize(search)));
  const optionsHtml = rows.length
    ? rows
        .map((row) => {
          const key = benefitKey(row, kind);
          const checked = selectedIds.has(key) ? "checked" : "";
          const meta = [benefitValueText(row), benefitDateText(row)].filter(Boolean).join(" · ");
          const hidden = normalize(benefitTitle(row, kind)).includes(normalize(search)) ? "" : "hidden";
          return `
            <label class="benefit-option" ${hidden}>
              <input type="checkbox" value="${escapeHtml(key)}" data-benefit-kind="${kind}" ${checked} />
              <span>
                <strong>${escapeHtml(benefitTitle(row, kind))}</strong>
                <small>${escapeHtml(meta || "Đang áp dụng")}</small>
              </span>
            </label>
          `;
        })
        .join("")
    : "";
  container.innerHTML = `
    <div class="benefit-selected">
      <div class="benefit-chip-list">${selectedHtml}</div>
      <button class="secondary benefit-add-button" data-action="${isVoucher ? "toggle-voucher-picker" : "toggle-promotion-picker"}" type="button">${open ? "Đóng" : isVoucher ? "Thêm voucher" : "Thêm khuyến mãi"}</button>
    </div>
    <div class="benefit-panel ${open ? "active" : ""}">
      <input class="search-input benefit-search" data-benefit-search="${isVoucher ? "voucher" : "promotion"}" placeholder="Tìm theo mã hoặc tên..." value="${escapeHtml(search)}" />
      <div class="benefit-option-list">
        ${optionsHtml}
        <div class="empty compact-empty benefit-search-empty" ${matchingRows.length ? "hidden" : ""}>${escapeHtml(rows.length ? "Không tìm thấy ưu đãi phù hợp" : `Không có ${isVoucher ? "voucher" : "khuyến mãi"} khả dụng`)}</div>
      </div>
    </div>
  `;
}

function updateBenefitPreview() {
  if (!els.benefitPreview) return;
  const voucherCount = selectedBenefitIds(els.orderVoucherPicker).length;
  const promotionCount = selectedBenefitIds(els.orderPromotionPicker).length;
  if (!voucherCount && !promotionCount) {
    els.benefitPreview.textContent = "Có thể chọn nhiều voucher và nhiều chương trình khuyến mãi.";
    return;
  }
  els.benefitPreview.textContent = `Đang chọn ${voucherCount} voucher và ${promotionCount} chương trình khuyến mãi.`;
}

function renderOrderBenefits() {
  const selectedVoucherIds = new Set(state.orderBenefits.voucherIds.map(String));
  const selectedPromotionIds = new Set(state.orderBenefits.promotionIds.map(String));
  const availableVouchers = state.vouchers.filter(
    (row) => benefitIsSelectable(row) || selectedVoucherIds.has(String(benefitKey(row, "voucher"))),
  );
  const availablePromotions = state.promotions.filter(
    (row) => benefitIsSelectable(row) || selectedPromotionIds.has(String(benefitKey(row, "promotion"))),
  );
  renderCompactBenefitPicker(els.orderVoucherPicker, availableVouchers, "voucher");
  renderCompactBenefitPicker(els.orderPromotionPicker, availablePromotions, "promotion");
  updateBenefitPreview();
  updateOrderPaymentSummary();
}

function renderOrderOptions() {
  els.orderContractSelect.innerHTML = state.contracts.length
    ? `<option value="">Chọn tour / tuyến</option>${state.contracts
        .map((row) => `<option value="${escapeHtml(row.id)}" data-start="${escapeHtml(row.diemDi || "")}" data-end="${escapeHtml(row.diemDen || "")}">${escapeHtml(row.tuyen)}</option>`)
        .join("")}`
    : `<option value="">Chưa có tour / tuyến</option>`;
  renderOrderBenefits();
  renderVehicleOptions();
  return;
  const availableVouchers = state.vouchers.filter(benefitIsSelectable);
  els.orderVoucherPicker.innerHTML = availableVouchers.length
    ? availableVouchers
        .map((row) => `<label class="benefit-option"><input type="checkbox" value="${escapeHtml(row.id)}" /><span><strong>${escapeHtml(row.maVoucher)} - ${escapeHtml(voucherCampaignName(row.tenVoucher))}</strong><small>${escapeHtml(benefitValueText(row))}${row.ngayHetHan ? ` · Đến ${escapeHtml(row.ngayHetHan)}` : ""}</small></span></label>`)
        .join("")
    : `<div class="empty compact-empty">Không có voucher khả dụng</div>`;
  const availablePromotions = state.promotions.filter(benefitIsSelectable);
  els.orderPromotionPicker.innerHTML = availablePromotions.length
    ? availablePromotions
        .map((row) => `<label class="benefit-option"><input type="checkbox" value="${escapeHtml(row.id)}" /><span><strong>${escapeHtml(row.tenChuongTrinh)}</strong><small>${escapeHtml(benefitValueText(row))}${row.ngayHetHan ? ` · Đến ${escapeHtml(row.ngayHetHan)}` : ""}</small></span></label>`)
        .join("")
    : `<div class="empty compact-empty">Không có khuyến mãi khả dụng</div>`;
  renderCompactBenefitPicker(els.orderVoucherPicker, availableVouchers, "voucher");
  renderCompactBenefitPicker(els.orderPromotionPicker, availablePromotions, "promotion");
  updateBenefitPreview();
  renderVehicleOptions();
}

function applySelectedContractDefaults() {
  const option = els.orderContractSelect.selectedOptions[0];
  if (!option?.value) return;
  if (!els.orderPickupInput.value && option.dataset.start) els.orderPickupInput.value = option.dataset.start;
  if (!els.orderDropoffInput.value && option.dataset.end) els.orderDropoffInput.value = option.dataset.end;
}

function normalizePhone(value) {
  return String(value || "").replace(/\D/g, "");
}

function validCustomerPhone(value) {
  return /^0\d{9}$/.test(normalizePhone(value));
}

function requireCustomerPhone(value, label = "Số điện thoại") {
  const phone = normalizePhone(value);
  if (!/^0\d{9}$/.test(phone)) {
    throw new Error(`${label} phải gồm đúng 10 chữ số và bắt đầu bằng số 0.`);
  }
  return phone;
}

function isCustomerPhoneInput(element) {
  return element?.matches?.('[name="soDienThoai"], [data-passenger-field="soDienThoai"]');
}

document.addEventListener("input", (event) => {
  if (isCustomerPhoneInput(event.target)) event.target.setCustomValidity("");
});

document.addEventListener("focusout", (event) => {
  if (!isCustomerPhoneInput(event.target)) return;
  const phone = normalizePhone(event.target.value);
  event.target.value = phone;
  event.target.setCustomValidity(
    !phone || validCustomerPhone(phone) ? "" : "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0.",
  );
});

function findCustomerByPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  return state.customers.find((row) => normalizePhone(row.soDienThoai) === normalized) || null;
}

function setOrderCustomerFieldsLocked(locked) {
  for (const element of [
    els.orderCustomerName,
    els.orderCustomerCccd,
    els.orderCustomerAddress,
    els.orderCustomerProfileType,
    els.orderCustomerBirthYear,
    els.orderCustomerGender,
    els.orderCustomerSource,
    els.orderCustomerStaff,
  ]) {
    element.disabled = locked;
  }
  document.querySelectorAll(".customer-new-field").forEach((label) => label.classList.toggle("locked", locked));
  els.orderCustomerPreview.classList.toggle("locked", locked);
}

function fillOrderCustomer(customer) {
  if (!customer) {
    els.orderCustomerId.value = "";
    setOrderCustomerFieldsLocked(false);
    els.orderCustomerName.value = "";
    els.orderCustomerCccd.value = "";
    if (els.orderCustomerAddress) els.orderCustomerAddress.value = "";
    els.orderCustomerProfileType.value = "";
    els.orderCustomerBirthYear.value = "";
    els.orderCustomerGender.value = "";
    els.orderCustomerSource.value = "";
    els.orderCustomerStaff.value = state.currentUser?.displayName || state.currentUser?.username || "";
    els.orderCustomerPreview.textContent = "Chưa có khách hàng. Khi lưu đơn nguyên chuyến, hệ thống sẽ khai báo khách mới.";
    return;
  }
  els.orderCustomerId.value = customer.id || "";
  els.orderCustomerName.value = customer.tenKhach || "";
  els.orderCustomerCccd.value = customer.soCCCD || "";
  if (els.orderCustomerAddress) els.orderCustomerAddress.value = customer.diaChi || "";
  els.orderCustomerProfileType.value = customer.loaiKhachHang || "";
  els.orderCustomerBirthYear.value = customer.namSinh || "";
  els.orderCustomerGender.value = customer.gioiTinh || "";
  els.orderCustomerSource.value = customer.nguonKhach || "";
  els.orderCustomerStaff.value = customer.nhanVienNhap || "";
  setOrderCustomerFieldsLocked(true);
  els.orderCustomerPreview.textContent = [
    `Đã có khách: ${customer.tenKhach || ""}`,
    `SĐT: ${customer.soDienThoai || ""}`,
    customer.soCCCD ? `CCCD: ${customer.soCCCD}` : "",
    customer.loaiKhachHang ? `Loại khách: ${customer.loaiKhachHang}` : "",
    `Năm sinh: ${customer.namSinh || ""}`,
    `Giới tính: ${customer.gioiTinh || ""}`,
    `Nguồn: ${customer.nguonKhach || ""}`,
    `Nhân viên nhập: ${customer.nhanVienNhap || ""}`,
  ].join(" | ");
}

function selectedContractType() {
  return els.orderForm.elements.loaiHopDong.value;
}

function updateOrderTypeUI() {
  const isShared = selectedContractType() === "xe_ghep";
  els.sharedPassengersSection.classList.toggle("active", isShared);
  if (els.orderBenefitsSection) els.orderBenefitsSection.hidden = isShared;
  if (els.orderInvoiceSection) els.orderInvoiceSection.hidden = isShared;
  if (els.orderDebtSection) els.orderDebtSection.hidden = isShared;
  const debtToggle = document.querySelector("#debtToggle");
  const debtOwner = document.querySelector("#debtOwnerInput");
  if (debtToggle) debtToggle.disabled = isShared;
  if (debtOwner) {
    debtOwner.disabled = isShared;
    debtOwner.required = !isShared && Boolean(debtToggle?.checked);
    debtOwner.closest("label")?.classList.toggle("required", debtOwner.required);
  }
  els.ticketCountWrap.classList.toggle("active", isShared);
  els.ticketCountInput.required = isShared;
  els.ticketCountInput.min = isShared ? "1" : "0";
  for (const element of [
    els.orderPickupInput,
    els.orderDropoffInput,
    els.orderForm.elements.giaTien,
    els.orderForm.elements.giamGia,
    els.orderForm.elements.phuThu,
    els.orderForm.elements.daCoc,
  ]) {
    element.closest("label").hidden = isShared;
    element.disabled = isShared;
    element.required = !isShared;
  }
  const surchargeReason = els.orderForm.elements.lyDoPhuThu;
  if (surchargeReason) {
    const active = !isShared && parseMoney(els.orderForm.elements.phuThu?.value) > 0;
    surchargeReason.disabled = isShared;
    surchargeReason.required = active;
    surchargeReason.closest("label").hidden = !active;
    surchargeReason.closest("label").classList.toggle("required", active);
  }
  document.querySelectorAll(".customer-main-field").forEach((label) => label.classList.toggle("hidden", isShared));
  document.querySelectorAll(".customer-type-field").forEach((label) => label.classList.toggle("hidden", isShared));
  els.orderForm.querySelectorAll('input[name="loaiKhach"]').forEach((input) => {
    input.disabled = isShared;
    input.required = !isShared;
  });
  if (isShared) {
    state.orderBenefits.voucherIds = [];
    state.orderBenefits.promotionIds = [];
    els.invoiceToggle.checked = false;
    els.invoiceFields.classList.remove("active");
  }
  for (const name of ["tenCongTy", "maSoThue", "diaChiHoaDon"]) {
    const field = els.orderForm.elements[name];
    if (field) {
      field.required = !isShared && els.invoiceToggle.checked;
      field.closest("label")?.classList.toggle("required", field.required);
    }
  }
  for (const element of [
    els.orderCustomerPhone,
    els.orderCustomerName,
    els.orderCustomerProfileType,
    els.orderCustomerGender,
    els.orderCustomerSource,
    els.orderCustomerStaff,
  ]) {
    element.required = !isShared;
  }
  for (const element of [els.orderCustomerCccd, els.orderCustomerAddress, els.orderCustomerBirthYear]) {
    element.required = false;
  }
  if (!isShared) fillOrderCustomer(findCustomerByPhone(els.orderCustomerPhone.value));
  renderSharedPassengerFields();
}

function renderSharedPassengerFields() {
  const isShared = selectedContractType() === "xe_ghep";
  const count = isShared ? Math.max(Number(els.ticketCountInput.value || 0), 0) : 0;
  const currentStaff = state.currentUser?.displayName || state.currentUser?.username || "";
  const editingOrder = state.orders.find((row) => String(row.id) === String(state.editingOrderId || ""));
  const editingPassengers = editingOrder?.khachXeGhep || [];
  const existingVoucherIds = new Set(editingPassengers.flatMap((row) => row.voucherIds || []).map(String));
  const existingPromotionIds = new Set(editingPassengers.flatMap((row) => row.promotionIds || []).map(String));
  const vouchers = state.vouchers.filter(
    (row) => benefitIsSelectable(row) || existingVoucherIds.has(String(benefitKey(row, "voucher"))),
  );
  const promotions = state.promotions.filter(
    (row) => benefitIsSelectable(row) || existingPromotionIds.has(String(benefitKey(row, "promotion"))),
  );
  const benefitCheckboxes = (rows, kind, index) =>
    rows.length
      ? rows
          .map(
            (row) => {
              const benefitKind = kind === "voucherIds" ? "voucher" : "promotion";
              return `
                <label class="benefit-option compact">
                  <input type="checkbox" value="${escapeHtml(benefitKey(row, benefitKind))}" data-passenger-benefit="${kind}" data-passenger-index="${index}" />
                  <span>
                    <strong>${escapeHtml(benefitTitle(row, benefitKind))}</strong>
                    <small>${escapeHtml([benefitValueText(row), benefitDateText(row)].filter(Boolean).join(" · "))}</small>
                  </span>
                </label>
              `;
            },
          )
          .join("")
      : `<div class="empty compact-empty">Không có ${kind === "voucherIds" ? "voucher" : "khuyến mãi"} khả dụng.</div>`;
  els.sharedPassengerList.innerHTML = Array.from({ length: count }, (_, index) => {
    const number = index + 1;
    return `
      <div class="shared-passenger-card passenger-tone-${(index % 6) + 1}" data-shared-passenger-card="${index}">
        <h3>Khách lẻ ${number}</h3>
        <div class="shared-passenger-section">
          <h4>Thông tin khách</h4>
          <div class="form-grid two-col">
            <label class="required"><span>Số điện thoại</span><input data-passenger-field="soDienThoai" data-passenger-index="${index}" inputmode="numeric" autocomplete="tel" maxlength="14" placeholder="0xxxxxxxxx" required /></label>
            <label class="required"><span>Họ tên</span><input data-passenger-field="hoTen" data-passenger-index="${index}" required /></label>
            <label><span>Số CCCD</span><input data-passenger-field="soCCCD" data-passenger-index="${index}" inputmode="numeric" /></label>
            <label><span>Năm sinh</span><input data-passenger-field="namSinh" data-passenger-index="${index}" inputmode="numeric" /></label>
            <label class="full"><span>Địa chỉ</span><input data-passenger-field="diaChi" data-passenger-index="${index}" /></label>
            <label class="required"><span>Giới tính</span><select data-passenger-field="gioiTinh" data-passenger-index="${index}" required><option value="">Chọn giới tính</option><option>Nam</option><option>Nữ</option><option>Khác</option></select></label>
            <label class="required"><span>Nguồn khách</span><select data-passenger-field="nguonKhach" data-passenger-index="${index}" required>${selectOptions(customerSourceOptions(), "", "Chọn nguồn")}</select></label>
            <label class="required"><span>Loại khách</span><select data-passenger-field="loaiKhach" data-passenger-index="${index}" required><option value="">Chọn loại khách</option><option value="B2C">B2C</option><option value="B2B">B2B</option></select></label>
            <label><span>Nhân viên nhập</span><input data-passenger-field="nhanVienNhap" data-passenger-index="${index}" value="${escapeHtml(currentStaff)}" readonly /></label>
          </div>
          <div class="customer-preview shared-customer-preview" data-passenger-preview="${index}">Nhập số điện thoại để kiểm tra khách hàng.</div>
        </div>
        <div class="shared-passenger-section">
          <h4>Hành trình</h4>
          <div class="form-grid two-col">
            <label class="required"><span>Điểm đón</span><input data-passenger-field="diemDon" data-passenger-index="${index}" required /></label>
            <label class="required"><span>Điểm trả</span><input data-passenger-field="diemTra" data-passenger-index="${index}" required /></label>
          </div>
        </div>
        <div class="shared-passenger-section">
          <h4>Tài chính</h4>
          <div class="form-grid three-col">
            <label class="required"><span>Số tiền</span><input class="money-input" data-passenger-field="soTien" data-passenger-index="${index}" inputmode="numeric" required /></label>
            <label><span>Giảm giá</span><input class="money-input" data-passenger-field="giamGia" data-passenger-index="${index}" inputmode="numeric" value="0" /></label>
            <label data-passenger-discount-note="${index}" hidden><span>Ghi chú giảm giá thủ công</span><input data-passenger-field="ghiChuGiamGia" data-passenger-index="${index}" /></label>
            <label><span>Phụ thu</span><input class="money-input" data-passenger-field="phuThu" data-passenger-index="${index}" inputmode="numeric" value="0" /></label>
            <label data-passenger-surcharge-reason="${index}" hidden><span>Lý do phụ thu</span><input data-passenger-field="lyDoPhuThu" data-passenger-index="${index}" /></label>
            <label><span>Đã cọc</span><input class="money-input" data-passenger-field="daCoc" data-passenger-index="${index}" inputmode="numeric" value="0" /></label>
          </div>
        </div>
        <details class="shared-passenger-section shared-collapsible">
          <summary>Voucher & khuyến mãi</summary>
          <div class="shared-benefit-grid">
            <div>
              <span class="field-label">Voucher</span>
              <div class="shared-benefit-list">${benefitCheckboxes(vouchers, "voucherIds", index)}</div>
            </div>
            <div>
              <span class="field-label">Khuyến mãi</span>
              <div class="shared-benefit-list">${benefitCheckboxes(promotions, "promotionIds", index)}</div>
            </div>
          </div>
        </details>
        <div class="shared-passenger-section">
          <h4>Hóa đơn VAT</h4>
          <label class="checkbox-line">
            <input type="checkbox" data-passenger-field="yeuCauHoaDon" data-passenger-index="${index}" />
            <span>Khách lẻ này yêu cầu xuất hóa đơn</span>
          </label>
          <div class="form-grid two-col shared-invoice-fields">
            <label><span>Tên công ty</span><input data-passenger-field="tenCongTy" data-passenger-index="${index}" /></label>
            <label><span>Mã số thuế</span><input data-passenger-field="maSoThue" data-passenger-index="${index}" /></label>
            <label class="full"><span>Địa chỉ hóa đơn</span><input data-passenger-field="diaChiHoaDon" data-passenger-index="${index}" /></label>
            <label><span>Email nhận hóa đơn</span><input data-passenger-field="emailHoaDon" data-passenger-index="${index}" type="email" /></label>
          </div>
        </div>
        <div class="shared-passenger-section">
          <h4>Công nợ</h4>
          <label class="checkbox-line">
            <input type="checkbox" data-passenger-field="congNo" data-passenger-index="${index}" />
            <span>Ghi nhận công nợ cho khách lẻ này</span>
          </label>
          <div class="form-grid two-col" data-passenger-debt-fields="${index}" hidden>
            <label><span>Đối tượng ghi nhận công nợ</span><input data-passenger-field="congNoChoAi" data-passenger-index="${index}" /></label>
          </div>
        </div>
      </div>
    `;
  }).join("");
  syncSharedPassengerPhoneGate();
  syncSharedVoucherAvailability();
  updateOrderPaymentSummary();
}

function collectSharedPassengers() {
  const passengers = [];
  const count = Math.max(Number(els.ticketCountInput.value || 0), 0);
  for (let index = 0; index < count; index += 1) {
    const passenger = { voucherIds: [], promotionIds: [] };
    els.sharedPassengerList.querySelectorAll(`[data-passenger-index="${index}"]`).forEach((input) => {
      if (input.dataset.passengerBenefit) {
        if (input.checked) passenger[input.dataset.passengerBenefit].push(input.value);
        return;
      }
      if (!input.dataset.passengerField) return;
      if (input.type === "checkbox") {
        passenger[input.dataset.passengerField] = input.checked;
      } else {
        passenger[input.dataset.passengerField] = input.classList.contains("money-input") ? parseMoney(input.value) : input.value.trim();
      }
    });
    passengers.push(passenger);
  }
  return passengers;
}

function snapshotSharedPassengerFields() {
  return [...els.sharedPassengerList.querySelectorAll("[data-shared-passenger-card]")].map((card) => {
    const passenger = { voucherIds: [], promotionIds: [] };
    card.querySelectorAll("[data-passenger-field], [data-passenger-benefit]").forEach((input) => {
      if (input.dataset.passengerBenefit) {
        if (input.checked) passenger[input.dataset.passengerBenefit].push(input.value);
        return;
      }
      const field = input.dataset.passengerField;
      if (!field) return;
      if (input.type === "checkbox") {
        passenger[field] = input.checked;
      } else {
        passenger[field] = input.classList.contains("money-input") ? parseMoney(input.value) : input.value.trim();
      }
    });
    return passenger;
  });
}

function populateSharedPassengerFields(passengers) {
  passengers.forEach((passenger, index) => {
    const card = els.sharedPassengerList.querySelector(`[data-shared-passenger-card="${index}"]`);
    if (!card) return;
    card.querySelectorAll(`[data-passenger-field][data-passenger-index="${index}"]`).forEach((input) => {
      const field = input.dataset.passengerField;
      if (input.type === "checkbox") {
        input.checked = Boolean(passenger[field]);
      } else {
        const value = passenger[field] ?? "";
        input.value = input.classList.contains("money-input") ? formatMoney(value) || "0" : value;
      }
    });
    for (const kind of ["voucherIds", "promotionIds"]) {
      const selected = new Set(
        (Array.isArray(passenger[kind]) ? passenger[kind] : String(passenger[kind] || "").split(","))
          .map((value) => String(value).trim())
          .filter(Boolean),
      );
      card.querySelectorAll(`[data-passenger-benefit="${kind}"]`).forEach((input) => {
        input.checked = selected.has(String(input.value));
      });
    }
    const invoiceToggle = card.querySelector('[data-passenger-field="yeuCauHoaDon"]');
    const invoiceFields = card.querySelector(".shared-invoice-fields");
    if (invoiceFields) invoiceFields.classList.toggle("active", Boolean(invoiceToggle?.checked));
    const debtToggle = card.querySelector('[data-passenger-field="congNo"]');
    const debtFields = card.querySelector(`[data-passenger-debt-fields="${index}"]`);
    if (debtFields) debtFields.hidden = !debtToggle?.checked;
    const discount = parseMoney(card.querySelector('[data-passenger-field="giamGia"]')?.value);
    const discountNote = card.querySelector(`[data-passenger-discount-note="${index}"]`);
    if (discountNote) discountNote.hidden = discount <= 0;
    const surcharge = parseMoney(card.querySelector('[data-passenger-field="phuThu"]')?.value);
    const surchargeReason = card.querySelector(`[data-passenger-surcharge-reason="${index}"]`);
    if (surchargeReason) surchargeReason.hidden = surcharge <= 0;
  });
  syncSharedPassengerPhoneGate();
  syncSharedVoucherAvailability();
  updateOrderPaymentSummary();
}

function sharedVoucherCheckboxes() {
  return [...els.sharedPassengerList.querySelectorAll('input[data-passenger-benefit="voucherIds"]')];
}

function sharedVoucherLabel(voucherId) {
  const row = state.vouchers.find((item) => String(benefitKey(item, "voucher")) === String(voucherId));
  return row ? benefitTitle(row, "voucher") : voucherId;
}

function syncSharedVoucherAvailability() {
  const selectedByVoucher = new Map();
  for (const checkbox of sharedVoucherCheckboxes()) {
    if (checkbox.checked && !selectedByVoucher.has(checkbox.value)) {
      selectedByVoucher.set(checkbox.value, checkbox.dataset.passengerIndex);
    }
  }
  for (const checkbox of sharedVoucherCheckboxes()) {
    const ownerIndex = selectedByVoucher.get(checkbox.value);
    const locked = ownerIndex !== undefined && ownerIndex !== checkbox.dataset.passengerIndex;
    checkbox.disabled = locked;
    const option = checkbox.closest(".benefit-option");
    option?.classList.toggle("is-disabled", locked);
    let note = option?.querySelector(".benefit-duplicate-note");
    if (locked) {
      if (!note) {
        note = document.createElement("small");
        note.className = "benefit-duplicate-note";
        option?.querySelector("span")?.appendChild(note);
      }
      note.textContent = `Đã chọn ở khách lẻ ${Number(ownerIndex) + 1}`;
    } else {
      note?.remove();
    }
  }
}

function duplicateSharedVoucherMessage() {
  const seen = new Map();
  for (const passenger of collectSharedPassengers()) {
    for (const voucherId of passenger.voucherIds || []) {
      if (seen.has(voucherId)) return `Voucher ${sharedVoucherLabel(voucherId)} chỉ được áp dụng cho một khách lẻ trong cùng đơn.`;
      seen.set(voucherId, true);
    }
  }
  return "";
}

function syncSharedPassengerPhoneGate(index = null) {
  const cards =
    index === null
      ? [...els.sharedPassengerList.querySelectorAll("[data-shared-passenger-card]")]
      : [...els.sharedPassengerList.querySelectorAll(`[data-shared-passenger-card="${index}"]`)];
  for (const card of cards) {
    const phoneInput = card.querySelector('[data-passenger-field="soDienThoai"]');
    const hasPhone = Boolean(normalizePhone(phoneInput?.value || ""));
    card.classList.toggle("needs-phone", !hasPhone);
    card.querySelectorAll("[data-passenger-field], [data-passenger-benefit]").forEach((input) => {
      if (input === phoneInput) return;
      if (!hasPhone) {
        input.disabled = true;
        input.dataset.lockedByPhone = "1";
        return;
      }
      if (input.dataset.lockedByPhone === "1" && input.dataset.lockedByCustomer !== "1") {
        input.disabled = false;
        input.dataset.lockedByPhone = "";
      }
    });
  }
}

function sharedPassengerInputs(index) {
  return {
    name: els.sharedPassengerList.querySelector(`[data-passenger-field="hoTen"][data-passenger-index="${index}"]`),
    cccd: els.sharedPassengerList.querySelector(`[data-passenger-field="soCCCD"][data-passenger-index="${index}"]`),
    address: els.sharedPassengerList.querySelector(`[data-passenger-field="diaChi"][data-passenger-index="${index}"]`),
    birthYear: els.sharedPassengerList.querySelector(`[data-passenger-field="namSinh"][data-passenger-index="${index}"]`),
    gender: els.sharedPassengerList.querySelector(`[data-passenger-field="gioiTinh"][data-passenger-index="${index}"]`),
    source: els.sharedPassengerList.querySelector(`[data-passenger-field="nguonKhach"][data-passenger-index="${index}"]`),
    staff: els.sharedPassengerList.querySelector(`[data-passenger-field="nhanVienNhap"][data-passenger-index="${index}"]`),
    preview: els.sharedPassengerList.querySelector(`[data-passenger-preview="${index}"]`),
  };
}

function setSharedPassengerCustomerLocked(index, locked) {
  const inputs = sharedPassengerInputs(index);
  for (const element of [inputs.name, inputs.cccd, inputs.address, inputs.birthYear, inputs.gender, inputs.source, inputs.staff]) {
    if (!element) continue;
    element.dataset.lockedByCustomer = locked ? "1" : "";
    element.disabled = locked;
  }
  if (inputs.preview) inputs.preview.classList.toggle("locked", locked);
}

function fillSharedPassengerCustomer(index, customer) {
  const inputs = sharedPassengerInputs(index);
  if (!inputs.name) return;
  if (!customer) {
    if (inputs.name.dataset.lockedCustomer === "1") {
      inputs.name.value = "";
      inputs.cccd.value = "";
      inputs.address.value = "";
      inputs.birthYear.value = "";
      inputs.gender.value = "";
      inputs.source.value = "";
      inputs.staff.value = state.currentUser?.displayName || state.currentUser?.username || "";
    }
    inputs.name.dataset.lockedCustomer = "";
    setSharedPassengerCustomerLocked(index, false);
    if (inputs.preview) inputs.preview.textContent = "Chưa có khách hàng. Có thể nhập thông tin mới cho khách lẻ này.";
    return;
  }
  inputs.name.value = customer.tenKhach || "";
  inputs.cccd.value = customer.soCCCD || "";
  inputs.address.value = customer.diaChi || "";
  inputs.birthYear.value = customer.namSinh || "";
  inputs.gender.value = customer.gioiTinh || "";
  inputs.source.value = customer.nguonKhach || "";
  inputs.staff.value = customer.nhanVienNhap || "";
  inputs.name.dataset.lockedCustomer = "1";
  setSharedPassengerCustomerLocked(index, true);
  if (inputs.preview) {
    inputs.preview.textContent = [
      `Đã có khách: ${customer.tenKhach || ""}`,
      `SĐT: ${customer.soDienThoai || ""}`,
      customer.soCCCD ? `CCCD: ${customer.soCCCD}` : "",
      customer.diaChi ? `Địa chỉ: ${customer.diaChi}` : "",
      customer.namSinh ? `Năm sinh: ${customer.namSinh}` : "",
      customer.gioiTinh ? `Giới tính: ${customer.gioiTinh}` : "",
      customer.nguonKhach ? `Nguồn: ${customer.nguonKhach}` : "",
      customer.nhanVienNhap ? `Nhân viên nhập: ${customer.nhanVienNhap}` : "",
    ]
      .filter(Boolean)
      .join(" | ");
  }
}

function renderVehicleOptions() {
  const startValue = els.assignVehicleForm.elements.ngayGioDi.value;
  const endValue = els.assignVehicleForm.elements.ngayGioDuKienKetThuc.value;
  const currentOrderId = els.assignVehicleForm.elements.orderId?.value || "";
  const selected = els.orderVehicleSelect.value;
  const rosterRows = rosterVehiclesForStart(startValue);
  const franchiseRows = activeFranchiseVehicles();
  const emptyLabel = startValue ? "Chưa chọn xe" : "Chọn giờ đi trước";
  const seatsLabel = (value) => {
    const text = String(value || "").trim();
    if (!text) return "";
    return normalize(text).includes("cho") ? text : `${text} chỗ`;
  };
  const rosterOptions = rosterRows
    .map((row) => {
      const conflict = conflictingOrder(row.bienKiemSoat, startValue, endValue, currentOrderId);
      const noDriver = !hasRosterDriver(row);
      const vehicleType = row.loai_xe || row.loaiXe || "";
      const vehicleSeats = row.so_cho || row.soCho || "";
      const vehicleDetails = [row.soHieuXe, vehicleType, seatsLabel(vehicleSeats)].filter(Boolean).join(" - ");
      return `<option value="${escapeHtml(row.bienKiemSoat)}" data-vehicle-kind="internal" data-driver="${escapeHtml(driverText(row))}" data-vehicle-type="${escapeHtml(vehicleType)}" data-vehicle-seats="${escapeHtml(vehicleSeats)}" data-shift-date="${escapeHtml(formatDate(row.thoiGianTao))}" data-no-driver="${noDriver ? "1" : ""}" ${conflict ? "data-busy=\"1\"" : ""}>${escapeHtml(row.bienKiemSoat)}${vehicleDetails ? ` - ${escapeHtml(vehicleDetails)}` : ""}${noDriver ? " - chưa có lái" : ""}${conflict ? " - đang bận" : ""}</option>`;
    })
    .join("");
  const franchiseOptions = franchiseRows
    .map((row) => {
      const conflict = conflictingOrder(row.bienKiemSoat, startValue, endValue, currentOrderId);
      const vehicleType = row.hieuXe || "";
      const vehicleSeats = row.soCho || row.so_cho || "";
      const vehicleDetails = [row.dongXe, vehicleType, seatsLabel(vehicleSeats)].filter(Boolean).join(" - ");
      return `<option value="${escapeHtml(row.bienKiemSoat)}" data-vehicle-kind="franchise" data-driver="${escapeHtml(row.hoTenLaiXe || "")}" data-vehicle-type="${escapeHtml(vehicleType)}" data-vehicle-seats="${escapeHtml(vehicleSeats)}" ${conflict ? "data-busy=\"1\"" : ""}>${escapeHtml(row.bienKiemSoat)} - thương quyền${vehicleDetails ? ` - ${escapeHtml(vehicleDetails)}` : ""}${conflict ? " - đang bận" : ""}</option>`;
    })
    .join("");
  els.orderVehicleSelect.innerHTML = `
    <option value="">${emptyLabel}</option>
    ${rosterOptions ? `<optgroup label="Xe lên ca">${rosterOptions}</optgroup>` : ""}
    ${franchiseOptions ? `<optgroup label="Xe thương quyền">${franchiseOptions}</optgroup>` : ""}
  `;
  if ([...els.orderVehicleSelect.options].some((option) => option.value === selected)) {
    els.orderVehicleSelect.value = selected;
  }
  updateVehicleWarning();
}

function updateVehicleWarning() {
  const option = els.orderVehicleSelect.selectedOptions[0];
  els.orderDriverName.value = option?.dataset.driver || "";
  els.orderVehicleType.value = option?.dataset.vehicleType || "";
  els.orderVehicleSeats.value = option?.dataset.vehicleSeats || "";
  const plate = els.orderVehicleSelect.value;
  const currentOrderId = els.assignVehicleForm.elements.orderId?.value || "";
  const isFranchise = option?.dataset.vehicleKind === "franchise";
  els.franchiseCommissionWrap.classList.toggle("active", Boolean(isFranchise));
  els.franchiseCommissionWrap.classList.toggle("required", Boolean(isFranchise));
  els.franchiseCommissionInput.required = Boolean(isFranchise);
  if (!isFranchise) els.franchiseCommissionInput.value = "";
  const conflict = plate
    ? conflictingOrder(plate, els.assignVehicleForm.elements.ngayGioDi.value, els.assignVehicleForm.elements.ngayGioDuKienKetThuc.value, currentOrderId)
    : null;
  els.vehicleWarning.textContent = conflict
    ? `Cảnh báo: xe ${plate} đang bận đơn ${conflict.id} trong khung giờ này.`
    : isFranchise
      ? `Xe thương quyền: nhập tỷ lệ nộp lại riêng cho đơn hàng này.`
    : option?.dataset.noDriver === "1"
      ? `Xe ${plate} có lên ca ngày ${option.dataset.shiftDate}, nhưng chưa có lái xe. Vui lòng cập nhật lái xe trong DANH_SACH_LEN_CA trước khi lưu.`
    : option?.dataset.shiftDate
      ? `Xe được lấy theo danh sách lên ca ngày ${option.dataset.shiftDate}.`
      : "";
}

function parseSystemLogJson(value) {
  if (value && typeof value === "object") return value;
  try {
    return JSON.parse(String(value || "{}"));
  } catch {
    return {};
  }
}

function systemLogValue(value) {
  if (value === null || value === undefined || value === "") return "Trống";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function systemLogComparableValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") return Number.isFinite(value) ? `number:${value}` : String(value);
  if (typeof value === "boolean") return `boolean:${value}`;
  if (typeof value === "string") {
    const text = value.trim();
    if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(text)) return `number:${Number(text)}`;
    return `string:${text}`;
  }
  if (Array.isArray(value)) return JSON.stringify(value.map(systemLogComparableValue));
  if (typeof value === "object") {
    return JSON.stringify(
      Object.keys(value)
        .sort()
        .reduce((result, key) => {
          result[key] = systemLogComparableValue(value[key]);
          return result;
        }, {}),
    );
  }
  return String(value);
}

function systemLogChanges(row) {
  const before = parseSystemLogJson(row.before);
  const after = parseSystemLogJson(row.after);
  const ignoredFields = new Set(["id", "createdAt", "updatedAt", "createdBy", "updatedBy"]);
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter(
    (key) => !ignoredFields.has(key) && systemLogComparableValue(before[key]) !== systemLogComparableValue(after[key]),
  );
  if (!keys.length) return `<span class="muted">—</span>`;
  const changes = keys
    .map((key) => {
      const label = systemLogFieldLabels[key] || key;
      const oldValue = systemLogValue(before[key]);
      const newValue = systemLogValue(after[key]);
      if (!Object.keys(before).length) {
        return `<div class="log-change"><span>${escapeHtml(label)}</span><strong>${escapeHtml(newValue)}</strong></div>`;
      }
      return `<div class="log-change"><span>${escapeHtml(label)}</span><del>${escapeHtml(oldValue)}</del><b>→</b><strong>${escapeHtml(newValue)}</strong></div>`;
    })
    .join("");
  return changes;
}

function renderSystemLogs() {
  if (!els.systemLogTable) return;
  const actions = [...new Set(state.systemLogs.map((row) => String(row.action || "")).filter(Boolean))].sort((a, b) =>
    (systemLogActionLabels[a] || a).localeCompare(systemLogActionLabels[b] || b, "vi"),
  );
  if (els.systemLogActionFilter) {
    const selected = state.filters.systemLogAction;
    els.systemLogActionFilter.innerHTML = [
      `<option value="">Tất cả thao tác</option>`,
      ...actions.map((action) => `<option value="${escapeHtml(action)}">${escapeHtml(systemLogActionLabels[action] || action)}</option>`),
    ].join("");
    els.systemLogActionFilter.value = selected;
  }
  const query = normalize(state.filters.systemLog);
  const rows = state.systemLogs.filter((row) => {
    if (state.filters.systemLogAction && row.action !== state.filters.systemLogAction) return false;
    if (!query) return true;
    return normalize(
      [row.username, row.role, row.action, systemLogActionLabels[row.action], row.targetType, row.targetId, row.note].join(" "),
    ).includes(query);
  });
  els.systemLogTable.innerHTML =
    rows
      .map(
        (row) => `
          <tr>
            <td><strong>${escapeHtml(formatDateTime(row.createdAt))}</strong></td>
            <td><strong>${escapeHtml(row.username || "")}</strong><div class="muted">${escapeHtml(roleLabel(row.role || ""))}</div></td>
            <td><span class="pill">${escapeHtml(systemLogActionLabels[row.action] || row.action || "")}</span></td>
            <td><strong>${escapeHtml(row.targetId || "")}</strong><div class="muted">${escapeHtml(row.targetType || "")}</div></td>
            <td class="system-log-changes">${systemLogChanges(row)}</td>
            <td>${escapeHtml(row.note || "") || `<span class="muted">—</span>`}</td>
          </tr>
        `,
      )
      .join("") || `<tr><td colspan="6" class="empty">Chưa có lịch sử thay đổi phù hợp.</td></tr>`;
}

function renderPermissions() {
  if (els.userTable) {
    els.userTable.innerHTML =
      state.users
        .map((row) => {
          const active = normalize(row.status) === "active" || normalize(row.status) === "dang hoat dong";
          return `
            <tr>
              <td><strong>${escapeHtml(row.username)}</strong></td>
              <td>${escapeHtml(row.displayName || "")}</td>
              <td><span class="pill">${escapeHtml(roleLabel(row.role))}</span></td>
              <td><span class="pill ${active ? "done" : "cancelled"}">${escapeHtml(active ? "Đang hoạt động" : row.status || "Tạm khóa")}</span></td>
              <td>${escapeHtml(formatDateTime(row.createdAt))}</td>
              <td class="action-cell">
                <button class="small" data-action="open-edit-user" data-user-id="${escapeHtml(row.id)}" type="button">Chỉnh sửa</button>
                <button class="small secondary" data-action="open-reset-password" data-user-id="${escapeHtml(row.id)}" type="button">Reset mật khẩu</button>
              </td>
            </tr>
          `;
        })
        .join("") || `<tr><td colspan="6" class="empty">Chưa có tài khoản.</td></tr>`;
  }

  if (els.reopenRequestTable) {
    els.reopenRequestTable.innerHTML =
      state.reopenRequests
        .map((row) => {
          const pending = isPendingReopen(row);
          const approved = normalize(row.status) === "da duyet" || normalize(row.status) === "approved";
          const actions =
            pending && can("approve_reopen")
              ? `<div class="order-action-stack">
                  <button class="small" data-action="approve-reopen" data-request-id="${escapeHtml(row.id)}" type="button">Duyệt</button>
                  <button class="small secondary" data-action="reject-reopen" data-request-id="${escapeHtml(row.id)}" type="button">Từ chối</button>
                </div>`
              : "";
          return `
            <tr>
              <td><strong>${escapeHtml(row.orderId)}</strong><div class="muted">${escapeHtml(formatDateTime(row.createdAt))}</div></td>
              <td>${escapeHtml(row.requestedByName || row.requestedBy || "")}</td>
              <td>${escapeHtml(row.reason || "")}${row.adminNote ? `<div class="muted">Admin: ${escapeHtml(row.adminNote)}</div>` : ""}</td>
              <td><span class="pill ${pending ? "running" : approved ? "done" : "cancelled"}">${escapeHtml(row.status || "")}</span></td>
              <td>${actions}</td>
            </tr>
          `;
        })
        .join("") || `<tr><td colspan="5" class="empty">Chưa có yêu cầu mở lại đơn.</td></tr>`;
  }
}

function refreshCustomerSourceSelects() {
  const options = customerSourceOptions();
  [document.querySelector('#customerForm select[name="nguonKhach"]'), els.orderCustomerSource]
    .filter(Boolean)
    .forEach((select) => {
      const selected = select.value;
      const values = [...new Set([...options, selected].filter(Boolean))];
      select.innerHTML = selectOptions(values, selected, "Chọn nguồn");
    });
}

function refreshFranchiseVehicleCatalogSelects() {
  const lineSelect = els.franchiseVehicleForm?.elements.dongXe;
  const makeSelect = els.franchiseVehicleForm?.elements.hieuXe;
  if (lineSelect) {
    const selected = lineSelect.value;
    lineSelect.innerHTML = selectOptions(vehicleLineOptions(), selected, "Chọn dòng xe");
  }
  if (makeSelect) {
    const selected = makeSelect.value;
    makeSelect.innerHTML = selectOptions(vehicleMakeOptions(), selected, "Chọn hiệu xe");
  }
}

function renderSystemCatalogs() {
  refreshCustomerSourceSelects();
  refreshFranchiseVehicleCatalogSelects();
  if (els.systemCatalogType) {
    const selected = els.systemCatalogType.value || "nguonKhach";
    els.systemCatalogType.innerHTML = Object.entries(systemCatalogTypeLabels)
      .map(([value, label]) => `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`)
      .join("");
    els.systemCatalogType.value = selected;
  }
  if (!els.systemCatalogTable) return;
  els.systemCatalogTable.innerHTML = state.systemCatalogs
    .map((row, index) => `<tr>
      <td>${index + 1}</td>
      <td><span class="pill">${escapeHtml(systemCatalogTypeLabels[row.loaiDanhMuc] || row.loaiDanhMuc || "--")}</span></td>
      <td><strong>${escapeHtml(row.giaTri || "")}</strong></td>
      <td>${escapeHtml(row.createdBy || "Hệ thống")}</td>
      <td>${escapeHtml(formatDateTime(row.createdAt))}</td>
      <td><button class="small danger" data-action="delete-system-catalog" data-catalog-id="${escapeHtml(row.id)}" data-catalog-value="${escapeHtml(row.giaTri || "")}" type="button">Xóa</button></td>
    </tr>`)
    .join("") || `<tr><td colspan="6" class="empty">Danh mục chưa có dữ liệu.</td></tr>`;
}

function renderAll() {
  renderDashboard();
  renderCustomers();
  renderContracts();
  renderContractPricing();
  renderVouchers();
  renderPromotions();
  renderOrders();
  renderInvoiceOrders();
  renderDebtOrders();
  renderCommissionOrders();
  renderOrderFeedback();
  renderCskhShiftReports();
  renderVehicles();
  renderFranchiseVehicles();
  renderPermissions();
  renderSystemCatalogs();
  renderSystemLogs();
  renderDriverSalaries();
  renderDriverAreas();
  renderFuelRecords();
  renderFuelPrices();
  renderFuelStandard();
  renderCarWash();
  renderOrderOptions();
  applyPermissions();
  if (document.querySelector("#calendarView")?.classList.contains("active")) renderCalendar();
}

function salaryNumber(value) { return Math.max(0, parseMoney(value)); }

function fuelNumber(value) {
  const text = String(value ?? "").trim().replace(/\s/g, "");
  if (!text) return 0;
  const commaIndex = text.lastIndexOf(",");
  const dotIndex = text.lastIndexOf(".");
  if (commaIndex >= 0 && dotIndex >= 0) {
    // Vietnamese format: 1.234,5; US format: 1,234.5.
    return commaIndex > dotIndex
      ? Number(text.replace(/\./g, "").replace(",", ".")) || 0
      : Number(text.replace(/,/g, "")) || 0;
  }
  if (commaIndex >= 0) {
    const fraction = text.slice(commaIndex + 1);
    // A three-digit suffix is a thousands separator (21,430), except 0,075.
    if (fraction.length === 3 && !/^0,/.test(text)) return Number(text.replace(/,/g, "")) || 0;
    return Number(text.replace(",", ".")) || 0;
  }
  if (/^\d{1,3}(\.\d{3})+$/.test(text)) return Number(text.replace(/\./g, "")) || 0;
  return Number(text) || 0;
}

function formatFuelNumber(value) {
  return Number(value || 0).toLocaleString("vi-VN", { maximumFractionDigits: 2 });
}

function fuelFormCacheKey() {
  const identity = state.currentUser?.username || state.currentUser?.displayName || "default";
  return `diXanhFuelFormDefaults:${identity}`;
}

function readFuelFormDefaults() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(fuelFormCacheKey()) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveFuelFormDefaults(payload) {
  const current = readFuelFormDefaults();
  const defaults = {
    loaiNhienLieu: String(payload.loaiNhienLieu || "").trim(),
    donGiaLit: fuelNumber(payload.donGiaLit),
  };
  const byDriver = current.byDriver && typeof current.byDriver === "object" ? current.byDriver : {};
  if (payload.employeeCode) byDriver[String(payload.employeeCode).toUpperCase()] = defaults;
  try {
    window.localStorage.setItem(fuelFormCacheKey(), JSON.stringify({ last: defaults, byDriver }));
  } catch {
    // Không chặn việc lưu dữ liệu chỉ vì trình duyệt không cho dùng localStorage.
  }
}

function applyFuelFormDefaults(employeeCode = els.fuelDriver?.value || "") {
  const saved = readFuelFormDefaults();
  const last = saved.last && typeof saved.last === "object" ? saved.last : {};
  const byDriver = saved.byDriver && typeof saved.byDriver === "object" ? saved.byDriver : {};
  const defaults = { ...last, ...(byDriver[String(employeeCode).toUpperCase()] || {}) };
  if (els.fuelType && defaults.loaiNhienLieu && [...els.fuelType.options].some((option) => option.value === defaults.loaiNhienLieu)) {
    els.fuelType.value = defaults.loaiNhienLieu;
  }
  if (els.fuelPrice && defaults.donGiaLit) els.fuelPrice.value = formatMoney(defaults.donGiaLit);
  updateFuelAmount();
}

function renderFuelDrivers(selectedCode = els.fuelDriver?.value || "") {
  if (!els.fuelDriver) return;
  const drivers = state.fuel?.drivers || [];
  els.fuelDriver.innerHTML = `<option value="">Chọn tài xế Travel</option>${drivers.map((driver) => `<option value="${escapeHtml(driver.employeeCode)}" data-name="${escapeHtml(driver.employeeName)}" data-plate="${escapeHtml(driver.bienKiemSoat || "")}">${escapeHtml(driver.employeeName)} · ${escapeHtml(driver.employeeCode)}</option>`).join("")}`;
  els.fuelDriver.value = selectedCode;
}

function renderFuelPlates(selectedPlate = els.fuelPlate?.value || "") {
  if (!els.fuelPlate) return;
  const plateMap = new Map();
  const rememberPlate = (value) => {
    const label = String(value || "").trim().toUpperCase();
    const key = normalizeFuelPlate(label);
    if (key && !plateMap.has(key)) plateMap.set(key, label);
  };
  (state.fuel?.drivers || []).forEach((driver) => rememberPlate(driver.bienKiemSoat));
  (state.fuel?.rows || []).forEach((row) => rememberPlate(row.bienKiemSoat));
  rememberPlate(selectedPlate);
  const selectedKey = normalizeFuelPlate(selectedPlate);
  const plates = [...plateMap.entries()].sort((left, right) => left[1].localeCompare(right[1], "vi"));
  els.fuelPlate.innerHTML = `<option value="">Chọn biển số xe</option>${plates.map(([key, label]) => `<option value="${escapeHtml(label)}"${key === selectedKey ? " selected" : ""}>${escapeHtml(label)}</option>`).join("")}`;
  syncSearchableSelect(els.fuelPlate);
}

function updateFuelPlate() {
  const option = els.fuelDriver?.selectedOptions?.[0];
  if (!els.fuelPlate) return;
  const assignedPlate = String(option?.dataset.plate || "").trim().toUpperCase();
  renderFuelPlates(assignedPlate);
}

function normalizeFuelPlate(value) {
  return normalize(value).replace(/[^a-z0-9]/g, "");
}

function latestFuelOdometerRecord() {
  const employeeCode = normalize(els.fuelDriver?.value || "");
  const plate = normalizeFuelPlate(els.fuelPlate?.value || "");
  const selectedDate = nativeDateValue(els.fuelDate?.value || "");
  const editingId = String(els.fuelRecordId?.value || "");
  if (!employeeCode && !plate) return null;
  const sourceRows = state.fuel?.rows || [];
  const editingIndex = editingId ? sourceRows.findIndex((row) => String(row.id || "") === editingId) : -1;
  const editingRow = editingIndex >= 0 ? sourceRows[editingIndex] : null;
  const editingCreatedAt = String(editingRow?.createdAt || "");

  return sourceRows
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => {
      if (editingId && String(row.id || "") === editingId) return false;
      const rowPlate = normalizeFuelPlate(row.bienKiemSoat || "");
      // Taplo belongs to the vehicle, not the driver. When a plate is known,
      // only that exact vehicle may provide the previous odometer reference.
      if (plate) {
        if (!rowPlate || rowPlate !== plate) return false;
      } else if (normalize(row.employeeCode) !== employeeCode) return false;
      const rowDate = nativeDateValue(row.ngay || "");
      if (selectedDate && rowDate && rowDate > selectedDate) return false;
      if (editingRow && selectedDate && rowDate === selectedDate) {
        const rowCreatedAt = String(row.createdAt || "");
        if (editingCreatedAt && rowCreatedAt) {
          if (rowCreatedAt >= editingCreatedAt) return false;
        } else if (index >= editingIndex) return false;
      }
      return fuelNumber(row.soKmTaplo) > 0;
    })
    .sort((left, right) => {
      const leftDate = nativeDateValue(left.row.ngay || "");
      const rightDate = nativeDateValue(right.row.ngay || "");
      return rightDate.localeCompare(leftDate)
        || String(right.row.createdAt || "").localeCompare(String(left.row.createdAt || ""))
        || right.index - left.index;
    })[0]?.row || null;
}

function updateFuelOdometerReference({ clearDistanceWhenMissing = false, preserveDistance = false } = {}) {
  if (!els.fuelPreviousOdometer || !els.fuelDistance) return;
  const employeeCode = els.fuelDriver?.value || "";
  const previous = latestFuelOdometerRecord();
  els.fuelPreviousOdometerHint?.classList.remove("fuel-reference-warning");
  els.fuelDistanceHint?.classList.remove("fuel-reference-warning");

  if (!employeeCode) {
    els.fuelPreviousOdometer.value = "Chưa chọn tài xế";
    if (els.fuelPreviousOdometerHint) els.fuelPreviousOdometerHint.textContent = "Chọn tài xế để tra lần khai báo gần nhất.";
    if (els.fuelDistanceHint) els.fuelDistanceHint.textContent = "Tự tính từ hai mốc taplo khi có dữ liệu.";
    els.fuelDistance.readOnly = false;
    if (clearDistanceWhenMissing) els.fuelDistance.value = "";
    return;
  }

  if (!previous) {
    els.fuelPreviousOdometer.value = "Chưa có dữ liệu";
    const plateLabel = String(els.fuelPlate?.value || "").trim();
    if (els.fuelPreviousOdometerHint) els.fuelPreviousOdometerHint.textContent = plateLabel ? `Xe ${plateLabel} chưa có mốc taplo trước ngày đã chọn; có thể nhập số km đi được thủ công.` : "Chưa có mốc taplo trước ngày đã chọn; có thể nhập số km đi được thủ công.";
    if (els.fuelDistanceHint) els.fuelDistanceHint.textContent = "Nhập thủ công do chưa có mốc taplo trước đó.";
    els.fuelDistance.readOnly = false;
    if (clearDistanceWhenMissing) els.fuelDistance.value = "";
    return;
  }

  const previousOdometer = fuelNumber(previous.soKmTaplo);
  els.fuelPreviousOdometer.value = formatFuelNumber(previousOdometer);
  if (els.fuelPreviousOdometerHint) {
    els.fuelPreviousOdometerHint.textContent = `Khai báo ngày ${formatDate(previous.ngay)}${previous.bienKiemSoat ? ` · ${previous.bienKiemSoat}` : ""}.`;
  }
  els.fuelDistance.readOnly = false;
  const currentText = String(els.fuelOdometer?.value || "").trim();
  if (!currentText) {
    els.fuelDistance.value = "";
    if (els.fuelDistanceHint) els.fuelDistanceHint.textContent = `Sẽ điền sẵn theo công thức: taplo hiện tại − ${formatFuelNumber(previousOdometer)}; có thể chỉnh lại.`;
    return;
  }

  const currentOdometer = fuelNumber(currentText);
  const distance = currentOdometer - previousOdometer;
  if (distance < 0) {
    if (!preserveDistance) els.fuelDistance.value = "";
    if (els.fuelDistanceHint) {
      els.fuelDistanceHint.textContent = preserveDistance
        ? `Đang giữ số km đã lưu. Mốc taplo trước là ${formatFuelNumber(previousOdometer)} km.`
        : `Taplo hiện tại phải từ ${formatFuelNumber(previousOdometer)} km trở lên.`;
      els.fuelDistanceHint.classList.add("fuel-reference-warning");
    }
    return;
  }
  if (!preserveDistance) els.fuelDistance.value = formatFuelNumber(distance);
  if (els.fuelDistanceHint) {
    els.fuelDistanceHint.textContent = preserveDistance
      ? `Đang giữ số km đã lưu; thay đổi taplo để tính lại từ mốc ${formatFuelNumber(previousOdometer)} km.`
      : `Đã điền sẵn: ${formatFuelNumber(currentOdometer)} − ${formatFuelNumber(previousOdometer)} = ${formatFuelNumber(distance)} km; có thể chỉnh lại.`;
  }
}

function updateFuelAmount() {
  if (els.fuelAmount) els.fuelAmount.value = formatMoney(fuelNumber(els.fuelLiters?.value) * fuelNumber(els.fuelPrice?.value));
}

function resetFuelForm() {
  if (!els.fuelForm) return;
  els.fuelForm.reset();
  if (els.fuelRecordId) els.fuelRecordId.value = "";
  if (els.fuelDate) { els.fuelDate.disabled = false; els.fuelDate.value = localDateForInput(); }
  if (els.fuelAmount) els.fuelAmount.value = "0";
  if (els.fuelSubmitButton) els.fuelSubmitButton.textContent = "Lưu lần đổ xăng";
  if (els.fuelCancelButton) els.fuelCancelButton.hidden = true;
  if (els.fuelFormStatus) els.fuelFormStatus.textContent = "";
  renderFuelDrivers();
  updateFuelPlate();
  applyFuelFormDefaults();
  updateFuelOdometerReference({ clearDistanceWhenMissing: true });
}

function renderFuelRecords() {
  if (!els.fuelTable) return;
  renderFuelDrivers(els.fuelDriver?.value || "");
  renderFuelPlates(els.fuelPlate?.value || "");
  const allRows = [...(state.fuel?.rows || [])].sort((a, b) => String(b.ngay || "").localeCompare(String(a.ngay || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const query = normalize(els.fuelDriverSearch?.value || "");
  const rows = query
    ? allRows.filter((row) => normalize([row.employeeName, row.employeeCode, row.bienKiemSoat].join(" ")).includes(query))
    : allRows;
  const total = allRows.reduce((sum, row) => sum + fuelNumber(row.thanhTien), 0);
  if (els.fuelSummary) els.fuelSummary.textContent = `${allRows.length.toLocaleString("vi-VN")} lần đổ · ${formatMoney(total)} VNĐ`;
  if (els.fuelSearchResult) els.fuelSearchResult.textContent = query ? `${rows.length.toLocaleString("vi-VN")}/${allRows.length.toLocaleString("vi-VN")} kết quả` : `${allRows.length.toLocaleString("vi-VN")} bản ghi`;
  const emptyMessage = query ? "Không tìm thấy lái xe phù hợp." : "Chưa có dữ liệu đổ xăng.";
  els.fuelTable.innerHTML = rows.map((row, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(formatDate(row.ngay))}</td><td><strong>${escapeHtml(row.employeeName || row.employeeCode)}</strong><small>${escapeHtml(row.employeeCode || "")}</small></td><td>${escapeHtml(row.bienKiemSoat || "")}</td><td>${escapeHtml(row.loaiNhienLieu || "")}</td><td>${formatFuelNumber(row.soLit)}</td><td>${formatMoney(row.donGiaLit)}</td><td><strong>${formatMoney(row.thanhTien)}</strong></td><td>${formatFuelNumber(row.soKmTaplo)}</td><td>${formatFuelNumber(row.soKmDaChay)}</td><td><div class="row-actions"><button class="small secondary" data-action="edit-fuel" data-id="${escapeHtml(row.id)}" type="button">Sửa</button><button class="small danger" data-action="delete-fuel" data-id="${escapeHtml(row.id)}" type="button">Xóa</button></div></td></tr>`).join("") || `<tr><td colspan="11" class="empty">${emptyMessage}</td></tr>`;
  updateFuelOdometerReference();
}

function renderFuelPrices() {
  if (!els.fuelPriceTable) return;
  const rows = [...(state.fuel?.prices || [])].sort((a, b) => String(b.month || "").localeCompare(String(a.month || "")));
  els.fuelPriceTable.innerHTML = rows.map((row, index) => { const locked = Boolean(row.locked); return `<tr${locked ? " class=\"fuel-locked-row\"" : ""}><td>${index + 1}</td><td>${escapeHtml(formatMonthLabel(row.month))}${locked ? " <span class=\"fuel-lock-badge\">Đã chốt</span>" : ""}</td><td><strong>${formatMoney(row.donGiaLit)}</strong></td><td>${escapeHtml(row.updatedBy || row.createdBy || "")}</td><td>${escapeHtml(formatDateTime(row.updatedAt || row.createdAt))}</td><td><div class="row-actions"><button class="small secondary" data-action="edit-fuel-price" data-month="${escapeHtml(row.month)}" type="button" ${locked ? "disabled title=\"Tháng đã chốt lương\"" : ""}>Sửa</button><button class="small danger" data-action="delete-fuel-price" data-month="${escapeHtml(row.month)}" type="button" ${locked ? "disabled title=\"Tháng đã chốt lương\"" : ""}>Xóa</button></div></td></tr>`; }).join("") || `<tr><td colspan="6" class="empty">Chưa khai báo giá xăng theo tháng.</td></tr>`;
  updateFuelPriceLockState();
}

function renderFuelStandard() {
  if (!els.fuelStandardTable) return;
  const rows = state.fuel?.standard || [];
  const price = fuelNumber(state.fuel?.price);
  const priceText = state.fuel?.priceDeclared ? formatMoney(price) : "chưa khai báo";
  const bonusTotal = rows.reduce((sum, row) => sum + fuelNumber(row.savingBonus), 0);
  const chargeTotal = rows.reduce((sum, row) => sum + fuelNumber(row.overuseCharge), 0);
  const month = state.fuel?.standardMonth || els.fuelStandardMonth?.value || localMonthForInput();
  if (els.fuelStandardSummary) els.fuelStandardSummary.textContent = `${formatMonthLabel(month)} · ${rows.length} tài xế · Giá ${priceText} · Thu vượt ${formatMoney(chargeTotal)} · Thưởng ${formatMoney(bonusTotal)}${state.fuel?.standardLocked ? ` · ĐÃ KHÓA${state.fuel.standardLockedBy ? ` bởi ${state.fuel.standardLockedBy}` : ""}` : ""}`;
  els.fuelStandardTable.innerHTML = rows.map((row, index) => {
    const difference = fuelNumber(row.differenceLit);
    const differenceText = difference > 0 ? `+${formatFuelNumber(difference)}` : formatFuelNumber(difference);
    return `<tr><td>${index + 1}</td><td><strong>${escapeHtml(row.employeeName || row.employeeCode)}</strong><small>${escapeHtml(row.employeeCode || "")}</small></td><td>${escapeHtml(row.bienKiemSoat || "")}</td><td>${formatFuelNumber(row.totalKm)}</td><td>${formatFuelNumber(row.standardLit)}</td><td>${formatFuelNumber(row.totalLit)}</td><td class="${difference > 0 ? "fuel-overuse" : difference < 0 ? "fuel-saving" : ""}">${differenceText}</td><td class="money">${formatMoney(row.overuseCharge)}</td><td class="fuel-saving">${formatFuelNumber(row.savingLit)}</td><td class="money">${formatMoney(row.savingBonus)}</td></tr>`;
  }).join("") || `<tr><td colspan="10" class="empty">Chưa có dữ liệu định mức trong tháng này.</td></tr>`;
  updateFuelPriceLockState();
}

function setFuelPriceForm(row = {}) {
  if (els.fuelPriceMonth) els.fuelPriceMonth.value = row.month || localMonthForInput();
  if (els.fuelPriceAmount) els.fuelPriceAmount.value = row.donGiaLit ? formatMoney(row.donGiaLit) : "";
  if (els.fuelPriceSubmitButton) els.fuelPriceSubmitButton.textContent = row.month ? "Cập nhật giá theo tháng" : "Lưu giá theo tháng";
  updateFuelPriceLockState();
}

function updateFuelPriceLockState() {
  const month = els.fuelPriceMonth?.value || els.fuelStandardMonth?.value || "";
  const row = (state.fuel?.prices || []).find((item) => String(item.month) === String(month));
  const locked = Boolean(row?.locked) || (String(state.fuel?.standardMonth || "") === String(month) && Boolean(state.fuel?.standardLocked));
  if (els.fuelPriceAmount) els.fuelPriceAmount.disabled = locked;
  if (els.fuelPriceSubmitButton) { els.fuelPriceSubmitButton.disabled = locked; els.fuelPriceSubmitButton.title = locked ? "Tháng đã chốt lương, không thể sửa định mức." : ""; }
  if (els.fuelPriceStatus && locked) els.fuelPriceStatus.textContent = `Tháng ${formatMonthLabel(month)} đã chốt lương, định mức đã khóa.`;
}

async function loadFuelStandard(month = els.fuelStandardMonth?.value || localMonthForInput()) {
  if (els.fuelStandardMonth) els.fuelStandardMonth.value = month;
  try {
    const payload = await fetchJson(`/api/proxy/accounting/fuel-standard?month=${encodeURIComponent(month)}`, {}, 90000);
    state.fuel = { ...state.fuel, standard: payload.rows || [], standardMonth: payload.month || month, standardRate: payload.standardRate || 0.075, price: payload.price || 0, priceDeclared: Boolean(payload.priceDeclared), standardLocked: Boolean(payload.locked), standardLockedBy: payload.lockedBy || "", standardLockedAt: payload.lockedAt || "" };
    renderFuelStandard();
  } catch (error) {
    if (els.fuelStandardSummary) els.fuelStandardSummary.textContent = error.message || "Không thể tính định mức xăng.";
  }
}

async function loadFuelRecords() {
  try {
    const month = els.fuelStandardMonth?.value || localMonthForInput();
    if (els.fuelStandardMonth) els.fuelStandardMonth.value = month;
    const [fuelResult, pricesResult, standardResult] = await Promise.allSettled([
      fetchJson("/api/proxy/accounting/fuel", {}, 90000),
      fetchJson("/api/proxy/accounting/fuel-prices", {}, 90000),
      fetchJson(`/api/proxy/accounting/fuel-standard?month=${encodeURIComponent(month)}`, {}, 90000),
    ]);
    if (fuelResult.status === "rejected") throw fuelResult.reason;
    const fuel = fuelResult.value;
    const prices = pricesResult.status === "fulfilled" ? pricesResult.value : { rows: state.fuel?.prices || [] };
    const standard = standardResult.status === "fulfilled"
      ? standardResult.value
      : { rows: state.fuel?.standard || [], month, standardRate: state.fuel?.standardRate || 0.075, price: state.fuel?.price || 0, priceDeclared: Boolean(state.fuel?.priceDeclared) };
    state.fuel = { ...fuel, prices: prices.rows || [], standard: standard.rows || [], standardMonth: standard.month || month, standardRate: standard.standardRate || 0.075, price: standard.price || 0, priceDeclared: Boolean(standard.priceDeclared), standardLocked: Boolean(standard.locked), standardLockedBy: standard.lockedBy || "", standardLockedAt: standard.lockedAt || "" };
    renderFuelRecords();
    renderFuelPrices();
    renderFuelStandard();
    const secondaryErrors = [];
    if (pricesResult.status === "rejected") secondaryErrors.push("giá xăng");
    if (standardResult.status === "rejected") secondaryErrors.push("định mức");
    if (secondaryErrors.length && els.fuelFormStatus) els.fuelFormStatus.textContent = `Đã tải danh sách đổ xăng; tạm thời chưa tải được ${secondaryErrors.join(" và ")}.`;
  } catch (error) {
    if (els.fuelFormStatus) els.fuelFormStatus.textContent = error.message || "Không thể tải dữ liệu xăng.";
  }
}

function downloadFuelImportTemplate() {
  window.location.href = "/api/proxy/accounting/fuel/import-template";
}

async function importFuelExcel(file) {
  if (!file) return;
  if (!String(file.name || "").toLowerCase().endsWith(".xlsx")) {
    alert("Vui lòng chọn file Excel .xlsx theo mẫu.");
    return;
  }
  if (!confirm(`Import dữ liệu đổ xăng từ file ${file.name}?`)) return;
  if (els.fuelImportButton) els.fuelImportButton.disabled = true;
  if (els.fuelFormStatus) els.fuelFormStatus.textContent = "Đang kiểm tra và import file Excel...";
  try {
    const result = await fetchJson("/api/proxy/accounting/fuel/import", {
      method: "POST",
      headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      body: file,
    }, 180000);
    await loadFuelRecords();
    const imported = Number(result?.importedCount || 0);
    const skipped = Number(result?.skippedCount || 0);
    const recalculated = Number(result?.recalculatedCount || 0);
    const errorPreview = (result?.errors || []).slice(0, 8).map((item) => `Dòng ${item.row}: ${item.message}`).join("\n");
    const summary = `Đã import ${imported.toLocaleString("vi-VN")} dòng${skipped ? `; bỏ qua ${skipped.toLocaleString("vi-VN")} dòng` : ""}${recalculated ? `; cập nhật ${recalculated.toLocaleString("vi-VN")} mốc km phía sau` : ""}.`;
    if (els.fuelFormStatus) els.fuelFormStatus.textContent = summary;
    alert(errorPreview ? `${summary}\n\n${errorPreview}${skipped > 8 ? "\n..." : ""}` : summary);
  } catch (error) {
    const message = error.message || "Không thể import dữ liệu đổ xăng.";
    if (els.fuelFormStatus) els.fuelFormStatus.textContent = message;
    alert(message);
  } finally {
    if (els.fuelImportButton) els.fuelImportButton.disabled = false;
    if (els.fuelImportInput) els.fuelImportInput.value = "";
  }
}

async function loadFuelStandardView() {
  const month = els.fuelStandardMonth?.value || localMonthForInput();
  if (els.fuelStandardMonth) els.fuelStandardMonth.value = month;
  try {
    const standard = await fetchJson(`/api/proxy/accounting/fuel-standard?month=${encodeURIComponent(month)}`, {}, 90000);
    state.fuel = { ...state.fuel, standard: standard.rows || [], standardMonth: standard.month || month, standardRate: standard.standardRate || 0.075, price: standard.price || 0, priceDeclared: Boolean(standard.priceDeclared), standardLocked: Boolean(standard.locked), standardLockedBy: standard.lockedBy || "", standardLockedAt: standard.lockedAt || "" };
    renderFuelStandard();
  } catch (error) {
    if (els.fuelStandardSummary) els.fuelStandardSummary.textContent = error.message || "Không thể tải định mức xăng.";
  }
}

async function loadFuelPricesView() {
  try {
    const prices = await fetchJson("/api/proxy/accounting/fuel-prices", {}, 90000);
    state.fuel = { ...state.fuel, prices: prices.rows || [] };
    renderFuelPrices();
  } catch (error) {
    if (els.fuelPriceStatus) els.fuelPriceStatus.textContent = error.message || "Không thể tải giá xăng.";
  }
}

async function saveFuelPrice(event) {
  event.preventDefault();
  const month = els.fuelPriceMonth?.value || "";
  const donGiaLit = fuelNumber(els.fuelPriceAmount?.value);
  if (!month || donGiaLit <= 0) {
    if (els.fuelPriceStatus) els.fuelPriceStatus.textContent = "Vui lòng nhập tháng và giá xăng hợp lệ.";
    return;
  }
  const existing = (state.fuel?.prices || []).find((row) => String(row.month) === String(month));
  if (existing?.locked || (state.fuel?.standardLocked && String(state.fuel?.standardMonth) === String(month))) {
    if (els.fuelPriceStatus) els.fuelPriceStatus.textContent = "Tháng này đã chốt lương, không thể sửa định mức xăng.";
    return;
  }
  if (els.fuelPriceSubmitButton) els.fuelPriceSubmitButton.disabled = true;
  if (els.fuelPriceStatus) els.fuelPriceStatus.textContent = "Đang lưu giá xăng...";
  try {
    await fetchJson("/api/proxy/accounting/fuel-prices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ month, donGiaLit }) });
    await loadFuelRecords();
    setFuelPriceForm({});
    if (els.fuelPriceStatus) els.fuelPriceStatus.textContent = "Đã lưu giá xăng theo tháng.";
  } catch (error) {
    if (els.fuelPriceStatus) els.fuelPriceStatus.textContent = error.message || "Không thể lưu giá xăng.";
  } finally { if (els.fuelPriceSubmitButton) els.fuelPriceSubmitButton.disabled = false; }
}

function editFuelPrice(month) {
  const row = (state.fuel?.prices || []).find((item) => String(item.month) === String(month));
  if (row?.locked) { alert("Tháng này đã chốt lương, không thể sửa định mức xăng."); return; }
  if (row) setFuelPriceForm(row);
}

async function deleteFuelPrice(month) {
  const row = (state.fuel?.prices || []).find((item) => String(item.month) === String(month));
  if (row?.locked) { alert("Tháng này đã chốt lương, không thể xóa định mức xăng."); return; }
  if (!confirm(`Xóa giá xăng tháng ${formatMonthLabel(month)}?`)) return;
  try { await fetchJson(`/api/proxy/accounting/fuel-prices/${encodeURIComponent(month)}`, { method: "DELETE" }); await loadFuelRecords(); }
  catch (error) { alert(error.message || "Không thể xóa giá xăng."); }
}

async function saveFuelRecord(event) {
  event.preventDefault();
  const employee = els.fuelDriver?.selectedOptions?.[0];
  const id = els.fuelRecordId?.value || "";
  const payload = {
    ngay: els.fuelDate?.value || "",
    employeeCode: els.fuelDriver?.value || "",
    employeeName: employee?.dataset.name || "",
    bienKiemSoat: els.fuelPlate?.value || employee?.dataset.plate || "",
    loaiNhienLieu: els.fuelType?.value || "",
    soLit: fuelNumber(els.fuelLiters?.value),
    donGiaLit: fuelNumber(els.fuelPrice?.value),
    soKmTaplo: fuelNumber(els.fuelOdometer?.value),
    soKmDaChay: fuelNumber(els.fuelDistance?.value),
  };
  if (!payload.employeeCode) { els.fuelFormStatus.textContent = "Vui lòng chọn tài xế Travel."; return; }
  const previous = latestFuelOdometerRecord();
  const existing = id ? (state.fuel?.rows || []).find((row) => String(row.id || "") === String(id)) : null;
  const odometerContextChanged = !existing
    || normalizeFuelPlate(existing.bienKiemSoat) !== normalizeFuelPlate(payload.bienKiemSoat)
    || nativeDateValue(existing.ngay) !== nativeDateValue(payload.ngay)
    || fuelNumber(existing.soKmTaplo) !== payload.soKmTaplo;
  if (odometerContextChanged && previous && payload.soKmTaplo < fuelNumber(previous.soKmTaplo)) {
    els.fuelFormStatus.textContent = `Số km taplo hiện tại không được nhỏ hơn mốc gần nhất ${formatFuelNumber(previous.soKmTaplo)} km.`;
    return;
  }
  els.fuelSubmitButton.disabled = true;
  els.fuelFormStatus.textContent = "Đang lưu...";
  try {
    const result = await fetchJson(id ? `/api/proxy/accounting/fuel/${encodeURIComponent(id)}` : "/api/proxy/accounting/fuel", { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    saveFuelFormDefaults(payload);
    await loadFuelRecords();
    resetFuelForm();
    const recalculatedCount = Number(result?.recalculatedCount || 0);
    els.fuelFormStatus.textContent = recalculatedCount
      ? `Đã lưu và cập nhật lại ${recalculatedCount.toLocaleString("vi-VN")} mốc km phía sau.`
      : "Đã lưu dữ liệu đổ xăng.";
  } catch (error) {
    els.fuelFormStatus.textContent = error.message || "Không thể lưu dữ liệu xăng.";
  } finally { els.fuelSubmitButton.disabled = false; }
}

function editFuelRecord(id) {
  const row = (state.fuel?.rows || []).find((item) => String(item.id) === String(id));
  if (!row) return;
  els.fuelRecordId.value = row.id;
  els.fuelDate.value = nativeDateValue(row.ngay) || row.ngay || "";
  els.fuelDate.disabled = true;
  renderFuelDrivers(row.employeeCode);
  renderFuelPlates(row.bienKiemSoat || "");
  els.fuelType.value = row.loaiNhienLieu || "Khác";
  els.fuelLiters.value = formatFuelNumber(row.soLit);
  els.fuelPrice.value = formatMoney(row.donGiaLit);
  els.fuelOdometer.value = formatFuelNumber(row.soKmTaplo);
  els.fuelDistance.value = formatFuelNumber(row.soKmDaChay);
  updateFuelOdometerReference({ preserveDistance: true });
  updateFuelAmount();
  els.fuelSubmitButton.textContent = "Cập nhật lần đổ xăng";
  els.fuelCancelButton.hidden = false;
  els.fuelForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteFuelRecord(id) {
  if (!confirm("Xóa lần đổ xăng này?")) return;
  try { await fetchJson(`/api/proxy/accounting/fuel/${encodeURIComponent(id)}`, { method: "DELETE" }); await loadFuelRecords(); }
  catch (error) { alert(error.message || "Không thể xóa dữ liệu xăng."); }
}

function resetCarWashForm() {
  if (!els.carWashForm) return;
  els.carWashForm.reset();
  if (els.carWashDate) els.carWashDate.value = localDateForInput();
  if (els.carWashFormStatus) els.carWashFormStatus.textContent = "";
  renderCarWashDriverList();
}

function renderCarWashDriverList() {
  if (!els.carWashDriverList) return;
  const drivers = state.carWash?.onShiftDrivers || [];
  els.carWashDriverList.innerHTML = drivers.map((driver) => `<div class="car-wash-driver-row ${driver.washed ? "washed" : ""}"><div><strong>${escapeHtml(driver.employeeName || driver.employeeCode || "")}</strong><small>${escapeHtml(driver.employeeCode || "")} · ${escapeHtml(driver.bienKiemSoat || "Chưa có BSX")}</small></div><button class="small ${driver.washed ? "secondary" : ""} car-wash-confirm" data-code="${escapeHtml(driver.employeeCode || "")}" type="button" ${driver.washed ? "disabled" : ""}>${driver.washed ? "Đã xác nhận rửa" : "Xác nhận đã rửa"}</button></div>`).join("") || `<div class="empty">Ngày này không có tài xế Travel lên ca.</div>`;
}

function renderCarWash() {
  if (!els.carWashTable) return;
  renderCarWashDriverList();
  const rows = [...(state.carWash?.rows || [])].sort((a, b) => String(b.ngay || "").localeCompare(String(a.ngay || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  const vehicleCount = Number(state.carWash?.vehicleCount ?? new Set(rows.map((row) => String(row.bienKiemSoat || row.employeeCode || "").trim()).filter(Boolean)).size);
  const washCount = Number(state.carWash?.washCount ?? rows.length);
  if (els.carWashSummary) els.carWashSummary.textContent = `${vehicleCount.toLocaleString("vi-VN")} xe · ${washCount.toLocaleString("vi-VN")} lượt rửa`;
  els.carWashTable.innerHTML = rows.map((row, index) => `<tr><td>${index + 1}</td><td>${escapeHtml(formatDate(row.ngay))}</td><td><strong>${escapeHtml(row.employeeName || row.employeeCode || "")}</strong><small>${escapeHtml(row.employeeCode || "")}</small></td><td>${escapeHtml(row.bienKiemSoat || "")}</td><td><span class="deduction-status active">Đã rửa</span></td><td>${escapeHtml(row.updatedBy || row.createdBy || "")}</td><td><div class="row-actions"><button class="small danger" data-action="delete-car-wash" data-id="${escapeHtml(row.id)}" type="button">Hủy xác nhận</button></div></td></tr>`).join("") || `<tr><td colspan="7" class="empty">Chưa có dữ liệu rửa xe trong khoảng thời gian này.</td></tr>`;
}

async function loadCarWashRecords(useSelected = true) {
  const fromInput = els.carWashFromDate, toInput = els.carWashToDate;
  const fromDate = useSelected ? (fromInput?.value || "") : (state.carWash?.fromDate || fromInput?.value || "");
  const toDate = useSelected ? (toInput?.value || "") : (state.carWash?.toDate || toInput?.value || "");
  const date = els.carWashDate?.value || "";
  if (fromInput) fromInput.value = fromDate;
  if (toInput) toInput.value = toDate;
  if (els.carWashSummary) els.carWashSummary.textContent = "Đang tải báo cáo rửa xe...";
  try {
    const payload = await fetchJson(`/api/proxy/accounting/car-wash?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}&date=${encodeURIComponent(date)}`, {}, 90000);
    state.carWash = { ...payload, rows: payload.rows || [], drivers: payload.drivers || [], onShiftDrivers: payload.onShiftDrivers || [], fromDate, toDate };
    renderCarWash();
  } catch (error) { if (els.carWashSummary) els.carWashSummary.textContent = error.message || "Không thể tải dữ liệu rửa xe."; }
}

async function confirmCarWash(code) {
  const driver = (state.carWash?.onShiftDrivers || []).find((item) => String(item.employeeCode) === String(code));
  const date = els.carWashDate?.value || "";
  if (!driver || !date || driver.washed) return;
  if (els.carWashFormStatus) els.carWashFormStatus.textContent = "Đang lưu xác nhận...";
  try {
    await fetchJson("/api/proxy/accounting/car-wash", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ngay: date, employeeCode: driver.employeeCode, employeeName: driver.employeeName, bienKiemSoat: driver.bienKiemSoat }) });
    await loadCarWashRecords(true);
    if (els.carWashFormStatus) els.carWashFormStatus.textContent = "Đã lưu xác nhận rửa xe.";
  } catch (error) { if (els.carWashFormStatus) els.carWashFormStatus.textContent = error.message || "Không thể lưu xác nhận rửa xe."; }
}

async function deleteCarWashRecord(id) {
  if (!confirm("Hủy xác nhận rửa xe này?")) return;
  try { await fetchJson(`/api/proxy/accounting/car-wash/${encodeURIComponent(id)}`, { method: "DELETE" }); await loadCarWashRecords(true); }
  catch (error) { alert(error.message || "Không thể xóa dữ liệu rửa xe."); }
}

function exportCarWash() {
  const fromDate = els.carWashFromDate?.value || "", toDate = els.carWashToDate?.value || "";
  if (fromDate && toDate && fromDate > toDate) { alert("Ngày bắt đầu không được lớn hơn ngày kết thúc."); return; }
  window.location.href = `/api/proxy/accounting/car-wash.xlsx?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`;
}

function formatSalaryAmountInput(input) {
  input.value = formatMoney(salaryNumber(input.value));
  updateSalaryTotalPreview();
}

function updateSalaryTotalPreview() {
  const allowanceTotal=[...document.querySelectorAll(".salary-allowance-amount")].reduce((sum,input)=>sum+salaryNumber(input.value),0);
  const total=salaryNumber(document.querySelector("#salaryBaseAmount")?.value)+allowanceTotal;
  const target=document.querySelector("#salaryTotalPreview");
  if(target) target.textContent=formatMoney(total);
}

function salaryAllowanceOptions(selected="") {
  const types=[...(state.allowanceTypes||[])];
  if(selected&&!types.some(item=>item.name===selected)) types.push({name:selected});
  return types.map(item=>`<option value="${escapeHtml(item.name)}"${item.name===selected?" selected":""}>${escapeHtml(item.name)}</option>`).join("");
}

function addSalaryAllowanceRow(item={type:"",amount:0}) {
  const container=document.querySelector("#salaryAllowanceRows");
  if(!container) return;
  const row=document.createElement("div");
  row.className="salary-allowance-row";
  row.innerHTML=`<select class="salary-allowance-type" aria-label="Loại phụ cấp" required>${salaryAllowanceOptions(item.type)}</select><input class="salary-allowance-amount" type="text" inputmode="numeric" placeholder="0" value="${formatMoney(item.amount||0)}" aria-label="Tiền phụ cấp" required /><button class="danger remove-allowance" type="button" title="Xóa khoản phụ cấp">×</button>`;
  container.appendChild(row);
  updateSalaryTotalPreview();
}

function setSalaryAllowances(items=[]) {
  const container=document.querySelector("#salaryAllowanceRows");
  if(!container) return;
  container.innerHTML="";
  (items.length?items:[{type:"",amount:0}]).forEach(addSalaryAllowanceRow);
}

function salaryAllowancesFromForm() {
  return [...document.querySelectorAll(".salary-allowance-row")].map(row=>({type:row.querySelector(".salary-allowance-type")?.value||"Khác",amount:salaryNumber(row.querySelector(".salary-allowance-amount")?.value)}));
}

function salaryAllowancesForRow(row) {
  return Array.isArray(row.allowances)&&row.allowances.length?row.allowances:[...(salaryNumber(row.allowance)>0?[{type:row.allowanceType||"Khác",amount:salaryNumber(row.allowance)}]:[])];
}

function resetDriverSalaryForm() {
  const form=document.querySelector("#driverSalaryForm");
  form.reset();
  form.dataset.editing="";
  document.querySelector("#salaryEffectiveMonth").value=localMonthForInput();
  document.querySelector("#salaryBaseAmount").value="0";
  document.querySelector("#salaryDialogTitle").textContent="Thêm khai báo lương";
  form.querySelector('button[type="submit"]').textContent="Lưu mức lương";
  document.querySelector("#allowanceManager").hidden=true;
  setSalaryAllowances();
  updateSalaryTotalPreview();
}

function setSalaryBankValue(value) {
  const select=document.querySelector("#salaryBankName");
  if(!select)return;
  const bank=String(value||"").trim();
  if(bank&&!([...select.options].some(option=>option.value===bank))) select.add(new Option(bank,bank));
  select.value=bank;
}

function openSalaryDialogForCreate() {
  resetDriverSalaryForm();
  document.querySelector("#salaryDialog")?.showModal();
}

function closeSalaryDialog() {
  document.querySelector("#salaryDialog")?.close();
}

function renderDriverSalaries() {
  const select=document.querySelector("#salaryDriverSelect"),table=document.querySelector("#driverSalaryTable"),search=document.querySelector("#driverSalarySearch");
  if(!select || !table) return;
  const selected=select.value;
  select.innerHTML=`<option value="">Chọn lái xe</option>${(state.driverSalaries.drivers||[]).map(driver=>`<option value="${escapeHtml(driver.employeeCode)}" data-name="${escapeHtml(driver.employeeName)}">${escapeHtml(driver.employeeName)} · ${escapeHtml(driver.employeeCode)}</option>`).join("")}`;
  if([...select.options].some(option=>option.value===selected)) select.value=selected;
  document.querySelectorAll(".salary-allowance-type").forEach(allowanceSelect=>{const value=allowanceSelect.value;allowanceSelect.innerHTML=salaryAllowanceOptions(value);});
  const keyword=normalize(state.filters.driverSalary||search?.value||"");
  const rows=(state.driverSalaries.rows||[]).filter(row=>!keyword||normalize([row.employeeCode,row.employeeName,row.bankName,row.accountNumber,row.accountHolder,row.effectiveMonth].join(" ")).includes(keyword));
  table.innerHTML=rows.map(row=>{const allowances=salaryAllowancesForRow(row),allowanceTotal=allowances.reduce((sum,item)=>sum+salaryNumber(item.amount),0);return `<tr><td><strong>${escapeHtml(row.employeeCode)}</strong></td><td>${escapeHtml(row.employeeName)}</td><td>${escapeHtml(row.effectiveMonth)}</td><td>${escapeHtml(row.bankName)}</td><td>${escapeHtml(row.accountNumber)}</td><td>${escapeHtml(row.accountHolder)}</td><td>${formatMoney(row.baseSalary)}</td><td><div class="salary-allowance-list">${allowances.map(item=>`<div class="salary-allowance-line"><span>${escapeHtml(item.type||"Khác")}</span><strong>${formatMoney(item.amount)}</strong></div>`).join("")||"—"}</div></td><td><strong>${formatMoney(allowanceTotal)}</strong></td><td><strong>${formatMoney(salaryNumber(row.baseSalary)+allowanceTotal)}</strong></td><td>${escapeHtml(row.createdBy||"")}</td><td><div class="row-actions"><button class="small secondary" data-action="edit-salary" data-code="${escapeHtml(row.employeeCode)}" data-month="${escapeHtml(row.effectiveMonth)}" type="button">Sửa</button><button class="small danger" data-action="delete-salary" data-code="${escapeHtml(row.employeeCode)}" data-month="${escapeHtml(row.effectiveMonth)}" type="button">Xóa</button></div></td></tr>`;}).join("")||`<tr><td colspan="12" class="empty">${keyword?"Không tìm thấy khai báo lương phù hợp.":"Chưa có khai báo lương."}</td></tr>`;
  if(!document.querySelector("#salaryEffectiveMonth")?.value) document.querySelector("#salaryEffectiveMonth").value=localMonthForInput();
  updateSalaryTotalPreview();
  renderAllowanceTypes();
}

async function loadDriverSalaries() {
  try { const [salaries,types]=await Promise.all([fetchJson("/api/proxy/accounting/driver-salaries",{},90000),fetchJson("/api/proxy/accounting/allowance-types",{},90000)]); state.driverSalaries=salaries; state.allowanceTypes=types.rows||[]; renderDriverSalaries(); }
  catch(error) { const table=document.querySelector("#driverSalaryTable"); if(table) table.innerHTML=`<tr><td colspan="12" class="empty">${escapeHtml(error.message||"Không thể tải khai báo lương.")}</td></tr>`; }
}

function renderDriverAreas() {
  const select=document.querySelector("#driverAreaDriver"),table=document.querySelector("#driverAreaTable"),options=document.querySelector("#driverAreaOptions"),search=document.querySelector("#driverAreaSearch");
  if(!select||!table)return;
  const selected=select.value;
  select.innerHTML=`<option value="">Chọn mã nhân viên · họ tên</option>${(state.driverAreas.drivers||[]).map(driver=>`<option value="${escapeHtml(driver.employeeCode)}" data-name="${escapeHtml(driver.employeeName)}">${escapeHtml(driver.employeeCode)} · ${escapeHtml(driver.employeeName)}</option>`).join("")}`;
  if([...select.options].some(option=>option.value===selected))select.value=selected;
  if(options)options.innerHTML=(state.driverAreas.areas||[]).map(area=>`<option value="${escapeHtml(area)}"></option>`).join("");
  const keyword=normalize(state.filters.driverArea||search?.value||"");
  const rows=(state.driverAreas.rows||[]).filter(row=>!keyword||normalize([row.employeeCode,row.employeeName,row.operatingArea].join(" ")).includes(keyword));
  table.innerHTML=rows.map((row,index)=>`<tr><td>${index+1}</td><td><strong>${escapeHtml(row.employeeCode)}</strong></td><td>${escapeHtml(row.employeeName)}</td><td><span class="pill">${escapeHtml(row.operatingArea)}</span></td><td>${escapeHtml(row.updatedBy||"")}</td><td>${escapeHtml(formatDateTime(row.updatedAt))}</td><td><div class="row-actions"><button class="small secondary" data-action="edit-driver-area" data-code="${escapeHtml(row.employeeCode)}" type="button">Sửa</button><button class="small danger" data-action="delete-driver-area" data-code="${escapeHtml(row.employeeCode)}" type="button">Xóa</button></div></td></tr>`).join("")||`<tr><td colspan="7" class="empty">${keyword?"Không tìm thấy khai báo phù hợp.":"Chưa có khai báo khu vực lái xe."}</td></tr>`;
}

async function loadDriverAreas() {
  const table=document.querySelector("#driverAreaTable");
  try{state.driverAreas=await fetchJson("/api/proxy/accounting/driver-areas",{},90000);renderDriverAreas();}
  catch(error){if(table)table.innerHTML=`<tr><td colspan="7" class="empty">${escapeHtml(error.message||"Không thể tải khai báo khu vực.")}</td></tr>`;}
}

async function saveDriverArea(event) {
  event.preventDefault();
  const select=document.querySelector("#driverAreaDriver"),areaInput=document.querySelector("#driverAreaValue"),status=document.querySelector("#driverAreaStatus"),button=document.querySelector("#driverAreaSubmit");
  const option=select?.selectedOptions?.[0],employeeCode=select?.value||"",employeeName=option?.dataset?.name||"",operatingArea=areaInput?.value?.trim()||"";
  if(!employeeCode||!employeeName||!operatingArea)return;
  button.disabled=true;status.textContent="Đang lưu khu vực...";
  try{await fetchJson("/api/proxy/accounting/driver-areas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({employeeCode,employeeName,operatingArea})});areaInput.value="";select.value="";status.textContent="Đã lưu khu vực hoạt động.";await loadDriverAreas();}
  catch(error){status.textContent=error.message||"Không thể lưu khu vực.";}
  finally{button.disabled=false;}
}

async function manageDriverAreaClick(event) {
  const button=event.target.closest("button[data-action]");if(!button)return;
  const code=button.dataset.code||"",row=(state.driverAreas.rows||[]).find(item=>String(item.employeeCode||"").toUpperCase()===code.toUpperCase());if(!row)return;
  if(button.dataset.action==="edit-driver-area"){
    const select=document.querySelector("#driverAreaDriver"),areaInput=document.querySelector("#driverAreaValue");select.value=row.employeeCode;areaInput.value=row.operatingArea||"";areaInput.focus();return;
  }
  if(button.dataset.action!=="delete-driver-area"||!confirm(`Xóa khai báo khu vực của ${row.employeeName} (${row.employeeCode})?`))return;
  button.disabled=true;
  try{await fetchJson(`/api/proxy/accounting/driver-areas/${encodeURIComponent(code)}`,{method:"DELETE"});await loadDriverAreas();}
  catch(error){alert(error.message||"Không thể xóa khai báo khu vực.");button.disabled=false;}
}

function renderAllowanceTypes() {
  const list=document.querySelector("#allowanceTypeList");
  if(!list) return;
  list.innerHTML=(state.allowanceTypes||[]).map(item=>`<span class="allowance-type-item"><strong>${escapeHtml(item.name)}</strong><button class="secondary" data-action="edit-allowance-type" data-id="${escapeHtml(item.id)}" type="button">Sửa</button><button class="danger" data-action="delete-allowance-type" data-id="${escapeHtml(item.id)}" type="button">Xóa</button></span>`).join("");
}

async function refreshAllowanceTypes() {
  const result=await fetchJson("/api/proxy/accounting/allowance-types",{},90000);
  state.allowanceTypes=result.rows||[];
  renderDriverSalaries();
}

async function createAllowanceType(event) {
  event.preventDefault();
  const input=document.querySelector("#allowanceTypeName"),name=input.value.trim();
  if(!name) return;
  try { await fetchJson("/api/proxy/accounting/allowance-types",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})}); input.value=""; await refreshAllowanceTypes(); }
  catch(error) { alert(error.message||"Không thể thêm loại phụ cấp."); }
}

async function manageAllowanceTypeClick(event) {
  const button=event.target.closest("button[data-action]");
  if(!button) return;
  const item=(state.allowanceTypes||[]).find(row=>row.id===button.dataset.id);
  if(!item) return;
  try {
    if(button.dataset.action==="edit-allowance-type") {
      const name=prompt("Tên loại phụ cấp mới:",item.name)?.trim();
      if(!name || name===item.name) return;
      await fetchJson(`/api/proxy/accounting/allowance-types/${encodeURIComponent(item.id)}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});
    } else if(confirm(`Ngừng sử dụng loại phụ cấp “${item.name}”? Dữ liệu lương cũ vẫn được giữ nguyên.`)) {
      await fetchJson(`/api/proxy/accounting/allowance-types/${encodeURIComponent(item.id)}`,{method:"DELETE"});
    } else return;
    await refreshAllowanceTypes();
  } catch(error) { alert(error.message||"Không thể cập nhật loại phụ cấp."); }
}

async function saveDriverSalary(event) {
  event.preventDefault();
  const form=event.currentTarget;
  if (!(form instanceof HTMLFormElement)) return;
  const select=document.querySelector("#salaryDriverSelect"),option=select?.selectedOptions?.[0];
  if (!select || !option) {
    alert("Vui lòng chọn lái xe.");
    return;
  }
  const allowances=salaryAllowancesFromForm();
  const bankName=document.querySelector("#salaryBankName"),accountNumber=document.querySelector("#salaryAccountNumber"),accountHolder=document.querySelector("#salaryAccountHolder"),effectiveMonth=document.querySelector("#salaryEffectiveMonth"),baseAmount=document.querySelector("#salaryBaseAmount");
  if (!bankName || !accountNumber || !accountHolder || !effectiveMonth || !baseAmount) {
    alert("Biểu mẫu khai báo lương chưa tải đầy đủ. Vui lòng tải lại trang.");
    return;
  }
  const payload={employeeCode:select.value,employeeName:option.dataset?.name||"",bankName:bankName.value.trim(),accountNumber:accountNumber.value.trim(),accountHolder:accountHolder.value.trim(),effectiveMonth:effectiveMonth.value,baseSalary:salaryNumber(baseAmount.value),allowances,allowanceType:allowances[0]?.type||"Khác",allowance:allowances.reduce((sum,item)=>sum+item.amount,0)};
  const button=form.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled=true;
  try { await fetchJson("/api/proxy/accounting/driver-salaries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); form.dataset.editing=""; button.textContent="Lưu mức lương"; await loadDriverSalaries(); closeSalaryDialog(); }
  catch(error) { alert(error.message||"Không thể lưu mức lương."); }
  finally { button.disabled=false; }
}

async function exportFuelStandard() {
  const payload = state.fuel || {};
  const month = payload.standardMonth || els.fuelStandardMonth?.value || localMonthForInput();
  const rows = payload.standard || [];
  if (!rows.length) {
    alert("Chưa có dữ liệu định mức để xuất.");
    return;
  }
  const button = els.fuelStandardExportButton;
  const originalLabel = button?.textContent || "Xuất Excel";
  if (button) { button.disabled = true; button.textContent = "Đang xuất..."; }
  try {
    let fuelRows = Array.isArray(payload.rows) ? payload.rows : [];
    try {
      const fuelPayload = await fetchJson("/api/proxy/accounting/fuel", {}, 90000);
      fuelRows = Array.isArray(fuelPayload) ? fuelPayload : fuelPayload.rows || [];
      state.fuel = { ...state.fuel, rows: fuelRows };
    } catch { /* Vẫn xuất sheet định mức nếu dữ liệu nhập xăng tạm thời không tải được. */ }

    const rawStandardRate = payload.standardRate;
    const standardRate = typeof rawStandardRate === "number"
      ? rawStandardRate
      : Number(String(rawStandardRate || "0.075").trim().replace(",", ".")) || 0.075;
    const standardRateText = standardRate.toLocaleString("vi-VN", { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    const monthKey = String(month).slice(0, 7);
    const fuelRowMonth = (row) => {
      const text = String(row.ngay || "").trim();
      const iso = text.match(/^(\d{4}-\d{2})/);
      if (iso) return iso[1];
      const native = nativeDateValue(text);
      return native ? native.slice(0, 7) : "";
    };
    const detailRows = fuelRows
      .filter((row) => fuelRowMonth(row) === monthKey)
      .sort((a, b) => String(a.ngay || "").localeCompare(String(b.ngay || "")) || String(a.employeeName || "").localeCompare(String(b.employeeName || "")));
    const standardHeaders = ["STT", "Tài xế", "Mã NV", "BSX", "Km đã chạy", "ĐM chuẩn (lít)", "Số lít đã đổ", "Chênh lệch", "Thu vượt ĐM (VNĐ)", "Tiết kiệm (lít)", "Thưởng (VNĐ)"];
    const standardWidths = [42, 155, 72, 92, 88, 100, 100, 92, 118, 100, 105];
    const standardData = rows.map((row, index) => {
      const difference = fuelNumber(row.differenceLit);
      return [index + 1, row.employeeName || row.employeeCode || "", row.employeeCode || "", row.bienKiemSoat || "", formatFuelNumber(row.totalKm), formatFuelNumber(row.standardLit), formatFuelNumber(row.totalLit), `${difference > 0 ? "+" : ""}${formatFuelNumber(difference)}`, formatMoney(row.overuseCharge), formatFuelNumber(row.savingLit), formatMoney(row.savingBonus)];
    });
    const detailHeaders = ["STT", "Ngày", "Tài xế", "Mã NV", "BSX", "Loại nhiên liệu", "Số lít", "Đơn giá / lít", "Thành tiền (VNĐ)", "Số km taplo", "Số km đã chạy (Km)"];
    const detailWidths = [42, 88, 155, 72, 92, 155, 72, 100, 118, 100, 110];
    const detailData = detailRows.map((row, index) => [index + 1, formatDate(row.ngay), row.employeeName || row.employeeCode || "", row.employeeCode || "", row.bienKiemSoat || "", row.loaiNhienLieu || "", formatFuelNumber(row.soLit), formatMoney(row.donGiaLit), formatMoney(row.thanhTien), formatFuelNumber(row.soKmTaplo), formatFuelNumber(row.soKmDaChay)]);
    const xmlText = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
    const xmlCell = (value, style = "") => `<Cell${style ? ` ss:StyleID="${style}"` : ""}><Data ss:Type="String">${xmlText(value)}</Data></Cell>`;
    const xmlRow = (values, style = "", height = "") => `<Row${height ? ` ss:Height="${height}"` : ""}>${values.map((value) => xmlCell(value, style)).join("")}</Row>`;
    const xmlWorksheet = (name, title, note, headers, data, widths) => {
      const mergeAcross = Math.max(0, headers.length - 1);
      const columns = widths.map((width) => `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`).join("");
      const body = data.length ? data.map((row, index) => xmlRow(row, index % 2 ? "BodyAlt" : "Body", 22)).join("") : `<Row ss:Height="22"><Cell ss:MergeAcross="${mergeAcross}" ss:StyleID="Note"><Data ss:Type="String">Không có dữ liệu trong tháng này.</Data></Cell></Row>`;
      return `<Worksheet ss:Name="${xmlText(name)}"><Table>${columns}<Row ss:Height="28"><Cell ss:MergeAcross="${mergeAcross}" ss:StyleID="Title"><Data ss:Type="String">${xmlText(title)}</Data></Cell></Row><Row ss:Height="22"><Cell ss:MergeAcross="${mergeAcross}" ss:StyleID="Note"><Data ss:Type="String">${xmlText(note)}</Data></Cell></Row>${xmlRow(headers, "Header", 34)}${body}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><FreezePanes/><FrozenNoSplit/><SplitHorizontal>3</SplitHorizontal><TopRowBottomPane>3</TopRowBottomPane></WorksheetOptions></Worksheet>`;
    };
    const borders = `<Borders><Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#C8D9DB"/><Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#C8D9DB"/><Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#C8D9DB"/><Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#C8D9DB"/></Borders>`;
    const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"><DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>ĐI XANH FINANCE</Author><Created>${new Date().toISOString()}</Created></DocumentProperties><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Font ss:FontName="Arial" ss:Size="10"/></Style><Style ss:ID="Title"><Font ss:FontName="Arial" ss:Size="15" ss:Bold="1" ss:Color="#0B5F68"/></Style><Style ss:ID="Header"><Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>${borders}<Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/><Interior ss:Color="#D9EEEE" ss:Pattern="Solid"/></Style><Style ss:ID="Body"><Alignment ss:Vertical="Center"/>${borders}</Style><Style ss:ID="BodyAlt"><Alignment ss:Vertical="Center"/>${borders}<Interior ss:Color="#F5FAFA" ss:Pattern="Solid"/></Style><Style ss:ID="Note"><Font ss:FontName="Arial" ss:Size="10" ss:Italic="1" ss:Color="#60777D"/></Style></Styles>${xmlWorksheet("Định mức", `Tính định mức xăng Travel tháng ${month}`, `Định mức chuẩn: ${standardRateText} lít/km · Giá xăng: ${payload.priceDeclared ? `${formatMoney(payload.price)} VNĐ/lít` : "chưa khai báo"}`, standardHeaders, standardData, standardWidths)}${xmlWorksheet("Nhập đổ xăng", `Chi tiết nhập đổ xăng Travel tháng ${month}`, `${detailData.length} lần đổ xăng trong tháng · Ngày hiển thị theo dd/MM/yyyy`, detailHeaders, detailData, detailWidths)}</Workbook>`;
    const blob = new Blob([`\ufeff${xml}`], { type: "application/vnd.ms-excel" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Tinh_dinh_muc_xang_Travel_${month}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  } catch (error) {
    alert(error.message || "Không thể xuất Excel định mức xăng.");
  } finally {
    if (button) { button.disabled = false; button.textContent = originalLabel; }
  }
}

async function manageSalaryRow(event) {
  const button=event.target.closest("button[data-action]");
  if(!button) return;
  const row=(state.driverSalaries.rows||[]).find(item=>item.employeeCode===button.dataset.code&&item.effectiveMonth===button.dataset.month);
  if(!row) return;
  if(button.dataset.action==="edit-salary") {
    document.querySelector("#salaryDriverSelect").value=row.employeeCode;
    document.querySelector("#salaryEffectiveMonth").value=row.effectiveMonth;
    setSalaryBankValue(row.bankName||"");
    document.querySelector("#salaryAccountNumber").value=row.accountNumber||"";
    document.querySelector("#salaryAccountHolder").value=row.accountHolder||"";
    document.querySelector("#salaryBaseAmount").value=formatMoney(row.baseSalary||0);
    setSalaryAllowances(salaryAllowancesForRow(row));
    const form=document.querySelector("#driverSalaryForm"); form.dataset.editing="true"; form.querySelector('button[type="submit"]').textContent="Cập nhật mức lương";
    document.querySelector("#salaryDialogTitle").textContent=`Sửa lương · ${row.employeeName}`;
    updateSalaryTotalPreview(); document.querySelector("#salaryDialog")?.showModal();
    return;
  }
  if(!confirm(`Xóa khai báo lương của ${row.employeeName} áp dụng từ ${row.effectiveMonth}?`)) return;
  try { await fetchJson(`/api/proxy/accounting/driver-salaries/${encodeURIComponent(row.employeeCode)}/${encodeURIComponent(row.effectiveMonth)}`,{method:"DELETE"}); await loadDriverSalaries(); }
  catch(error) { alert(error.message||"Không thể xóa khai báo lương."); }
}

function attendanceDate(value) {
  const match = String(value || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : null;
}

function attendanceCode(value) {
  return String(value || "").match(/-\s*([A-Za-z]{2}\d+)\s*$/)?.[1]?.toUpperCase() || "";
}

function isCargoVan(row) {
  return normalize(row?.so_cho).replace(/\s+/g, "").includes("taivan945kg");
}

function attendanceOverride(payload, viewType, employeeCode, day, fallback) {
  return payload?.overrides?.[`${viewType}:${employeeCode}:${day}`]?.mark || fallback;
}

function attendanceLockFor(payload, viewType) {
  const lock = payload?.locks?.[viewType] || (payload?.viewType === viewType && payload?.locked ? payload : null);
  return lock && (lock.status === "locked" || lock.locked === true) ? lock : null;
}

async function attendancePayloadForMonth(month) {
  const payload = await fetchJson(`/api/proxy/accounting/attendance?month=${encodeURIComponent(month)}`, {}, 90000);
  if (!Array.isArray(payload.holidays)) {
    try {
      const holidays = await fetchJson(`/api/proxy/accounting/payroll-holidays?month=${encodeURIComponent(month)}`, {}, 90000);
      payload.holidays = holidays.rows || [];
    } catch {
      payload.holidays = [];
    }
  }
  return payload;
}

function attendanceHolidayForDay(payload, day) {
  const month = String(payload?.month || "").slice(0, 7);
  if (!month || !Number.isInteger(Number(day))) return null;
  const date = `${month}-${String(day).padStart(2, "0")}`;
  return (payload?.holidays || []).find((holiday) => String(holiday?.date || "").slice(0, 10) === date) || null;
}

function attendanceMarkCell(value, originalValue, viewType, employeeCode, day, payload) {
  const holiday = attendanceHolidayForDay(payload, day);
  const displayValue = value === "X" && holiday ? "NL" : value;
  const label = displayValue === "NL" ? `Ngày lễ: ${holiday?.name || "Ngày lễ"} (có đi làm)` : value === "X" ? "Có đi làm" : value === "O" ? "Nghỉ có lương" : "Nghỉ không lương";
  const override = payload?.overrides?.[`${viewType}:${employeeCode}:${day}`];
  const lock = attendanceLockFor(payload, viewType);
  const editingPaused = !ATTENDANCE_EDITING_ENABLED || payload?.editingEnabled === false;
  const editedBy = String(override?.updatedBy || "").trim();
  const editedAtValue = String(override?.updatedAt || "").trim();
  const editedAtDate = editedAtValue ? new Date(editedAtValue) : null;
  const editedAt = editedAtDate && !Number.isNaN(editedAtDate.getTime()) ? editedAtDate.toLocaleString("vi-VN") : editedAtValue;
  const editTitle = editingPaused ? "Chức năng thay đổi dấu công đang tạm khóa." : lock ? `Bảng lương đã chốt${lock.lockedBy ? ` bởi ${lock.lockedBy}` : ""}${lock.lockedAt ? ` lúc ${new Date(lock.lockedAt).toLocaleString("vi-VN")}` : ""}` : override ? `Ký hiệu gốc: ${originalValue} → Hiện tại: ${value} · Đã sửa bởi ${editedBy || "Kế toán"}${editedAt ? ` lúc ${editedAt}` : ""}` : `Ký hiệu gốc: ${originalValue} · Dữ liệu tự động · Bấm để sửa`;
  const title = holiday && value === "X" ? `${holiday.name || "Ngày lễ"} · NL vẫn được tính 1 ngày công. ${editTitle}` : editTitle;
  const markClass = displayValue === "NL" ? "holiday" : value === "O" ? "off" : value === "KL" ? "unpaid" : "on";
  const disabled = lock || editingPaused;
  return `<td class="attendance-mark ${markClass}${override ? " manually-edited" : ""}${lock ? " attendance-locked" : ""}${editingPaused ? " attendance-editing-paused" : ""}" title="${escapeHtml(title)}"><select class="attendance-mark-editor" data-attendance-view="${viewType}" data-employee-code="${escapeHtml(employeeCode)}" data-day="${day}" aria-label="Ngày ${day}: ${escapeHtml(label)}"${disabled ? " disabled" : ""}><option value="X"${value === "X" ? " selected" : ""}>${displayValue === "NL" ? "NL" : "X"}</option><option value="O"${value === "O" ? " selected" : ""}>O</option><option value="KL"${value === "KL" ? " selected" : ""}>KL</option></select></td>`;
}

function attendanceRows() {
  const month = state.attendance.month || document.querySelector("#attendanceMonthInput")?.value;
  if (!month) return [];
  const [year, monthNumber] = month.split("-").map(Number);
  const monthEnd = new Date(year, monthNumber, 0, 23, 59, 59);
  const events = new Map();
  const rosterNames = new Map();
  const rosterBranches = new Map();
  for (const row of state.attendance.roster || []) {
    if (isCargoVan(row)) continue;
    const code = attendanceCode(row.hoTenMSNVLaiXe);
    const date = attendanceDate(row.thoiGianTao);
    if (!code || !date) continue;
    const name = String(row.hoTenMSNVLaiXe || "").replace(/\s*-\s*[A-Za-z]{2}\d+\s*$/, "").trim();
    rosterNames.set(code, name);
    if (row.khuVucHoatDong) rosterBranches.set(code, String(row.khuVucHoatDong).trim());
    const key = `${code}:${date.getDate()}`;
    events.set(key, normalize(row.trangThaiLenXuongCa).includes("xuong ca") ? "O" : "X");
  }
  const codes = new Set(rosterNames.keys());
  return [...codes].map(code => {
    const originalDays = Array.from({ length: monthEnd.getDate() }, (_, index) => events.get(`${code}:${index + 1}`) || "KL");
    const days = originalDays.map((originalValue, index) => attendanceOverride(state.attendance, "travel", code, index + 1, originalValue));
    return { code, name: rosterNames.get(code) || code, position: "Tài xế Travel", branch: rosterBranches.get(code) || "", originalDays, days, total: days.filter(value => value === "X").length };
  }).sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

function renderAttendance() {
  const table = document.querySelector("#attendanceTable");
  if (!table) return;
  const month = state.attendance.month || document.querySelector("#attendanceMonthInput")?.value;
  if (!month) return;
  const [year, monthNumber] = month.split("-").map(Number);
  const dayCount = new Date(year, monthNumber, 0).getDate();
  const weekday = date => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
  const rows = attendanceRows();
  const lock = attendanceLockFor(state.attendance, "travel");
  document.querySelector("#attendanceHeading").textContent = `Chấm Công Lái Xe Travel tháng ${String(monthNumber).padStart(2, "0")}/${year}`;
  document.querySelector("#attendanceSummary").textContent = `${rows.length} nhân sự · ${rows.reduce((sum, row) => sum + row.total, 0)} ngày công`;
  const lockStatus = document.querySelector("#attendanceLockStatus");
  if (lockStatus) lockStatus.textContent = !ATTENDANCE_EDITING_ENABLED || state.attendance?.editingEnabled === false ? "TẠM KHÓA THAY ĐỔI DẤU CÔNG" : lock ? "ĐÃ CHỐT LƯƠNG · Bảng công đã khóa" : "";
  table.innerHTML = `<thead><tr><th rowspan="2">STT</th><th rowspan="2" class="employee-col">Họ và tên</th><th rowspan="2" class="role-col">Chức vụ</th><th colspan="${dayCount}">Ngày trong tháng</th><th rowspan="2" class="total-col">Tổng công</th><th rowspan="2">Ghi chú</th></tr><tr>${Array.from({length:dayCount},(_,i)=>`<th class="day-head"><b>${String(i+1).padStart(2,"0")}</b><small>${weekday(new Date(year,monthNumber-1,i+1))}</small></th>`).join("")}</tr></thead><tbody>${rows.map((row,index)=>`<tr><td>${index+1}</td><td class="employee-col"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.code)}${row.branch?` · ${escapeHtml(row.branch)}`:""}</small></td><td class="role-col">${escapeHtml(row.position)}</td>${row.days.map((value,dayIndex)=>attendanceMarkCell(value,row.originalDays[dayIndex],"travel",row.code,dayIndex+1,state.attendance)).join("")}<td class="total-col"><strong>${row.total}</strong></td><td></td></tr>`).join("") || `<tr><td colspan="${dayCount+5}" class="empty">Không có dữ liệu chấm công trong tháng này.</td></tr>`}</tbody>`;
}

async function loadAttendance(useSelectedMonth = true) {
  const input = document.querySelector("#attendanceMonthInput");
  if (!input.value) input.value = localMonthForInput();
  const month = useSelectedMonth ? input.value : (state.attendance.month || input.value);
  document.querySelector("#attendanceSummary").textContent = "Đang tổng hợp dữ liệu...";
  try {
    const payload = await attendancePayloadForMonth(month);
    state.attendance = payload;
    renderAttendance();
  } catch (error) {
    document.querySelector("#attendanceSummary").textContent = error.message || "Không thể tải bảng chấm công.";
  }
}

function exportAttendanceCsv() {
  const month = state.attendance.month || document.querySelector("#attendanceMonthInput")?.value || "";
  if (month) window.location.href = `/api/proxy/accounting/attendance.xlsx?month=${encodeURIComponent(month)}&viewType=travel`;
}

function cargoAttendanceRows() {
  const month = state.cargoAttendance.month || document.querySelector("#cargoAttendanceMonthInput")?.value;
  if (!month) return [];
  const [year, monthNumber] = month.split("-").map(Number);
  const dayCount = new Date(year, monthNumber, 0).getDate();
  const drivers = new Map();
  const events = new Map();
  for (const row of state.cargoAttendance.roster || []) {
    if (!isCargoVan(row)) continue;
    const code = attendanceCode(row.hoTenMSNVLaiXe);
    const date = attendanceDate(row.thoiGianTao);
    if (!code || !date) continue;
    const name = String(row.hoTenMSNVLaiXe || "").replace(/\s*-\s*[A-Za-z]{2}\d+\s*$/, "").trim();
    drivers.set(code, { name, branch: String(row.khuVucHoatDong || "").trim() });
    const key = `${code}:${date.getDate()}`;
    const status = normalize(row.trangThaiLenXuongCa);
    const isHoliday = Boolean(attendanceHolidayForDay(state.cargoAttendance, date.getDate()));
    if (status.includes("len ca")) {
      events.set(key, "X");
    } else if (isHoliday && status.includes("xuong ca")) {
      if (!events.has(key)) events.set(key, "X");
    } else if (!events.has(key)) events.set(key, "KL");
  }
  return [...drivers].map(([code, driver]) => {
    const originalDays = Array.from({length:dayCount},(_,index)=>events.get(`${code}:${index+1}`) || "KL");
    const days = originalDays.map((originalValue,index)=>attendanceOverride(state.cargoAttendance,"cargo",code,index+1,originalValue));
    return {code,name:driver.name || code,position:"Tài xế Xe Hàng",branch:driver.branch,originalDays,days,total:days.filter(value=>value==="X").length};
  }).sort((a,b)=>a.name.localeCompare(b.name,"vi"));
}

function renderCargoAttendance() {
  const table=document.querySelector("#cargoAttendanceTable");
  const month=state.cargoAttendance.month || document.querySelector("#cargoAttendanceMonthInput")?.value;
  if(!table || !month) return;
  const [year,monthNumber]=month.split("-").map(Number),dayCount=new Date(year,monthNumber,0).getDate();
  const weekday=date=>["CN","T2","T3","T4","T5","T6","T7"][date.getDay()];
  const rows=cargoAttendanceRows();
  const lock = attendanceLockFor(state.cargoAttendance, "cargo");
  document.querySelector("#cargoAttendanceHeading").textContent=`Chấm Công Xe Hàng tháng ${String(monthNumber).padStart(2,"0")}/${year}`;
  document.querySelector("#cargoAttendanceSummary").textContent=`${rows.length} tài xế · ${rows.reduce((sum,row)=>sum+row.total,0)} ngày công`;
  const lockStatus = document.querySelector("#cargoAttendanceLockStatus");
  if (lockStatus) lockStatus.textContent = !ATTENDANCE_EDITING_ENABLED || state.cargoAttendance?.editingEnabled === false ? "TẠM KHÓA THAY ĐỔI DẤU CÔNG" : lock ? "ĐÃ CHỐT LƯƠNG · Bảng công đã khóa" : "";
  table.innerHTML=`<thead><tr><th rowspan="2">STT</th><th rowspan="2" class="employee-col">Họ và tên</th><th rowspan="2" class="role-col">Chức vụ</th><th colspan="${dayCount}">Ngày trong tháng</th><th rowspan="2" class="total-col">Tổng công</th><th rowspan="2">Ghi chú</th></tr><tr>${Array.from({length:dayCount},(_,i)=>`<th class="day-head"><b>${String(i+1).padStart(2,"0")}</b><small>${weekday(new Date(year,monthNumber-1,i+1))}</small></th>`).join("")}</tr></thead><tbody>${rows.map((row,index)=>`<tr><td>${index+1}</td><td class="employee-col"><strong>${escapeHtml(row.name)}</strong><small>${escapeHtml(row.code)}${row.branch?` · ${escapeHtml(row.branch)}`:""}</small></td><td class="role-col">${escapeHtml(row.position)}</td>${row.days.map((value,dayIndex)=>attendanceMarkCell(value,row.originalDays[dayIndex],"cargo",row.code,dayIndex+1,state.cargoAttendance)).join("")}<td class="total-col"><strong>${row.total}</strong></td><td></td></tr>`).join("")||`<tr><td colspan="${dayCount+5}" class="empty">Không có dữ liệu Tải Van 945KG trong tháng này.</td></tr>`}</tbody>`;
}

async function saveAttendanceOverride(select) {
  if (!ATTENDANCE_EDITING_ENABLED) {
    alert("Chức năng thay đổi dấu công đang tạm khóa.");
    return;
  }
  const viewType=select.dataset.attendanceView,employeeCode=select.dataset.employeeCode,day=Number(select.dataset.day),mark=select.value;
  const payload=viewType==="cargo"?state.cargoAttendance:state.attendance;
  if (attendanceLockFor(payload, viewType)) {
    alert("Bảng lương tháng này đã chốt, không thể sửa bảng công.");
    return;
  }
  const month=payload.month;
  select.disabled=true;
  try {
    const result=await fetchJson("/api/proxy/accounting/attendance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({month,viewType,employeeCode,day,mark})});
    payload.overrides ||= {};
    payload.overrides[`${viewType}:${employeeCode}:${day}`]=result.override || {month,viewType,employeeCode,day,mark};
    if(viewType==="cargo") renderCargoAttendance(); else renderAttendance();
  } catch(error) {
    alert(error.message||"Không thể lưu ký hiệu công.");
    if(viewType==="cargo") renderCargoAttendance(); else renderAttendance();
  }
}

async function loadCargoAttendance(useSelectedMonth=true) {
  const input=document.querySelector("#cargoAttendanceMonthInput");
  if(!input.value) input.value=localMonthForInput();
  const month=useSelectedMonth?input.value:(state.cargoAttendance.month||input.value);
  document.querySelector("#cargoAttendanceSummary").textContent="Đang tổng hợp dữ liệu...";
  try { state.cargoAttendance=await attendancePayloadForMonth(month); renderCargoAttendance(); }
  catch(error){ document.querySelector("#cargoAttendanceSummary").textContent=error.message||"Không thể tải bảng chấm công xe hàng."; }
}

function applyAttendanceType(type = "travel") {
  const value = type === "cargo" ? "cargo" : "travel";
  const travelMonthInput = document.querySelector("#attendanceMonthInput");
  const cargoMonthInput = document.querySelector("#cargoAttendanceMonthInput");
  const selectedMonth = value === "cargo" ? travelMonthInput?.value : cargoMonthInput?.value;
  if (selectedMonth) {
    if (value === "cargo" && cargoMonthInput) cargoMonthInput.value = selectedMonth;
    if (value === "travel" && travelMonthInput) travelMonthInput.value = selectedMonth;
  }
  document.querySelectorAll(".attendance-view-type").forEach((select) => {
    select.value = value;
  });
  const travelView = document.querySelector("#attendanceView");
  const cargoView = document.querySelector("#cargoAttendanceView");
  travelView?.classList.toggle("active", value === "travel");
  cargoView?.classList.toggle("active", value === "cargo");
  if (els.pageTitle) els.pageTitle.textContent = "Chấm Công Lái Xe";
  if (els.pageHint) els.pageHint.textContent = "Chọn nhóm tài xế để xem bảng công Travel hoặc Xe Hàng.";
  if (value === "cargo") {
    loadCargoAttendance(true);
  } else {
    loadAttendance(true);
  }
}

function exportCargoAttendanceCsv(){
  const month=state.cargoAttendance.month||document.querySelector("#cargoAttendanceMonthInput")?.value||"";
  if(month) window.location.href=`/api/proxy/accounting/attendance.xlsx?month=${encodeURIComponent(month)}&viewType=cargo`;
}

document.querySelector("#attendanceRefreshButton")?.addEventListener("click", () => loadAttendance(true));
document.querySelector("#attendanceMonthInput")?.addEventListener("change", () => {
  const value = document.querySelector("#attendanceMonthInput")?.value || "";
  const cargoInput = document.querySelector("#cargoAttendanceMonthInput");
  if (cargoInput && value) cargoInput.value = value;
  loadAttendance(true);
});
document.querySelector("#attendanceExportButton")?.addEventListener("click", exportAttendanceCsv);
document.querySelector("#cargoAttendanceRefreshButton")?.addEventListener("click",()=>loadCargoAttendance(true));
document.querySelector("#cargoAttendanceMonthInput")?.addEventListener("change",()=>{
  const value = document.querySelector("#cargoAttendanceMonthInput")?.value || "";
  const travelInput = document.querySelector("#attendanceMonthInput");
  if (travelInput && value) travelInput.value = value;
  loadCargoAttendance(true);
});
document.querySelector("#cargoAttendanceExportButton")?.addEventListener("click",exportCargoAttendanceCsv);
document.querySelectorAll(".attendance-view-type").forEach((select) => {
  select.addEventListener("change", () => applyAttendanceType(select.value));
});
document.querySelector("#attendanceTable")?.addEventListener("change",event=>{if(event.target.matches(".attendance-mark-editor")) saveAttendanceOverride(event.target);});
document.querySelector("#cargoAttendanceTable")?.addEventListener("change",event=>{if(event.target.matches(".attendance-mark-editor")) saveAttendanceOverride(event.target);});
els.fuelForm?.addEventListener("submit", saveFuelRecord);
els.fuelImportTemplateButton?.addEventListener("click", downloadFuelImportTemplate);
els.fuelImportButton?.addEventListener("click", () => els.fuelImportInput?.click());
els.fuelImportInput?.addEventListener("change", () => importFuelExcel(els.fuelImportInput.files?.[0]));
els.fuelDriver?.addEventListener("change", () => { updateFuelPlate(); applyFuelFormDefaults(els.fuelDriver.value); updateFuelOdometerReference({ clearDistanceWhenMissing: true }); });
els.fuelPlate?.addEventListener("change", () => updateFuelOdometerReference({ clearDistanceWhenMissing: true }));
els.fuelDate?.addEventListener("change", () => updateFuelOdometerReference({ clearDistanceWhenMissing: true }));
els.fuelOdometer?.addEventListener("input", () => updateFuelOdometerReference());
els.fuelLiters?.addEventListener("input", updateFuelAmount);
els.fuelPrice?.addEventListener("input", updateFuelAmount);
els.fuelCancelButton?.addEventListener("click", resetFuelForm);
els.fuelDriverSearch?.addEventListener("input", renderFuelRecords);
els.fuelTable?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-fuel") editFuelRecord(button.dataset.id);
  if (button.dataset.action === "delete-fuel") deleteFuelRecord(button.dataset.id);
});
els.fuelPriceForm?.addEventListener("submit", saveFuelPrice);
els.fuelPriceAmount?.addEventListener("blur", () => { els.fuelPriceAmount.value = els.fuelPriceAmount.value ? formatMoney(fuelNumber(els.fuelPriceAmount.value)) : ""; });
els.fuelPriceMonth?.addEventListener("change", () => { loadFuelStandard(els.fuelPriceMonth.value || localMonthForInput()); updateFuelPriceLockState(); });
els.fuelPriceTable?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "edit-fuel-price") editFuelPrice(button.dataset.month);
  if (button.dataset.action === "delete-fuel-price") deleteFuelPrice(button.dataset.month);
});
els.fuelStandardRefreshButton?.addEventListener("click", () => loadFuelStandard(els.fuelStandardMonth?.value || localMonthForInput()));
els.fuelStandardExportButton?.addEventListener("click", exportFuelStandard);
els.fuelStandardMonth?.addEventListener("change", () => loadFuelStandard(els.fuelStandardMonth.value || localMonthForInput()));
resetFuelForm();
els.carWashDate?.addEventListener("change", () => loadCarWashRecords(true));
els.carWashFromDate?.addEventListener("change", () => loadCarWashRecords(true));
els.carWashToDate?.addEventListener("change", () => loadCarWashRecords(true));
els.carWashRefreshButton?.addEventListener("click", () => loadCarWashRecords(true));
els.carWashExportButton?.addEventListener("click", exportCarWash);
els.carWashDriverList?.addEventListener("click", (event) => {
  const button = event.target.closest("button.car-wash-confirm");
  if (button) confirmCarWash(button.dataset.code || "");
});
els.carWashTable?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  if (button.dataset.action === "delete-car-wash") deleteCarWashRecord(button.dataset.id);
});
resetCarWashForm();
document.querySelector("#driverSalaryForm")?.addEventListener("submit",saveDriverSalary);
document.querySelector("#driverSalaryTable")?.addEventListener("click",manageSalaryRow);
document.querySelector("#driverSalarySearch")?.addEventListener("input",event=>{state.filters.driverSalary=event.target.value;renderDriverSalaries();});
document.querySelector("#driverAreaSearch")?.addEventListener("input",event=>{state.filters.driverArea=event.target.value;renderDriverAreas();});
document.querySelector("#driverAreaForm")?.addEventListener("submit",saveDriverArea);
document.querySelector("#driverAreaTable")?.addEventListener("click",manageDriverAreaClick);
document.querySelector("#openSalaryDialog")?.addEventListener("click",openSalaryDialogForCreate);
document.querySelector("#closeSalaryDialog")?.addEventListener("click",closeSalaryDialog);
document.querySelector("#cancelSalaryDialog")?.addEventListener("click",closeSalaryDialog);
document.querySelector("#salaryBaseAmount")?.addEventListener("input",event=>formatSalaryAmountInput(event.target));
document.querySelector("#addSalaryAllowance")?.addEventListener("click",()=>addSalaryAllowanceRow());
document.querySelector("#salaryAllowanceRows")?.addEventListener("input",event=>{if(event.target.matches(".salary-allowance-amount")) formatSalaryAmountInput(event.target);});
document.querySelector("#salaryAllowanceRows")?.addEventListener("click",event=>{const button=event.target.closest(".remove-allowance");if(!button)return;button.closest(".salary-allowance-row")?.remove();if(!document.querySelector(".salary-allowance-row"))addSalaryAllowanceRow();updateSalaryTotalPreview();});
document.querySelector("#toggleAllowanceManager")?.addEventListener("click",()=>{const manager=document.querySelector("#allowanceManager");manager.hidden=!manager.hidden;});
document.querySelector("#allowanceTypeForm")?.addEventListener("submit",createAllowanceType);
document.querySelector("#allowanceTypeList")?.addEventListener("click",manageAllowanceTypeClick);
document.querySelector("#salaryDriverSelect")?.addEventListener("change",event=>{
  const code=event.target.value;
  const selectedName=event.target.selectedOptions[0]?.dataset.name||"";
  document.querySelector("#salaryAccountHolder").value=selectedName.toUpperCase();
  const latest=(state.driverSalaries.rows||[]).filter(row=>row.employeeCode===code).sort((a,b)=>String(b.effectiveMonth).localeCompare(String(a.effectiveMonth)))[0];
  if(!latest) return;
  setSalaryBankValue(latest.bankName||"");
  document.querySelector("#salaryAccountNumber").value=latest.accountNumber||"";
  document.querySelector("#salaryAccountHolder").value=latest.accountHolder||selectedName.toUpperCase();
  document.querySelector("#salaryBaseAmount").value=formatMoney(latest.baseSalary||0);
  setSalaryAllowances(salaryAllowancesForRow(latest));
  updateSalaryTotalPreview();
});

setSalaryAllowances();

function payrollOvertimeText(minutes) {
  const value=Math.max(0,Number(minutes)||0),hours=Math.floor(value/60),remaining=value%60;
  return `${hours}:${String(remaining).padStart(2,"0")}`;
}

function orderDeductionTypes(types) {
  const unique=[];
  (types||[]).forEach(type=>{const value=String(type||"").trim();if(value&&!unique.includes(value))unique.push(value);});
  return unique.sort((a,b)=>{const aOther=normalize(a)==="khac",bOther=normalize(b)==="khac";return aOther===bOther?normalize(a).localeCompare(normalize(b)):aOther?1:-1;});
}

function renderPayroll() {
  const payload=state.payroll||{},isCargo=payload.viewType==="cargo",rows=payload.rows||[];
  const head=document.querySelector("#payrollTableHead"),body=document.querySelector("#payrollTableBody"),summary=document.querySelector("#payrollSummary");
  if(!head||!body||!summary)return;
  const payslipsZipButton=document.querySelector("#payrollPayslipsZipExport");
  if(payslipsZipButton){
    payslipsZipButton.disabled=rows.length===0;
    payslipsZipButton.title=`Tải file ZIP, mỗi ${isCargo?"tài xế Xe Hàng":"lái xe Travel"} một file Excel chi tiết.`;
  }
  const lockButton=document.querySelector("#payrollLockButton");
  if (lockButton) {
    lockButton.disabled = Boolean(payload.locked);
    lockButton.textContent = payload.locked ? "ĐÃ CHỐT LƯƠNG" : "CHỐT LƯƠNG";
    lockButton.title = payload.locked ? `Đã chốt${payload.lockedBy ? ` bởi ${payload.lockedBy}` : ""}` : "Khóa bảng lương và bảng công của tháng đã chọn";
  }
  const allowanceTypes=[];
  const knownAllowanceTypes=Array.isArray(payload.allowanceTypes)?payload.allowanceTypes:[];
  [...knownAllowanceTypes,...rows.flatMap(row=>salaryAllowancesForRow(row).map(item=>String(item.type||"Khác").trim()||"Khác"))].forEach(type=>{if(type&&!allowanceTypes.includes(type))allowanceTypes.push(type);});
  const deductionTypes=[];
  const knownDeductionTypes=Array.isArray(payload.deductionTypes)?payload.deductionTypes:[];
  [...knownDeductionTypes,...rows.flatMap(row=>(row.deductions||[]).map(item=>String(item.type||"Khoản trừ").trim()||"Khoản trừ"))].forEach(type=>{if(type&&!deductionTypes.includes(type))deductionTypes.push(type);});
  const orderedDeductionTypes=orderDeductionTypes(deductionTypes);
  const allowanceAmount=(row,type)=>salaryAllowancesForRow(row).filter(item=>(String(item.type||"Khác").trim()||"Khác")===type).reduce((sum,item)=>sum+salaryNumber(item.amount),0);
  const deductionAmount=(row,type)=>(row.deductions||[]).filter(item=>(String(item.type||"Khoản trừ").trim()||"Khoản trừ")===type).reduce((sum,item)=>sum+salaryNumber(item.amount),0);
  const columns=["STT","Mã NV","Họ và tên","Công chuẩn","Công thực tế","Lương cơ bản",...allowanceTypes,"Tổng phụ cấp",...orderedDeductionTypes,"Tổng khoản trừ","Ghi chú",...(isCargo?["Giờ tăng ca","Tiền tăng ca"]:[]),"Thưởng đủ công","Ngày lễ đi làm","Thưởng ngày lễ",...(isCargo?["Số ngày còn phép trong tháng","Tiền thưởng ngày công tăng ca"]:["Doanh thu tháng","Thưởng doanh thu 10%","Thưởng tiết kiệm xăng","Thu vượt định mức"]),"Tổng lương","Thao tác"];
  head.innerHTML=`<tr>${columns.map(label=>`<th>${escapeHtml(label)}</th>`).join("")}</tr>`;
  body.innerHTML=rows.map((row,index)=>`<tr class="payroll-driver-row" data-code="${escapeHtml(row.employeeCode)}"><td>${index+1}</td><td><strong>${escapeHtml(row.employeeCode)}</strong></td><td><button class="link-button payroll-driver-detail" data-code="${escapeHtml(row.employeeCode)}" type="button">${escapeHtml(row.employeeName)}</button></td><td>${row.requiredDays}</td><td><strong>${row.workDays}</strong></td><td class="money">${formatMoney(row.baseSalary)}</td>${allowanceTypes.map(type=>`<td class="money">${formatMoney(allowanceAmount(row,type))}</td>`).join("")}<td class="money">${formatMoney(row.totalAllowance)}</td>${orderedDeductionTypes.map(type=>`<td class="money payroll-deduction-cell"><input class="payroll-deduction-input" data-code="${escapeHtml(row.employeeCode)}" data-name="${escapeHtml(row.employeeName)}" data-type="${escapeHtml(type)}" value="${escapeHtml(deductionAmount(row,type)?formatMoney(deductionAmount(row,type)):"")}" placeholder="0" inputmode="numeric" ${payload.locked?"disabled":""} aria-label="${escapeHtml(type)} của ${escapeHtml(row.employeeName)}" /></td>`).join("")}<td class="money">${formatMoney(row.totalDeduction)}</td><td class="payroll-note-cell"><input class="payroll-note-input" data-code="${escapeHtml(row.employeeCode)}" value="${escapeHtml(row.payrollNote||"")}" placeholder="Ghi chú (nếu là Khác)..." maxlength="500" ${payload.locked?"disabled":""} aria-label="Ghi chú của ${escapeHtml(row.employeeName)}" /></td>${isCargo?`<td>${payrollOvertimeText(row.overtimeMinutes)}</td><td class="money">${formatMoney(row.overtimePay)}</td>`:""}<td class="money">${formatMoney(row.attendanceBonus)}</td><td><strong>${row.holidayWorkDays||0}</strong></td><td class="money payroll-holiday-bonus">${formatMoney(row.holidayBonus)}</td>${isCargo?`<td><strong>${row.remainingLeaveDays||0}</strong></td><td class="money">${formatMoney(row.extraWorkdayBonus)}</td>`:`<td class="money">${formatMoney(row.travelRevenue)}</td><td class="money">${formatMoney(row.travelRevenueBonus)}</td><td class="money">${formatMoney(row.fuelSavingBonus)}</td><td class="money">${formatMoney(row.fuelOveruseCharge)}</td>`}<td class="money salary-total-cell">${formatMoney(row.totalSalary)}</td><td>${row.salaryDeclared?"":`<button class="small payroll-declare-salary" data-code="${escapeHtml(row.employeeCode)}" data-name="${escapeHtml(row.employeeName)}" type="button">Khai báo ngay</button>`}</td></tr>`).join("")||`<tr><td colspan="${columns.length}" class="empty">Không có dữ liệu tài xế trong tháng này.</td></tr>`;
  const total=rows.reduce((sum,row)=>sum+salaryNumber(row.totalSalary),0),deductionTotal=rows.reduce((sum,row)=>sum+salaryNumber(row.totalDeduction),0),bonus=formatMoney(payload.bonusAmount||0),holidayBonus=formatMoney(payload.holidayBonusTotal||0),extraWorkdayBonus=formatMoney(payload.extraWorkdayBonusTotal||0),revenueBonus=formatMoney(payload.travelRevenueBonusTotal||0),fuelBonus=formatMoney(payload.fuelSavingBonusTotal||0),fuelCharge=formatMoney(payload.fuelOveruseChargeTotal||0);
  summary.textContent=`${isCargo?"Xe Hàng":"Travel"} · Công chuẩn ${payload.requiredDays||0} ngày · ${isCargo?"Thưởng đủ công theo chức vụ":`Thưởng đủ công ${bonus}`} · ${payload.holidays?.length||0} ngày lễ · Thưởng ngày lễ ${holidayBonus}${isCargo?` · Thưởng ngày công tăng ca ${extraWorkdayBonus}`:` · Thưởng doanh thu ${payload.travelRevenueBonusRate||10}% ${revenueBonus} · Thưởng tiết kiệm xăng ${fuelBonus} · Thu vượt định mức ${fuelCharge}`} · Khoản trừ ${formatMoney(deductionTotal)} · ${rows.length} tài xế · Tổng lương ${formatMoney(total)}${payload.locked ? " · ĐÃ CHỐT LƯƠNG" : ""}`;
}

async function saveInlinePayrollDeduction(input) {
  const month=state.payroll?.month||document.querySelector("#payrollMonth")?.value||localMonthForInput(),viewType=state.payroll?.viewType||document.querySelector("#payrollViewType")?.value||"travel",code=input.dataset.code||"",type=input.dataset.type||"",amount=salaryNumber(input.value),row=(state.payroll.rows||[]).find(item=>String(item.employeeCode||"").toUpperCase()===code.toUpperCase());
  if(!code||!type||!row||state.payroll?.locked)return;
  const matches=(row.deductions||[]).filter(item=>(String(item.type||"").trim()||"Khoản trừ")===type),existing=matches[0];
  const noteInput=[...document.querySelectorAll(".payroll-note-input")].find((item)=>String(item.dataset.code||"").toUpperCase()===code.toUpperCase());
  const note=String(noteInput?.value||existing?.note||row.payrollNote||"").trim();
  if(amount>0&&normalize(type)==="khac"&&!note){
    if(noteInput){
      input.dataset.pendingNote="1";
      noteInput.classList.add("payroll-note-required");
      noteInput.placeholder="Nhập ghi chú cho khoản Khác";
      noteInput.focus();
    }
    return;
  }
  input.disabled=true;
  try {
    let updatedDeductions=[...(row.deductions||[])];
    if(amount>0){
      const payload={month,viewType,employeeCode:code,employeeName:row.employeeName||"",deductionType:type,amount,note};
      const result=await fetchJson(existing?`/api/proxy/accounting/payroll-deductions/${encodeURIComponent(existing.id)}`:"/api/proxy/accounting/payroll-deductions",{method:existing?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)},90000);
      const saved=result?.row||{},replacement={id:String(saved.id||existing?.id||""),type:String(saved.deductionType||saved.type||type),amount:salaryNumber(saved.amount??amount),note:String(saved.note??note)};
      if(existing){
        let replaced=false;
        updatedDeductions=updatedDeductions.map(item=>{if(!replaced&&(item===existing||String(item.id||"")===String(existing.id||""))){replaced=true;return replacement;}return item;});
      } else updatedDeductions.push(replacement);
      input.value=formatMoney(amount);
    } else if(matches.length){
      for(const item of matches) await fetchJson(`/api/proxy/accounting/payroll-deductions/${encodeURIComponent(item.id)}`,{method:"DELETE"},90000);
      const removedIds=new Set(matches.map(item=>String(item.id||"")));
      updatedDeductions=updatedDeductions.filter(item=>!matches.includes(item)&&!removedIds.has(String(item.id||"")));
      input.value="";
    }
    row.deductions=updatedDeductions;
    row.totalDeduction=updatedDeductions.reduce((sum,item)=>sum+salaryNumber(item.amount),0);
    row.totalSalary=Math.max(0,salaryNumber(row.grossSalary)-row.totalDeduction-salaryNumber(row.fuelOveruseCharge)+salaryNumber(row.fuelSavingBonus));
    if(normalize(type)==="khac"&&note){row.payrollNote=note;state.payrollNotes={...(state.payrollNotes||{}),[code.toUpperCase()]:note};}
    state.payroll.deductionTotal=(state.payroll.rows||[]).reduce((sum,item)=>sum+salaryNumber(item.totalDeduction),0);
    renderPayroll();
  } catch(error){alert(error.message||"Không thể lưu khoản trừ."); input.value=existing?formatMoney(existing.amount):"";} finally{input.disabled=Boolean(state.payroll?.locked);}
}

async function saveInlinePayrollNote(input) {
  const month=state.payroll?.month||document.querySelector("#payrollMonth")?.value||localMonthForInput(),viewType=state.payroll?.viewType||document.querySelector("#payrollViewType")?.value||"travel",code=input.dataset.code||"";
  const row=(state.payroll.rows||[]).find(item=>String(item.employeeCode||"").toUpperCase()===code.toUpperCase());
  if(!code||!row||state.payroll?.locked)return;
  const note=input.value.trim(),previous=String(row.payrollNote||"");
  const otherInput=[...document.querySelectorAll(".payroll-deduction-input")].find((item)=>String(item.dataset.code||"").toUpperCase()===code.toUpperCase()&&normalize(item.dataset.type||"")==="khac");
  const pendingOther=Boolean(otherInput?.dataset.pendingNote);
  if(pendingOther){
    if(!note){input.classList.add("payroll-note-required");input.focus();return;}
    input.classList.remove("payroll-note-required");
    input.placeholder="Ghi chú...";
    delete otherInput.dataset.pendingNote;
    await saveInlinePayrollDeduction(otherInput);
    return;
  }
  input.disabled=true;
  try {
    await fetchJson(`/api/proxy/accounting/payroll-notes/${encodeURIComponent(code)}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({month,viewType,employeeCode:code,note})},90000);
    row.payrollNote=note;
    state.payrollNotes={...(state.payrollNotes||{}),[code.toUpperCase()]:note};
    input.value=note;
    input.classList.remove("payroll-note-required");
    input.placeholder="Ghi chú...";
  } catch(error) { alert(error.message||"Không thể lưu ghi chú bảng lương."); input.value=previous; }
  finally { input.disabled=Boolean(state.payroll?.locked); }
}

async function loadPayroll(useSelected=true) {
  const monthInput=document.querySelector("#payrollMonth"),typeInput=document.querySelector("#payrollViewType");
  if(!monthInput.value)monthInput.value=localMonthForInput();
  const month=useSelected?monthInput.value:(state.payroll.month||monthInput.value),viewType=typeInput.value||"travel";
  document.querySelector("#payrollSummary").textContent="Đang tính bảng lương...";
  try { const typesPromise=(state.deductionTypes||[]).length?Promise.resolve({rows:state.deductionTypes}):fetchJson("/api/proxy/accounting/deduction-types",{},90000); const [payroll,types]=await Promise.all([fetchJson(`/api/proxy/accounting/payroll?month=${encodeURIComponent(month)}&viewType=${encodeURIComponent(viewType)}`,{},90000),typesPromise]); state.deductionTypes=types.rows||[]; state.payrollNotes=Object.fromEntries((payroll.rows||[]).map(row=>[String(row.employeeCode||"").toUpperCase(),String(row.payrollNote||"")])); const catalogTypes=state.deductionTypes.filter(item=>!['inactive','deleted','da xoa'].includes(String(item.status||'').toLowerCase())).map(item=>String(item.name||'').trim()).filter(Boolean); state.payroll={...payroll,deductionTypes:[...(payroll.deductionTypes||[]),...catalogTypes].filter((type,index,array)=>type&&array.indexOf(type)===index)}; renderPayroll(); }
  catch(error) { document.querySelector("#payrollSummary").textContent=error.message||"Không thể tải bảng lương."; }
}

function payrollHolidayDisplayDate(value) {
  const parts=String(value||"").slice(0,10).split("-");
  return parts.length===3?`${parts[2]}/${parts[1]}/${parts[0]}`:String(value||"");
}

function renderPayrollHolidays() {
  const payload=state.payrollHolidays||{},rows=payload.rows||[],body=document.querySelector("#payrollHolidayTableBody"),summary=document.querySelector("#payrollHolidaySummary"),submit=document.querySelector("#payrollHolidaySubmit");
  if(!body||!summary)return;
  body.innerHTML=rows.map((row,index)=>`<tr><td>${index+1}</td><td><strong>${escapeHtml(payrollHolidayDisplayDate(row.date))}</strong></td><td>${escapeHtml(row.name||"Ngày lễ")}</td><td>${escapeHtml(row.updatedBy||"")}</td><td>${payload.locked?`<span class="muted">Tháng đã chốt</span>`:`<button class="small danger payroll-holiday-delete" data-id="${escapeHtml(row.id||"")}" data-date="${escapeHtml(row.date||"")}" type="button">Xóa</button>`}</td></tr>`).join("")||`<tr><td colspan="5" class="empty">Chưa khai báo ngày lễ trong tháng này.</td></tr>`;
  summary.textContent=`Tháng ${payload.month||""} · ${rows.length} ngày lễ${payload.locked?" · ĐÃ KHÓA DO BẢNG LƯƠNG ĐÃ CHỐT":" · Áp dụng chung cho Travel và Xe Hàng"}`;
  if(submit)submit.disabled=Boolean(payload.locked);
  const dateInput=document.querySelector("#payrollHolidayDate"),nameInput=document.querySelector("#payrollHolidayName");
  if(dateInput)dateInput.disabled=Boolean(payload.locked);
  if(nameInput)nameInput.disabled=Boolean(payload.locked);
}

async function loadPayrollHolidays(month) {
  const selectedMonth=month||document.querySelector("#payrollMonth")?.value||localMonthForInput();
  const summary=document.querySelector("#payrollHolidaySummary");
  if(summary)summary.textContent="Đang tải danh mục ngày lễ...";
  try { state.payrollHolidays=await fetchJson(`/api/proxy/accounting/payroll-holidays?month=${encodeURIComponent(selectedMonth)}`,{},90000); renderPayrollHolidays(); }
  catch(error) { if(summary)summary.textContent=error.message||"Không thể tải danh mục ngày lễ."; }
}

async function openPayrollHolidayDialog() {
  const month=document.querySelector("#payrollMonth")?.value||localMonthForInput(),dialog=document.querySelector("#payrollHolidayDialog"),dateInput=document.querySelector("#payrollHolidayDate"),nameInput=document.querySelector("#payrollHolidayName"),status=document.querySelector("#payrollHolidayFormStatus");
  if(dateInput){const today=localDateForInput();dateInput.value=today.startsWith(`${month}-`)?today:`${month}-01`;dateInput.min=`${month}-01`;const [year,monthNumber]=month.split("-").map(Number);dateInput.max=new Date(Date.UTC(year,monthNumber,0)).toISOString().slice(0,10);}
  if(nameInput)nameInput.value="";
  if(status)status.textContent="";
  dialog?.showModal();
  await loadPayrollHolidays(month);
}

function closePayrollHolidayDialog() { document.querySelector("#payrollHolidayDialog")?.close(); }

async function savePayrollHoliday(event) {
  event.preventDefault();
  const date=document.querySelector("#payrollHolidayDate")?.value||"",name=document.querySelector("#payrollHolidayName")?.value.trim()||"",month=state.payrollHolidays?.month||document.querySelector("#payrollMonth")?.value||localMonthForInput(),status=document.querySelector("#payrollHolidayFormStatus"),submit=document.querySelector("#payrollHolidaySubmit");
  if(!date||!name)return;
  if(!date.startsWith(`${month}-`)){if(status)status.textContent="Ngày lễ phải nằm trong tháng đang xem.";return;}
  if(submit)submit.disabled=true;
  if(status)status.textContent="Đang lưu...";
  try { await fetchJson("/api/proxy/accounting/payroll-holidays",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({date,name})},90000); if(status)status.textContent="Đã lưu ngày lễ."; document.querySelector("#payrollHolidayName").value=""; await Promise.all([loadPayrollHolidays(month),loadPayroll(true)]); }
  catch(error) { if(status)status.textContent=error.message||"Không thể lưu ngày lễ."; }
  finally { if(submit)submit.disabled=Boolean(state.payrollHolidays?.locked); }
}

async function deletePayrollHoliday(button) {
  const id=button.dataset.id||"",date=button.dataset.date||"",month=state.payrollHolidays?.month||"";
  if(!id||!confirm(`Xóa ngày lễ ${payrollHolidayDisplayDate(date)}?`))return;
  button.disabled=true;
  try { await fetchJson(`/api/proxy/accounting/payroll-holidays/${encodeURIComponent(id)}`,{method:"DELETE"},90000); await Promise.all([loadPayrollHolidays(month),loadPayroll(true)]); }
  catch(error) { button.disabled=false; alert(error.message||"Không thể xóa ngày lễ."); }
}

function closedPayrollBankCode(bankName) {
  const value=normalize(bankName);
  const codes=[["vietcombank","VCB"],["vietinbank","ICB"],["vietcombank","VCB"],["bidv","BIDV"],["agribank","AGRIBANK"],["techcombank","TCB"],["mbbank","MB"],["quan doi","MB"],["vpbank","VPB"],["acb","ACB"],["tpbank","TPB"],["sacombank","STB"],["hdbank","HDB"],["ocb","OCB"],["shb","SHB"],["msb","MSB"]];
  return codes.find(([name])=>value.includes(name))?.[1]||String(bankName||"").trim().toUpperCase();
}

function closedPayrollQrUrl(row, month) {
  const account=String(row.accountNumber||"").replace(/\s+/g,"");
  const bank=closedPayrollBankCode(row.bankName);
  if(!account||!bank)return "";
  const info=`Luong ${month} - ${row.employeeName||row.employeeCode||"Tai xe"}`;
  return `https://img.vietqr.io/image/${encodeURIComponent(bank)}-${encodeURIComponent(account)}-compact2.png?accountName=${encodeURIComponent(row.accountHolder||row.employeeName||"")}&amount=${encodeURIComponent(Math.max(0,Math.round(Number(row.totalSalary)||0)))}&addInfo=${encodeURIComponent(info)}`;
}

function openClosedPayrollDetail(code) {
  const payload=state.closedPayroll||{};
  const row=(payload.rows||[]).find(item=>String(item.employeeCode||"").toUpperCase()===String(code||"").toUpperCase());
  const dialog=document.querySelector("#closedPayrollDetailDialog"),content=document.querySelector("#closedPayrollDetailContent"),title=document.querySelector("#closedPayrollDetailTitle");
  if(!row||!dialog||!content)return;
  const allowances=salaryAllowancesForRow(row),qr=closedPayrollQrUrl(row,payload.month),transferred=row.remittanceStatus==="transferred";
  if(title) title.textContent=`Chi tiết lương · ${row.employeeName||row.employeeCode}`;
  const detail=(label,value,klass="")=>`<div class="payroll-detail-item"><span>${escapeHtml(label)}</span><strong class="${klass}">${escapeHtml(value==null||value===""?"—":String(value))}</strong></div>`;
  const deductions=Array.isArray(row.deductions)?row.deductions:[];
  content.innerHTML=`<div class="payroll-detail-layout"><div class="payroll-detail-info">
    <div class="payroll-detail-identity"><strong>${escapeHtml(row.employeeName||"")}</strong><span>${escapeHtml(row.employeeCode||"")} · ${payload.viewType==="cargo"?"Xe Hàng":"Lái xe Travel"}</span></div>
    <div class="payroll-detail-grid">${detail("Tháng",payload.month)}${detail("Công thực tế",row.workDays||0)}${detail("Lương cơ bản",formatMoney(row.baseSalary),"money")}${detail("Tổng phụ cấp",formatMoney(row.totalAllowance),"money")}${detail("Tổng khoản trừ",formatMoney(row.totalDeduction),"money")}${payload.viewType==="cargo"?`${detail("Giờ tăng ca",payrollOvertimeText(row.overtimeMinutes))}${detail("Tiền tăng ca",formatMoney(row.overtimePay),"money")}${detail("Số ngày còn phép trong tháng",row.remainingLeaveDays||0)}${detail("Tiền thưởng ngày công tăng ca",formatMoney(row.extraWorkdayBonus),"money")}`:""}${detail("Thưởng đủ công",formatMoney(row.attendanceBonus),"money")}${detail("Ngày lễ đi làm",row.holidayWorkDays||0)}${detail("Thưởng ngày lễ",formatMoney(row.holidayBonus),"money")}${payload.viewType!=="cargo"?`${detail("Doanh thu tháng",formatMoney(row.travelRevenue),"money")}${detail("Thưởng doanh thu 10%",formatMoney(row.travelRevenueBonus),"money")}${detail("Thưởng tiết kiệm xăng",formatMoney(row.fuelSavingBonus),"money")}${detail("Thu vượt định mức",formatMoney(row.fuelOveruseCharge),"money")}`:""}${detail("Tổng lương",formatMoney(row.totalSalary),"money")}</div>
    <h3>Các khoản phụ cấp</h3><div class="payroll-detail-allowances">${allowances.length?allowances.map(item=>`<div><span>${escapeHtml(item.type||"Khác")}</span><strong>${formatMoney(item.amount)}</strong></div>`).join(""):"<span class=\"muted\">Không có phụ cấp</span>"}</div>
    <h3>Các khoản trừ</h3><div class="payroll-detail-allowances payroll-detail-deductions">${deductions.length?deductions.map(item=>`<div><span>${escapeHtml(item.type||"Khoản trừ")}${item.note?`<small class=\"muted\">${escapeHtml(item.note)}</small>`:""}</span><strong>${formatMoney(item.amount)}</strong></div>`).join(""):"<span class=\"muted\">Không có khoản trừ</span>"}</div>
    <h3>Thông tin nhận lương</h3><div class="payroll-detail-grid">${detail("Ngân hàng",row.bankName)}${detail("Số tài khoản",row.accountNumber)}${detail("Chủ tài khoản",row.accountHolder)}${detail("Trạng thái",transferred?"Đã chuyển lương":"Chưa chuyển")}${transferred?detail("Người xác nhận",row.transferredBy||""):""}${transferred?detail("Thời gian",row.transferredAt?new Date(row.transferredAt).toLocaleString("vi-VN"):""):""}</div>
  </div><div class="payroll-qr-card"><h3>QR nhận lương</h3>${qr?`<img class="payroll-qr-large" src="${escapeHtml(qr)}" alt="QR nhận lương ${escapeHtml(row.employeeName)}" />`:`<div class="payroll-qr-empty">Chưa đủ thông tin ngân hàng để tạo QR.</div>`}<p class="muted">Quét mã để chuyển đúng số tiền ${formatMoney(row.totalSalary)}.</p></div></div>`;
  dialog.showModal();
}

function closeClosedPayrollDetail() {
  document.querySelector("#closedPayrollDetailDialog")?.close();
}

function renderClosedPayroll() {
  const payload=state.closedPayroll||{},isCargo=payload.viewType==="cargo",rows=payload.rows||[];
  const head=document.querySelector("#closedPayrollTableHead"),body=document.querySelector("#closedPayrollTableBody"),summary=document.querySelector("#closedPayrollSummary");
  if(!head||!body||!summary)return;
  if(!payload.locked){
    head.innerHTML="";
    body.innerHTML=`<tr><td class="empty">${escapeHtml(payload.message||"Tháng này chưa chốt lương.")}</td></tr>`;
    summary.textContent=payload.message||"Tháng này chưa chốt lương.";
    return;
  }
  const allowanceTypes=[];
  rows.flatMap(row=>salaryAllowancesForRow(row).map(item=>String(item.type||"Khác").trim()||"Khác")).forEach(type=>{if(type&&!allowanceTypes.includes(type))allowanceTypes.push(type);});
  const allowanceAmount=(row,type)=>salaryAllowancesForRow(row).filter(item=>(String(item.type||"Khác").trim()||"Khác")===type).reduce((sum,item)=>sum+salaryNumber(item.amount),0);
  const deductionTypes=[];
  const knownDeductionTypes=Array.isArray(payload.deductionTypes)?payload.deductionTypes:[];
  [...knownDeductionTypes,...rows.flatMap(row=>(row.deductions||[]).map(item=>String(item.type||"Khoản trừ").trim()||"Khoản trừ"))].forEach(type=>{if(type&&!deductionTypes.includes(type))deductionTypes.push(type);});
  const orderedDeductionTypes=orderDeductionTypes(deductionTypes);
  const deductionAmount=(row,type)=>(row.deductions||[]).filter(item=>(String(item.type||"Khoản trừ").trim()||"Khoản trừ")===type).reduce((sum,item)=>sum+salaryNumber(item.amount),0);
  const columns=["STT","Mã NV","Họ và tên","Công thực tế","Lương cơ bản",...allowanceTypes,"Tổng phụ cấp",...orderedDeductionTypes,"Tổng khoản trừ",...(isCargo?["Giờ tăng ca","Tiền tăng ca"]:[]),"Thưởng đủ công","Ngày lễ đi làm","Thưởng ngày lễ",...(isCargo?["Số ngày còn phép trong tháng","Tiền thưởng ngày công tăng ca"]:["Doanh thu tháng","Thưởng doanh thu 10%","Thưởng tiết kiệm xăng","Thu vượt định mức"]),"Tổng lương","Ghi chú","Ngân hàng","Số tài khoản","QR nhận lương","Trạng thái chuyển","Người xác nhận","Thao tác"];
  head.innerHTML=`<tr>${columns.map(label=>`<th>${escapeHtml(label)}</th>`).join("")}</tr>`;
  body.innerHTML=rows.map((row,index)=>{
    const qr=closedPayrollQrUrl(row,payload.month);
    const transferred=row.remittanceStatus==="transferred";
    const transferredAt=row.transferredAt?new Date(row.transferredAt).toLocaleString("vi-VN"):"";
    return `<tr><td>${index+1}</td><td><strong>${escapeHtml(row.employeeCode)}</strong></td><td><button class="link-button closed-payroll-detail" data-code="${escapeHtml(row.employeeCode)}" type="button">${escapeHtml(row.employeeName)}</button></td><td><strong>${row.workDays||0}</strong></td><td class="money">${formatMoney(row.baseSalary)}</td>${allowanceTypes.map(type=>`<td class="money">${formatMoney(allowanceAmount(row,type))}</td>`).join("")}<td class="money">${formatMoney(row.totalAllowance)}</td>${orderedDeductionTypes.map(type=>`<td class="money payroll-deduction-cell">${formatMoney(deductionAmount(row,type))}</td>`).join("")}<td class="money">${formatMoney(row.totalDeduction)}</td>${isCargo?`<td>${payrollOvertimeText(row.overtimeMinutes)}</td><td class="money">${formatMoney(row.overtimePay)}</td>`:""}<td class="money">${formatMoney(row.attendanceBonus)}</td><td><strong>${row.holidayWorkDays||0}</strong></td><td class="money payroll-holiday-bonus">${formatMoney(row.holidayBonus)}</td>${isCargo?`<td><strong>${row.remainingLeaveDays||0}</strong></td><td class="money">${formatMoney(row.extraWorkdayBonus)}</td>`:`<td class="money">${formatMoney(row.travelRevenue)}</td><td class="money">${formatMoney(row.travelRevenueBonus)}</td><td class="money">${formatMoney(row.fuelSavingBonus)}</td><td class="money">${formatMoney(row.fuelOveruseCharge)}</td>`}<td class="money salary-total-cell">${formatMoney(row.totalSalary)}</td><td class="payroll-note-cell">${escapeHtml(row.payrollNote||"")}</td><td>${escapeHtml(row.bankName)}</td><td>${escapeHtml(row.accountNumber)}</td><td>${qr?`<img class="payroll-qr" src="${escapeHtml(qr)}" alt="QR nhận lương ${escapeHtml(row.employeeName)}" loading="lazy" />`:`<span class="muted">Chưa đủ thông tin</span>`}</td><td>${transferred?`<span class="payroll-transfer-status done">Đã chuyển</span>`:`<span class="payroll-transfer-status pending">Chưa chuyển</span>`}</td><td>${escapeHtml(row.transferredBy||"")}<small class="muted">${escapeHtml(transferredAt)}</small></td><td><div class="row-actions"><button class="small secondary closed-payroll-detail" data-code="${escapeHtml(row.employeeCode)}" type="button">Chi tiết</button>${transferred?`<span class="muted">Đã xác nhận</span>`:`<button class="small closed-payroll-transfer" data-code="${escapeHtml(row.employeeCode)}" type="button">Đã chuyển lương</button>`}</div></td></tr>`;
  }).join("")||`<tr><td colspan="${columns.length}" class="empty">Bảng lương đã chốt chưa có dòng dữ liệu.</td></tr>`;
  const transferredCount=rows.filter(row=>row.remittanceStatus==="transferred").length;
  const total=rows.reduce((sum,row)=>sum+salaryNumber(row.totalSalary),0);
  summary.textContent=`${isCargo?"Xe Hàng":"Travel"} · Tháng ${payload.month} · Chốt bởi ${payload.lockedBy||""} · ${rows.length} tài xế · Thưởng ngày lễ ${formatMoney(payload.holidayBonusTotal||0)}${isCargo?` · Thưởng ngày công tăng ca ${formatMoney(payload.extraWorkdayBonusTotal||0)}`:""} · Tổng lương ${formatMoney(total)} · Đã chuyển ${transferredCount}/${rows.length}`;
}

async function loadClosedPayroll(useSelected=true) {
  const monthInput=document.querySelector("#closedPayrollMonth"),typeInput=document.querySelector("#closedPayrollViewType");
  if(!monthInput||!typeInput)return;
  if(!monthInput.value)monthInput.value=localMonthForInput();
  const month=useSelected?monthInput.value:(state.closedPayroll.month||monthInput.value),viewType=typeInput.value||"travel";
  document.querySelector("#closedPayrollSummary").textContent="Đang tải lịch sử bảng lương...";
  try { state.closedPayroll=await fetchJson(`/api/proxy/accounting/payroll-closed?month=${encodeURIComponent(month)}&viewType=${encodeURIComponent(viewType)}`,{},90000); renderClosedPayroll(); }
  catch(error) { document.querySelector("#closedPayrollSummary").textContent=error.message||"Không thể tải bảng lương đã chốt."; }
}

function exportClosedPayroll() {
  const payload=state.closedPayroll||{};
  const month=payload.month||document.querySelector("#closedPayrollMonth")?.value||localMonthForInput();
  const viewType=payload.viewType||document.querySelector("#closedPayrollViewType")?.value||"travel";
  if(!payload.locked){ alert("Tháng này chưa có bảng lương đã chốt để xuất."); return; }
  window.location.href=`/api/proxy/accounting/payroll.xlsx?month=${encodeURIComponent(month)}&viewType=${encodeURIComponent(viewType)}`;
}

async function markClosedPayrollTransferred(button) {
  const month=state.closedPayroll?.month||document.querySelector("#closedPayrollMonth")?.value||localMonthForInput();
  const viewType=state.closedPayroll?.viewType||document.querySelector("#closedPayrollViewType")?.value||"travel";
  const code=button.dataset.code||"";
  const row=(state.closedPayroll.rows||[]).find(item=>String(item.employeeCode||"").toUpperCase()===code.toUpperCase());
  if(!row||!confirm(`Xác nhận đã chuyển lương cho ${row.employeeName||code}?`))return;
  button.disabled=true;
  try { const result=await fetchJson("/api/proxy/accounting/payroll-remittance",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({month,viewType,employeeCode:code})}); row.remittanceStatus=result.remittance?.status||"transferred"; row.transferredBy=result.remittance?.transferredBy||""; row.transferredAt=result.remittance?.transferredAt||""; renderClosedPayroll(); }
  catch(error) { button.disabled=false; alert(error.message||"Không thể xác nhận chuyển lương."); }
}

function exportPayroll() {
  const month=document.querySelector("#payrollMonth")?.value||localMonthForInput(),viewType=document.querySelector("#payrollViewType")?.value||"travel";
  window.location.href=`/api/proxy/accounting/payroll.xlsx?month=${encodeURIComponent(month)}&viewType=${encodeURIComponent(viewType)}`;
}

function exportPayrollPayslipsZip() {
  const month=document.querySelector("#payrollMonth")?.value||localMonthForInput(),viewType=document.querySelector("#payrollViewType")?.value||"travel";
  if(!(state.payroll?.rows||[]).length){
    alert("Không có dữ liệu lái xe trong tháng đã chọn.");
    return;
  }
  window.location.href=`/api/proxy/accounting/payroll-payslips.zip?month=${encodeURIComponent(month)}&viewType=${encodeURIComponent(viewType)}`;
}

async function openSalaryFromPayroll(button) {
  const code=button.dataset.code||"",name=button.dataset.name||"",month=state.payroll.month||document.querySelector("#payrollMonth")?.value||localMonthForInput();
  switchView("driverSalaries");
  await loadDriverSalaries();
  resetDriverSalaryForm();
  document.querySelector("#salaryDriverSelect").value=code;
  document.querySelector("#salaryEffectiveMonth").value=month;
  document.querySelector("#salaryAccountHolder").value=name.toUpperCase();
  document.querySelector("#salaryDialog")?.showModal();
}

document.querySelector("#payrollRefresh")?.addEventListener("click",()=>loadPayroll(true));
document.querySelector("#payrollMonth")?.addEventListener("change",()=>loadPayroll(true));
document.querySelector("#payrollViewType")?.addEventListener("change",()=>loadPayroll(true));
document.querySelector("#payrollExport")?.addEventListener("click",exportPayroll);
document.querySelector("#payrollPayslipsZipExport")?.addEventListener("click",exportPayrollPayslipsZip);
document.querySelector("#openPayrollHolidayDialog")?.addEventListener("click",openPayrollHolidayDialog);
document.querySelector("#closePayrollHolidayDialog")?.addEventListener("click",closePayrollHolidayDialog);
document.querySelector("#payrollHolidayForm")?.addEventListener("submit",savePayrollHoliday);
document.querySelector("#payrollHolidayTableBody")?.addEventListener("click",event=>{const button=event.target.closest(".payroll-holiday-delete");if(button)deletePayrollHoliday(button);});
document.querySelector("#payrollLockButton")?.addEventListener("click", async () => {
  const month = document.querySelector("#payrollMonth")?.value || localMonthForInput();
  const viewType = document.querySelector("#payrollViewType")?.value || "travel";
  if (!month || state.payroll?.locked) return;
  const label = viewType === "cargo" ? "Xe Hàng" : "Travel";
  if (!confirm(`Chốt bảng lương ${label} tháng ${month}? Sau khi chốt, bảng lương và bảng công tháng này sẽ không thể chỉnh sửa.`)) return;
  const button = document.querySelector("#payrollLockButton");
  if (button) { button.disabled = true; button.textContent = "ĐANG CHỐT..."; }
  try {
    const result = await fetchJson("/api/proxy/accounting/payroll-lock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ month, viewType }) });
    state.payroll = result.payroll || { ...state.payroll, locked: true };
    renderPayroll();
    await (viewType === "cargo" ? loadCargoAttendance(true) : loadAttendance(true));
  } catch (error) {
    alert(error.message || "Không thể chốt bảng lương.");
    if (button) { button.disabled = false; button.textContent = "CHỐT LƯƠNG"; }
  }
});
document.querySelector("#payrollTableBody")?.addEventListener("click",event=>{const detailButton=event.target.closest(".payroll-driver-detail");if(detailButton){const row=(state.payroll.rows||[]).find(item=>String(item.employeeCode||"").toUpperCase()===String(detailButton.dataset.code||"").toUpperCase());if(row)openDeductionDialog({...row,month:state.payroll.month||document.querySelector("#payrollMonth")?.value||localMonthForInput(),viewType:state.payroll.viewType||document.querySelector("#payrollViewType")?.value||"travel",locked:Boolean(state.payroll.locked)});return;}const button=event.target.closest(".payroll-declare-salary");if(button)openSalaryFromPayroll(button);});
document.querySelector("#payrollTableBody")?.addEventListener("change",event=>{const input=event.target.closest(".payroll-deduction-input");if(input){saveInlinePayrollDeduction(input);return;}const note=event.target.closest(".payroll-note-input");if(note)saveInlinePayrollNote(note);});
document.querySelector("#closedPayrollRefresh")?.addEventListener("click",()=>loadClosedPayroll(true));
document.querySelector("#closedPayrollExport")?.addEventListener("click",exportClosedPayroll);
document.querySelector("#closedPayrollMonth")?.addEventListener("change",()=>loadClosedPayroll(true));
document.querySelector("#closedPayrollViewType")?.addEventListener("change",()=>loadClosedPayroll(true));
document.querySelector("#closedPayrollTableBody")?.addEventListener("click",event=>{const detailButton=event.target.closest(".closed-payroll-detail");if(detailButton){openClosedPayrollDetail(detailButton.dataset.code);return;}const button=event.target.closest(".closed-payroll-transfer");if(button)markClosedPayrollTransferred(button);});
document.querySelector("#closeClosedPayrollDetail")?.addEventListener("click",closeClosedPayrollDetail);

function renderDeductionDrivers() {
  const select=document.querySelector("#deductionDriverSelect"),viewType=document.querySelector("#deductionViewType")?.value||"travel";
  if(!select)return;
  const selected=select.value;
  const drivers=Array.isArray(state.payrollDeductions?.drivers)?state.payrollDeductions.drivers:[];
  select.innerHTML=`<option value="">Chọn lái xe</option>${drivers.map(driver=>`<option value="${escapeHtml(driver.employeeCode)}" data-name="${escapeHtml(driver.employeeName)}">${escapeHtml(driver.employeeName)} · ${escapeHtml(driver.employeeCode)}</option>`).join("")}`;
  if([...select.options].some(option=>option.value===selected))select.value=selected;
}

function renderDeductionTypeOptions(selected="") {
  const select=document.querySelector("#deductionType"); if(!select)return;
  const defaults=["Ký quỹ","Phạt vi phạm","Tạm ứng","Bồi thường","Khấu trừ xăng vượt định mức","Khác"];
  const types=(state.deductionTypes||[]).filter(item=>["inactive","deleted","da xoa"].indexOf(String(item.status||"").toLowerCase())<0).map(item=>String(item.name||"").trim()).filter(Boolean);
  [...defaults,...types,selected].forEach(name=>{if(name&&!types.includes(name))types.push(name);});
  select.innerHTML=`<option value="">Chọn loại khoản trừ</option>${types.map(name=>`<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}`;
  if(selected)select.value=selected;
}

function renderPayrollDeductions() {
  const payload=state.payrollDeductions||{},summary=document.querySelector("#deductionSummary"),typeBody=document.querySelector("#deductionTypeTableBody");
  if(!summary||!typeBody)return;
  const types=state.deductionTypes||[];
  typeBody.innerHTML=types.map((item,index)=>{const status=String(item.status||'').toLowerCase(),active=!['inactive','deleted','da xoa'].includes(status),legacy=status==='legacy';return `<tr><td>${index+1}</td><td><strong>${escapeHtml(item.name||'Khoản trừ')}</strong></td><td><span class="deduction-status ${active?'active':'inactive'}">${legacy?'Đang dùng (cũ)':active?'Đang sử dụng':'Ngừng sử dụng'}</span></td><td><div class="row-actions">${legacy?'<span class="muted">—</span>':active?`<button class="small secondary" data-action="edit-deduction-type" data-id="${escapeHtml(item.id)}" type="button">Sửa</button><button class="small danger" data-action="delete-deduction-type" data-id="${escapeHtml(item.id)}" type="button">Ngừng sử dụng</button>`:`<button class="small secondary" data-action="reactivate-deduction-type" data-id="${escapeHtml(item.id)}" type="button">Sử dụng lại</button>`}</div></td></tr>`;}).join("")||`<tr><td colspan="4" class="empty">Chưa có loại khoản trừ.</td></tr>`;
  const activeCount=types.filter(item=>!['inactive','deleted','da xoa'].includes(String(item.status||'').toLowerCase())).length;
  summary.textContent=`Hiện có ${activeCount} loại khoản trừ đang sử dụng.`;
  renderDeductionDrivers(); renderDeductionTypeOptions(document.querySelector("#deductionType")?.value||"");
}

async function loadPayrollDeductions(useSelected=true) {
  const month=state.payrollDeductions.month||localMonthForInput();
  document.querySelector("#deductionSummary").textContent="Đang tải danh mục khoản trừ...";
  try {
    const [deductions,types,salaries]=await Promise.all([fetchJson(`/api/proxy/accounting/payroll-deductions?month=${encodeURIComponent(month)}`,{},90000),fetchJson("/api/proxy/accounting/deduction-types",{},90000),fetchJson("/api/proxy/accounting/driver-salaries",{},90000)]);
    state.payrollDeductions={month,rows:deductions.rows||[],drivers:salaries.drivers||[]}; state.deductionTypes=types.rows||[];
    renderPayrollDeductions();
  } catch(error) { document.querySelector("#deductionSummary").textContent=error.message||"Không thể tải khoản trừ lương."; }
}

function openDeductionDialog(row=null) {
  const dialog=document.querySelector("#deductionDialog"),form=document.querySelector("#deductionForm");
  if(!dialog||!form)return;
  form.dataset.editing=row?.id||"";
  document.querySelector("#deductionDialogTitle").textContent=row?`Sửa khoản trừ · ${row.employeeName||row.employeeCode}`:"Thêm khoản trừ lương";
  const employeeSummary=document.querySelector("#deductionEmployeeSummary"),existingList=document.querySelector("#deductionExistingList");
  if(employeeSummary){employeeSummary.hidden=!row?.employeeCode;employeeSummary.innerHTML=row?.employeeCode?`<strong>${escapeHtml(row.employeeName||row.employeeCode)}</strong><span>${escapeHtml(row.employeeCode)} · ${row.viewType==="cargo"?escapeHtml(row.position||"Xe Hàng"):"Lái xe Travel"} · ${escapeHtml(row.month||"")}</span>`:"";}
  if(existingList){
    const items=Array.isArray(row?.deductions)?row.deductions:[];
    existingList.hidden=!row?.employeeCode||!items.length;
    const itemsMarkup=items.map(item=>`<div><span>${escapeHtml(item.type||"Khoản trừ")}${item.note?`<small>${escapeHtml(item.note)}</small>`:""}</span><strong>${formatMoney(item.amount)}</strong></div>`).join("");
    existingList.innerHTML=items.length?`<strong>Các khoản trừ hiện tại</strong>${itemsMarkup}`:"";
  }
  document.querySelector("#deductionViewType").value=row?.viewType||"travel";
  document.querySelector("#deductionMonthInput").value=row?.month||state.payrollDeductions.month||localMonthForInput();
  renderDeductionDrivers();
  document.querySelector("#deductionDriverSelect").value=row?.employeeCode||"";
  renderDeductionTypeOptions(row?.deductionType||"Tạm ứng");
  document.querySelector("#deductionAmount").value=row?formatMoney(row.amount):"";
  document.querySelector("#deductionNote").value=row?.note||"";
  const locked=Boolean(row?.locked);
  form.querySelectorAll("input,select,textarea,button[type=submit]").forEach(field=>{field.disabled=locked;});
  document.querySelector("#deductionFormStatus").textContent=locked?"Tháng đã chốt, chỉ được xem.":"";
  dialog.showModal();
}

function closeDeductionDialog(){document.querySelector("#deductionDialog")?.close();}

async function savePayrollDeduction(event) {
  event.preventDefault();
  const form=event.currentTarget,driver=document.querySelector("#deductionDriverSelect"),option=driver?.selectedOptions?.[0];
  const month=document.querySelector("#deductionMonthInput")?.value||"",viewType=document.querySelector("#deductionViewType")?.value||"travel",type=document.querySelector("#deductionType")?.value||"",amount=salaryNumber(document.querySelector("#deductionAmount")?.value),note=document.querySelector("#deductionNote")?.value.trim()||"";
  if(!driver?.value||!month||!type||amount<=0){alert("Vui lòng nhập đầy đủ lái xe, tháng, loại khoản trừ và số tiền lớn hơn 0.");return;}
  if(normalize(type)==="khac"&&!note){alert("Khoản trừ Khác bắt buộc phải có ghi chú.");document.querySelector("#deductionNote")?.focus();return;}
  const button=form.querySelector('button[type="submit"]');if(button)button.disabled=true;
  const payload={month,viewType,employeeCode:driver.value,employeeName:option?.dataset?.name||"",deductionType:type,amount,note};
  try { const id=form.dataset.editing; await fetchJson(id?`/api/proxy/accounting/payroll-deductions/${encodeURIComponent(id)}`:"/api/proxy/accounting/payroll-deductions",{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); closeDeductionDialog(); await loadPayrollDeductions(true); if(state.payroll?.month===month&&state.payroll?.viewType===viewType)await loadPayroll(true); }
  catch(error){alert(error.message||"Không thể lưu khoản trừ lương.");}
  finally{if(button)button.disabled=false;}
}

async function managePayrollDeductionClick(event) {
  const button=event.target.closest("button[data-action]"),id=button?.dataset?.id;if(!button||!id)return;
  const row=(state.payrollDeductions.rows||[]).find(item=>String(item.id)===String(id));if(!row)return;
  if(button.dataset.action==="edit-deduction"){openDeductionDialog(row);return;}
  if(!confirm(`Xóa khoản trừ ${formatMoney(row.amount)} của ${row.employeeName||row.employeeCode} tháng ${row.month}?`))return;
  try{await fetchJson(`/api/proxy/accounting/payroll-deductions/${encodeURIComponent(id)}`,{method:"DELETE"});await loadPayrollDeductions(true);if(state.payroll?.month===row.month&&state.payroll?.viewType===row.viewType)await loadPayroll(true);}catch(error){alert(error.message||"Không thể xóa khoản trừ lương.");}
}

function openDeductionTypeDialog(row=null){
  const dialog=document.querySelector("#deductionTypeDialog"),form=document.querySelector("#deductionTypeForm"); if(!dialog||!form)return;
  form.dataset.editing=row?.id||""; document.querySelector("#deductionTypeDialogTitle").textContent=row?`Sửa loại khoản trừ · ${row.name}`:"Thêm loại khoản trừ"; document.querySelector("#deductionTypeName").value=row?.name||""; document.querySelector("#deductionTypeFormStatus").textContent=""; dialog.showModal();
}
function closeDeductionTypeDialog(){document.querySelector("#deductionTypeDialog")?.close();}
async function saveDeductionType(event){
  event.preventDefault(); const form=event.currentTarget,name=document.querySelector("#deductionTypeName")?.value.trim()||""; if(!name){alert("Vui lòng nhập tên khoản trừ.");return;}
  const button=form.querySelector('button[type="submit"]'); if(button)button.disabled=true;
  try{const id=form.dataset.editing; await fetchJson(id?`/api/proxy/accounting/deduction-types/${encodeURIComponent(id)}`:"/api/proxy/accounting/deduction-types",{method:id?"PUT":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})}); closeDeductionTypeDialog(); await loadPayrollDeductions(true);}
  catch(error){alert(error.message||"Không thể lưu loại khoản trừ.");} finally{if(button)button.disabled=false;}
}
async function manageDeductionTypeClick(event){
  const button=event.target.closest("button[data-action]"),id=button?.dataset?.id; if(!button||!id)return; const row=(state.deductionTypes||[]).find(item=>String(item.id)===String(id)); if(!row)return;
  if(button.dataset.action==="edit-deduction-type"){openDeductionTypeDialog(row);return;}
  if(button.dataset.action==="reactivate-deduction-type"){
    if(!confirm(`Sử dụng lại loại khoản trừ “${row.name}”?`))return;
    try{await fetchJson(`/api/proxy/accounting/deduction-types/${encodeURIComponent(id)}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:row.name})});await loadPayrollDeductions(true);}catch(error){alert(error.message||"Không thể sử dụng lại loại khoản trừ.");}
    return;
  }
  if(!confirm(`Ngừng sử dụng loại khoản trừ “${row.name}”? Các khoản đã nhập trước đây vẫn được giữ nguyên.`))return;
  try{await fetchJson(`/api/proxy/accounting/deduction-types/${encodeURIComponent(id)}`,{method:"DELETE"});await loadPayrollDeductions(true);}catch(error){alert(error.message||"Không thể ngừng sử dụng loại khoản trừ.");}
}

document.querySelector("#deductionMonth")?.addEventListener("change",()=>loadPayrollDeductions(true));
document.querySelector("#openDeductionDialog")?.addEventListener("click",()=>openDeductionDialog());
document.querySelector("#closeDeductionDialog")?.addEventListener("click",closeDeductionDialog);
document.querySelector("#cancelDeductionDialog")?.addEventListener("click",closeDeductionDialog);
document.querySelector("#deductionForm")?.addEventListener("submit",savePayrollDeduction);
document.querySelector("#deductionViewType")?.addEventListener("change",renderDeductionDrivers);
document.querySelector("#deductionTableBody")?.addEventListener("click",managePayrollDeductionClick);
document.querySelector("#openDeductionTypeDialog")?.addEventListener("click",()=>openDeductionTypeDialog());
document.querySelector("#closeDeductionTypeDialog")?.addEventListener("click",closeDeductionTypeDialog);
document.querySelector("#cancelDeductionTypeDialog")?.addEventListener("click",closeDeductionTypeDialog);
document.querySelector("#deductionTypeForm")?.addEventListener("submit",saveDeductionType);
document.querySelector("#deductionTypeTableBody")?.addEventListener("click",manageDeductionTypeClick);

const viewDataSources = {
  dashboard: ["roster", "franchiseVehicles", "customers", "contracts", "orders"],
  orders: ["systemCatalogs", "roster", "franchiseVehicles", "customers", "contracts", "vouchers", "promotions", "orders", "orderFeedback"],
  attendance: [],
  cargoAttendance: [],
  fuel: [],
  fuelStandard: [],
  fuelPrices: [],
  driverSalaries: [],
  driverAreas: [],
  payroll: [],
  closedPayroll: [],
  payrollDeductions: [],
  calendar: ["roster", "calendarVehicleOrder", "franchiseVehicles", "orders"],
  vehicles: ["roster"],
  franchiseVehicles: ["franchiseVehicles"],
  customers: ["systemCatalogs", "customers"],
  contracts: ["contracts"],
  contractPricing: ["contractPricing"],
  vouchers: ["vouchers"],
  promotions: ["promotions"],
  invoiceOrders: ["invoiceOrders", "invoiceGroupCandidates"],
  debtOrders: ["debtOrders"],
  commissionOrders: ["commissionOrders"],
  orderFeedback: ["orders", "orderFeedback"],
  cskhShiftReports: ["cskhShiftReports", "orders"],
  reports: ["customers", "vouchers", "promotions", "orders"],
  permissions: ["users"],
  reopenApprovals: ["reopenRequests"],
  systemCatalogs: ["systemCatalogs"],
  systemLogs: ["systemLogs"],
};

const dataSourceDefinitions = {
  systemCatalogs: ["danh mục hệ thống", "/api/proxy/system-catalogs"],
  roster: ["xe lên ca", "/api/proxy/roster"],
  calendarVehicleOrder: ["thứ tự lịch điều xe", "/api/proxy/calendar-vehicle-order"],
  franchiseVehicles: ["xe thương quyền", "/api/proxy/franchise-vehicles"],
  customers: ["khách hàng", "/api/proxy/customers"],
  contracts: ["hợp đồng/tuyến", "/api/proxy/tours"],
  contractPricing: ["bảng giá hợp đồng", "/api/proxy/contract-pricing"],
  vouchers: ["voucher", "/api/proxy/vouchers"],
  promotions: ["khuyến mãi", "/api/proxy/promotions"],
  orders: ["đơn hàng", "/api/proxy/orders"],
  orderFeedback: ["phản hồi khách hàng", "/api/proxy/order-feedback"],
  cskhShiftReports: ["báo cáo ca CSKH", "/api/proxy/cskh-shift-reports"],
  invoiceOrders: ["hóa đơn", "/api/proxy/invoice-orders"],
  invoiceGroupCandidates: ["đơn có thể gộp hóa đơn", "/api/proxy/invoice-groups/candidates"],
  debtOrders: ["công nợ", "/api/proxy/debt-orders"],
  commissionOrders: ["hoa hồng xe thương quyền", "/api/proxy/commission-orders"],
  users: ["tài khoản", "/api/proxy/users"],
  reopenRequests: ["yêu cầu mở lại", "/api/proxy/reopen-requests"],
  systemLogs: ["lịch sử thay đổi", "/api/proxy/logs"],
};

const loadDataPromises = new Map();

function allowedSourceKeys(view) {
  return (viewDataSources[view] || viewDataSources.dashboard).filter((key) => {
    if (key === "invoiceGroupCandidates") return can("create_invoice_groups");
    if (key === "users") return can("manage_users");
    if (key === "reopenRequests") return can("approve_reopen") || can("request_reopen");
    if (key === "systemLogs") return state.currentUser?.role === "admin";
    return true;
  });
}

async function loadDataOnce(view = state.activeView, force = true) {
  if (els.refreshButton) els.refreshButton.disabled = true;
  els.syncStatus.textContent = "Đang tải dữ liệu...";
  try {
    if (!state.currentUser) {
      const me = await fetchJson("/api/proxy/me", {}, 90000);
      if (!isAccountingAppRole(me.user?.role)) {
        clearAuth("Ứng dụng này chỉ dành cho tài khoản Kế toán hoặc Admin.");
        return;
      }
      state.currentUser = me.user;
      state.permissions = me.permissions || { views: [], actions: [] };
      state.roles = me.roles || {};
      showApp();
      applyPermissions();
    }
    const keys = allowedSourceKeys(view).filter((key) => force || !state.loadedSources.has(key));
    if (!keys.length) {
      renderAll();
      els.syncStatus.textContent = `Đã đồng bộ ${formatDateTime(new Date())}`;
      return;
    }
    const sources = keys.map((key) => {
      const [label, url] = dataSourceDefinitions[key];
      return [key, label, fetchJson(url, {}, 90000)];
    });
    const results = await Promise.allSettled(sources.map((source) => source[2]));
    const failed = [];
    results.forEach((result, index) => {
      const [key, label] = sources[index];
      if (result.status === "fulfilled") {
        state[key] = key === "contractPricing" ? result.value.config : (result.value.rows || []);
        state.loadedSources.add(key);
        if (key === "systemCatalogs") state.systemCatalogsLoaded = true;
      } else {
        failed.push(label);
      }
    });
    renderAll();
    prefillCskhB2cOrderTotal();
    els.syncStatus.textContent = failed.length
      ? `Đã tải một phần, lỗi: ${failed.join(", ")}`
      : `Đã đồng bộ ${formatDateTime(new Date())}`;
  } catch (error) {
    const message = error.message || "";
    if (message.includes("đăng nhập") || message.includes("Phiên") || message.includes("401")) {
      showLogin(message);
    } else if (els.syncStatus) {
      els.syncStatus.textContent = message;
    }
  } finally {
    if (els.refreshButton) els.refreshButton.disabled = false;
  }
}

function loadData(view = state.activeView, force = true) {
  const promiseKey = `${view}:${force ? "force" : "cached"}`;
  if (loadDataPromises.has(promiseKey)) return loadDataPromises.get(promiseKey);
  const promise = loadDataOnce(view, force).finally(() => {
    loadDataPromises.delete(promiseKey);
  });
  loadDataPromises.set(promiseKey, promise);
  return promise;
}

function openOrderDialog() {
  if (!canOperateOrders()) return;
  state.editingOrderId = "";
  els.orderForm.dataset.mode = "create";
  const title = els.orderForm.querySelector(".panel-title h2");
  if (title) title.textContent = "Tạo đơn hàng";
  if (els.orderSubmitButton) els.orderSubmitButton.textContent = "Lưu đơn hàng";
  els.orderForm.reset();
  state.orderBenefits = {
    voucherIds: [],
    promotionIds: [],
    voucherOpen: false,
    promotionOpen: false,
    voucherSearch: "",
    promotionSearch: "",
  };
  els.orderFormStatus.textContent = "";
  els.ticketCountInput.value = "0";
  els.orderCustomerId.value = "";
  els.orderCustomerStaff.value = state.currentUser?.displayName || state.currentUser?.username || "";
  els.orderCustomerPreview.textContent = "Nhập số điện thoại để kiểm tra khách hàng.";
  els.invoiceFields.classList.remove("active");
  const debtFields = document.querySelector("#debtFields");
  if (debtFields) debtFields.hidden = true;
  const debtOwner = document.querySelector("#debtOwnerInput");
  if (debtOwner) {
    debtOwner.required = false;
    debtOwner.closest("label")?.classList.remove("required");
  }
  const discountNoteWrap = document.querySelector("#manualDiscountNoteWrap");
  if (discountNoteWrap) {
    discountNoteWrap.hidden = true;
    discountNoteWrap.classList.remove("required");
  }
  if (els.orderForm.elements.ghiChuGiamGia) els.orderForm.elements.ghiChuGiamGia.required = false;
  if (els.orderBenefitsSection) els.orderBenefitsSection.hidden = false;
  renderOrderOptions();
  updateOrderTypeUI();
  els.orderDialog.showModal();
}

function orderIsSharedRide(order) {
  return normalize(order.loaiHopDong).includes("ghep");
}

function canEditOrderInline(order) {
  return order && !orderIsDone(order) && canOperateOrders();
}

function setOrderRadioValue(name, value) {
  const input = els.orderForm.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function setOrderSelectValue(select, value) {
  if (!select) return;
  const option = [...select.options].find((item) => String(item.value) === String(value));
  if (option) select.value = option.value;
}

function openOrderEditDialog(orderId) {
  const order = state.orders.find((row) => String(row.id) === String(orderId));
  if (!canEditOrderInline(order)) {
    openOrderDetails(orderId);
    return;
  }
  state.editingOrderId = String(order.id);
  els.orderForm.reset();
  els.orderForm.dataset.mode = "edit";
  const title = els.orderForm.querySelector(".panel-title h2");
  if (title) title.textContent = `Sửa đơn hàng ${order.id}`;
  if (els.orderSubmitButton) els.orderSubmitButton.textContent = "Lưu thay đổi";
  els.orderFormStatus.textContent =
    order.voucherCodes || order.khuyenMai
      ? "Có thể thêm hoặc bỏ voucher và chương trình khuyến mãi trước khi lưu thay đổi."
      : "";
  state.orderBenefits = {
    voucherIds:
      Array.isArray(order.voucherIds) && order.voucherIds.length
        ? order.voucherIds.map(String)
        : String(order.voucherCodes || "")
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
    promotionIds: Array.isArray(order.promotionIds) ? order.promotionIds.map(String) : [],
    voucherOpen: false,
    promotionOpen: false,
    voucherSearch: "",
    promotionSearch: "",
  };
  const isShared = orderIsSharedRide(order);
  setOrderRadioValue("loaiHopDong", isShared ? "xe_ghep" : "xe_nguyen_chuyen");
  setOrderRadioValue("loaiKhach", order.loaiKhach === "B2B" ? "B2B" : "B2C");
  els.orderCustomerId.value = order.khachHangId || "";
  els.orderCustomerPhone.value = order.soDienThoai || "";
  els.orderCustomerName.value = order.tenKhach || "";
  if (els.orderCustomerAddress) els.orderCustomerAddress.value = order.diaChi || "";
  const customer = state.customers.find((row) => String(row.id) === String(order.khachHangId)) || findCustomerByPhone(order.soDienThoai);
  if (customer) {
    els.orderCustomerCccd.value = customer.soCCCD || "";
    if (els.orderCustomerAddress) els.orderCustomerAddress.value = customer.diaChi || "";
    els.orderCustomerProfileType.value = customer.loaiKhachHang || "";
    els.orderCustomerBirthYear.value = customer.namSinh || "";
    els.orderCustomerGender.value = customer.gioiTinh || "";
    els.orderCustomerSource.value = customer.nguonKhach || "";
    els.orderCustomerStaff.value = customer.nhanVienNhap || "";
  }
  if (customer) {
    fillOrderCustomer(customer);
  } else {
    setOrderCustomerFieldsLocked(false);
    els.orderCustomerPreview.textContent = `Không tìm thấy hồ sơ khách đã gắn với đơn ${order.id}.`;
  }
  renderOrderOptions();
  setOrderSelectValue(els.orderContractSelect, order.hopDongTourId || "");
  if (isShared) {
    els.ticketCountInput.value = String(order.khachXeGhep?.length || Number(order.soVe || 0) || 1);
  }
  setOrderSelectValue(els.orderForm.elements.khuVucDatXe, order.khuVucDatXe || "");
  els.orderPickupInput.value = order.diemDon || "";
  els.orderDropoffInput.value = order.diemTra || "";
  els.orderForm.elements.ngayGioDi.value = formatDateTime(order.ngayGioDi) || "";
  setOrderSelectValue(els.orderForm.elements.soCho, order.soCho || order.so_cho || "");
  els.orderForm.elements.giaTien.value = formatMoney(order.giaTien) || "";
  els.orderForm.elements.giamGia.value = formatMoney(order.giamGia) || "0";
  if (els.orderForm.elements.ghiChuGiamGia) {
    els.orderForm.elements.ghiChuGiamGia.value = order.ghiChuGiamGia || "";
    els.orderForm.elements.ghiChuGiamGia.required = Number(order.giamGia || 0) > 0;
    els.orderForm.elements.ghiChuGiamGia.closest("label").hidden = !(Number(order.giamGia || 0) > 0);
  }
  els.orderForm.elements.phuThu.value = formatMoney(order.phuThu) || "0";
  if (els.orderForm.elements.lyDoPhuThu) {
    const hasSurcharge = Number(order.phuThu || 0) > 0;
    els.orderForm.elements.lyDoPhuThu.value = order.lyDoPhuThu || "";
    els.orderForm.elements.lyDoPhuThu.required = hasSurcharge;
    els.orderForm.elements.lyDoPhuThu.closest("label").hidden = !hasSurcharge;
    els.orderForm.elements.lyDoPhuThu.closest("label").classList.toggle("required", hasSurcharge);
  }
  els.orderForm.elements.daCoc.value = formatMoney(order.daCoc) || "0";
  els.invoiceToggle.checked = normalize(order.yeuCauHoaDon).includes("co");
  els.invoiceFields.classList.toggle("active", els.invoiceToggle.checked);
  els.orderForm.elements.tenCongTy.value = order.tenCongTy || "";
  els.orderForm.elements.maSoThue.value = order.maSoThue || "";
  els.orderForm.elements.diaChiHoaDon.value = order.diaChiHoaDon || "";
  els.orderForm.elements.emailHoaDon.value = order.emailHoaDon || "";
  const debtToggle = document.querySelector("#debtToggle");
  const debtFields = document.querySelector("#debtFields");
  const debtOwner = document.querySelector("#debtOwnerInput");
  const hasDebt = normalize(order.congNo).includes("co");
  if (debtToggle) debtToggle.checked = hasDebt;
  if (debtFields) debtFields.hidden = !hasDebt;
  if (debtOwner) {
    debtOwner.value = order.congNoChoAi || "";
    debtOwner.required = hasDebt;
    debtOwner.closest("label")?.classList.toggle("required", hasDebt);
  }
  els.orderForm.elements.ghiChu.value = order.ghiChu || "";
  if (els.orderBenefitsSection) els.orderBenefitsSection.hidden = false;
  updateOrderTypeUI();
  if (isShared) populateSharedPassengerFields(order.khachXeGhep || []);
  setOrderCustomerFieldsLocked(Boolean(customer));
  if (els.orderBenefitsSection) els.orderBenefitsSection.hidden = false;
  renderOrderBenefits();
  updateOrderPaymentSummary();
  els.orderDialog.showModal();
}

function openAssignVehicleDialog(orderId) {
  if (!canOperateOrders()) return;
  const order = state.orders.find((row) => String(row.id) === String(orderId));
  if (!order || orderIsDone(order)) return;
  els.assignVehicleForm.reset();
  els.assignVehicleForm.elements.orderId.value = order.id;
  els.assignVehicleForm.elements.ngayGioDi.value = formatDateTime(order.ngayGioDi) || "";
  els.assignVehicleForm.elements.ngayGioDuKienKetThuc.value = formatDateTime(order.ngayGioDuKienKetThuc) || "";
  els.assignVehicleForm.querySelectorAll(".datetime-input").forEach((input) => {
    input.classList.remove("invalid");
    input.setCustomValidity("");
  });
  els.assignVehicleFormStatus.textContent = "";
  els.assignVehicleSummary.innerHTML = detailSection("Đơn cần điều xe", "detail-amber", [
    detailArticle("Mã đơn", order.id),
    detailArticle("Khách hàng", `${order.tenKhach || "Xe ghép"}${order.soDienThoai ? ` - ${order.soDienThoai}` : ""}`),
    detailArticle("Tuyến", order.tuyen || order.loaiHopDong || ""),
    detailArticle("Điểm đón / trả", [order.diemDon, order.diemTra].filter(Boolean).join(" - ")),
    detailArticle("Thực thu", formatMoney(orderRevenueAmount(order)) || "0"),
  ]);
  renderVehicleOptions();
  if (order.bienKiemSoat && [...els.orderVehicleSelect.options].some((option) => option.value === order.bienKiemSoat)) {
    els.orderVehicleSelect.value = order.bienKiemSoat;
  }
  updateVehicleWarning();
  els.assignVehicleDialog.showModal();
}

function openCompleteDialog(orderId) {
  if (!canOperateOrders()) return;
  const order = state.orders.find((row) => String(row.id) === String(orderId));
  if (!order) return;
  if (!normalize(order.trangThaiGuiTaiXe).includes("da gui tai xe")) {
    window.alert("Vui lòng đánh dấu Đã gửi tài xế trước khi hoàn thành đơn hàng.");
    return;
  }
  els.completeForm.elements.orderId.value = order.id;
  els.completeForm.elements.ngayGioHoanThanh.value = localNowForInput();
  els.completeOrderLabel.textContent = `${order.tenKhach} - ${order.tuyen}`;
  els.completeOrderSummary.innerHTML = [
    detailArticle("Mã đơn", order.id),
    detailArticle("Khách hàng", `${order.tenKhach || ""}${order.soDienThoai ? ` - ${order.soDienThoai}` : ""}`),
    detailArticle("Loại đơn", order.loaiHopDong || ""),
    detailArticle("Tuyến", order.tuyen || ""),
    detailArticle("Điểm đón / trả", `${order.diemDon || ""}${order.diemTra ? ` - ${order.diemTra}` : ""}`),
    detailArticle("Xe", order.bienKiemSoat || ""),
    detailArticle("Lái xe", `${order.hoTenLaiXe || ""}${order.maNVLaiXe ? ` - ${order.maNVLaiXe}` : ""}`),
    detailArticle("Đơn vị vận hành xe", vehicleOwnershipLabel(order)),
    hasCommission(order) ? detailArticle("Hoa hồng xe thương quyền", orderCommissionText(order)) : "",
    detailArticle("Giờ đi", formatDateTime(order.ngayGioDi)),
    detailArticle("Dự kiến kết thúc", formatDateTime(order.ngayGioDuKienKetThuc)),
    detailArticle("Giá tiền", formatMoney(order.giaTien)),
    detailArticle("Giảm giá", formatMoney(order.giamGia) || "0"),
    detailArticle("Phụ thu", formatMoney(order.phuThu) || "0"),
    order.phuThu ? detailArticle("Lý do phụ thu", order.lyDoPhuThu || "") : "",
    detailArticle("Ưu đãi", formatMoney(order.tongUuDai) || "0"),
    detailArticle("Voucher", order.voucherCodes || ""),
    detailArticle("Khuyến mãi", order.khuyenMai || ""),
    detailArticle("Thực thu", formatMoney(orderRevenueAmount(order)) || "0"),
    detailArticle("Khách đã cọc", formatMoney(order.daCoc) || "0"),
    detailArticle("Còn phải thu", formatMoney(orderNetAmount(order)) || "0"),
  ].join("");
  els.completeDialog.showModal();
}

function openReopenDialog(orderId) {
  if (!canOperateOrders()) return;
  const order = state.orders.find((row) => String(row.id) === String(orderId));
  if (!order || !els.reopenDialog) return;
  els.reopenForm.reset();
  els.reopenForm.elements.orderId.value = order.id;
  els.reopenFormStatus.textContent = `Gửi yêu cầu mở lại đơn ${order.id} để admin duyệt.`;
  els.reopenDialog.showModal();
}

async function reviewReopenRequest(requestId, approved) {
  const adminNote = window.prompt(approved ? "Ghi chú duyệt (nếu có):" : "Lý do từ chối (nếu có):") || "";
  await fetchJson(`/api/proxy/reopen-requests/${encodeURIComponent(requestId)}/${approved ? "approve" : "reject"}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminNote }),
  });
  await loadData();
}

function detailArticle(label, value) {
  return `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "")}</strong></article>`;
}

function detailSection(title, tone, items) {
  const content = items.filter(Boolean).join("");
  if (!content) return "";
  return `<section class="order-detail-section ${tone}">
    <h3>${escapeHtml(title)}</h3>
    <div class="order-detail-grid">${content}</div>
  </section>`;
}

function openCustomerDetails(customerId) {
  els.detailsSaveButton.textContent = "Lưu thay đổi";
  const row = state.customers.find((item) => String(item.id) === String(customerId));
  if (!row) return;
  els.detailsSaveButton.hidden = false;
  els.detailsDeleteButton.hidden = false;
  els.detailsForm.elements.id.value = row.id;
  els.detailsForm.elements.type.value = "customer";
  els.detailsTitle.textContent = "Chi tiết khách hàng";
  els.detailsStatus.textContent = "";
  els.detailsReadonly.innerHTML = [
    detailArticle("ID", row.id),
    detailArticle("Ngày tạo", formatDateTime(row.createdAt)),
  ].join("");
  els.detailsEditor.innerHTML = `
    <label class="required"><span>Tên khách hàng</span><input name="tenKhach" value="${escapeHtml(row.tenKhach)}" required /></label>
    <label class="required"><span>Số điện thoại</span><input name="soDienThoai" value="${escapeHtml(row.soDienThoai)}" inputmode="numeric" autocomplete="tel" maxlength="14" placeholder="0xxxxxxxxx" required /></label>
    <label><span>Số CCCD</span><input name="soCCCD" value="${escapeHtml(row.soCCCD || "")}" /></label>
    <label><span>Địa chỉ</span><input name="diaChi" value="${escapeHtml(row.diaChi || "")}" /></label>
    <label><span>Loại khách</span><select name="loaiKhachHang"><option value="">Chọn loại khách</option><option ${row.loaiKhachHang === "Khách cá nhân" ? "selected" : ""}>Khách cá nhân</option><option ${row.loaiKhachHang === "Khách doanh nghiệp" ? "selected" : ""}>Khách doanh nghiệp</option></select></label>
    <label><span>Năm sinh</span><input name="namSinh" value="${escapeHtml(row.namSinh)}" /></label>
    <label class="required"><span>Giới tính</span><select name="gioiTinh" required><option value="">Chọn giới tính</option><option ${row.gioiTinh === "Nam" ? "selected" : ""}>Nam</option><option ${row.gioiTinh === "Nữ" ? "selected" : ""}>Nữ</option><option ${row.gioiTinh === "Khác" ? "selected" : ""}>Khác</option></select></label>
    <label class="required"><span>Nguồn khách</span><select name="nguonKhach" required>${selectOptions([...new Set([...customerSourceOptions(), row.nguonKhach].filter(Boolean))], row.nguonKhach || "", "Chọn nguồn")}</select></label>
    <label><span>Nhân viên nhập</span><input name="nhanVienNhap" value="${escapeHtml(row.nhanVienNhap)}" readonly /></label>
  `;
  els.detailsDialog.showModal();
}

function openContractDetails(contractId) {
  els.detailsSaveButton.textContent = "Lưu thay đổi";
  const row = state.contracts.find((item) => String(item.id) === String(contractId));
  if (!row) return;
  els.detailsSaveButton.hidden = false;
  els.detailsDeleteButton.hidden = false;
  els.detailsForm.elements.id.value = row.id;
  els.detailsForm.elements.type.value = "contract";
  els.detailsTitle.textContent = "Chi tiết hợp đồng/tuyến";
  els.detailsStatus.textContent = "";
  els.detailsReadonly.innerHTML = [
    detailArticle("ID", row.id),
    detailArticle("Ngày tạo", formatDateTime(row.createdAt)),
  ].join("");
  els.detailsEditor.innerHTML = `
    <label class="required"><span>Điểm đi</span><input name="diemDi" value="${escapeHtml(row.diemDi || "")}" required /></label>
    <label class="required"><span>Điểm đến</span><input name="diemDen" value="${escapeHtml(row.diemDen || "")}" required /></label>
    <label class="full"><span>Ghi chú</span><textarea name="ghiChu" rows="3">${escapeHtml(row.ghiChu)}</textarea></label>
  `;
  els.detailsDialog.showModal();
}

function openVoucherDetails(voucherId) {
  els.detailsSaveButton.textContent = "Lưu thay đổi";
  const row = state.vouchers.find((item) => String(item.id) === String(voucherId));
  if (!row) return;
  const canManageBenefits = can("manage_benefits");
  els.detailsSaveButton.hidden = !canManageBenefits;
  els.detailsDeleteButton.hidden = !canManageBenefits;
  els.detailsForm.elements.id.value = row.id;
  els.detailsForm.elements.type.value = "voucher";
  els.detailsTitle.textContent = "Chi tiết voucher";
  els.detailsStatus.textContent = "";
  els.detailsReadonly.innerHTML = [
    detailArticle("ID", row.id),
    detailArticle("Trạng thái", row.trangThaiSuDung || row.trangThai || ""),
    detailArticle("Đơn đã dùng", row.donHangId || ""),
    detailArticle("Khách đã dùng", row.tenKhach || ""),
  ].join("");
  els.detailsEditor.innerHTML = `
    <label class="required"><span>Mã voucher</span><input name="maVoucher" value="${escapeHtml(row.maVoucher || "")}" required /></label>
    <label class="required"><span>Tên chiến dịch</span><input name="tenVoucher" value="${escapeHtml(row.tenVoucher || "")}" required /></label>
    <label class="required"><span>Loại giá trị</span><select name="loaiGiaTri"><option value="fixed" ${row.loaiGiaTri === "fixed" ? "selected" : ""}>Số tiền</option><option value="percent" ${row.loaiGiaTri === "percent" ? "selected" : ""}>Phần trăm</option></select></label>
    <label class="required"><span>Giá trị</span><input name="giaTri" class="money-input" value="${escapeHtml(formatMoney(row.giaTri) || row.giaTri || "")}" required /></label>
    <label><span>Ngày bắt đầu</span><input name="ngayBatDau" class="date-input" inputmode="numeric" value="${escapeHtml(row.ngayBatDau || "")}" /></label>
    <label><span>Ngày hết hạn</span><input name="ngayHetHan" class="date-input" inputmode="numeric" value="${escapeHtml(row.ngayHetHan || "")}" /></label>
    <label class="checkbox-line"><input name="khongGioiHanHanDung" type="checkbox" ${row.ngayHetHan ? "" : "checked"} /><span>Không giới hạn hạn sử dụng</span></label>
    <label><span>Trạng thái</span><select name="trangThai"><option ${row.trangThai === "Đang áp dụng" ? "selected" : ""}>Đang áp dụng</option><option ${row.trangThai === "Tạm ngưng" ? "selected" : ""}>Tạm ngưng</option></select></label>
    <label class="full"><span>Ghi chú</span><textarea name="ghiChu" rows="3">${escapeHtml(row.ghiChu || "")}</textarea></label>
  `;
  els.detailsEditor.querySelectorAll("input, select, textarea").forEach((field) => {
    field.disabled = !canManageBenefits;
  });
  if (!canManageBenefits) {
    els.detailsStatus.textContent = "Ban chi duoc xem voucher. Viec tao, sua, xoa do Kinh doanh quan ly.";
  }
  els.detailsDialog.showModal();
}

function openPromotionDetails(promotionId) {
  els.detailsSaveButton.textContent = "Lưu thay đổi";
  const row = state.promotions.find((item) => String(item.id) === String(promotionId));
  if (!row) return;
  const canManageBenefits = can("manage_benefits");
  els.detailsSaveButton.hidden = !canManageBenefits;
  els.detailsDeleteButton.hidden = !canManageBenefits;
  els.detailsForm.elements.id.value = row.id;
  els.detailsForm.elements.type.value = "promotion";
  els.detailsTitle.textContent = "Chi tiết khuyến mãi";
  els.detailsStatus.textContent = "";
  els.detailsReadonly.innerHTML = [
    detailArticle("ID", row.id),
    detailArticle("Trạng thái", row.trangThaiHieuLuc || row.trangThai || ""),
  ].join("");
  els.detailsEditor.innerHTML = `
    <label class="required full"><span>Tên chương trình</span><input name="tenChuongTrinh" value="${escapeHtml(row.tenChuongTrinh || "")}" required /></label>
    <label class="required"><span>Loại giá trị</span><select name="loaiGiaTri"><option value="fixed" ${row.loaiGiaTri === "fixed" ? "selected" : ""}>Số tiền</option><option value="percent" ${row.loaiGiaTri === "percent" ? "selected" : ""}>Phần trăm</option></select></label>
    <label class="required"><span>Giá trị</span><input name="giaTri" class="money-input" value="${escapeHtml(formatMoney(row.giaTri) || row.giaTri || "")}" required /></label>
    <label><span>Ngày bắt đầu</span><input name="ngayBatDau" class="date-input" inputmode="numeric" value="${escapeHtml(row.ngayBatDau || "")}" /></label>
    <label><span>Ngày hết hạn</span><input name="ngayHetHan" class="date-input" inputmode="numeric" value="${escapeHtml(row.ngayHetHan || "")}" /></label>
    <label><span>Trạng thái</span><select name="trangThai"><option ${row.trangThai === "Đang áp dụng" ? "selected" : ""}>Đang áp dụng</option><option ${row.trangThai === "Tạm ngưng" ? "selected" : ""}>Tạm ngưng</option></select></label>
    <label class="full"><span>Ghi chú</span><textarea name="ghiChu" rows="3">${escapeHtml(row.ghiChu || "")}</textarea></label>
  `;
  els.detailsEditor.querySelectorAll("input, select, textarea").forEach((field) => {
    field.disabled = !canManageBenefits;
  });
  if (!canManageBenefits) {
    els.detailsStatus.textContent = "Ban chi duoc xem khuyen mai. Viec tao, sua, xoa do Kinh doanh quan ly.";
  }
  els.detailsDialog.showModal();
}

async function updateInvoiceOrderStatus(invoiceId, status, entityType = "order") {
  const endpoint = entityType === "sharedPassenger"
    ? `/api/proxy/shared-passengers/${encodeURIComponent(invoiceId)}/invoice-status`
    : entityType === "invoiceGroup"
      ? `/api/proxy/invoice-groups/${encodeURIComponent(invoiceId)}/invoice-status`
      : `/api/proxy/orders/${encodeURIComponent(invoiceId)}/invoice-status`;
  await fetchJson(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trangThaiHoaDon: status }),
  });
  await loadData();
  switchView("invoiceOrders");
}

function selectedInvoiceGroupOrders() {
  return state.invoiceGroupCandidates.filter((row) => state.invoiceGroupSelection.has(String(row.id)));
}

function renderInvoiceGroupSummary() {
  const rows = selectedInvoiceGroupOrders();
  const beforeVat = rows.reduce((total, row) => total + Number(row.tienTruocVAT || 0), 0);
  const vat = rows.reduce((total, row) => total + Math.round(Number(row.tienTruocVAT || 0) * 0.08), 0);
  els.invoiceGroupSummary.innerHTML = `
    <div class="invoice-group-summary-title">
      <div>
        <span>Tổng kết hóa đơn</span>
        <small>Giá trị được tổng hợp từ các đơn đã chọn</small>
      </div>
      <span class="invoice-group-count">${rows.length} đơn</span>
    </div>
    <div class="invoice-group-summary-grid">
      <article>
        <span>Giá trị trước VAT</span>
        <strong>${escapeHtml(formatMoney(beforeVat)) || "0"} <small>đ</small></strong>
      </article>
      <article>
        <span>Thuế VAT 8%</span>
        <strong>${escapeHtml(formatMoney(vat)) || "0"} <small>đ</small></strong>
      </article>
      <article class="invoice-group-grand-total">
        <span>Tổng thanh toán</span>
        <strong>${escapeHtml(formatMoney(beforeVat + vat)) || "0"} <small>đ</small></strong>
      </article>
    </div>
  `;
}

function renderInvoiceGroupCandidates() {
  const selected = selectedInvoiceGroupOrders();
  const customerKey = selected[0] ? String(selected[0].khachHangId || normalizePhone(selected[0].soDienThoai)) : "";
  els.invoiceGroupCandidateTable.innerHTML =
    state.invoiceGroupCandidates
      .filter((row) => {
        const keyword = normalize(state.invoiceGroupSearch);
        if (!keyword) return true;
        return normalize(`${row.id || ""} ${row.tenKhach || ""} ${row.soDienThoai || ""}`).includes(keyword);
      })
      .map((row) => {
        const rowKey = String(row.khachHangId || normalizePhone(row.soDienThoai));
        const disabled = customerKey && rowKey !== customerKey;
        const checked = selected.some((item) => String(item.id) === String(row.id));
        return `<tr>
          <td><input type="checkbox" data-invoice-group-order value="${escapeHtml(row.id)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""} /></td>
          <td><strong>${escapeHtml(row.id || "")}</strong></td>
          <td><strong>${escapeHtml(row.tenKhach || "")}</strong><div class="muted">${escapeHtml(row.soDienThoai || "")}</div></td>
          <td>${escapeHtml(formatDateTime(row.ngayGioDi))}</td>
          <td>${escapeHtml(row.tuyen || "")}</td>
          <td><strong>${escapeHtml(formatMoney(row.tienTruocVAT)) || "0"}</strong></td>
        </tr>`;
      })
      .join("") || `<tr><td colspan="6" class="empty">Không có đơn đã hoàn thành phù hợp để gộp hóa đơn.</td></tr>`;
  renderInvoiceGroupSummary();
}

function openInvoiceGroupDialog() {
  if (!can("create_invoice_groups")) return;
  els.invoiceGroupForm.reset();
  state.invoiceGroupSelection.clear();
  state.invoiceGroupSearch = "";
  els.invoiceGroupSearch.value = "";
  els.invoiceGroupFormStatus.textContent = "";
  renderInvoiceGroupCandidates();
  els.invoiceGroupDialog.showModal();
}

async function updateDebtOrderStatus(orderId, status, entityType = "order") {
  await fetchJson(`/api/proxy/debt-orders/${encodeURIComponent(orderId)}/status?entityType=${encodeURIComponent(entityType)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trangThaiCongNo: status }),
  });
  await loadData();
  switchView("debtOrders");
}

async function updateCommissionOrderStatus(orderId, status) {
  await fetchJson(`/api/proxy/commission-orders/${encodeURIComponent(orderId)}/status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trangThaiHoaHong: status }),
  });
  await loadData();
  switchView("commissionOrders");
}

function openResetPasswordDialog(userId) {
  const row = state.users.find((item) => String(item.id) === String(userId));
  if (!row || !els.resetPasswordDialog) return;
  els.resetPasswordForm.reset();
  els.resetPasswordForm.elements.userId.value = row.id;
  els.resetPasswordForm.elements.username.value = row.username || "";
  els.resetPasswordFormStatus.textContent = "";
  els.resetPasswordDialog.showModal();
}

function openEditUserDialog(userId) {
  const row = state.users.find((item) => String(item.id) === String(userId));
  if (!row || !els.userDialog) return;
  els.userForm.reset();
  els.userForm.elements.id.value = row.id || "";
  els.userForm.elements.username.value = row.username || "";
  els.userForm.elements.displayName.value = row.displayName || "";
  els.userForm.elements.role.value = "ke_toan";
  els.userForm.elements.status.value = normalize(row.status) === "active" || normalize(row.status) === "dang hoat dong"
    ? "active"
    : "inactive";
  els.userForm.elements.password.required = false;
  els.userPasswordField.hidden = true;
  els.userDialogTitle.textContent = "Chỉnh sửa tài khoản";
  els.userSubmitButton.textContent = "Lưu thay đổi";
  els.userFormStatus.textContent = "";
  els.userDialog.showModal();
}

function openFranchiseVehicleDetails(vehicleId) {
  els.detailsSaveButton.textContent = "Lưu thay đổi";
  const row = state.franchiseVehicles.find((item) => String(item.id) === String(vehicleId));
  if (!row) return;
  els.detailsSaveButton.hidden = false;
  els.detailsDeleteButton.hidden = false;
  els.detailsForm.elements.id.value = row.id;
  els.detailsForm.elements.type.value = "franchiseVehicle";
  els.detailsTitle.textContent = "Chi tiết xe thương quyền";
  els.detailsStatus.textContent = "";
  els.detailsReadonly.innerHTML = [
    detailArticle("ID", row.id),
    detailArticle("Ngày tạo", formatDateTime(row.createdAt)),
  ].join("");
  els.detailsEditor.innerHTML = `
    <label class="required"><span>Biển số xe</span><input name="bienKiemSoat" value="${escapeHtml(row.bienKiemSoat || "")}" required pattern="\\d{2}[A-Za-z]-\\d{3}\\.\\d{2}" placeholder="68A-123.45" title="Nhập đúng định dạng 68A-123.45" /></label>
    <label class="required"><span>Dòng xe</span><select name="dongXe" required>${selectOptions(vehicleLineOptions(), row.dongXe || "", "Chọn dòng xe")}</select></label>
    <label class="required"><span>Hiệu xe</span><select name="hieuXe" required>${selectOptions(vehicleMakeOptions(), row.hieuXe || "", "Chọn hiệu xe")}</select></label>
    <label><span>Số chỗ</span><select name="soCho">${selectOptions(vehicleSeatOptions, row.soCho || "", "Chọn số chỗ")}</select></label>
    <label class="required"><span>Chủ xe / đơn vị hợp tác</span><input name="tenChuXe" value="${escapeHtml(row.tenChuXe || "")}" required /></label>
    <label><span>SĐT chủ xe</span><input name="soDienThoaiChuXe" value="${escapeHtml(row.soDienThoaiChuXe || "")}" /></label>
    <label class="required"><span>Lái xe</span><input name="hoTenLaiXe" value="${escapeHtml(row.hoTenLaiXe || "")}" required /></label>
    <label><span>SĐT lái xe</span><input name="soDienThoaiLaiXe" value="${escapeHtml(row.soDienThoaiLaiXe || "")}" /></label>
    <label class="full"><span>Địa chỉ lái xe</span><input name="diaChiLaiXe" value="${escapeHtml(row.diaChiLaiXe || "")}" /></label>
    <label><span>Trạng thái</span><select name="trangThai"><option ${row.trangThai === "Đang hợp tác" ? "selected" : ""}>Đang hợp tác</option><option ${row.trangThai === "Tạm ngưng" ? "selected" : ""}>Tạm ngưng</option><option ${row.trangThai === "Ngừng hợp tác" ? "selected" : ""}>Ngừng hợp tác</option></select></label>
    <label class="full"><span>Ghi chú</span><textarea name="ghiChu" rows="3">${escapeHtml(row.ghiChu || "")}</textarea></label>
  `;
  els.detailsDialog.showModal();
}

function openOrderDetails(orderId) {
  const row =
    state.orders.find((item) => String(item.id) === String(orderId)) ||
    state.invoiceOrders.find((item) => String(item.id) === String(orderId));
  if (!row) return;
  const feedback = state.orderFeedback.find((item) => String(item.donHangId) === String(row.id)) || {};
  const canManageFeedback = orderIsDone(row) && can("manage_order_feedback");
  const debtStatus = normalize(row.congNo);
  const hasDebtRecord = debtStatus.includes("co") || ["true", "yes", "1"].includes(debtStatus);
  const storedDebtAmount = String(row.soTienCongNo || "").trim();
  const debtAmount = hasDebtRecord
    ? (storedDebtAmount
      ? parseMoney(storedDebtAmount)
      : Math.max(orderTotalPaymentAmount(row) - parseMoney(row.daCoc), 0))
    : 0;
  els.detailsForm.elements.id.value = row.id;
  els.detailsForm.elements.type.value = canManageFeedback ? "orderFeedback" : "order";
  els.detailsTitle.textContent = "Chi tiết đơn hàng";
  els.detailsStatus.textContent = "";
  els.detailsReadonly.innerHTML = [
    detailSection("Thông tin đơn hàng", "detail-blue", [
      detailArticle("Mã đơn", row.orderCode || row.id),
      row.invoiceEntityType === "sharedPassenger" ? detailArticle("Mã khách xe ghép", row.id) : "",
      detailArticle("Trạng thái", row.trangThai || ""),
      detailArticle("Loại đơn", row.loaiHopDong || ""),
      detailArticle("Khách hàng", `${row.tenKhach || ""}${row.soDienThoai ? ` - ${row.soDienThoai}` : ""}`),
    ]),
    detailSection("Hành trình", "detail-amber", [
      detailArticle("Tuyến", row.tuyen || ""),
      detailArticle("Điểm đón", row.diemDon || ""),
      detailArticle("Điểm trả", row.diemTra || ""),
      detailArticle("Giờ đi", formatDateTime(row.ngayGioDi)),
      detailArticle("Dự kiến kết thúc", formatDateTime(row.ngayGioDuKienKetThuc)),
      detailArticle("Hoàn thành", formatDateTime(row.ngayGioHoanThanh)),
    ]),
    detailSection("Điều xe", "detail-slate", [
      detailArticle("Xe", `${row.bienKiemSoat || ""}${row.soHieuXe ? ` - ${row.soHieuXe}` : ""}`),
      detailArticle("Lái xe", `${row.hoTenLaiXe || ""}${row.maNVLaiXe ? ` - ${row.maNVLaiXe}` : ""}`),
      detailArticle("Đơn vị vận hành xe", vehicleOwnershipLabel(row)),
      hasCommission(row) ? detailArticle("Hoa hồng xe thương quyền", orderCommissionText(row)) : "",
    ]),
    detailSection("Tài chính", "detail-purple", [
      detailArticle("Giá tiền / doanh thu", formatMoney(row.giaTien)),
      detailArticle("Giảm giá", formatMoney(row.giamGia) || "0"),
      detailArticle("Phụ thu", formatMoney(row.phuThu) || "0"),
      row.phuThu ? detailArticle("Lý do phụ thu", row.lyDoPhuThu || "") : "",
      detailArticle("Ưu đãi", formatMoney(row.tongUuDai) || "0"),
      detailArticle("Voucher", row.voucherCodes || ""),
      detailArticle("Khuyến mãi", row.khuyenMai || ""),
      detailArticle("Thành tiền trước VAT", formatMoney(orderRevenueAmount(row)) || "0"),
      detailArticle("Thuế VAT (8%)", formatMoney(orderVatAmount(row)) || "0"),
      detailArticle("Tổng thanh toán", formatMoney(orderTotalPaymentAmount(row)) || "0"),
      detailArticle("Khách đã cọc", formatMoney(row.daCoc) || "0"),
      detailArticle("Ghi nhận công nợ", hasDebtRecord ? "Có" : "Không"),
      detailArticle("Số tiền công nợ", hasDebtRecord ? (formatMoney(debtAmount) || "0") : "0"),
      detailArticle("Công nợ cho ai", hasDebtRecord ? (row.congNoChoAi || "—") : "—"),
      detailArticle("Trạng thái nộp tiền", hasDebtRecord ? "Công nợ" : (row.trangThaiNopTien === "Đã nộp tiền" ? "Đã nộp tiền" : "Chưa nộp tiền")),
      detailArticle("Còn phải thu", formatMoney(orderNetAmount(row)) || "0"),
    ]),
    detailSection("Hóa đơn", "detail-green", [
      detailArticle("Yêu cầu hóa đơn", row.yeuCauHoaDon || "Không"),
      detailArticle("Loại khách", row.loaiKhach || ""),
      detailArticle("Tên công ty", row.tenCongTy || ""),
      detailArticle("Mã số thuế", row.maSoThue || ""),
      detailArticle("Địa chỉ hóa đơn", row.diaChiHoaDon || ""),
      detailArticle("Email nhận hóa đơn", row.emailHoaDon || ""),
      detailArticle("Trạng thái hóa đơn", invoiceOrderStatus(row)),
      detailArticle("Ngày xuất hóa đơn", formatDateTime(row.ngayXuatHoaDon)),
      detailArticle("Người xuất hóa đơn", row.nguoiXuatHoaDon || ""),
      detailArticle("Ghi chú", row.ghiChu || ""),
    ]),
    feedback.id && !canManageFeedback
      ? detailSection("Phản hồi khách hàng", "detail-blue", [
          detailArticle("Kênh chăm sóc", feedback.kenhChamSoc || ""),
          detailArticle("Điểm đánh giá", feedback.diemDanhGia ? `${feedback.diemDanhGia}/10` : ""),
          detailArticle("Nội dung khách hàng phản ánh", feedback.noiDungPhanHoi || ""),
          detailArticle("Hình thức xử lý", feedback.hinhThucXuLy || ""),
          detailArticle("Kết quả xử lý", feedback.ketQuaXuLy || ""),
          detailArticle("Chú thích", feedback.chuThich || ""),
        ])
      : "",
  ].join("");
  els.detailsEditor.innerHTML = canManageFeedback
    ? `
      <fieldset class="feedback-editor full">
        <legend>Phản hồi khách hàng sau chuyến đi</legend>
        <div class="form-grid two-col">
          <label class="required">
            <span>Kênh chăm sóc</span>
            <select name="kenhChamSoc" required>
              ${selectOptions(["Điện thoại", "Zalo", "Facebook", "Email", "Trực tiếp", "Khác"], feedback.kenhChamSoc || "", "Chọn kênh chăm sóc")}
            </select>
          </label>
          <label class="required">
            <span>Điểm đánh giá (thang điểm 10)</span>
            <input name="diemDanhGia" type="number" min="1" max="10" step="1" value="${escapeHtml(feedback.diemDanhGia || "")}" required />
          </label>
          <label class="required full">
            <span>Nội dung khách hàng phản ánh</span>
            <textarea name="noiDungPhanHoi" rows="3" required>${escapeHtml(feedback.noiDungPhanHoi || "")}</textarea>
          </label>
          <label>
            <span>Hình thức xử lý</span>
            <textarea name="hinhThucXuLy" rows="2">${escapeHtml(feedback.hinhThucXuLy || "")}</textarea>
          </label>
          <label>
            <span>Kết quả xử lý</span>
            <textarea name="ketQuaXuLy" rows="2">${escapeHtml(feedback.ketQuaXuLy || "")}</textarea>
          </label>
          <label class="full">
            <span>Chú thích</span>
            <textarea name="chuThich" rows="2">${escapeHtml(feedback.chuThich || "")}</textarea>
          </label>
        </div>
      </fieldset>
    `
    : "";
  els.detailsSaveButton.textContent = canManageFeedback ? "Lưu phản hồi" : "Lưu thay đổi";
  els.detailsSaveButton.hidden = !canManageFeedback;
  els.detailsDeleteButton.hidden = row.invoiceEntityType === "sharedPassenger" || orderIsDone(row) || !canOperateOrders();
  els.detailsDialog.showModal();
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.view));
});

els.loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (els.loginSubmitButton) els.loginSubmitButton.disabled = true;
  if (els.loginStatus) els.loginStatus.textContent = "Đang đăng nhập...";
  const formData = new FormData(els.loginForm);
  try {
    const result = await fetchJson(
      "/api/proxy/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.get("username"),
          password: formData.get("password"),
        }),
      },
      60000,
    );
    if (!isAccountingAppRole(result.user?.role)) throw new Error("Ứng dụng này chỉ dành cho tài khoản Kế toán hoặc Admin.");
    state.authToken = result.token || "";
    window.localStorage.setItem("diXanhAuthToken", state.authToken);
    state.currentUser = result.user;
    state.permissions = result.permissions || { views: [], actions: [] };
    state.roles = result.roles || {};
    if (els.loginStatus) els.loginStatus.textContent = "";
    showApp();
    await loadData();
  } catch (error) {
    if (els.loginStatus) els.loginStatus.textContent = error.message || "Không đăng nhập được.";
  } finally {
    if (els.loginSubmitButton) els.loginSubmitButton.disabled = false;
  }
});

els.logoutButton?.addEventListener("click", async () => {
  try {
    await fetchJson("/api/proxy/logout", { method: "POST" }, 10000);
  } catch (error) {
    // Local session is cleared below even if the server session is already gone.
  }
  clearAuth("Đã đăng xuất.");
});

els.refreshButton.addEventListener("click", async () => {
  await loadData();
  if (state.activeView === "attendance") {
    const type = document.querySelector("#attendanceViewType")?.value || "travel";
    if (type === "cargo") await loadCargoAttendance(true);
    else await loadAttendance(true);
  }
  if (state.activeView === "payroll") await loadPayroll(true);
  if (state.activeView === "fuel") await loadFuelRecords();
  if (state.activeView === "fuelStandard") await loadFuelStandardView();
  if (state.activeView === "fuelPrices") await loadFuelPricesView();
  if (state.activeView === "carWash") await loadCarWashRecords(true);
});
els.cskhShiftReportForm?.elements.caLamViec?.addEventListener("change", syncCskhShiftForm);
els.cskhShiftReportForm?.elements.ngay?.addEventListener("change", prefillCskhB2cOrderTotal);
els.cskhShiftReportFromInput?.addEventListener("change", renderCskhShiftReports);
els.cskhShiftReportToInput?.addEventListener("change", renderCskhShiftReports);
els.cskhShiftReportExportButton?.addEventListener("click", () => {
  const range = reportDateRange(els.cskhShiftReportFromInput, els.cskhShiftReportToInput);
  if (!range) return;
  window.location.href = `/api/proxy/cskh-shift-reports/export.xlsx?tuNgay=${encodeURIComponent(range.from)}&denNgay=${encodeURIComponent(range.to)}`;
});
els.cskhShiftReportForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (state.currentUser?.role === "marketing") return;
  const form = els.cskhShiftReportForm;
  if (!form.reportValidity()) return;
  els.cskhShiftReportSubmitButton.disabled = true;
  els.cskhShiftReportStatus.textContent = "Đang lưu...";
  const data = new FormData(form);
  const numberValue = (name) => Number(data.get(name) || 0);
  const selectedDateText = String(data.get("ngay") || "").split("-").reverse().join("/");
  const selectedShift = `Ca ${numberValue("caLamViec")}`;
  const employee = state.currentUser?.displayName || state.currentUser?.username || "";
  const duplicate = state.cskhShiftReports.some((row) =>
    String(row["Ngày"] || "").trim() === selectedDateText
    && String(row["Ca Làm Việc"] || "").trim() === selectedShift
    && String(row["Nhân Viên Trực"] || "").trim() === employee
  );
  if (duplicate) {
    const message = `Báo cáo ngày ${selectedDateText} - ${selectedShift} đã được khai báo.`;
    els.cskhShiftReportStatus.textContent = message;
    els.cskhShiftReportSubmitButton.disabled = false;
    window.alert(message);
    return;
  }
  try {
    const result = await fetchJson("/api/proxy/cskh-shift-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ngay: data.get("ngay"),
        caLamViec: numberValue("caLamViec"),
        soLuongTinNhanMeta: numberValue("soLuongTinNhanMeta"),
        soLuongKhachPhanHoi: numberValue("soLuongKhachPhanHoi"),
        soLuongCuocGoi: numberValue("soLuongCuocGoi"),
        soLuongChatZalo: numberValue("soLuongChatZalo"),
        soLuongKhachTuWebsite: numberValue("soLuongKhachTuWebsite"),
        soLuongKhachTuEmail: numberValue("soLuongKhachTuEmail"),
        soLuongTinNhanKhachVangLai: numberValue("soLuongTinNhanKhachVangLai"),
        soLuongKhachPhanHoiTuTiktok: numberValue("soLuongKhachPhanHoiTuTiktok"),
        tongSoLuongDonChot: numberValue("tongSoLuongDonChot"),
      }),
    });
    const rows = await fetchJson("/api/proxy/cskh-shift-reports", {}, 90000);
    state.cskhShiftReports = rows.rows || [];
    renderCskhShiftReports();
    els.cskhShiftReportStatus.textContent = result.updated ? "Đã cập nhật báo cáo ca." : "Đã lưu báo cáo ca.";
  } catch (error) {
    els.cskhShiftReportStatus.textContent = error.message || "Không lưu được báo cáo ca.";
    window.alert(els.cskhShiftReportStatus.textContent);
  } finally {
    els.cskhShiftReportSubmitButton.disabled = false;
  }
});
els.openCustomerDialogButton.addEventListener("click", () => {
  els.customerForm.reset();
  els.customerForm.elements.id.value = "";
  els.customerForm.elements.nhanVienNhap.value = state.currentUser?.displayName || state.currentUser?.username || "";
  els.customerDialog.querySelector("h2").textContent = "Thêm khách hàng";
  els.customerFormStatus.textContent = "";
  els.customerDialog.showModal();
});
els.customerCancelButton.addEventListener("click", () => els.customerDialog.close());
els.openContractDialogButton.addEventListener("click", () => {
  els.contractForm.reset();
  els.contractForm.elements.id.value = "";
  els.contractDialog.querySelector("h2").textContent = "Thêm hợp đồng/tuyến";
  els.contractFormStatus.textContent = "";
  els.contractDialog.showModal();
});
els.contractCancelButton.addEventListener("click", () => els.contractDialog.close());
els.contractPricingKm?.addEventListener("input", calculateContractPricing);
els.contractPricingWeekend?.addEventListener("change", calculateContractPricing);
els.overnightCalculatorForm?.addEventListener("input", (event) => {
  if (!event.target.classList?.contains("datetime-input")) return;
  event.target.value = formatDateTimeTyping(event.target.value);
  setDateTimeInputValidity(event.target);
});
els.overnightCalculatorForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  renderOvernightCalculation();
});
els.overnightCalculatorResult?.addEventListener("change", (event) => {
  if (!event.target.matches?.("[data-overnight-window-index]")) return;
  const excludedIndexes = new Set(
    [...els.overnightCalculatorResult.querySelectorAll("[data-overnight-window-index]:not(:checked)")]
      .map((input) => Number(input.dataset.overnightWindowIndex)),
  );
  renderOvernightCalculation(excludedIndexes);
});
els.overnightResetButton?.addEventListener("click", () => {
  els.overnightCalculatorForm?.reset();
  [els.overnightStartInput, els.overnightEndInput].forEach((input) => {
    input?.classList.remove("invalid");
    input?.setCustomValidity("");
  });
  if (els.overnightCalculatorResult) els.overnightCalculatorResult.innerHTML = `<div class="empty">Nhập đầy đủ thông tin để tính thời gian và chi phí sử dụng xe.</div>`;
  els.overnightStartInput?.focus();
});
els.contractPricingView?.addEventListener("input", (event) => {
  const input = event.target.closest("[data-pricing-group]");
  if (!input || !state.contractPricing) return;
  const group = input.dataset.pricingGroup;
  const row = state.contractPricing[group]?.[Number(input.dataset.pricingRow)];
  if (!row) return;
  const value = Math.max(0, Number(input.value || 0));
  if (group === "oneWay") row.rates[input.dataset.pricingKey] = value;
  else if (group === "roundTrip") row.percentages[input.dataset.pricingKey] = value;
  else if (group === "waiting") row.minutes = value;
  calculateContractPricing();
});
els.saveContractPricingButton?.addEventListener("click", async () => {
  if (!state.contractPricing) return;
  els.saveContractPricingButton.disabled = true;
  els.contractPricingStatus.textContent = "Đang lưu bảng giá...";
  try {
    const result = await fetchJson("/api/proxy/contract-pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.contractPricing),
    }, 90000);
    state.contractPricing = result.config;
    els.contractPricingStatus.textContent = "Đã lưu cấu hình bảng giá hợp đồng.";
    renderContractPricing();
  } catch (error) {
    els.contractPricingStatus.textContent = error.message || "Không thể lưu bảng giá.";
  } finally {
    els.saveContractPricingButton.disabled = false;
  }
});
els.openVoucherDialogButton.addEventListener("click", async () => {
  els.voucherForm.reset();
  els.voucherForm.elements.id.value = "";
  els.voucherDialog.querySelector("h2").textContent = "Thêm voucher";
  els.voucherFormStatus.textContent = "Đang sinh mã...";
  els.voucherDialog.showModal();
  try {
    const result = await fetchJson("/api/proxy/vouchers/suggest-code", {}, 15000);
    els.voucherForm.elements.maVoucher.value = result.maVoucher || "";
    els.voucherFormStatus.textContent = "";
  } catch (error) {
    els.voucherFormStatus.textContent = "Không tự sinh được mã, bạn có thể nhập thủ công.";
  }
});
els.voucherCancelButton.addEventListener("click", () => els.voucherDialog.close());
els.openVoucherBatchDialogButton.addEventListener("click", () => {
  els.voucherBatchForm.reset();
  els.voucherBatchFormStatus.textContent = "";
  els.voucherBatchDialog.showModal();
});
els.voucherBatchCancelButton.addEventListener("click", () => els.voucherBatchDialog.close());
els.openPromotionDialogButton.addEventListener("click", () => {
  els.promotionForm.reset();
  els.promotionForm.elements.id.value = "";
  els.promotionDialog.querySelector("h2").textContent = "Thêm khuyến mãi";
  els.promotionFormStatus.textContent = "";
  els.promotionDialog.showModal();
});
els.promotionCancelButton.addEventListener("click", () => els.promotionDialog.close());
els.openFranchiseVehicleDialogButton.addEventListener("click", () => {
  els.franchiseVehicleForm.reset();
  refreshFranchiseVehicleCatalogSelects();
  els.franchiseVehicleForm.elements.id.value = "";
  els.franchiseVehicleDialog.querySelector("h2").textContent = "Thêm xe thương quyền";
  els.franchiseVehicleFormStatus.textContent = "";
  els.franchiseVehicleDialog.showModal();
});
els.franchiseVehicleCancelButton.addEventListener("click", () => els.franchiseVehicleDialog.close());
els.franchiseVehicleForm.elements.bienKiemSoat?.addEventListener("input", (event) => {
  event.target.value = event.target.value.toUpperCase();
});
els.openOrderDialogButton.addEventListener("click", () => {
  if (canOperateOrders()) openOrderDialog();
});
els.exportDriverRemittanceButton.addEventListener("click", () => {
  const selectedDate = els.driverRemittanceDateInput.value || localDateForInput();
  window.location.href = `/api/proxy/reports/driver-remittance.xlsx?ngay=${encodeURIComponent(selectedDate)}`;
});
els.reportTypeSelect?.addEventListener("change", updateReportControls);
els.exportSelectedReportButton?.addEventListener("click", () => {
  const report = selectedReportType();
  if (!report || !canExportReport(report)) return;
  if (report.value === "summary") {
    const selectedMonth = els.reportMonthInput.value || localMonthForInput();
    window.location.href = `/api/proxy/reports/summary.xlsx?thang=${encodeURIComponent(selectedMonth)}`;
    return;
  }
  if (report.value === "vouchers") {
    const selectedMonth = els.reportMonthInput.value || localMonthForInput();
    window.location.href = `/api/proxy/reports/vouchers.xlsx?thang=${encodeURIComponent(selectedMonth)}`;
    return;
  }
  if (report.value === "orders") {
    const fromDate = els.reportFromInput.value || localDateForInput();
    const toDate = els.reportToInput.value || fromDate;
    window.location.href = `/api/proxy/reports/orders.xlsx?tuNgay=${encodeURIComponent(fromDate)}&denNgay=${encodeURIComponent(toDate)}`;
    return;
  }
  if (report.value === "workPerformance") {
    const fromDate = els.reportFromInput.value || localDateForInput();
    const toDate = els.reportToInput.value || fromDate;
    window.location.href = `/api/proxy/reports/work-performance.xlsx?tuNgay=${encodeURIComponent(fromDate)}&denNgay=${encodeURIComponent(toDate)}`;
    return;
  }
  if (report.value === "driverRevenue") {
    const fromDate = els.reportFromInput.value || localDateForInput();
    const toDate = els.reportToInput.value || fromDate;
    window.location.href = `/api/proxy/reports/driver-revenue.xlsx?tuNgay=${encodeURIComponent(fromDate)}&denNgay=${encodeURIComponent(toDate)}`;
    return;
  }
  if (report.value === "customers") {
    window.location.href = "/api/proxy/reports/customers.xlsx";
    return;
  }
  if (report.value === "debts") {
    window.location.href = "/api/proxy/reports/debts.xlsx";
  }
});
els.exportInvoicesReportButton?.addEventListener("click", () => {
  const range = reportDateRange(els.invoiceReportDateInput, els.invoiceReportDateToInput);
  if (!range) return;
  window.location.href = `/api/proxy/reports/invoices.xlsx?tuNgay=${encodeURIComponent(range.from)}&denNgay=${encodeURIComponent(range.to)}`;
});
els.openInvoiceGroupDialogButton?.addEventListener("click", openInvoiceGroupDialog);
els.invoiceGroupCancelButton?.addEventListener("click", () => els.invoiceGroupDialog.close());
els.invoiceGroupCandidateTable?.addEventListener("change", (event) => {
  if (!event.target.matches("input[data-invoice-group-order]")) return;
  const orderId = String(event.target.value || "");
  if (event.target.checked) state.invoiceGroupSelection.add(orderId);
  else state.invoiceGroupSelection.delete(orderId);
  const selected = selectedInvoiceGroupOrders();
  if (selected.length === 1) {
    const first = selected[0];
    for (const name of ["tenCongTy", "maSoThue", "diaChiHoaDon", "emailHoaDon"]) {
      if (!els.invoiceGroupForm.elements[name].value) els.invoiceGroupForm.elements[name].value = first[name] || "";
    }
  }
  renderInvoiceGroupCandidates();
});
els.invoiceGroupSearch?.addEventListener("input", (event) => {
  state.invoiceGroupSearch = event.target.value;
  renderInvoiceGroupCandidates();
});
els.invoiceGroupForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const rows = selectedInvoiceGroupOrders();
  if (rows.length < 2) {
    els.invoiceGroupFormStatus.textContent = "Vui lòng chọn ít nhất hai đơn hàng.";
    return;
  }
  const payload = Object.fromEntries(new FormData(els.invoiceGroupForm).entries());
  payload.orderIds = rows.map((row) => row.id);
  els.invoiceGroupSubmitButton.disabled = true;
  els.invoiceGroupFormStatus.textContent = "Đang tạo lệnh hóa đơn gộp...";
  try {
    await fetchJson("/api/proxy/invoice-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.invoiceGroupDialog.close();
    await loadData();
    switchView("invoiceOrders");
  } catch (error) {
    els.invoiceGroupFormStatus.textContent = error.message;
  } finally {
    els.invoiceGroupSubmitButton.disabled = false;
  }
});
els.exportDebtsReportButton?.addEventListener("click", () => {
  const range = reportDateRange(els.debtReportDateInput, els.debtReportDateToInput);
  if (!range) return;
  window.location.href = `/api/proxy/reports/debts.xlsx?tuNgay=${encodeURIComponent(range.from)}&denNgay=${encodeURIComponent(range.to)}`;
});
els.exportCommissionsReportButton?.addEventListener("click", () => {
  const range = reportDateRange(els.commissionReportDateInput, els.commissionReportDateToInput);
  if (!range) return;
  window.location.href = `/api/proxy/reports/commissions.xlsx?tuNgay=${encodeURIComponent(range.from)}&denNgay=${encodeURIComponent(range.to)}`;
});
els.orderCancelButton.addEventListener("click", () => {
  state.editingOrderId = "";
  els.orderForm.dataset.mode = "create";
  els.orderDialog.close();
});
els.orderDialog.addEventListener("close", () => {
  state.editingOrderId = "";
  els.orderForm.dataset.mode = "create";
});
els.assignVehicleCancelButton.addEventListener("click", () => els.assignVehicleDialog.close());
els.completeCancelButton.addEventListener("click", () => els.completeDialog.close());
els.detailsCloseButton.addEventListener("click", () => els.detailsDialog.close());

els.dashboardDateFilter?.addEventListener("change", (event) => {
  state.filters.dashboardDate = event.target.value || localDateForInput();
  renderDashboard();
});
els.customerSearch.addEventListener("input", (event) => {
  state.filters.customer = event.target.value;
  renderCustomers();
});
els.systemLogSearch?.addEventListener("input", (event) => {
  state.filters.systemLog = event.target.value;
  renderSystemLogs();
});
els.systemLogActionFilter?.addEventListener("change", (event) => {
  state.filters.systemLogAction = event.target.value;
  renderSystemLogs();
});
els.orderFeedbackSearch?.addEventListener("input", (event) => {
  state.filters.orderFeedback = event.target.value;
  renderOrderFeedback();
});
els.orderFeedbackStatusFilter?.addEventListener("change", (event) => {
  state.filters.orderFeedbackStatus = event.target.value;
  renderOrderFeedback();
});
els.orderFeedbackDateFromInput?.addEventListener("change", renderOrderFeedback);
els.orderFeedbackDateToInput?.addEventListener("change", renderOrderFeedback);
els.commissionOrderSearch?.addEventListener("input", (event) => {
  state.filters.commissionOrder = event.target.value;
  renderCommissionOrders();
});
els.commissionStatusFilter?.addEventListener("change", (event) => {
  state.filters.commissionStatus = event.target.value;
  renderCommissionOrders();
});
els.commissionReportDateInput?.addEventListener("change", renderCommissionOrders);
els.commissionReportDateToInput?.addEventListener("change", renderCommissionOrders);
els.contractSearch.addEventListener("input", (event) => {
  state.filters.contract = event.target.value;
  renderContracts();
});
els.voucherSearch.addEventListener("input", (event) => {
  state.filters.voucher = event.target.value;
  renderVouchers();
});
els.voucherCampaignFilter?.addEventListener("change", (event) => {
  state.filters.voucherCampaign = event.target.value;
  renderVouchers();
});
els.voucherTable?.addEventListener("click", (event) => {
  if (event.target.closest(".voucher-print-checkbox")) event.stopPropagation();
});
els.voucherTable?.addEventListener("change", (event) => {
  const checkbox = event.target.closest(".voucher-print-checkbox");
  if (!checkbox) return;
  const voucherId = String(checkbox.dataset.voucherPrintId || "");
  if (checkbox.checked) state.selectedVoucherIds.add(voucherId);
  else state.selectedVoucherIds.delete(voucherId);
  renderVouchers();
});
els.selectAllVouchersCheckbox?.addEventListener("change", (event) => {
  els.voucherTable.querySelectorAll(".voucher-print-checkbox").forEach((checkbox) => {
    const voucherId = String(checkbox.dataset.voucherPrintId || "");
    if (event.target.checked) state.selectedVoucherIds.add(voucherId);
    else state.selectedVoucherIds.delete(voucherId);
  });
  renderVouchers();
});
els.printSelectedVouchersButton?.addEventListener("click", () => {
  const voucherIds = [...state.selectedVoucherIds];
  if (!voucherIds.length) return;
  window.location.href = `/api/proxy/vouchers/print.pdf?voucherIds=${encodeURIComponent(voucherIds.join(","))}`;
});
els.deleteVoucherCampaignButton?.addEventListener("click", async () => {
  const campaign = state.filters.voucherCampaign || "";
  if (!campaign || !can("manage_benefits")) return;
  const campaignRows = state.vouchers.filter((row) => voucherCampaignName(row.tenVoucher) === campaign);
  if (!campaignRows.length) return;
  if (!confirm(`Xóa toàn bộ ${campaignRows.length} voucher thuộc chiến dịch "${campaign}"?\n\nThao tác này chỉ thực hiện được khi chưa có voucher nào được sử dụng.`)) return;
  els.deleteVoucherCampaignButton.disabled = true;
  els.deleteVoucherCampaignButton.textContent = "Đang xóa...";
  try {
    await fetchJson(`/api/proxy/vouchers/campaign?campaignName=${encodeURIComponent(campaign)}`, {
      method: "DELETE",
    });
    campaignRows.forEach((row) => state.selectedVoucherIds.delete(String(row.id)));
    state.filters.voucherCampaign = "";
    await loadData();
    switchView("vouchers");
  } catch (error) {
    if (els.syncStatus) els.syncStatus.textContent = error.message;
    renderVouchers();
  }
});
els.promotionSearch.addEventListener("input", (event) => {
  state.filters.promotion = event.target.value;
  renderPromotions();
});
els.orderSearch.addEventListener("input", (event) => {
  state.filters.order = event.target.value;
  renderOrders();
});
els.driverRemittanceDateInput?.addEventListener("change", () => {
  if (
    els.orderDateToInput?.value &&
    els.driverRemittanceDateInput.value > els.orderDateToInput.value
  ) {
    els.orderDateToInput.value = els.driverRemittanceDateInput.value;
  }
  renderOrders();
});
els.orderDateToInput?.addEventListener("change", () => {
  if (
    els.driverRemittanceDateInput?.value &&
    els.orderDateToInput.value < els.driverRemittanceDateInput.value
  ) {
    els.driverRemittanceDateInput.value = els.orderDateToInput.value;
  }
  renderOrders();
});
els.orderStatusFilter?.addEventListener("change", (event) => {
  state.filters.orderStatus = event.target.value;
  renderOrders();
});
els.driverNotificationStatusFilter?.addEventListener("change", (event) => {
  state.filters.driverNotificationStatus = event.target.value;
  renderOrders();
});
els.invoiceOrderSearch?.addEventListener("input", (event) => {
  state.filters.invoiceOrder = event.target.value;
  renderInvoiceOrders();
});
els.invoiceStatusFilter?.addEventListener("change", (event) => {
  state.filters.invoiceStatus = event.target.value;
  renderInvoiceOrders();
});
els.invoiceReportDateInput?.addEventListener("change", renderInvoiceOrders);
els.invoiceReportDateToInput?.addEventListener("change", renderInvoiceOrders);
els.debtOrderSearch?.addEventListener("input", (event) => {
  state.filters.debtOrder = event.target.value;
  renderDebtOrders();
});
els.debtStatusFilter?.addEventListener("change", (event) => {
  state.filters.debtStatus = event.target.value;
  renderDebtOrders();
});
els.debtReportDateInput?.addEventListener("change", renderDebtOrders);
els.debtReportDateToInput?.addEventListener("change", renderDebtOrders);
els.vehicleSearch.addEventListener("input", (event) => {
  state.filters.vehicle = event.target.value;
  renderVehicles();
});
els.franchiseVehicleSearch.addEventListener("input", (event) => {
  state.filters.franchiseVehicle = event.target.value;
  renderFranchiseVehicles();
});

els.customerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.customerSubmitButton.disabled = true;
  els.customerFormStatus.textContent = "Đang lưu...";
  try {
    const payload = Object.fromEntries(new FormData(els.customerForm).entries());
    payload.soDienThoai = requireCustomerPhone(payload.soDienThoai);
    payload.nhanVienNhap = state.currentUser?.displayName || state.currentUser?.username || payload.nhanVienNhap || "";
    const id = payload.id;
    delete payload.id;
    await fetchJson(id ? `/api/proxy/customers/${encodeURIComponent(id)}` : "/api/proxy/customers", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.customerDialog.close();
    await loadData();
  } catch (error) {
    els.customerFormStatus.textContent = error.message;
  } finally {
    els.customerSubmitButton.disabled = false;
  }
});

els.contractForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.contractSubmitButton.disabled = true;
  els.contractFormStatus.textContent = "Đang lưu...";
  try {
    const payload = Object.fromEntries(new FormData(els.contractForm).entries());
    const id = payload.id;
    delete payload.id;
    await fetchJson(id ? `/api/proxy/tours/${encodeURIComponent(id)}` : "/api/proxy/tours", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.contractDialog.close();
    await loadData();
  } catch (error) {
    els.contractFormStatus.textContent = error.message;
  } finally {
    els.contractSubmitButton.disabled = false;
  }
});

els.voucherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.voucherSubmitButton.disabled = true;
  els.voucherFormStatus.textContent = "Đang lưu...";
  try {
    const payload = Object.fromEntries(new FormData(els.voucherForm).entries());
    const id = payload.id;
    delete payload.id;
    payload.giaTri = payload.loaiGiaTri === "fixed" ? parseMoney(payload.giaTri) : Number(String(payload.giaTri || "0").replace(",", "."));
    await fetchJson(id ? `/api/proxy/vouchers/${encodeURIComponent(id)}` : "/api/proxy/vouchers", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.voucherDialog.close();
    await loadData();
    switchView("vouchers");
  } catch (error) {
    els.voucherFormStatus.textContent = error.message;
  } finally {
    els.voucherSubmitButton.disabled = false;
  }
});

els.voucherBatchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.voucherBatchSubmitButton.disabled = true;
  els.voucherBatchFormStatus.textContent = "Đang phát hành...";
  try {
    const payload = Object.fromEntries(new FormData(els.voucherBatchForm).entries());
    payload.menhGia = payload.loaiGiaTri === "fixed" ? parseMoney(payload.menhGia) : Number(String(payload.menhGia || "0").replace(",", "."));
    payload.soLuong = Number(payload.soLuong || 0);
    await fetchJson("/api/proxy/vouchers/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.voucherBatchDialog.close();
    await loadData();
    switchView("vouchers");
  } catch (error) {
    els.voucherBatchFormStatus.textContent = error.message;
  } finally {
    els.voucherBatchSubmitButton.disabled = false;
  }
});

els.promotionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.promotionSubmitButton.disabled = true;
  els.promotionFormStatus.textContent = "Đang lưu...";
  try {
    const payload = Object.fromEntries(new FormData(els.promotionForm).entries());
    const id = payload.id;
    delete payload.id;
    if (payload.khongGioiHanHanDung) payload.ngayHetHan = "";
    delete payload.khongGioiHanHanDung;
    payload.giaTri = payload.loaiGiaTri === "fixed" ? parseMoney(payload.giaTri) : Number(String(payload.giaTri || "0").replace(",", "."));
    await fetchJson(id ? `/api/proxy/promotions/${encodeURIComponent(id)}` : "/api/proxy/promotions", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.promotionDialog.close();
    await loadData();
    switchView("promotions");
  } catch (error) {
    els.promotionFormStatus.textContent = error.message;
  } finally {
    els.promotionSubmitButton.disabled = false;
  }
});

els.franchiseVehicleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const plateInput = els.franchiseVehicleForm.elements.bienKiemSoat;
  plateInput.value = String(plateInput.value || "").trim().toUpperCase();
  if (!franchisePlateIsValid(plateInput.value)) {
    els.franchiseVehicleFormStatus.textContent = "Biển số xe phải đúng định dạng 68A-123.45.";
    plateInput.focus();
    return;
  }
  els.franchiseVehicleSubmitButton.disabled = true;
  els.franchiseVehicleFormStatus.textContent = "Đang lưu...";
  try {
    const payload = Object.fromEntries(new FormData(els.franchiseVehicleForm).entries());
    const id = payload.id;
    delete payload.id;
    await fetchJson(id ? `/api/proxy/franchise-vehicles/${encodeURIComponent(id)}` : "/api/proxy/franchise-vehicles", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.franchiseVehicleDialog.close();
    await loadData();
    switchView("franchiseVehicles");
  } catch (error) {
    els.franchiseVehicleFormStatus.textContent = error.message;
  } finally {
    els.franchiseVehicleSubmitButton.disabled = false;
  }
});

els.openUserDialogButton?.addEventListener("click", () => {
  els.userForm.reset();
  els.userForm.elements.id.value = "";
  els.userForm.elements.role.value = "ke_toan";
  els.userForm.elements.status.value = "active";
  els.userForm.elements.password.required = true;
  els.userPasswordField.hidden = false;
  els.userDialogTitle.textContent = "Tạo tài khoản";
  els.userSubmitButton.textContent = "Lưu tài khoản";
  els.userFormStatus.textContent = "";
  els.userDialog.showModal();
});

els.userCancelButton?.addEventListener("click", () => els.userDialog.close());
els.systemCatalogForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!can("manage_system_catalogs")) return;
  const payload = Object.fromEntries(new FormData(els.systemCatalogForm).entries());
  els.systemCatalogSubmitButton.disabled = true;
  els.systemCatalogFormStatus.textContent = "Đang thêm danh mục...";
  try {
    await fetchJson("/api/proxy/system-catalogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.systemCatalogForm.reset();
    els.systemCatalogFormStatus.textContent = "Đã thêm danh mục.";
    await loadData();
    switchView("systemCatalogs");
  } catch (error) {
    els.systemCatalogFormStatus.textContent = error.message;
  } finally {
    els.systemCatalogSubmitButton.disabled = false;
  }
});
els.openChangePasswordButton?.addEventListener("click", () => {
  els.changePasswordForm.reset();
  els.changePasswordFormStatus.textContent = "";
  els.changePasswordDialog.showModal();
});
els.changePasswordCancelButton?.addEventListener("click", () => els.changePasswordDialog.close());
els.resetPasswordCancelButton?.addEventListener("click", () => els.resetPasswordDialog.close());
els.reopenCancelButton?.addEventListener("click", () => els.reopenDialog.close());

els.userForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.userSubmitButton.disabled = true;
  const payload = Object.fromEntries(new FormData(els.userForm).entries());
  payload.role = "ke_toan";
  payload.extraPermissions = [];
  const userId = payload.id || "";
  delete payload.id;
  els.userFormStatus.textContent = userId ? "Đang lưu thay đổi..." : "Đang tạo tài khoản...";
  try {
    if (userId) delete payload.password;
    await fetchJson(userId ? `/api/proxy/users/${encodeURIComponent(userId)}` : "/api/proxy/users", {
      method: userId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (userId && String(state.currentUser?.id || "") === String(userId)) {
      state.currentUser = { ...state.currentUser, ...payload };
      showApp();
    }
    els.userDialog.close();
    await loadData();
  } catch (error) {
    els.userFormStatus.textContent = error.message;
  } finally {
    els.userSubmitButton.disabled = false;
  }
});

els.changePasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(els.changePasswordForm).entries());
  if (payload.newPassword !== payload.confirmPassword) {
    els.changePasswordFormStatus.textContent = "Mật khẩu mới nhập lại không khớp.";
    return;
  }
  delete payload.confirmPassword;
  els.changePasswordSubmitButton.disabled = true;
  els.changePasswordFormStatus.textContent = "Đang đổi mật khẩu...";
  try {
    await fetchJson("/api/proxy/me/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.changePasswordDialog.close();
    clearAuth("Đã đổi mật khẩu. Vui lòng đăng nhập lại bằng mật khẩu mới.");
  } catch (error) {
    els.changePasswordFormStatus.textContent = error.message;
  } finally {
    els.changePasswordSubmitButton.disabled = false;
  }
});

els.resetPasswordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(els.resetPasswordForm).entries());
  if (payload.newPassword !== payload.confirmPassword) {
    els.resetPasswordFormStatus.textContent = "Mật khẩu mới nhập lại không khớp.";
    return;
  }
  const userId = payload.userId;
  els.resetPasswordSubmitButton.disabled = true;
  els.resetPasswordFormStatus.textContent = "Đang reset mật khẩu...";
  try {
    await fetchJson(`/api/proxy/users/${encodeURIComponent(userId)}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword: payload.newPassword }),
    });
    els.resetPasswordDialog.close();
    await loadData();
  } catch (error) {
    els.resetPasswordFormStatus.textContent = error.message;
  } finally {
    els.resetPasswordSubmitButton.disabled = false;
  }
});

els.reopenForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const orderId = els.reopenForm.elements.orderId.value;
  els.reopenSubmitButton.disabled = true;
  els.reopenFormStatus.textContent = "Đang gửi yêu cầu...";
  try {
    const payload = { reason: els.reopenForm.elements.reason.value };
    await fetchJson(`/api/proxy/orders/${encodeURIComponent(orderId)}/reopen-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.reopenDialog.close();
    await loadData();
  } catch (error) {
    els.reopenFormStatus.textContent = error.message;
  } finally {
    els.reopenSubmitButton.disabled = false;
  }
});

els.orderForm.addEventListener("input", (event) => {
  if (event.target.name === "ngayGioDi") {
    event.target.value = formatDateTimeTyping(event.target.value);
    setDateTimeInputValidity(event.target);
  }
  if (event.target.classList?.contains("money-input") && shouldFormatAsMoney(event.target)) formatMoneyInput(event.target);
  if (event.target === els.orderCustomerPhone) {
    fillOrderCustomer(findCustomerByPhone(event.target.value));
  }
  if (event.target.dataset?.passengerField === "soDienThoai") {
    fillSharedPassengerCustomer(event.target.dataset.passengerIndex, findCustomerByPhone(event.target.value));
    syncSharedPassengerPhoneGate(event.target.dataset.passengerIndex);
  }
  if (event.target === els.ticketCountInput) {
    const visibleDrafts = snapshotSharedPassengerFields();
    if (visibleDrafts.length) els.sharedPassengerList._passengerDrafts = visibleDrafts;
    const drafts = els.sharedPassengerList._passengerDrafts || [];
    renderSharedPassengerFields();
    populateSharedPassengerFields(drafts.slice(0, Math.max(Number(els.ticketCountInput.value || 0), 0)));
  }
  if (event.target.name === "giamGia") {
    const wrap = document.querySelector("#manualDiscountNoteWrap");
    const note = els.orderForm.elements.ghiChuGiamGia;
    const active = parseMoney(event.target.value) > 0;
    if (wrap) wrap.hidden = !active;
    if (wrap) wrap.classList.toggle("required", active);
    if (note) note.required = active;
  }
  if (event.target.name === "phuThu") {
    const wrap = document.querySelector("#surchargeReasonWrap");
    const reason = els.orderForm.elements.lyDoPhuThu;
    const active = selectedContractType() !== "xe_ghep" && parseMoney(event.target.value) > 0;
    if (wrap) wrap.hidden = !active;
    if (wrap) wrap.classList.toggle("required", active);
    if (reason) reason.required = active;
  }
  if (event.target.dataset?.passengerField === "giamGia") {
    const index = event.target.dataset.passengerIndex;
    const wrap = els.sharedPassengerList.querySelector(`[data-passenger-discount-note="${index}"]`);
    const note = els.sharedPassengerList.querySelector(`[data-passenger-field="ghiChuGiamGia"][data-passenger-index="${index}"]`);
    const active = parseMoney(event.target.value) > 0;
    if (wrap) wrap.hidden = !active;
    if (wrap) wrap.classList.toggle("required", active);
    if (note) note.required = active;
  }
  if (event.target.dataset?.passengerField === "phuThu") {
    const index = event.target.dataset.passengerIndex;
    const wrap = els.sharedPassengerList.querySelector(`[data-passenger-surcharge-reason="${index}"]`);
    const reason = els.sharedPassengerList.querySelector(`[data-passenger-field="lyDoPhuThu"][data-passenger-index="${index}"]`);
    const active = parseMoney(event.target.value) > 0;
    if (wrap) wrap.hidden = !active;
    if (wrap) wrap.classList.toggle("required", active);
    if (reason) reason.required = active;
  }
  if (event.target.classList?.contains("money-input") || event.target === els.ticketCountInput) updateOrderPaymentSummary();
});

els.orderForm.addEventListener("change", (event) => {
  if (event.target.name === "ngayGioDi") {
    const normalized = normalizeDateTimeInput(event.target.value);
    if (normalized) event.target.value = normalized;
    setDateTimeInputValidity(event.target);
  }
  if (event.target.dataset?.passengerField === "yeuCauHoaDon") {
    const section = event.target.closest(".shared-passenger-section");
    section?.querySelector(".shared-invoice-fields")?.classList.toggle("active", event.target.checked);
    for (const fieldName of ["tenCongTy", "maSoThue", "diaChiHoaDon"]) {
      const field = section?.querySelector(`[data-passenger-field="${fieldName}"]`);
      if (field) {
        field.required = event.target.checked;
        field.closest("label")?.classList.toggle("required", event.target.checked);
      }
    }
    updateOrderPaymentSummary();
  }
  if (event.target.dataset?.passengerField === "congNo") {
    const index = event.target.dataset.passengerIndex;
    const fields = els.sharedPassengerList.querySelector(`[data-passenger-debt-fields="${index}"]`);
    const owner = els.sharedPassengerList.querySelector(`[data-passenger-field="congNoChoAi"][data-passenger-index="${index}"]`);
    if (fields) fields.hidden = !event.target.checked;
    if (owner) {
      owner.required = event.target.checked;
      owner.closest("label")?.classList.toggle("required", event.target.checked);
    }
  }
  if (event.target.dataset?.passengerBenefit === "voucherIds") {
    if (event.target.checked) {
      const duplicated = sharedVoucherCheckboxes().some(
        (checkbox) =>
          checkbox !== event.target &&
          checkbox.checked &&
          checkbox.value === event.target.value &&
          checkbox.dataset.passengerIndex !== event.target.dataset.passengerIndex,
      );
      if (duplicated) {
        event.target.checked = false;
        els.orderFormStatus.textContent = `Voucher ${sharedVoucherLabel(event.target.value)} đã được chọn cho khách lẻ khác.`;
      } else {
        els.orderFormStatus.textContent = "";
      }
    }
    syncSharedVoucherAvailability();
  }
  updateOrderPaymentSummary();
});

els.assignVehicleForm.addEventListener("input", (event) => {
  if (["ngayGioDi", "ngayGioDuKienKetThuc"].includes(event.target.name)) {
    event.target.value = formatDateTimeTyping(event.target.value);
    setDateTimeInputValidity(event.target);
    if (validateDateTimeInputs(els.assignVehicleForm)) renderVehicleOptions();
  }
  if (event.target === els.franchiseCommissionInput) {
    updateVehicleWarning();
  }
});

els.assignVehicleForm.addEventListener("change", (event) => {
  if (["ngayGioDi", "ngayGioDuKienKetThuc"].includes(event.target.name)) {
    const normalized = normalizeDateTimeInput(event.target.value);
    if (normalized) event.target.value = normalized;
    setDateTimeInputValidity(event.target);
    if (validateDateTimeInputs(els.assignVehicleForm)) renderVehicleOptions();
  }
});

function filterBenefitPicker(kind, value) {
  const isVoucher = kind === "voucher";
  if (!isVoucher && kind !== "promotion") return;
  state.orderBenefits[isVoucher ? "voucherSearch" : "promotionSearch"] = value;
  const picker = isVoucher ? els.orderVoucherPicker : els.orderPromotionPicker;
  const query = normalize(value);
  let visibleCount = 0;
  picker.querySelectorAll(".benefit-option").forEach((option) => {
    const visible = !query || normalize(option.textContent).includes(query);
    option.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  const empty = picker.querySelector(".benefit-search-empty");
  if (empty) empty.hidden = visibleCount > 0;
}

document.addEventListener("compositionstart", (event) => {
  if (event.target.dataset?.benefitSearch) event.target.dataset.composing = "true";
});

document.addEventListener("compositionend", (event) => {
  const kind = event.target.dataset?.benefitSearch;
  if (!kind) return;
  event.target.dataset.composing = "false";
  filterBenefitPicker(kind, event.target.value);
});

document.addEventListener("input", (event) => {
  const benefitSearchKind = event.target.dataset?.benefitSearch;
  if (benefitSearchKind) {
    state.orderBenefits[benefitSearchKind === "voucher" ? "voucherSearch" : "promotionSearch"] = event.target.value;
    if (event.isComposing || event.target.dataset.composing === "true") return;
    filterBenefitPicker(benefitSearchKind, event.target.value);
    return;
  }
  if (event.target.closest?.(".benefit-picker")) updateBenefitPreview();
  if (event.target.classList?.contains("date-input")) event.target.value = formatDateOnlyTyping(event.target.value);
  if (event.target.classList?.contains("money-input") && shouldFormatAsMoney(event.target)) formatMoneyInput(event.target);
});

document.addEventListener("change", (event) => {
  if (event.target.dataset?.benefitKind) {
    const key = event.target.dataset.benefitKind === "voucher" ? "voucherIds" : "promotionIds";
    const current = new Set(state.orderBenefits[key]);
    if (event.target.checked) current.add(event.target.value);
    else current.delete(event.target.value);
    state.orderBenefits[key] = [...current];
    renderOrderBenefits();
    updateOrderPaymentSummary();
    return;
  }
  if (event.target.classList?.contains("date-input")) event.target.value = normalizeDateOnlyInput(event.target.value);
  if (event.target.name === "loaiGiaTri") {
    const valueInput = event.target.form?.elements?.giaTri;
    if (!valueInput) return;
    valueInput.value = event.target.value === "fixed" ? formatMoney(valueInput.value) : String(valueInput.value || "").replace(/,/g, "");
  }
});

els.completeForm.addEventListener("change", (event) => {
  if (event.target.name === "ngayGioHoanThanh") {
    const normalized = normalizeDateTimeInput(event.target.value);
    if (normalized) event.target.value = normalized;
    const order = state.orders.find(
      (row) => String(row.id) === String(els.completeForm.elements.orderId.value || ""),
    );
    const completedAt = parseDateTime(normalized);
    const startedAt = parseDateTime(order?.ngayGioDi);
    event.target.setCustomValidity(
      completedAt && startedAt && completedAt < startedAt
        ? "Giờ hoàn thành không được trước giờ đi."
        : "",
    );
  }
});
els.completeForm.addEventListener("input", (event) => {
  if (event.target.name === "ngayGioHoanThanh") event.target.value = formatDateTimeTyping(event.target.value);
});
els.orderVehicleSelect.addEventListener("change", () => {
  updateVehicleWarning();
  updateOrderPaymentSummary();
});
els.orderContractSelect.addEventListener("change", applySelectedContractDefaults);
els.orderForm.querySelectorAll('input[name="loaiHopDong"]').forEach((input) => {
  input.addEventListener("change", updateOrderTypeUI);
});
els.invoiceToggle.addEventListener("change", () => {
  els.invoiceFields.classList.toggle("active", els.invoiceToggle.checked);
  for (const name of ["tenCongTy", "maSoThue", "diaChiHoaDon"]) {
    const field = els.orderForm.elements[name];
    if (field) {
      field.required = els.invoiceToggle.checked;
      field.closest("label")?.classList.toggle("required", els.invoiceToggle.checked);
    }
  }
  updateOrderPaymentSummary();
});
document.querySelector("#debtToggle")?.addEventListener("change", (event) => {
  const fields = document.querySelector("#debtFields");
  const owner = document.querySelector("#debtOwnerInput");
  if (fields) fields.hidden = !event.target.checked;
  if (owner) owner.required = event.target.checked;
  owner?.closest("label")?.classList.toggle("required", event.target.checked);
});

els.orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateDateTimeInputs(els.orderForm)) {
    els.orderFormStatus.textContent = "Vui lòng nhập thời gian khởi hành dự kiến của đơn hàng.";
    els.orderForm.reportValidity();
    return;
  }
  els.orderSubmitButton.disabled = true;
  els.orderFormStatus.textContent = "Đang lưu...";
  try {
    const payload = Object.fromEntries(new FormData(els.orderForm).entries());
    payload.ngayGioDi = normalizeDateTimeInput(payload.ngayGioDi);
    payload.ngayGioDuKienKetThuc = "";
    payload.bienKiemSoat = "";
    payload.tyLeNopLai = 0;
    payload.giaTien = parseMoney(payload.giaTien);
    payload.giamGia = parseMoney(payload.giamGia);
    payload.phuThu = parseMoney(payload.phuThu);
    payload.daCoc = parseMoney(payload.daCoc);
    payload.soVe = Number(payload.soVe || 0);
    if (!payload.ngayGioDi) throw new Error("Vui lòng nhập ngày giờ đi theo định dạng dd/MM/yyyy HH:mm.");
    payload.yeuCauHoaDon = selectedContractType() === "xe_ghep" ? false : els.invoiceToggle.checked;
    payload.congNo = selectedContractType() === "xe_ghep" ? false : Boolean(document.querySelector("#debtToggle")?.checked);
    payload.congNoChoAi = payload.congNoChoAi || "";
    if (payload.congNo && !payload.congNoChoAi.trim()) throw new Error("Vui lòng nhập đối tượng ghi nhận công nợ.");
    if (payload.giamGia > 0 && !String(payload.ghiChuGiamGia || "").trim()) throw new Error("Vui lòng nhập ghi chú giảm giá thủ công.");
    if (selectedContractType() !== "xe_ghep" && payload.phuThu > 0 && !String(payload.lyDoPhuThu || "").trim()) {
      throw new Error("Vui lòng nhập lý do phụ thu.");
    }
    payload.voucherIds = selectedContractType() === "xe_ghep" ? [] : selectedBenefitIds(els.orderVoucherPicker);
    payload.promotionIds = selectedContractType() === "xe_ghep" ? [] : selectedBenefitIds(els.orderPromotionPicker);
    payload.khachXeGhep = selectedContractType() === "xe_ghep" ? collectSharedPassengers() : [];
    if (selectedContractType() === "xe_ghep") {
      payload.khachXeGhep.forEach((passenger, index) => {
        passenger.soDienThoai = requireCustomerPhone(passenger.soDienThoai, `Số điện thoại khách lẻ ${index + 1}`);
        if (!["B2C", "B2B"].includes(String(passenger.loaiKhach || "").toUpperCase())) {
          throw new Error(`Vui lòng chọn loại khách B2C/B2B cho khách lẻ ${index + 1}.`);
        }
      });
      const duplicateVoucherError = duplicateSharedVoucherMessage();
      if (duplicateVoucherError) throw new Error(duplicateVoucherError);
      const missingDiscountNote = payload.khachXeGhep.findIndex(
        (passenger) => Number(passenger.giamGia || 0) > 0 && !String(passenger.ghiChuGiamGia || "").trim(),
      );
      if (missingDiscountNote >= 0) throw new Error(`Vui lòng nhập ghi chú giảm giá thủ công cho khách lẻ ${missingDiscountNote + 1}.`);
      const missingSurchargeReason = payload.khachXeGhep.findIndex(
        (passenger) => Number(passenger.phuThu || 0) > 0 && !String(passenger.lyDoPhuThu || "").trim(),
      );
      if (missingSurchargeReason >= 0) throw new Error(`Vui lòng nhập lý do phụ thu cho khách lẻ ${missingSurchargeReason + 1}.`);
      const missingDebtOwner = payload.khachXeGhep.findIndex(
        (passenger) => passenger.congNo && !String(passenger.congNoChoAi || "").trim(),
      );
      if (missingDebtOwner >= 0) throw new Error(`Vui lòng nhập đối tượng công nợ cho khách lẻ ${missingDebtOwner + 1}.`);
      payload.khachHangId = "";
      payload.tenKhach = "";
      payload.soDienThoai = "";
      payload.soCCCD = "";
      payload.loaiKhachHang = "";
      payload.namSinh = "";
      payload.gioiTinh = "";
      payload.nguonKhach = "";
      payload.nhanVienNhap = "";
      payload.loaiKhach = "";
      payload.diemDon = "";
      payload.diemTra = "";
      payload.giaTien = 0;
      payload.giamGia = 0;
      payload.phuThu = 0;
      payload.lyDoPhuThu = "";
      payload.daCoc = 0;
      payload.tenCongTy = "";
      payload.maSoThue = "";
      payload.diaChiHoaDon = "";
      payload.emailHoaDon = "";
    } else {
      payload.soDienThoai = requireCustomerPhone(payload.soDienThoai, "Số điện thoại khách hàng");
    }
    const editingOrderId = state.editingOrderId || "";
    await fetchJson(editingOrderId ? `/api/proxy/orders/${encodeURIComponent(editingOrderId)}` : "/api/proxy/orders", {
      method: editingOrderId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    state.editingOrderId = "";
    els.orderForm.dataset.mode = "create";
    els.orderDialog.close();
    await loadData();
    switchView("orders");
  } catch (error) {
    els.orderFormStatus.textContent = error.message;
  } finally {
    els.orderSubmitButton.disabled = false;
  }
});

els.assignVehicleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!validateDateTimeInputs(els.assignVehicleForm)) {
    els.assignVehicleForm.reportValidity();
    return;
  }
  els.assignVehicleSubmitButton.disabled = true;
  els.assignVehicleFormStatus.textContent = "Đang lưu điều xe...";
  try {
    const payload = Object.fromEntries(new FormData(els.assignVehicleForm).entries());
    const orderId = payload.orderId;
    payload.ngayGioDi = normalizeDateTimeInput(payload.ngayGioDi);
    payload.ngayGioDuKienKetThuc = normalizeDateTimeInput(payload.ngayGioDuKienKetThuc);
    if (!payload.ngayGioDi || !payload.ngayGioDuKienKetThuc) {
      throw new Error("Vui lòng nhập ngày giờ theo định dạng dd/MM/yyyy HH:mm.");
    }
    payload.tyLeNopLai = Number(payload.tyLeNopLai || 0);
    delete payload.orderId;
    if (payload.bienKiemSoat && els.orderVehicleSelect.selectedOptions[0]?.dataset.noDriver === "1") {
      throw new Error("Xe này có lên ca nhưng chưa có lái xe. Vui lòng cập nhật lái xe trước khi lưu.");
    }
    if (payload.bienKiemSoat && conflictingOrder(payload.bienKiemSoat, payload.ngayGioDi, payload.ngayGioDuKienKetThuc, orderId)) {
      throw new Error("Xe đang bận trong khung giờ này. Vui lòng chọn xe khác hoặc đổi giờ.");
    }
    await fetchJson(`/api/proxy/orders/${encodeURIComponent(orderId)}/assign-vehicle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.assignVehicleDialog.close();
    await loadData();
    switchView("orders");
  } catch (error) {
    els.assignVehicleFormStatus.textContent = error.message;
  } finally {
    els.assignVehicleSubmitButton.disabled = false;
  }
});

els.completeForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const orderId = els.completeForm.elements.orderId.value;
  els.completeSubmitButton.disabled = true;
  try {
    const completedAt = normalizeDateTimeInput(els.completeForm.elements.ngayGioHoanThanh.value);
    if (!completedAt) throw new Error("Vui lòng nhập ngày giờ hoàn thành theo định dạng dd/MM/yyyy HH:mm.");
    const order = state.orders.find((row) => String(row.id) === String(orderId));
    const completedDate = parseDateTime(completedAt);
    const startedDate = parseDateTime(order?.ngayGioDi);
    if (!completedDate || !startedDate) throw new Error("Ngày giờ hoàn thành hoặc giờ đi không hợp lệ.");
    if (completedDate < startedDate) throw new Error("Giờ hoàn thành không được trước giờ đi.");
    await fetchJson(`/api/proxy/orders/${encodeURIComponent(orderId)}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ngayGioHoanThanh: completedAt }),
    });
    els.completeDialog.close();
    await loadData();
  } catch (error) {
    els.completeOrderLabel.textContent = error.message;
  } finally {
    els.completeSubmitButton.disabled = false;
  }
});

document.body.addEventListener("click", (event) => {
  const target = event.target.closest("button");
  if (target?.dataset.action === "toggle-driver-notification" && canOperateOrders() && can("dispatch")) {
    const orderId = target.dataset.orderId;
    const status = target.dataset.status;
    target.disabled = true;
    fetchJson(`/api/proxy/orders/${encodeURIComponent(orderId)}/driver-notification-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trangThaiGuiTaiXe: status }),
    })
      .then(() => loadData())
      .catch((error) => {
        alert(error.message);
        target.disabled = false;
      });
  }
  if (target?.dataset.action === "toggle-remittance-status" && can("manage_remittance_status")) {
    const orderId = target.dataset.orderId;
    const status = target.dataset.status;
    if (!confirm(`Xác nhận chuyển đơn ${orderId} sang trạng thái “${status}”?`)) return;
    target.disabled = true;
    fetchJson(`/api/proxy/orders/${encodeURIComponent(orderId)}/remittance-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trangThaiNopTien: status }),
    })
      .then(() => loadData())
      .catch((error) => {
        alert(error.message);
        target.disabled = false;
      });
  }
  if (target?.dataset.action === "assign-order" && canOperateOrders()) openAssignVehicleDialog(target.dataset.orderId);
  if (target?.dataset.action === "complete-order" && canOperateOrders()) openCompleteDialog(target.dataset.orderId);
  if (target?.dataset.action === "delete-order" && canOperateOrders()) {
    const orderId = target.dataset.orderId;
    const order = state.orders.find((row) => String(row.id) === String(orderId));
    if (!order || orderIsDone(order)) return;
    if (!confirm(`Xóa đơn hàng ${orderId}? Dữ liệu ưu đãi và khách xe ghép thuộc đơn này cũng sẽ được gỡ bỏ.`)) return;
    target.disabled = true;
    fetchJson(`/api/proxy/orders/${encodeURIComponent(orderId)}`, { method: "DELETE" })
      .then(() => loadData())
      .catch((error) => {
        alert(error.message);
        target.disabled = false;
      });
  }
  if (target?.dataset.action === "request-reopen" && canOperateOrders()) openReopenDialog(target.dataset.orderId);
  if (target?.dataset.action === "approve-reopen") reviewReopenRequest(target.dataset.requestId, true);
  if (target?.dataset.action === "reject-reopen") reviewReopenRequest(target.dataset.requestId, false);
  if (target?.dataset.action === "open-order") openOrderDetails(target.dataset.orderId);
  if (target?.dataset.action === "mark-invoice-status") updateInvoiceOrderStatus(target.dataset.orderId, target.dataset.status, target.dataset.entityType);
  if (target?.dataset.action === "mark-debt-status") updateDebtOrderStatus(target.dataset.orderId, target.dataset.status, target.dataset.entityType);
  if (target?.dataset.action === "mark-commission-status") updateCommissionOrderStatus(target.dataset.orderId, target.dataset.status);
  if (target?.dataset.action === "open-edit-user") openEditUserDialog(target.dataset.userId);
  if (target?.dataset.action === "delete-system-catalog") {
    const catalogId = target.dataset.catalogId;
    const value = target.dataset.catalogValue || "giá trị này";
    if (!catalogId || !window.confirm(`Xóa “${value}” khỏi danh mục? Dữ liệu cũ đã sử dụng giá trị này vẫn được giữ nguyên.`)) return;
    target.disabled = true;
    fetchJson(`/api/proxy/system-catalogs/${encodeURIComponent(catalogId)}`, { method: "DELETE" })
      .then(() => loadData())
      .then(() => switchView("systemCatalogs"))
      .catch((error) => window.alert(error.message))
      .finally(() => { target.disabled = false; });
  }
  if (target?.dataset.action === "delete-cskh-shift-report") {
    const reportDate = target.dataset.reportDate || "";
    const reportShift = target.dataset.reportShift || "";
    const reportEmployee = target.dataset.reportEmployee || "";
    if (!window.confirm(`Xóa báo cáo ${reportDate} - ${reportShift} của ${reportEmployee}? Dòng dữ liệu vẫn được lưu để admin tra cứu lịch sử.`)) return;
    const parts = reportDate.split("/");
    const apiDate = parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : reportDate;
    target.disabled = true;
    fetchJson("/api/proxy/cskh-shift-reports/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ngay: apiDate,
        caLamViec: Number(String(reportShift).replace(/\D/g, "")),
        nhanVienTruc: reportEmployee,
      }),
    })
      .then(async () => {
        const result = await fetchJson("/api/proxy/cskh-shift-reports", {}, 90000);
        state.cskhShiftReports = result.rows || [];
        renderCskhShiftReports();
        els.cskhShiftReportStatus.textContent = "Đã xóa báo cáo ca. Bạn có thể khai báo lại.";
      })
      .catch((error) => window.alert(error.message))
      .finally(() => { target.disabled = false; });
  }
  if (target?.dataset.action === "open-reset-password") openResetPasswordDialog(target.dataset.userId);
  if (target?.dataset.action === "dashboard-new-order" && canOperateOrders()) openOrderDialog();
  if (target?.dataset.action === "dashboard-calendar") switchView("calendar");
  if (target?.dataset.action === "dashboard-orders") switchView("orders");
  if (target?.dataset.action === "dashboard-vouchers") switchView("vouchers");
  if (target?.dataset.action === "toggle-voucher-picker") {
    state.orderBenefits.voucherOpen = !state.orderBenefits.voucherOpen;
    renderOrderBenefits();
  }
  if (target?.dataset.action === "toggle-promotion-picker") {
    state.orderBenefits.promotionOpen = !state.orderBenefits.promotionOpen;
    renderOrderBenefits();
  }
  if (target?.dataset.action === "remove-benefit") {
    const key = target.dataset.kind === "voucher" ? "voucherIds" : "promotionIds";
    state.orderBenefits[key] = state.orderBenefits[key].filter((id) => String(id) !== String(target.dataset.id));
    renderOrderBenefits();
    updateOrderPaymentSummary();
  }
  if (target) return;
  const row = event.target.closest("tr[data-detail-type]");
  if (!row) return;
  if (row.dataset.detailType === "customer") openCustomerDetails(row.dataset.id);
  if (row.dataset.detailType === "contract") openContractDetails(row.dataset.id);
  if (row.dataset.detailType === "voucher") openVoucherDetails(row.dataset.id);
  if (row.dataset.detailType === "promotion") openPromotionDetails(row.dataset.id);
  if (row.dataset.detailType === "franchiseVehicle") openFranchiseVehicleDetails(row.dataset.id);
  if (row.dataset.detailType === "order") {
    const order = state.orders.find((item) => String(item.id) === String(row.dataset.id));
    if (canEditOrderInline(order)) openOrderEditDialog(row.dataset.id);
    else openOrderDetails(row.dataset.id);
  }
});

els.detailsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const type = els.detailsForm.elements.type.value;
  if (type === "order") return;
  if ((type === "voucher" || type === "promotion") && !can("manage_benefits")) {
    els.detailsStatus.textContent = "Ban khong co quyen sua voucher/khuyen mai.";
    return;
  }
  const id = els.detailsForm.elements.id.value;
  const payload = Object.fromEntries(new FormData(els.detailsForm).entries());
  delete payload.id;
  delete payload.type;
  if (type === "customer") {
    try {
      payload.soDienThoai = requireCustomerPhone(payload.soDienThoai);
    } catch (error) {
      els.detailsStatus.textContent = error.message;
      return;
    }
  }
  if (type === "orderFeedback") {
    payload.diemDanhGia = Number(payload.diemDanhGia || 0);
  }
  if (type === "franchiseVehicle") {
    payload.bienKiemSoat = String(payload.bienKiemSoat || "").trim().toUpperCase();
    if (!franchisePlateIsValid(payload.bienKiemSoat)) {
      els.detailsStatus.textContent = "Biển số xe phải đúng định dạng 68A-123.45.";
      return;
    }
  }
  if (type === "voucher" || type === "promotion") {
    if (payload.khongGioiHanHanDung) payload.ngayHetHan = "";
    delete payload.khongGioiHanHanDung;
    payload.giaTri = payload.loaiGiaTri === "fixed" ? parseMoney(payload.giaTri) : Number(String(payload.giaTri || "0").replace(",", "."));
  }
  els.detailsSaveButton.disabled = true;
  els.detailsStatus.textContent = "Đang lưu...";
  try {
    const detailEndpoint =
      type === "customer"
        ? `/api/proxy/customers/${encodeURIComponent(id)}`
        : type === "contract"
          ? `/api/proxy/tours/${encodeURIComponent(id)}`
          : type === "voucher"
            ? `/api/proxy/vouchers/${encodeURIComponent(id)}`
            : type === "promotion"
              ? `/api/proxy/promotions/${encodeURIComponent(id)}`
              : type === "orderFeedback"
                ? `/api/proxy/order-feedback/${encodeURIComponent(id)}`
              : `/api/proxy/franchise-vehicles/${encodeURIComponent(id)}`;
    await fetchJson(detailEndpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    els.detailsDialog.close();
    await loadData();
  } catch (error) {
    els.detailsStatus.textContent = error.message;
  } finally {
    els.detailsSaveButton.disabled = false;
  }
});

els.detailsDeleteButton.addEventListener("click", async () => {
  const type = els.detailsForm.elements.type.value;
  if ((type === "voucher" || type === "promotion") && !can("manage_benefits")) {
    els.detailsStatus.textContent = "Ban khong co quyen xoa voucher/khuyen mai.";
    return;
  }
  const id = els.detailsForm.elements.id.value;
  if (type === "order") {
    const order = state.orders.find((row) => String(row.id) === String(id));
    if (!order || orderIsDone(order) || !canOperateOrders()) {
      els.detailsStatus.textContent = "Chỉ được xóa đơn hàng chưa hoàn thành.";
      return;
    }
  }
  const deleteLabels = {
    customer: "khách hàng",
    contract: "hợp đồng/tuyến",
    voucher: "voucher",
    promotion: "chương trình khuyến mãi",
    order: "đơn hàng",
    franchiseVehicle: "xe thương quyền",
  };
  const label = deleteLabels[type] || "dữ liệu";
  if (!confirm(`Xóa ${label} này?`)) return;
  els.detailsDeleteButton.disabled = true;
  els.detailsStatus.textContent = "Đang xóa...";
  try {
    const detailEndpoint =
      type === "customer"
        ? `/api/proxy/customers/${encodeURIComponent(id)}`
        : type === "contract"
          ? `/api/proxy/tours/${encodeURIComponent(id)}`
          : type === "voucher"
            ? `/api/proxy/vouchers/${encodeURIComponent(id)}`
            : type === "promotion"
              ? `/api/proxy/promotions/${encodeURIComponent(id)}`
              : type === "order"
                ? `/api/proxy/orders/${encodeURIComponent(id)}`
                : `/api/proxy/franchise-vehicles/${encodeURIComponent(id)}`;
    await fetchJson(detailEndpoint, {
      method: "DELETE",
    });
    els.detailsDialog.close();
    await loadData();
  } catch (error) {
    els.detailsStatus.textContent = error.message;
  } finally {
    els.detailsDeleteButton.disabled = false;
  }
});

enhanceDateTimeControls();
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof Element) enhanceDateTimeControls(node);
    });
  });
}).observe(document.body, { childList: true, subtree: true });

els.calendarDateInput.value = localDateForInput();
els.driverRemittanceDateInput.value = localDateForInput();
if (els.orderDateToInput) els.orderDateToInput.value = localDateForInput();
if (els.reportMonthInput) els.reportMonthInput.value = localMonthForInput();
if (els.reportFromInput) els.reportFromInput.value = localDateForInput();
if (els.cskhShiftReportFromInput) els.cskhShiftReportFromInput.value = localDateForInput();
if (els.cskhShiftReportToInput) els.cskhShiftReportToInput.value = localDateForInput();
if (els.reportToInput) els.reportToInput.value = localDateForInput();
if (els.invoiceReportDateInput) els.invoiceReportDateInput.value = localDateForInput();
if (els.invoiceReportDateToInput) els.invoiceReportDateToInput.value = localDateForInput();
if (els.debtReportDateInput) els.debtReportDateInput.value = localDateForInput();
if (els.debtReportDateToInput) els.debtReportDateToInput.value = localDateForInput();
if (els.commissionReportDateInput) els.commissionReportDateInput.value = localDateForInput();
if (els.commissionReportDateToInput) els.commissionReportDateToInput.value = localDateForInput();
if (els.orderFeedbackDateFromInput) els.orderFeedbackDateFromInput.value = localDateForInput();
if (els.orderFeedbackDateToInput) els.orderFeedbackDateToInput.value = localDateForInput();
updateReportControls();
els.calendarDateInput.addEventListener("change", renderCalendar);
els.calendarTodayButton.addEventListener("click", () => {
  els.calendarDateInput.value = localDateForInput();
  renderCalendar();
});
els.calendarAvailabilityFilter.addEventListener("change", renderCalendar);
els.calendarOwnershipFilter?.addEventListener("change", renderCalendar);
els.dispatchTable?.addEventListener("dragstart", (event) => {
  const row = event.target.closest(".calendar-sortable-row");
  if (!row || !canView("calendar")) return;
  draggedCalendarRow = row;
  draggedCalendarInitialOrder = calendarVehiclePlateOrder().join("|");
  row.classList.add("dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", row.dataset.vehiclePlate || "");
});
els.dispatchTable?.addEventListener("dragover", (event) => {
  if (!draggedCalendarRow) return;
  const target = event.target.closest(".calendar-sortable-row");
  if (!target || target === draggedCalendarRow) return;
  if (target.dataset.vehicleSource !== draggedCalendarRow.dataset.vehicleSource) return;
  event.preventDefault();
  const rect = target.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;
  target.parentNode.insertBefore(draggedCalendarRow, insertAfter ? target.nextSibling : target);
});
els.dispatchTable?.addEventListener("drop", async (event) => {
  if (!draggedCalendarRow) return;
  event.preventDefault();
  const row = draggedCalendarRow;
  draggedCalendarRow = null;
  row.classList.remove("dragging");
  const changed = draggedCalendarInitialOrder !== calendarVehiclePlateOrder().join("|");
  draggedCalendarInitialOrder = "";
  if (changed) await saveCalendarVehicleOrder();
});
els.dispatchTable?.addEventListener("dragend", async () => {
  if (!draggedCalendarRow) return;
  const row = draggedCalendarRow;
  draggedCalendarRow = null;
  row.classList.remove("dragging");
  const changed = draggedCalendarInitialOrder !== calendarVehiclePlateOrder().join("|");
  draggedCalendarInitialOrder = "";
  if (changed) await saveCalendarVehicleOrder();
});
els.calendarResetOrderButton?.addEventListener("click", async () => {
  if (!canView("calendar")) return;
  if (!confirm("Khôi phục thứ tự xe mặc định trong lịch điều xe?")) return;
  try {
    await fetchJson("/api/proxy/calendar-vehicle-order", { method: "DELETE" });
    state.calendarVehicleOrder = [];
    renderCalendar();
    if (els.syncStatus) els.syncStatus.textContent = "Đã khôi phục thứ tự xe mặc định.";
  } catch (error) {
    if (els.syncStatus) els.syncStatus.textContent = error.message;
  }
});

function renderOrders() {
  const departureDateFrom = nativeDateValue(els.driverRemittanceDateInput?.value || "");
  const departureDateTo = nativeDateValue(els.orderDateToInput?.value || "");
  const rows = state.orders
    .filter((row) => matches(row, state.filters.order))
    .filter((row) => dateKeyInRange(orderDateKey(row), departureDateFrom, departureDateTo))
    .filter((row) => {
      if (!state.filters.orderStatus) return true;
      if (state.filters.orderStatus === "completed") return orderIsDone(row);
      if (state.filters.orderStatus === "pending") return !orderIsDone(row);
      return true;
    })
    .filter((row) => {
      if (!state.filters.driverNotificationStatus) return true;
      if (state.filters.driverNotificationStatus === "driver-sent") {
        return normalize(row.trangThaiGuiTaiXe).includes("da gui tai xe");
      }
      if (state.filters.driverNotificationStatus === "driver-unsent") {
        return !normalize(row.trangThaiGuiTaiXe).includes("da gui tai xe");
      }
      return true;
    })
    .sort((left, right) => {
      const leftTime = parseDateTime(left.ngayGioDi)?.getTime() ?? Number.POSITIVE_INFINITY;
      const rightTime = parseDateTime(right.ngayGioDi)?.getTime() ?? Number.POSITIVE_INFINITY;
      return leftTime - rightTime || String(left.id || "").localeCompare(String(right.id || ""), "vi");
    });
  const summary = rows.reduce(
    (result, row) => {
      result.tripCount += 1;
      result.baseAmount += parseMoney(row.giaTien);
      result.surcharge += parseMoney(row.phuThu);
      result.discount += parseMoney(row.giamGia) + parseMoney(row.tongUuDai);
      result.vat += orderVatAmount(row);
      result.deposit += parseMoney(row.daCoc);
      result.amountDue += orderRevenueAmount(row);
      result.commission += parseMoney(row.soTienNopLai);
      const hasDebt = normalize(row.congNo).includes("co");
      let debtAmount = 0;
      if (hasDebt) {
        const storedDebt = String(row.soTienCongNo || "").trim();
        debtAmount = storedDebt
          ? parseMoney(storedDebt)
          : Math.max(orderRevenueAmount(row) + parseMoney(row.thueVAT) - parseMoney(row.daCoc), 0);
        result.debt += debtAmount;
      }
      result.actualReceipt += Math.max(
        orderRevenueAmount(row) + orderVatAmount(row) - parseMoney(row.daCoc) - debtAmount,
        0,
      );
      return result;
    },
    { tripCount: 0, baseAmount: 0, surcharge: 0, discount: 0, vat: 0, deposit: 0, amountDue: 0, actualReceipt: 0, commission: 0, debt: 0 },
  );
  if (els.orderSummaryTripCount) els.orderSummaryTripCount.textContent = summary.tripCount.toLocaleString("vi-VN");
  if (els.orderSummaryBaseAmount) els.orderSummaryBaseAmount.textContent = `${formatMoney(summary.baseAmount) || "0"} đ`;
  if (els.orderSummarySurcharge) els.orderSummarySurcharge.textContent = `${formatMoney(summary.surcharge) || "0"} đ`;
  if (els.orderSummaryDiscount) els.orderSummaryDiscount.textContent = `${formatMoney(summary.discount) || "0"} đ`;
  if (els.orderSummaryVat) els.orderSummaryVat.textContent = `${formatMoney(summary.vat) || "0"} đ`;
  if (els.orderSummaryDeposit) els.orderSummaryDeposit.textContent = `${formatMoney(summary.deposit) || "0"} đ`;
  if (els.orderSummaryAmountDue) els.orderSummaryAmountDue.textContent = `${formatMoney(summary.amountDue) || "0"} đ`;
  if (els.orderSummaryActualReceipt) els.orderSummaryActualReceipt.textContent = `${formatMoney(summary.actualReceipt) || "0"} đ`;
  if (els.orderSummaryCommission) els.orderSummaryCommission.textContent = `${formatMoney(summary.commission) || "0"} đ`;
  if (els.orderSummaryDebt) els.orderSummaryDebt.textContent = `${formatMoney(summary.debt) || "0"} đ`;
  const orderHead = document.querySelector(".order-table thead");
  if (orderHead) orderHead.innerHTML = `
    <tr>
      <th>Thao tác</th>
      <th>STT</th>
      <th>Mã đơn</th>
      <th class="date-time-column">Ngày giờ đi</th>
      <th>Khách hàng</th>
      <th>Chuyến đi</th>
      <th>Điều xe</th>
      <th>Số chỗ</th>
      <th>Tài chính</th>
      <th>Loại / hóa đơn</th>
      <th>Ghi chú</th>
      <th>Gửi tài xế</th>
      <th>Trạng thái</th>
    </tr>
  `;
  els.orderTable.innerHTML =
    rows
      .map((row, index) => {
        const isDone = orderIsDone(row);
        const hasDispatch = Boolean(row.bienKiemSoat && row.ngayGioDi);
        const routeText = row.tuyen || row.loaiHopDong || "";
        const driverName = orderDriverName(row);
        const requestedSeatCount = String(row.soCho || row.so_cho || "").trim();
        const driverNotificationSent = normalize(row.trangThaiGuiTaiXe).includes("da gui tai xe");
        const pendingReopen = state.reopenRequests.some(
          (request) => String(request.orderId) === String(row.id) && isPendingReopen(request),
        );
        const isDebtOrder = normalize(row.congNo).includes("co");
        const remittancePaid = isDebtOrder || normalize(row.trangThaiNopTien).includes("da nop tien");
        const completedActions = [
          isDebtOrder
            ? `<span class="pill running">Công nợ</span>`
            : can("manage_remittance_status")
            ? `<button class="small ${remittancePaid ? "secondary" : ""}" data-action="toggle-remittance-status" data-order-id="${escapeHtml(row.id)}" data-status="${remittancePaid ? "Chưa nộp tiền" : "Đã nộp tiền"}" type="button">${remittancePaid ? "Đã nộp tiền" : "Chưa nộp tiền"}</button>`
            : `<span class="pill ${remittancePaid ? "done" : "running"}">${remittancePaid ? "Đã nộp tiền" : "Chưa nộp tiền"}</span>`,
          canOperateOrders() && can("request_reopen")
            ? `<button class="small secondary" data-action="request-reopen" data-order-id="${escapeHtml(row.id)}" type="button" ${pendingReopen ? "disabled" : ""}>${pendingReopen ? "Đã gửi yêu cầu" : "Yêu cầu mở lại"}</button>`
            : "",
        ].filter(Boolean).join("");
        const actions = isDone
          ? `<div class="order-action-stack">${completedActions}</div>`
          : `<div class="order-action-stack">
              ${canOperateOrders() && can("dispatch") ? `<button class="small secondary" data-action="assign-order" data-order-id="${escapeHtml(row.id)}" type="button">${hasDispatch ? "Sửa điều xe" : "Điều xe"}</button>` : ""}
              ${hasDispatch && driverNotificationSent && canOperateOrders() && can("complete_order") ? `<button class="small" data-action="complete-order" data-order-id="${escapeHtml(row.id)}" type="button">Hoàn thành</button>` : ""}
              ${canOperateOrders() ? `<button class="small danger" data-action="delete-order" data-order-id="${escapeHtml(row.id)}" type="button">Xóa</button>` : ""}
            </div>`;
        return `
          <tr data-detail-type="order" data-id="${escapeHtml(row.id)}">
            <td class="action-cell">${actions}</td>
            <td><strong>${index + 1}</strong></td>
            <td><strong>${escapeHtml(row.id)}</strong></td>
            <td class="date-time-cell">${formatDateTimeCell(row.ngayGioDi, "Chưa xác định")}</td>
            <td><strong>${escapeHtml(row.tenKhach)}</strong></td>
            <td><strong>${escapeHtml(routeText)}</strong></td>
            <td>
              <strong>${escapeHtml(row.bienKiemSoat || "Chưa điều xe")}</strong>
              ${driverName ? `<div class="order-driver-name">Lái xe: ${escapeHtml(driverName)}</div>` : ""}
              ${row.bienKiemSoat ? `<span class="pill">${escapeHtml(vehicleOwnershipLabel(row))}</span>` : ""}
            </td>
            <td><strong>${requestedSeatCount ? escapeHtml(requestedSeatCount) : `<span class="muted">—</span>`}</strong></td>
            <td><strong>${escapeHtml(formatMoney(orderRevenueAmount(row))) || "0"}</strong></td>
            <td><span class="pill">${escapeHtml(row.loaiHopDong || "Xe nguyên chuyến")}</span></td>
            <td class="order-note-cell">${row.ghiChu ? escapeHtml(row.ghiChu) : `<span class="muted">—</span>`}</td>
            <td>
              ${isDone
                ? `<span class="muted">—</span>`
                : canOperateOrders() && can("dispatch")
                  ? `<button class="small ${driverNotificationSent ? "secondary" : ""}" data-action="toggle-driver-notification" data-order-id="${escapeHtml(row.id)}" data-status="${driverNotificationSent ? "Chưa gửi tài xế" : "Đã gửi tài xế"}" type="button">${driverNotificationSent ? "Đã gửi tài xế" : "Chưa gửi tài xế"}</button>`
                  : `<span class="pill ${driverNotificationSent ? "done" : "running"}">${driverNotificationSent ? "Đã gửi tài xế" : "Chưa gửi tài xế"}</span>`}
            </td>
            <td><span class="pill ${isDone ? "done" : "running"}">${escapeHtml(row.trangThai || "Chưa hoàn thành")}</span></td>
          </tr>
        `;
      })
      .join("") || `<tr><td colspan="13" class="empty">Chưa có đơn hàng.</td></tr>`;
}

async function initializeApp() {
  const versionIsCurrent = await checkAppVersion();
  if (versionIsCurrent) await loadData();
}

refreshSearchableSelects();
document.addEventListener("pointerdown", (event) => {
  if (openSearchableSelectControl && !openSearchableSelectControl.wrapper.contains(event.target)) {
    closeSearchableSelect(openSearchableSelectControl);
  }
});
document.addEventListener("reset", () => window.requestAnimationFrame(refreshSearchableSelects));
const searchableSelectObserver = new MutationObserver((records) => {
  const selectChanged = records.some((record) => {
    if (record.target instanceof HTMLSelectElement) return true;
    return [...record.addedNodes, ...record.removedNodes].some((node) => {
      if (!(node instanceof Element)) return false;
      return node.matches("select, option") || Boolean(node.querySelector("select, option"));
    });
  });
  if (selectChanged) scheduleSearchableSelectRefresh();
});
searchableSelectObserver.observe(document.body, { childList: true, subtree: true });
initializeApp();
window.setInterval(checkAppVersion, APP_VERSION_CHECK_INTERVAL_MS);

