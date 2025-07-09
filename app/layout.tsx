import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Universidade Lusíada de São Tomé e Príncipe | ULSTP',
  description: 'Portal oficial da Universidade Lusíada de São Tomé e Príncipe. Excelência no ensino superior em STP.',
  generator: 'v0.dev',
  icons: {
    icon: [
      { url: '/images/favicon-16x16.webp', sizes: '16x16', type: 'image/webp' },
      { url: '/images/favicon-32x32.webp', sizes: '32x32', type: 'image/webp' },
      { url: '/images/favicon-48x48.webp', sizes: '48x48', type: 'image/webp' },
    ],
    apple: [
      { url: '/images/apple-touch-icon-180x180.webp', sizes: '180x180', type: 'image/webp' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/images/safari-pinned-tab.svg',
      },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          {children}
          {/* Chat Widget */}
          <script dangerouslySetInnerHTML={{ __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/65f0c0008d261e1b5f6b1234/1hpqwerty';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `}} />
        </AuthProvider>
      </body>
    </html>
  )
}
