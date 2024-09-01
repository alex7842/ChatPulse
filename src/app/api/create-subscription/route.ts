import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
    const body = await request.json();
    const { plan } = body;


    let instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_SECRET_KEY as string
    });

    const planId = process.env[`${plan.toUpperCase()}_PLAN_ID`] as string;

    if (!planId) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const result = await instance.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        quantity: 1,
        total_count: 1,
        addons: [],
        notes: {
            key1: 'Note',
            plan: plan
        }
    });

    return NextResponse.json(result);
}
