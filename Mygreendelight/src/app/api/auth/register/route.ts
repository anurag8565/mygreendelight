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
            return NextResponse.json({ message: "all fields are required" }, { status: 400 })
        }

        const existuser = await User.findOne({ 
            email: { $regex: new RegExp(`^${email}$`, "i") } 
        })
        if (existuser) {
            return NextResponse.json({ message: "email already exist" }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "password must be at least 6 characters" }, { status: 400 })
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



        return NextResponse.json(
            user, { status: 201 });

    } catch (error: any) {

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
