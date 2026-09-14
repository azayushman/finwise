import Link from "next/link";

const footerLinks = {
  Learn: [
    { label: "Financial Basics",    href: "/learn" },
    { label: "Budgeting 101",        href: "/learn" },
    { label: "Saving Strategies",    href: "/learn" },
    { label: "Investment Guide",     href: "/learn" },
    { label: "Understanding Credit", href: "/learn" },
    { label: "Compound Interest",    href: "/learn" },
  ],
  Tools: [
    { label: "Budget Planner",          href: "/budget" },
    { label: "Savings Calculator",      href: "/savings" },
    { label: "Investment Calculator",   href: "/tools" },
    { label: "Debt Payoff Tool",        href: "/tools" },
    { label: "Finance Quiz",            href: "/quiz" },
    { label: "AI Assistant",            href: "/assistant" },
  ],
  Company: [
    { label: "About FinWise", href: "#" },
    { label: "Our Mission",   href: "#" },
    { label: "Blog",          href: "#" },
    { label: "Careers",       href: "#" },
    { label: "Press",         href: "#" },
    { label: "Contact",       href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="text-slate-300 border-t border-white/5 bg-[#07111F]/80 backdrop-blur-md" role="contentinfo">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-white/5">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4" aria-label="FinWise home">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center glass-surface">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <polyline points="2 17 9 10 13 14 22 5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                Fin<span style={{ color: "#8B5CF6" }}>Wise</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-300 max-w-[260px] mb-6">
              Making financial literacy simple and practical for the next generation of smart money decisions.
            </p>
            {/* Social icons */}
            <div className="flex gap-3" aria-label="Social media links">
              {["𝕏", "in", "◯", "▷"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs glass-surface text-slate-300 transition-colors duration-150 hover:bg-white/5 hover:text-white"
                  aria-label={["Twitter", "LinkedIn", "Instagram", "YouTube"][i]}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">{title}</h3>
              <ul className="space-y-3" role="list">
                {links.map((link) => (
                  <li key={link.label} role="listitem">
                    <Link
                      href={link.href}
                      className="text-sm text-slate-300 hover:text-white transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-xs leading-relaxed text-slate-300 pt-8 max-w-3xl">
          Disclaimer: FinWise provides general financial education and calculators.
          Nothing on this site is financial, investment, tax, or legal advice.
          Consider speaking with a qualified professional before making money decisions.
        </p>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-sm text-slate-300">
            © 2026 FinWise. All rights reserved.
          </p>
          <nav className="flex gap-6" aria-label="Legal links">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-sm transition-colors duration-150 hover:text-white text-slate-300"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

      </div>
    </footer>
  );
}
