import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-bold">地域イベント情報共有アプリ</h1>
        </header>
        {children}
      </body>
    </html>
  )
}