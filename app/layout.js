import './globals.css'

export const metadata = {
  title: 'Launch Decision Wizard — Owner Manager Playbook',
  description: 'GP Score Launch Decision Framework — step-by-step tool for managers to evaluate when to launch, add a CSM, or override a held case.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
