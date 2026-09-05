import connectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { name, email: rawEmail, password } = await req.json();
        const email = rawEmail ? rawEmail.trim().toLowerCase() : "";
        if (!name || !email || !password) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const existuser = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, "i") } 
        });

        if (existuser) {
            if (existuser.password && existuser.password.length > 5) {
                return NextResponse.json({ message: "This email is already registered. Please sign in with your password." }, { status: 400 });
            }
            // If user was created via Google OAuth (password was empty), set their password now
            const hashedpassword = await bcrypt.hash(password, 10);
            existuser.password = hashedpassword;
            if (name) existuser.name = name;
            await existuser.save();
            return NextResponse.json(existuser, { status: 200 });
        }

        const hashedpassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedpassword,
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
        await user.save();

        try {
            const UserWallet = (await import("@/model/wallet.model")).default;
            await UserWallet.create({
                user: user._id,
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
            console.warn("Wallet create note:", wErr);
        }

        return NextResponse.json(user, { status: 201 });

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
    }
}
