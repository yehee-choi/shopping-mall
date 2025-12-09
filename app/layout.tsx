import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import CategoryMenu from "@/components/CategoryMenu";
import Link from 'next/link'

export const metadata: Metadata = {
  title: "저버코리아 - NAVER 스마트스토어",
  description: "감각적인 디자인과 편리하고 좋은 호흡을 쌈을 추구합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {/* 로고 추가 */}
        <div className="bg-white py-8 border-b">
          <div className="max-w-[1280px] mx-auto px-4">
            <Link href="/" className="block">
  <h1 className="text-4xl font-bold text-center text-gray-900 cursor-pointer hover:opacity-80 transition-opacity">
    저버코리아
  </h1>
</Link>
          </div>
        </div>
        <CategoryMenu />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t mt-20">
          <div className="max-w-[1280px] mx-auto px-4 py-12">
            <div className="text-sm text-gray-600">
              <p className="font-bold mb-2">저버코리아</p>
              <p>Copyright © ZERBER KOREA All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}