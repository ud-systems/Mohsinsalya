import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="frame-container frame-container-dark">
      <div className="p-6 sm:p-10 md:p-16">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          {/* Left - Logo & Tagline */}
          <div className="text-primary-foreground">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-2">
              Mohsin
              <br />
              Salya
            </h3>
            <p className="body-sm text-primary-foreground/60 max-w-xs">
              Rebuilding standards across industries
            </p>
          </div>

          {/* Center - Navigation */}
          <nav className="flex flex-wrap gap-6 text-primary-foreground/80">
            <a href="/biography" className="text-sm hover:text-primary-foreground transition-colors">Biography</a>
            <a href="/markets" className="text-sm hover:text-primary-foreground transition-colors">Markets</a>
            <a href="/insights" className="text-sm hover:text-primary-foreground transition-colors">Insights</a>
            <a href="/charity-works" className="text-sm hover:text-primary-foreground transition-colors">Charity</a>
          </nav>

          {/* Right - CTA */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/60">Get in touch</span>
            <a href="/contact" className="arrow-btn text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary">
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-primary-foreground/40 text-xs">
          <div className="flex items-center gap-1">
            <p>© {new Date().getFullYear()} Mohsin Salya. All rights reserved.</p>
            <a 
              href="https://iankatana.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-foreground/60 transition-colors ml-1 opacity-20 hover:opacity-100"
              title="Developer"
            >
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-foreground/60 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-foreground/60 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
