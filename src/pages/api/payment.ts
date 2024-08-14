import { Cashfree, OrderEntity } from 'cashfree-pg';
import crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';

Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  const orderId = hash.digest('hex');
  return orderId.substr(0, 12);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrderEntity | { error: string }>
) {
  if (req.method === 'POST') {
    try {
      const orderId = await generateOrderId();
      console.log("Generated orderId:", orderId);

      let request = {
        "order_amount": 1.00,
        "order_currency": "INR",
        "order_id": orderId,
        "customer_details": {
          "customer_id": "webcodder01",
          "customer_phone": "9999999999",
          "customer_name": "Web Codder",
          "customer_email": "webcodder@example.com"
        },
      };

      const response = await Cashfree.PGCreateOrder("2023-08-01", request);
      console.log("Cashfree response:", response.data);
      
      // Ensure we're returning the order_id in the response
      res.status(200).json({
        ...response.data,
        order_id: orderId
      });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}