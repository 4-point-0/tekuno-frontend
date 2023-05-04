export { default } from "next-auth/middleware"

export const config = { matcher: ["/admin", "/admin/user", "/admin/create/:path*", "/admin/previous/:path*"] }
