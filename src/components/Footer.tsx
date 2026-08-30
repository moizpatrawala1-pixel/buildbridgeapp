// src/components/Footer.tsx

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-paper/55 pt-16 pb-8 mt-auto">
      <div className="max-w-[1180px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 font-display font-bold text-[19px] text-paper mb-3.5">
              <span className="w-[30px] h-[30px] border-[1.5px] border-amber rounded-full flex items-center justify-center shrink-0">
                <span className="w-2.5 h-2.5 bg-amber rotate-45 block" />
              </span>
              BuildBridge
            </div>
            <p className="text-sm leading-relaxed max-w-[260px]">
              Connecting developers, licensed contractors, and material suppliers on one verified network.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider uppercase text-paper/40 mb-4">Platform</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/browse" className="text-sm hover:text-paper transition-colors">Browse Contractors</Link></li>
              <li><Link href="/dashboard" className="text-sm hover:text-paper transition-colors">Post a Project</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider uppercase text-paper/40 mb-4">For Business</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/signup" className="text-sm hover:text-paper transition-colors">Register as Developer</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-paper transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs tracking-wider uppercase text-paper/40 mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              <li><span className="text-sm">About</span></li>
              <li><span className="text-sm">Contact</span></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pt-7 text-[13px]">
          <span>© {new Date().getFullYear()} BuildBridge. All rights reserved.</span>
          <span>Mumbai, India</span>
        </div>
      </div>
    </footer>
  );
}
