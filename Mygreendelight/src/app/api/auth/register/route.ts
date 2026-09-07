import connectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectDb();
        const { name, email: rawEmail, password } = await req.json();
        const cleanEmail = rawEmail ? String(rawEmail).trim().toLowerCase() : "";
        const cleanName = name ? String(name).trim() : "";
        const cleanPassword = password ? String(password) : "";

        if (!cleanName || !cleanEmail || !cleanPassword) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        // 🛡️ Escape regex to prevent NoSQL regex injection
        const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const existuser = await User.findOne({ 
            email: { $regex: new RegExp(`^${escapedEmail}$`, "i") } 
        });
        if (existuser) {
            return NextResponse.json({ message: "An account with this email already exists" }, { status: 400 });
        }

        if (cleanPassword.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const hashedpassword = await bcrypt.hash(cleanPassword, 10);
        const user = new User({
            name: cleanName,
            email: cleanEmail,
            password: hashedpassword,
            role: "user", // 🛡️ Strict Role Enforcement (Zero Privilege Escalation)
            walletBalance: 0,
            walletHistory: [],
        });
        await user.save();

        try {
            const UserWallet = (await import("@/model/wallet.model")).default;
            await UserWallet.create({
                user: user._id,
                balance: 0,
                totalCashback: 0,
                transactions: [],
            });
        } catch (wErr) {
            console.warn("Wallet create note:", wErr);
        }



        const safeUser = {
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            walletBalance: user.walletBalance,
        };

        return NextResponse.json(
            { success: true, message: "Account created successfully", user: safeUser },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
