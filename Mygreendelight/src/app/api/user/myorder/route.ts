import OrderSuccess from "@/app/user/ordersuccess/page"
import { auth } from "@/auth"
import connectDb from "@/lib/db"
import Order from "@/model/order"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest){
 try {
    await connectDb()
    const session = await auth()
    const order=await Order.find({user:session?.user?.id}).populate("user").populate(
  "assigneddelliveryboy",
  "name mobile"
)
    if (!order) {
        return NextResponse.json({message:"not order found"},{status:400})
    }
    return NextResponse.json(order,{status:200})
 } catch (error) {
     return NextResponse.json({message:`order ${error}`},{status:500})
 }
}