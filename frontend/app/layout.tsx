import type { Metadata } from "next";
import "./globals.css";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Digital Life Navigator | Step-by-Step Digital Guidance",
  description: "Show me what you're trying to do. I'll help you do it. Step-by-step guidance for less-confident digital users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-gray-900 selection:bg-purple-200">
        {children}
      </body>
    </html>
  );
}
