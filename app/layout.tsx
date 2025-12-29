import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Agribank Trà Vinh - Tra Cứu Giá Đất',
    template: '%s | Agribank Trà Vinh',
  },
  description: 'Tra cứu giá đất tỉnh Trà Vinh theo Quyết định UBND tỉnh. Công cụ tính toán giá đất chính xác dành cho cán bộ ngân hàng Agribank.',
  keywords: ['giá đất', 'tra cứu giá đất', 'Trà Vinh', 'Agribank', 'bất động sản', 'định giá đất'],
  authors: [{ name: 'Agribank Trà Vinh' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Agribank Trà Vinh - Tra Cứu Giá Đất',
    description: 'Tra cứu giá đất tỉnh Trà Vinh theo Quyết định UBND tỉnh',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Agribank Trà Vinh',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#AE1C3E',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className={beVietnamPro.className}>
        {children}
      </body>
    </html>
  )
}
