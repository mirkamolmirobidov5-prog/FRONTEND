import { Inbox } from 'lucide-react'

export default function EmptyState({ title = "Ma'lumot topilmadi", hint, action }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-center text-slate-500">
      <Inbox size={36} className="text-slate-300" />
      <p className="font-medium text-slate-700">{title}</p>
      {hint && <p className="text-sm">{hint}</p>}
      {action}
    </div>
  )
}
