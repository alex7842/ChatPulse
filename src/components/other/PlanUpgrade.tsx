import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";


interface UpgradeButtonProps {
  plan: string;
  price: number;
}

const UpgradeButton: FC<UpgradeButtonProps> = ({ plan, price }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const calculateEndDate = (plan: string): Date => {
    const now = new Date();
    switch (plan) {
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        throw new Error('Invalid plan');
    }
  };

  const handleUpgrade = async () => {
    if (!session) {
      toast.error("Please sign in to upgrade");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/create-subscription', {
        userId: session.user.id,
        plan: plan
      });
      console.log(response.data);
      
      const { id: subscriptionId } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: 'DocXpert',
        description: `${plan} Subscription`,
        handler: async (response: any) => {
          const result = await axios.post('/api/verify-payment', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (result.data.success) {
            const startDate = new Date();
            const endDate = calculateEndDate(plan);
            
            const updateResult = await axios.post('/api/update-subscription', {
              userId: session.user.id,
              subscriptionId: subscriptionId,
              subscriptionPlan: 'PRO',
              subscriptionStartDate: startDate,
              subscriptionEndDate: endDate,
              subscriptionStatus: 'active'
            });

            if (updateResult.data.success) {
              console.log('Subscription details:', updateResult.data.user);
              toast.success("Subscription successful!");
              router.push("/f");
            } else {
              toast.error("Failed to update subscription details");
            }
          } else {
            toast.error("Subscription verification failed");
          }
        },
        prefill: {
          email: session.user?.email,
        },
        theme: {
          color: '#10B981',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to initiate upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleUpgrade} disabled={isLoading}>
      {isLoading
        ? "Processing..."
        : `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} - $${price}`}
    </Button>
  );
};

export default UpgradeButton;
