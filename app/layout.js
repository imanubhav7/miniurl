import "./globals.css";
import { Toaster } from "sonner";

export const metadata = {
  title: "MiniURL",
  description: "Shorten links — MiniURL",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900 antialiased">
       {/* \BG  */}
        <div className="blobs-bg -z-10">
          <div className="b1"></div>
          <div className="b2"></div>
        </div>

        {/* Shpaes x */}
        <div className="pointer-events-none fixed -top-32 -right-32 w-96 h-96 bg-gradient-to-tr from-indigo-200/25 to-transparent rounded-full blur-3xl mix-blend-screen" />
        <div className="pointer-events-none fixed -bottom-32 -left-32 w-96 h-96 bg-gradient-to-bl from-cyan-200/20 to-transparent rounded-full blur-3xl mix-blend-screen" />

        
        <main className="min-h-screen flex justify-center items-start p-6 lg:p-12">
          <div className="w-full max-w-6xl">{children}</div>
        </main>

        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
