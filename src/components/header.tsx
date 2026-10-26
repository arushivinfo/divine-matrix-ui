import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          <span className="text-accent">Divine</span> Matrix
        </Link>
        <nav className="flex gap-6 text-sm text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
