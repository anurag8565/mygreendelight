import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDb from "./lib/db"
import User from "./model/user.model"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"

const FALLBACK_SECRET = "quickbasket_super_secret_key_2026_subziquick_production_jwt";

const googleClientId = (
    process.env.GOOGLE_CLIENT_ID ||
    process.env.AUTH_GOOGLE_ID ||
    process.env.GOOGLE_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    ""
).trim();

const googleClientSecret = (
    process.env.GOOGLE_CLIENT_SECRET ||
    process.env.AUTH_GOOGLE_SECRET ||
    process.env.GOOGLE_SECRET ||
    ""
).trim();

const providers: any[] = [
    Credentials({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
            try {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                await connectDb();

                const email = (credentials.email as string).trim().toLowerCase();
                const password = credentials.password as string;

                const user = await User.findOne({ 
                    email: { $regex: new RegExp(`^${email}$`, "i") } 
                });

                if (!user || !user.password) {
                    return null;
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role || "user",
                    image: user.image || "",
                };

            } catch (error) {
                console.error("Authorize error in NextAuth:", error);
                return null;
            }
        }
    })
];

if (googleClientId && googleClientSecret) {
    providers.push(
        Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
        })
    );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    trustHost: true,
    providers,
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
                            image: user.image || "",
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
                token.id = user.id || token.sub;
                token.name = user.name;
                token.email = user.email;
                token.role = (user as any).role || "user";
                if (user.image) token.picture = user.image;
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
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || FALLBACK_SECRET
})