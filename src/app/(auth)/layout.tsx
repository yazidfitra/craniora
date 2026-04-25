import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Header */}
      <header className="bg-stone-50 border-b border-blue-100 shadow-sm shadow-blue-900/5 fixed top-0 w-full z-50">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-[1280px] mx-auto">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-crania.jpg"
              alt="Craniora Academy"
              width={28}
              height={28}
              className="rounded-full"
            />
            <span className="font-[var(--font-heading)] text-blue-950 font-bold tracking-tight text-lg">
              Craniora Academy
            </span>
          </Link>
          <div className="hidden md:block">
            <span className="text-xs text-secondary-500 font-medium tracking-wide">
              FK UNP 2025 &bull; Medical Education Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 border-t border-stone-200">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 py-6 w-full max-w-[1280px] mx-auto">
          <p className="text-xs font-medium text-stone-500 font-[var(--font-heading)]">
            &copy; 2025 Medical Academy Systems. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              className="text-xs font-medium text-stone-500 hover:text-blue-700 transition-colors"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-xs font-medium text-stone-500 hover:text-blue-700 transition-colors"
              href="#"
            >
              Terms of Service
            </a>
            <a
              className="text-xs font-medium text-stone-500 hover:text-blue-700 transition-colors"
              href="#"
            >
              Help Desk
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
