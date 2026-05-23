import prisma from "@/lib/prisma"

export default async function EnquiriesAdminPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Enquiries</h1>
        <p className="text-white/60 mt-1">Manage customer quotation requests and leads.</p>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Date</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Customer</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Message Snippet</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Status</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50">No enquiries found.</td>
              </tr>
            ) : (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/80 whitespace-nowrap">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{enquiry.name}</div>
                    <div className="text-xs text-white/50">{enquiry.email}</div>
                    <div className="text-xs text-white/50">{enquiry.phone}</div>
                  </td>
                  <td className="p-4 text-white/80 text-sm max-w-xs truncate">{enquiry.message}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      enquiry.status === 'NEW' ? 'bg-primary/20 text-primary' : 
                      enquiry.status === 'CLOSED' ? 'bg-gray-500/20 text-gray-400' : 
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <button className="text-white/50 hover:text-white transition-colors text-sm font-medium">View</button>
                    <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">Update</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
