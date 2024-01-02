import '@/app/globals.css';
import type { Metadata } from 'next'
import AuthProvider from '@/components/AuthProvider';
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from "next/navigation";



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
  if (session) {
    redirect("/home");
  }
  return (
    <html lang="en">
      <body>
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  )
}