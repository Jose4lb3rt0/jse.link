"use client"

import Shortener from "./components/Shortener"

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
          Usado por +10,000 equipos a lo largo del mundo.
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Una forma fácil <span className="text-indigo-400">de navegar.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-12">
          Transforma complejas URLs en cortos y atractivos links que redirigen a cualquier sitio en tiempo real.
        </p>

        <Shortener />
      </section>

      {/* Features Grid */}
      {/* <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Fast', desc: 'Our distributed infrastructure ensures links resolve in milliseconds globally.' },
          { title: 'Secure', desc: 'Enterprise-grade encryption and spam protection. Your data is our priority.' },
          { title: 'Analytical', desc: 'Gain deep insights into your audience. Track clicks, geography, and sources.' }
        ].map((feature, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section> */}
    </>
  )
}
