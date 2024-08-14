import { useState, useEffect } from 'react';
import axios from "axios";
import { load, CashfreeInstance } from '@cashfreepayments/cashfree-js';
import { toast } from 'sonner';

function PaymentComponent() {
  const [cashfree, setCashfree] = useState<CashfreeInstance | null>(null);
  const [orderId, setOrderId] = useState("");

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

  const getSessionId = async () => {
    try {
      let res = await axios.get("/api/payment");
      if (res.data && res.data.payment_session_id) {
        console.log(res.data);
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.error("Error getting session ID:", error);
      toast.error("Failed to create payment session");
    }
  };

  const verifyPayment = async () => {
    try {
      let res = await axios.post("/api/verify", {
        orderId: orderId
      });
      if (res && res.data) {
        toast.success("Payment verified");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Failed to verify payment");
    }
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cashfree) {
      toast.error("Payment system not initialized");
      return;
    }
    try {
      let sessionId = await getSessionId();
      if (!sessionId) {
        throw new Error("Failed to get session ID");
      }
      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("Payment initialized");
        verifyPayment();
      });
    } catch (error) {
      console.error("Error handling payment:", error);
      toast.error("Failed to process payment");
    }
  };

  return (
    <>
      <h1>Cashfree payment gateway</h1>
      <div className="card">
        <button onClick={handleClick}>
          Pay now
        </button>
      </div>
    </>
  );
}

export default PaymentComponent;
