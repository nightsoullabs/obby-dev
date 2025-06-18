import Link from "next/link";

const footerLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Refund", href: "/refund" },
  {
    label: "GitHub",
    href: "https://github.com/eersnington/obby-dev",
    newTab: true,
  },
];

export function LowProfileFooter() {
  return (
    <footer className="mt-auto pt-8 pb-6">
      <div className="flex items-center justify-center">
        <nav className="flex items-center gap-1 text-sm text-muted-foreground">
          {footerLinks.map((link, index) => (
            <div key={link.href} className="flex items-center gap-1">
              {link.newTab ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-accent/50"
                >
                  {link.label}
                </Link>
              )}
              {index < footerLinks.length - 1 && (
                <span className="text-muted-foreground/50">|</span>
              )}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
