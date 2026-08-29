import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    await connectDb()

                    const rawEmail = credentials?.email as string
                    const email = rawEmail ? rawEmail.trim().toLowerCase() : ""
                    const password = credentials?.password as string

                    const user = await User.findOne({ 
                        email: { $regex: new RegExp(`^${email}$`, "i") } 
                    })

                    if (!user) return null

                    const isMatch = await bcrypt.compare(password, user.password)

                    if (!isMatch) return null

                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role

                    }

                } catch (error) {
                    console.error(error)
                    return null
                }
            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
        })
    ],
    callbacks: {
        async signIn({ user, account }) {

            if (account?.provider === "google") {

                await connectDb();

                let existingUser =
                    await User.findOne({
                        email: user.email,
                    });

                if (!existingUser) {

                    existingUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        password: "",
                        role: "user",
                    });

                }

                user.id = existingUser._id.toString();
                user.role = existingUser.role;
            }

            return true;
        },

        async jwt({ token, user, trigger, session }) {

            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }

            if (trigger === "update") {
                token.role = session.role;
            }

            return token;
        },

        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }

            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 10 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "quickbasket_super_secret_key_2026_random_string"
})