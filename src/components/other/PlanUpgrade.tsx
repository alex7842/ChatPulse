import { Button } from "@/components/ui/button";
import { CashfreeInstance, load } from "@cashfreepayments/cashfree-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface UpgradeButtonProps {
  plan: string;
  price: number;
}

interface PaymentSessionResponse {
  payment_session_id: string;
  order_id: string;
}

interface PaymentVerificationResponse {
  order_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
}

interface SubscriptionUpdateResponse {
  success: boolean;
}

const UpgradeButton: FC<UpgradeButtonProps> = ({ plan, price }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cashfree, setCashfree] = useState<CashfreeInstance | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const initializeCashfree = async () => {
      try {
        const cashfreeInstance = await load({
          mode: "sandbox",
        });
        setCashfree(cashfreeInstance);
      } catch (error) {
        console.error("Failed to initialize Cashfree:", error);
        toast.error("Failed to initialize payment system");
      }
    };
    initializeCashfree();
  }, []);

  const getSessionId = async (): Promise<string | null> => {
    try {
      const res = await axios.post<PaymentSessionResponse>("/api/payment", {
        plan,
        price,
      });
      if (res.data && res.data.payment_session_id) {
        console.log("Payment session created:", res.data);
        localStorage.setItem("currentOrderId", res.data.order_id);
        console.log("Order ID saved to localStorage:", res.data.order_id);
        return res.data.payment_session_id;
      }
      return null;
    } catch (error) {
      console.error("Error getting session ID:", error);
      toast.error("Failed to create payment session");
      return null;
    }
  };

  const verifyPayment = async () => {
    const storedOrderId = localStorage.getItem("currentOrderId");
    console.log(
      "Verifying payment. Retrieved orderId from localStorage:",
      storedOrderId,
    );
    if (!storedOrderId) {
      console.error("Order ID is missing from localStorage");
      toast.error("Order ID is missing. Cannot verify payment.");
      return;
    }
    try {
      const res = await axios.post<PaymentVerificationResponse>("/api/verify", {
        orderId: storedOrderId,
      });
      if (res.data && res.data.order_status === "PAID") {
        toast.success("Payment verified successfully");
        if (!session?.user?.id) {
          throw new Error("User ID is missing");
        }
        const updateRes = await axios.post<SubscriptionUpdateResponse>(
          "/api/update-subscription",
          {
            userId: session.user.id,
            newStatus: "pro",
            plan: plan,
          },
        );
        if (updateRes.data.success) {
          toast.success("Subscription updated successfully");
          localStorage.removeItem("currentOrderId");
          router.push("/f");
        } else {
          toast.error("Failed to update subscription");
        }
      } else {
        toast.error("Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment or updating subscription:", error);
      toast.error("Failed to verify payment or update subscription");
    }
  };

  const handleUpgrade = async () => {
    if (!session) {
      toast.error("Please sign in to upgrade");
      return;
    }

    if (!cashfree) {
      toast.error("Payment system not initialized");
      return;
    }

    setIsLoading(true);
    try {
      const sessionId = await getSessionId();
      if (!sessionId) {
        throw new Error("Failed to get payment session ID");
      }

      console.log(
        "Before checkout. OrderId from localStorage:",
        localStorage.getItem("currentOrderId"),
      );

      const checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };

      const result = await cashfree.checkout(checkoutOptions);
      if (result.error) {
        console.error("Payment error:", result.error);
        toast.error("Payment failed. Please try again.");
      } else if (result.paymentDetails) {
        console.log("Payment completed:", result.paymentDetails);
        console.log(
          "After checkout. OrderId from localStorage:",
          localStorage.getItem("currentOrderId"),
        );
        await verifyPayment();
      }
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
        : `Upgrade to ${plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Pro"} - $${price}`}
    </Button>
  );
};

export default UpgradeButton;
