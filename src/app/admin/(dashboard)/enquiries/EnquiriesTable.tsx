"use client"

import { useState } from "react"

export type EnquiryRow = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  status: string
  createdAt: string | Date
}

const STATUSES = ["NEW", "IN_PROGRESS", "CLOSED"] as const

function statusClass(status: string) {
  return status === "NEW"
    ? "bg-primary/20 text-primary"
    : status === "CLOSED"
    ? "bg-gray-500/20 text-gray-400"
    : "bg-blue-500/20 text-blue-400"
}

export function EnquiriesTable({ initial }: { initial: EnquiryRow[] }) {
  const [rows, setRows] = useState<EnquiryRow[]>(initial)
  const [active, setActive] = useState<EnquiryRow | null>(null)

  function patchRow(id: string, status: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    setActive((prev) => (prev && prev.id === id ? { ...prev, status } : prev))
  }

  return (
    <>
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-white/50">No enquiries found.</td>
              </tr>
            ) : (
              rows.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white/80 whitespace-nowrap">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="font-bold text-white">{enquiry.name}</div>
                    <div className="text-xs text-white/50">{enquiry.email}</div>
                    <div className="text-xs text-white/50">{enquiry.phone}</div>
                  </td>
                  <td className="p-4 text-white/80 text-sm max-w-xs truncate">{enquiry.message}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(enquiry.status)}`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setActive(enquiry)}
                      className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {active && (
        <EnquiryModal
          enquiry={active}
          onClose={() => setActive(null)}
          onStatusChange={patchRow}
        />
      )}
    </>
  )
}

function EnquiryModal({
  enquiry,
  onClose,
  onStatusChange,
}: {
  enquiry: EnquiryRow
  onClose: () => void
  onStatusChange: (id: string, status: string) => void
}) {
  const [status, setStatus] = useState(enquiry.status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dirty = status !== enquiry.status
  // The API packs every context field into `message`, one per line.
  const lines = enquiry.message.split("\n").map((l) => l.trim()).filter(Boolean)

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: enquiry.id, status }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Update failed (${res.status})`)
      }
      onStatusChange(enquiry.id, status)
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0b0b0f] border border-white/10 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">{enquiry.name}</h2>
            <p className="text-white/50 text-sm mt-1">
              {new Date(enquiry.createdAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors text-2xl leading-none px-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email" value={enquiry.email} href={`mailto:${enquiry.email}`} />
            <Field label="Phone" value={enquiry.phone} href={`tel:${enquiry.phone}`} />
          </div>

          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Details</p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1">
              {lines.length === 0 ? (
                <p className="text-white/50 text-sm">(no details)</p>
              ) : (
                lines.map((line, i) => (
                  <p key={i} className="text-white/80 text-sm break-words">{line}</p>
                ))
              )}
            </div>
          </div>

          <div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2">Status</p>
            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary/50"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-[#0b0b0f]">{s}</option>
                ))}
              </select>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClass(status)}`}>
                {status}
              </span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-white/70 hover:text-white transition-colors text-sm font-medium"
          >
            Close
          </button>
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            {saving ? "Saving…" : "Save status"}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div>
      <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <a href={href} className="text-white/90 text-sm hover:text-primary transition-colors break-words">
        {value}
      </a>
    </div>
  )
}
