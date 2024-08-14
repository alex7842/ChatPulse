import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

console.log('Initializing Cashfree with environment:', process.env.NODE_ENV);

interface OrderResponse {
  order_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
  // Add other fields as needed
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OrderResponse | { error: string }>
) {
  console.log('Received request method:', req.method);
  console.log('Full request body:', req.body);

  if (req.method !== 'POST') {
    console.log('Invalid method:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId } = req.body;
  console.log('Order ID from request body:', orderId);

  if (!orderId) {
    console.error('Order ID is missing from request body');
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    console.log('Processing order ID:', orderId);

    const response = await axios.get<OrderResponse>(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          'x-api-version': '2023-08-01',
          'x-client-id': process.env.CASHFREE_CLIENT_ID!,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET!
        }
      }
    );

    console.log('Cashfree API response:', JSON.stringify(response.data));

    if (response.data && response.data.order_status) {
      return res.status(200).json(response.data);
    } else {
      console.error('Unexpected response format from Cashfree');
      return res.status(500).json({ error: 'Unexpected response from payment provider' });
    }
  } catch (error: unknown) {
    console.error('Error in payment verification:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        if (error.response.status === 404) {
          return res.status(404).json({ error: 'Order not found. Please check the order ID.' });
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        return res.status(500).json({ error: 'No response received from payment provider' });
      }
      return res.status(500).json({ error: error.message || 'An error occurred while verifying the payment' });
    } else if (error instanceof Error) {
      console.error('Error message:', error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.error('Unknown error:', error);
      return res.status(500).json({ error: 'An unknown error occurred while verifying the payment' });
    }
  }
}