import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import { Users, Package, MessageSquare, BookOpen, Bot } from "lucide-react"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const [productsCount, enquiriesCount, blogsCount, chatbotProvider, recentEnquiries] = await Promise.all([
    prisma.product.count(),
    prisma.enquiry.count(),
    prisma.blog.count(),
    prisma.setting.findUnique({ where: { key: 'chatbot_provider' } }),
    prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  ])

  const stats = [
    { name: 'Total Products', value: productsCount, icon: Package, href: '/admin/products' },
    { name: 'Total Enquiries', value: enquiriesCount, icon: MessageSquare, href: '/admin/enquiries' },
    { name: 'Blog Posts', value: blogsCount, icon: BookOpen, href: '/admin/blogs' },
    { name: 'Chatbot Mode', value: chatbotProvider?.value || 'Disabled', icon: Bot, href: '/admin/chatbot' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Welcome back, {session?.user?.name?.split(' ')[0] || 'Admin'}</h1>
        <p className="text-white/60 mt-1">Here's what's happening with Metplast today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white/50 uppercase tracking-widest mb-1">{stat.name}</p>
                <p className="text-3xl font-black text-white">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Recent Enquiries</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-black/20">
                <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Date</th>
                <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Name</th>
                <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Email</th>
                <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/50">No recent enquiries.</td>
                </tr>
              ) : (
                recentEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/80">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-white font-medium">{enquiry.name}</td>
                    <td className="p-4 text-white/80">{enquiry.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        enquiry.status === 'NEW' ? 'bg-primary/20 text-primary' : 
                        enquiry.status === 'CLOSED' ? 'bg-gray-500/20 text-gray-400' : 
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
