export default function BlogsAdminPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Blogs & News</h1>
          <p className="text-white/60 mt-1">Manage articles and announcements.</p>
        </div>
        <button className="bg-primary text-white font-bold px-6 py-2 rounded-xl">New Post</button>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center text-white/50">
        Blog CMS interface will be implemented here.
      </div>
    </div>
  )
}
