import prisma from "@/lib/prisma"
import { Save } from "lucide-react"

export default async function SettingsAdminPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">General Settings</h1>
        <p className="text-white/60 mt-1">Manage global website configurations and contact details.</p>
      </div>
      
      <form className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Company Contact Details</h2>
          
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Public Email Address</label>
            <input 
              type="email" 
              defaultValue={settingsMap['contact_email'] || 'info@metplast.com'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              type="tel" 
              defaultValue={settingsMap['contact_phone'] || '+91 98765 43210'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Office Address</label>
            <textarea 
              rows={3}
              defaultValue={settingsMap['contact_address'] || 'New Delhi, India'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="text-xl font-bold text-white mb-2">SEO & Branding</h2>
          
          <div>
            <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Meta Description</label>
            <textarea 
              rows={2}
              defaultValue={settingsMap['seo_description'] || 'Immersive, precision-engineered poultry systems.'}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>

        <button 
          type="button"
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Save Settings
        </button>
      </form>
    </div>
  )
}
