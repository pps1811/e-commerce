import Link from "next/link";
import type { Category } from "@/types/product";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.3l5 6.6L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.2C15.9 4.1 15 4 14 4c-2.3 0-3.9 1.4-3.9 4v2.4H7.5v3H10V21h3.5Z" />
    </svg>
  );
}

interface SiteFooterProps {
  categories: Category[];
}

export function SiteFooter({ categories }: SiteFooterProps) {
  const footerLinks = {
    Shop: [
      { label: "New Arrivals", href: "/products?filter=new" },
      ...categories
        .slice(0, 4)
        .map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })),
    ],
    Support: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "FAQs", href: "/faq" },
    ],
    Company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  };

  return (
    <footer className="border-t bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-2">
            <Link href="/" className="font-heading text-xl font-bold tracking-tight">
              Aurelle
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              Curated essentials, thoughtfully made. Fast shipping, easy returns, and a checkout
              you can trust.
            </p>
            <div className="mt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <FacebookIcon />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h3 className="font-heading text-sm font-semibold">{title}</h3>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Aurelle. All rights reserved.</p>
          <p>Secure checkout powered by Razorpay</p>
        </div>
      </div>
    </footer>
  );
}
