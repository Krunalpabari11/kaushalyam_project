// File: app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '../../../../lib/auth'
import clientPromise from '../../../../lib/mongodb'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const client = await clientPromise
        const usersCollection = client.db().collection('users')
    
        const user = await usersCollection.findOne({ email: credentials.email })
        if (!user) {
          throw new Error('No user found!')
        }
    
        const isValid = await verifyPassword(credentials.password, user.password)
        if (!isValid) {
          throw new Error('Invalid password!')
        }
    
        return { id: user._id, email: user.email }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      return session
    }
  }
})

export { handler as GET, handler as POST }