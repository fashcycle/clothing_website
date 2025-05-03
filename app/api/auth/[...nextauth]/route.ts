import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: "728166853981-5ijtecpp013m00fditbq17ko09h94qsc.apps.googleusercontent.com",
      clientSecret: "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",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }: any) {
      console.log("🔁 Redirect Callback: ", { url, baseUrl })
      return url.startsWith(baseUrl) ? url : baseUrl + "/dashboard"
    },

    async signIn({ user, account, profile, email, credentials }:any) {
      console.log("✅ SignIn Callback Triggered")
      console.log("👤 User:", user)
      console.log("📡 Account:", account)
      console.log("📄 Profile:", profile)
      return true // Return false to deny access
    },

    async jwt({ token, user, account, profile }:any) {
      console.log("🔐 JWT Callback Triggered")
      console.log("🧪 Token before update:", token)
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      console.log("✅ Token after update:", token)
      return token
    },

    async session({ session, token, user }:any) {
      console.log("🪪 Session Callback Triggered")
      console.log("📦 Token:", token)
      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      session.user.image = token.picture
      console.log("✅ Session returned:", session)
      return session
    },
  },
})

export { handler as GET, handler as POST }
