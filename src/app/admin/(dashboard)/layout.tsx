import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10 flex justify-center">
          <Link href="/admin" className="block w-40 relative h-12">
            <Image 
              src="/images/Logo Metplast.png" 
              alt="Metplast Logo" 
              fill 
              className="object-contain"
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Products
          </Link>
          <Link href="/admin/enquiries" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Enquiries
          </Link>
          <Link href="/admin/blogs" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Blogs
          </Link>
          <Link href="/admin/chatbot" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Chatbot & AI
          </Link>
          <Link href="/admin/settings" className="block px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-colors">
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {session.user?.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{session.user?.name}</p>
              <p className="text-xs text-white/50 truncate w-32">{session.user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-16 border-b border-white/10 flex items-center px-8 md:hidden">
          <Link href="/admin" className="block w-32 relative h-8">
            <Image 
              src="/images/Logo Metplast.png" 
              alt="Metplast Logo" 
              fill 
              className="object-contain"
            />
          </Link>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
