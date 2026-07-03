import re

with open("src/app/(frontend)/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update the 3 feature cards to match the screenshot design
old_cards = """      {/* FEATURE CARDS */}
      <section className="relative z-20 bg-dark pt-12 pb-6 px-6 -mt-8">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CheckCircle2 className="w-8 h-8 text-primary mb-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-xl font-bold text-white mb-3">Precision Engineering</h3>
            <p className="text-white/60 font-medium text-sm leading-relaxed">
              Manufacturing robust, high-quality poultry equipment designed for decades of reliable performance.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <ArrowUpRight className="w-8 h-8 text-primary mb-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-xl font-bold text-white mb-3">Turnkey Delivery</h3>
            <p className="text-white/60 font-medium text-sm leading-relaxed">
              From land leveling to final installation, we manage your entire project from start to finish.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Wind className="w-8 h-8 text-primary mb-5" style={{ color: 'var(--accent)' }} />
            <h3 className="text-xl font-bold text-white mb-3">Farm Optimization</h3>
            <p className="text-white/60 font-medium text-sm leading-relaxed">
              Integrating automated feeding, drinking, and climate control to maximize your yield efficiency.
            </p>
          </div>
        </div>
      </section>"""

new_cards = """      {/* FEATURE CARDS */}
      <section className="relative z-20 bg-[var(--bg)] pt-12 pb-6 px-6 -mt-8 transition-colors duration-500">
        <div className="max-w-[1600px] mx-auto grid md:grid-cols-3 gap-6">
          <div className="bg-[var(--surface)] p-10 rounded-[2rem] border border-[var(--border)] relative overflow-hidden group shadow-xl transition-colors duration-500">
            <div className="absolute top-4 right-8 text-8xl font-black text-[var(--text)] opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">01</div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm relative z-10 transition-colors duration-500">
              <CheckCircle2 className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4 relative z-10">Precision Engineering</h3>
            <p className="text-[var(--text-muted)] font-medium text-[15px] leading-relaxed relative z-10">
              Manufacturing robust, high-quality poultry equipment designed for decades of reliable performance.
            </p>
          </div>
          <div className="bg-[var(--surface)] p-10 rounded-[2rem] border border-[var(--border)] relative overflow-hidden group shadow-xl transition-colors duration-500">
            <div className="absolute top-4 right-8 text-8xl font-black text-[var(--text)] opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">02</div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm relative z-10 transition-colors duration-500">
              <CheckCircle2 className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4 relative z-10">Turnkey Delivery</h3>
            <p className="text-[var(--text-muted)] font-medium text-[15px] leading-relaxed relative z-10">
              From land leveling to final installation, we manage your entire project from start to finish.
            </p>
          </div>
          <div className="bg-[var(--surface)] p-10 rounded-[2rem] border border-[var(--border)] relative overflow-hidden group shadow-xl transition-colors duration-500">
            <div className="absolute top-4 right-8 text-8xl font-black text-[var(--text)] opacity-[0.03] select-none pointer-events-none group-hover:scale-110 transition-transform duration-700">03</div>
            <div className="w-16 h-16 rounded-2xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-center mb-6 shadow-sm relative z-10 transition-colors duration-500">
              <CheckCircle2 className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-[var(--text)] mb-4 relative z-10">Farm Optimization</h3>
            <p className="text-[var(--text-muted)] font-medium text-[15px] leading-relaxed relative z-10">
              Integrating automated feeding, drinking, and climate control to maximize your yield efficiency.
            </p>
          </div>
        </div>
      </section>"""

content = content.replace(old_cards, new_cards)

# 2. Update the rest of the hardcoded colors starting from "POSITIONING & 4 SOLUTION CARDS" down
# Split at the end of the hero section so we don't mess up the hero which should stay dark
parts = content.split('{/* POSITIONING & 4 SOLUTION CARDS */}')
if len(parts) == 2:
    hero_part = parts[0]
    rest_part = parts[1]

    # Replace bg-dark with bg-[var(--bg)]
    rest_part = rest_part.replace('bg-dark', 'bg-[var(--bg)]')
    
    # Replace bg-white with bg-[var(--surface)] except in a few specific places (like calculators maybe?)
    rest_part = rest_part.replace('bg-white ', 'bg-[var(--surface)] ')
    rest_part = rest_part.replace('bg-white/', 'bg-[var(--text)]/')
    
    # Replace text-white with text-[var(--text)]
    rest_part = rest_part.replace('text-white', 'text-[var(--text)]')
    
    # Replace text-dark with text-[var(--text)]
    rest_part = rest_part.replace('text-dark', 'text-[var(--text)]')
    
    # Replace border-white/10 with border-[var(--border)]
    rest_part = rest_part.replace('border-white/10', 'border-[var(--border)]')
    rest_part = rest_part.replace('border-white/30', 'border-[var(--border)]')
    
    # Replace hover:border-white/30 with hover:border-[var(--text-muted)]
    rest_part = rest_part.replace('hover:border-white/30', 'hover:border-[var(--text-muted)]')

    content = hero_part + '{/* POSITIONING & 4 SOLUTION CARDS */}' + rest_part

# Remove the overall text-white from <main>
content = content.replace('<main ref={containerRef} className="relative min-h-screen bg-[var(--bg)] overflow-hidden text-[var(--text)]">', '<main ref={containerRef} className="relative min-h-screen bg-[var(--bg)] overflow-hidden">')
# (It might still have bg-dark text-white from earlier, let's fix that)
content = content.replace('<main ref={containerRef} className="relative min-h-screen bg-dark overflow-hidden text-white">', '<main ref={containerRef} className="relative min-h-screen bg-[var(--bg)] overflow-hidden">')

with open("src/app/(frontend)/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Replacement successful")
