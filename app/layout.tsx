import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
const font=Be_Vietnam_Pro({variable:"--font-app",subsets:["latin","vietnamese"],weight:["400","500","600","700"]});
export const metadata:Metadata={title:"Kế toán Đi Xanh",description:"Ứng dụng kế toán và quản trị tài chính vận hành Đi Xanh"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body className={font.variable}>{children}</body></html>}
