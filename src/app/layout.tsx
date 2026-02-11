import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "CafeBoost",
  description: "Smart ordering system for modern cafés",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
      <header className="border-b bg-white/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-tight">
            ☕ CafeBoost
          </Link>

          {/* <nav className="space-x-8 text-sm font-medium">
            <Link href="/cafes" className="hover:text-amber-700 transition">
              Cafes
            </Link>
            <Link href="/login" className="hover:text-amber-700 transition">
              Login
            </Link>
          </nav> */}
        </div>
      </header>


        {children}
      </body>
    </html>
  );
}
