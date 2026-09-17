const UPSTREAM = process.env.DIXANH_API_URL || "http://103.118.29.100:8020";
const allowed=[/^api\/(app-version|login|logout|me)(\/.*)?$/,/^api\/users(?:\/[^/]+(?:\/reset-password)?)?$/,/^api\/(roster|franchise-vehicles|customers|tours)(\/.*)?$/,/^api\/accounting\/(attendance(?:\.xlsx)?|payroll(?:\.xlsx)?|payroll-payslips\.zip|payroll-lock|payroll-closed|payroll-remittance|payroll-deductions(?:\/[^/]+)?|deduction-types(?:\/[^/]+)?|payroll-notes(?:\/[^/]+)?|car-wash(?:\.xlsx)?(?:\/[^/]+)?|fuel(?:-prices|-standard)?(?:\/[^/]+)?|driver-salaries(?:\/[^/]+\/[^/]+)?|allowance-types(?:\/[^/]+)?)$/,/^api\/orders(\/.*)?$/,/^api\/invoice-orders$/,/^api\/invoice-groups(\/.*)?$/,/^api\/shared-passengers\/[^/]+\/invoice-status$/,/^api\/debt-orders(\/.*)?$/,/^api\/commission-orders(\/.*)?$/,/^api\/reports\/(driver-remittance|summary|orders|work-performance|driver-revenue|debts|commissions|invoices)\.xlsx$/];
function cookieValue(request:Request,name:string){const item=(request.headers.get("cookie")||"").split(";").map(v=>v.trim()).find(v=>v.startsWith(`${name}=`));return item?decodeURIComponent(item.slice(name.length+1)):""}
async function proxy(request:Request,context:{params:Promise<{path:string[]}>}){
  const {path}=await context.params;const route=`api/${path.join("/")}`;
  if(!allowed.some(rule=>rule.test(route)))return Response.json({detail:"Chức năng này không thuộc phạm vi Kế toán."},{status:403});
  const incoming=new URL(request.url),target=new URL(`${UPSTREAM}/${route}`);target.search=incoming.search;
  const headers=new Headers(),contentType=request.headers.get("content-type");if(contentType)headers.set("content-type",contentType);headers.set("x-app-scope","accounting");
  const token=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")||cookieValue(request,"accounting_token");if(token)headers.set("authorization",`Bearer ${token}`);
  try{
    const upstream=await fetch(target,{method:request.method,headers,body:["GET","HEAD"].includes(request.method)?undefined:await request.arrayBuffer(),cache:"no-store"});
    const responseHeaders=new Headers();for(const name of ["content-type","content-disposition","cache-control"]){const value=upstream.headers.get(name);if(value)responseHeaders.set(name,value)}
    const body=await upstream.arrayBuffer();
    if(route==="api/login"&&upstream.ok){try{const payload=JSON.parse(new TextDecoder().decode(body));if(payload.token)responseHeaders.append("set-cookie",`accounting_token=${encodeURIComponent(payload.token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`)}catch{}}
    if(route==="api/logout")responseHeaders.append("set-cookie","accounting_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0");
    return new Response(body,{status:upstream.status,headers:responseHeaders});
  }catch{return Response.json({detail:"Không thể kết nối máy chủ dữ liệu Đi Xanh."},{status:502})}
}
export const GET=proxy;export const POST=proxy;export const PUT=proxy;export const DELETE=proxy;
