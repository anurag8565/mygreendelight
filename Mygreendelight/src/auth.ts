import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
import mongoose from "mongoose"

process.env.AUTH_TRUST_HOST = "true";

const FALLBACK_SECRET = "quickbasket_super_secret_key_2026_subziquick_production_jwt";
if (!process.env.AUTH_SECRET) {
    process.env.AUTH_SECRET = (process.env.NEXTAUTH_SECRET || "").trim() || FALLBACK_SECRET;
}
if (!process.env.NEXTAUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
}

const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID || "").trim();
const GOOGLE_CLIENT_SECRET = (process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET || "").trim();

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
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
                        role: user.role,
                        image: user.image || "",
                    }

                } catch (error) {
                    console.error("Authorize error:", error)
                    return null
                }
            }
        }),
        ...(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET
            ? [
                Google({
                    clientId: GOOGLE_CLIENT_ID,
                    clientSecret: GOOGLE_CLIENT_SECRET,
                })
            ]
            : [])
    ],
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" && user?.email) {
                try {
                    await connectDb();

                    const cleanEmail = user.email.trim().toLowerCase();
                    let existingUser = await User.findOne({
                        email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
                    });

                    if (!existingUser) {
                        existingUser = await User.create({
                            name: user.name || "Customer",
                            email: cleanEmail,
                            image: user.image,
                            password: "",
                            role: "user",
                            walletBalance: 50,
                            walletHistory: [
                                {
                                    amount: 50,
                                    type: "credit",
                                    description: "🎉 Welcome Farm Gift Bonus",
                                    date: new Date(),
                                },
                            ],
                        });

                        try {
                            const UserWallet = (await import("./model/wallet.model")).default;
                            await UserWallet.create({
                                user: existingUser._id,
                                balance: 50,
                                totalCashback: 50,
                                transactions: [
                                    {
                                        type: "credit",
                                        amount: 50,
                                        description: "🎉 Welcome Farm Gift Bonus",
                                        createdAt: new Date(),
                                    },
                                ],
                            });
                        } catch (wErr) {
                            console.warn("Wallet create error on Google signin:", wErr);
                        }
                    }

                    if (existingUser?._id) {
                        user.id = existingUser._id.toString();
                        (user as any).role = existingUser.role || "user";
                    }
                } catch (error) {
                    console.error("Google signIn DB sync error:", error);
                }
            }

            return true;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.role = (user as any).role || "user";
                if (user.image) token.picture = user.image;
                if (user.id && mongoose.Types.ObjectId.isValid(user.id)) {
                    token.id = user.id;
                }
            }

            // Guarantee token.id is the real MongoDB _id
            if (!token.id || !mongoose.Types.ObjectId.isValid(token.id as string)) {
                if (token.email) {
                    try {
                        await connectDb();
                        const dbUser = await User.findOne({
                            email: { $regex: new RegExp(`^${token.email}$`, "i") }
                        });
                        if (dbUser) {
                            token.id = dbUser._id.toString();
                            token.role = dbUser.role || "user";
                            if (dbUser.image && !token.picture) {
                                token.picture = dbUser.image;
                            }
                        }
                    } catch (err) {
                        console.error("JWT user db lookup error:", err);
                    }
                }
            }

            if (trigger === "update" && session?.role) {
                token.role = session.role;
            }

            return token;
        },

        async session({ session, token }) {
            if (session?.user) {
                session.user.id = (token.id || token.sub) as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = (token.role as string) || "user";
                if (token.picture) {
                    session.user.image = token.picture as string;
                }
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
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || FALLBACK_SECRET
})