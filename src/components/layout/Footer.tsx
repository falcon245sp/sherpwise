export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <p className="text-sm text-gray-600">
          © {currentYear} The Ontara Institute. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm">
          <a
            href="/about"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            About
          </a>
          <a
            href="/privacy"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Terms
          </a>
        </nav>
      </div>
    </footer>
  );
}
