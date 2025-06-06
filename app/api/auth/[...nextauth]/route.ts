import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET}`,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }: any) {
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard"
    },

    async signIn({ user, account, profile, email, credentials }:any) {
    
      return true // Return false to deny access
    },

    async jwt({ token, user, account, profile }:any) {

      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }

      return token
    },

    async session({ session, token, user }:any) {
   
      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      session.user.image = token.picture

      return session
    },
  },
})

export { handler as GET, handler as POST }
