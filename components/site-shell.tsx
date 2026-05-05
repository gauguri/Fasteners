import Link from "next/link";
import { ReactNode } from "react";
import { ClipboardList, Contact, Gauge, PackageSearch, ShoppingCart, UserRound } from "lucide-react";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="brand-mark">
            <span className="brand-mark__sigil">FL</span>
            <span>
              <strong>ForgeLine</strong>
              <small>Military fastener supply desk</small>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link href="/search"><PackageSearch size={16} /> Catalog</Link>
            <Link href="/finder"><Gauge size={16} /> Finder</Link>
            <Link href="/quote"><ClipboardList size={16} /> RFQ</Link>
            <Link href="/cart"><ShoppingCart size={16} /> Cart</Link>
            <Link href="/account"><UserRound size={16} /> Account</Link>
            <Link href="/contact"><Contact size={16} /> Contact</Link>
          </nav>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <div className="brand-mark">
            <span className="brand-mark__sigil">FL</span>
            <span>
              <strong>ForgeLine</strong>
              <small>Traceable parts. Faster fulfillment. Cleaner programs.</small>
            </span>
          </div>
          <div className="footer-links">
            <Link href="/faq">FAQ</Link>
            <Link href="/shipping">Shipping</Link>
            <Link href="/quality">Quality</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
