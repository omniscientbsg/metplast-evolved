import prisma from "@/lib/prisma"
import { EnquiriesTable, type EnquiryRow } from "./EnquiriesTable"

export const dynamic = 'force-dynamic'

export default async function EnquiriesAdminPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const rows: EnquiryRow[] = enquiries.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone,
    message: e.message,
    status: e.status,
    createdAt: e.createdAt,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Enquiries</h1>
        <p className="text-white/60 mt-1">Manage customer quotation requests and leads.</p>
      </div>

      <EnquiriesTable initial={rows} />
    </div>
  )
}
