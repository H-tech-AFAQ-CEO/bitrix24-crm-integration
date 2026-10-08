import { PhoneCall, ArrowRight, CheckCircle2, Radio, ShieldCheck } from 'lucide-react'

const steps = [
  ['01', 'Call arrives', 'Twilio answers your public number and starts the scripted conversation.'],
  ['02', 'Answers become data', 'Speech recognition captures short replies and AI normalizes the key fields.'],
  ['03', 'Lead is created', 'A Bitrix24 lead is created through your incoming webhook with no human handoff.'],
]

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-[#172033]">
      <section className="mx-auto max-w-6xl px-6 py-8 lg:px-10 lg:py-12">
        <header className="flex items-center justify-between border-b border-[#dfe5ef] pb-6">
          <div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#2357d9] text-white"><PhoneCall size={19} /></div><span className="font-semibold tracking-tight">Callflow proof</span></div>
          <span className="flex items-center gap-2 rounded-full border border-[#cfe8d8] bg-[#effaf2] px-3 py-1.5 text-xs font-medium text-[#28733c]"><span className="size-1.5 rounded-full bg-[#35a853]" /> Demo-ready architecture</span>
        </header>

        <div className="grid gap-14 py-16 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:py-24">
          <div><p className="mb-5 text-sm font-semibold uppercase tracking-[.18em] text-[#2357d9]">Phone → AI → Bitrix24</p><h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-.04em] sm:text-6xl">Turn a short phone call into a qualified lead.</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#5c687d]">A minimal, deployable voice bot that asks three focused questions, understands short answers, and writes the structured result directly into your Bitrix24 CRM.</p><div className="mt-9 flex flex-wrap gap-3"><a href="#flow" className="inline-flex items-center gap-2 rounded-lg bg-[#2357d9] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2357d9]/20">See the flow <ArrowRight size={16} /></a><span className="inline-flex items-center gap-2 rounded-lg border border-[#dfe5ef] bg-white px-5 py-3 text-sm font-medium text-[#526077]"><ShieldCheck size={16} className="text-[#35a853]" /> Server-side credentials</span></div></div>
          <div className="rounded-2xl border border-[#dfe5ef] bg-white p-6 shadow-[0_18px_60px_rgba(38,58,93,.08)]"><div className="mb-7 flex items-center justify-between"><div><p className="text-sm font-semibold">Live call pipeline</p><p className="mt-1 text-xs text-[#8190a7]">Expected outcome after one call</p></div><Radio size={18} className="text-[#35a853]" /></div><div className="space-y-4">{['Incoming number answered', 'Three short replies captured', 'Lead fields normalized', 'Bitrix24 lead created'].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl bg-[#f5f7fb] px-4 py-3"><CheckCircle2 size={18} className="text-[#35a853]" /><span className="text-sm font-medium">{item}</span><span className="ml-auto text-xs text-[#8190a7]">0{index + 1}</span></div>)}</div></div>
        </div>

        <section id="flow" className="border-t border-[#dfe5ef] py-16"><p className="text-sm font-semibold uppercase tracking-[.18em] text-[#2357d9]">The proof</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">One narrow path, fully automated.</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map(([number, title, description]) => <article key={number} className="rounded-2xl border border-[#dfe5ef] bg-white p-6"><span className="text-sm font-semibold text-[#2357d9]">{number}</span><h3 className="mt-8 text-xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-6 text-[#66748a]">{description}</p></article>)}</div></section>
        <footer className="flex flex-col gap-2 border-t border-[#dfe5ef] py-7 text-sm text-[#8190a7] sm:flex-row sm:items-center sm:justify-between"><span>Built for a reliable MVP call demo.</span><span>Twilio Voice · AI Gateway · Bitrix24 REST</span></footer>
      </section>
    </main>
  )
}
