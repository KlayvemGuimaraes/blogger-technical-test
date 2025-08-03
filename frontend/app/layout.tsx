import '../src/styles/globals.css'

export const metadata = {
  title: 'Blog',
  description: 'News Blog with Next.js and Tailwind',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
