import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "username", type: "text", placeholder: "username" },
      },
      // this will be called when we sign in with normal credentials
      async authorize(credentials, req) {
        const usernameExists = await prisma.user.findUnique({
            where: {
              username: credentials.username,
            },
            select: {
              id: true, // You can select specific fields, in this case, we just need the id to check existence
            },
          });
          
          if (usernameExists) {
            console.log('Username exists, logging in');
            return {username: credentials.username};
          } else {
            console.log('Username does not exist, cant log in');
            return null;
          }

        // If no error and we have user data, return it
        // if (res.ok && data.user) {
        //   return data;
        // }
        // // Return null if user data could not be retrived
        // console.log("cannot log in");
        // return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "credentials") {
        // we already have all the necessary data from authorize(), just return true
        return true;
      }
    },
    // transfer user data to token object. Only store static info in session
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        console.log('(in jwt) user is ', user)
        // token.userId = user.user._id;
        token.username = user.username;
      }
      // console.log('(in jwt) token is  now ', token)

      return token;
    },
    // transfer token data to session object. Only store static info in session
    async session({ session, token }) {
      // console.log('(in session) token is ', token)

    //   session.user.userId = token.userId;
      session.user.username = token.username;
      // console.log('(in jwt) session is now ', session)

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
