'use client'

import MyHeader from "@/components/organism/Header"
import { usePathname } from "next/navigation"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathName = usePathname();

  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[100vh]">
        {pathName === '/log' || pathName === '/' || pathName === '/game' ? 
          null
          : <MyHeader display={true}/>
        }
        {children}
      </body>
    </html>
  )
}
