import { NextResponse } from 'next/server';
import crypto from 'crypto';
import  prisma  from '@/lib/prisma';

export async function POST(req: Request) {
    const body = await req.json();
    const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = body;

    const sign = razorpay_payment_id + "|" + razorpay_subscription_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY as string)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        try {
            const user = await prisma.user.findFirst({
                where: { subscriptionId: razorpay_subscription_id }
            });

            if (user) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { subscriptionStatus: 'active' }
                });
            }

            return NextResponse.json({ success: true });
        } catch (error) {
            console.error('Payment verification error:', error);
            return NextResponse.json({ success: false }, { status: 500 });
        }
    } else {
        return NextResponse.json({ success: false }, { status: 400 });
    }
}
