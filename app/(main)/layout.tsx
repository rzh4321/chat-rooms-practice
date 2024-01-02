import '@/app/globals.css';
import type { Metadata } from 'next'
import { SocketProvider } from '@/components/Provider'
import AuthProvider from '@/components/AuthProvider';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from "next/navigation";
import QueryProvider from '@/components/QueryProvider';



export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/");
    }
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SocketProvider>
            <QueryProvider>
              {children}
            </QueryProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  )
}