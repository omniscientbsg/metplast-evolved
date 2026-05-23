import prisma from "@/lib/prisma"

export default async function ProductsAdminPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Products</h1>
          <p className="text-white/60 mt-1">Manage your poultry equipment catalog.</p>
        </div>
        <button className="bg-primary text-white font-bold px-6 py-2 rounded-xl hover:bg-primary/90 transition-colors">Add Product</button>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Product Name</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Category</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider">Tagline</th>
              <th className="p-4 text-white/60 text-sm font-bold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-white/50">No products found. Add your first product!</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white">{product.name}</div>
                    <div className="text-xs text-white/50">/{product.slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-white/80 text-sm">{product.tagline}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="text-white/50 hover:text-white transition-colors text-sm font-medium">Edit</button>
                    <button className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">Delete</button>
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
