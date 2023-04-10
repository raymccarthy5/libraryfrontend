import React from "react";
import Stripe from "react-stripe-checkout";
import axios from "../api/axios";
import { toast } from "react-toastify";

const StripeCheckout = () => {
    async function handleToken(token) {
        console.log(token);
        await axios.post("/payment/charge", "", { 
            headers: {
            token: token.id,
            amount: 500,
            },
        }).then(() => {
            toast.success("Payment Success!");
            }).catch((err) => {
                const errorMessage = err.response?.data?.message || err.message || "An error occurred";
                toast.error(errorMessage);
            });
        }
    return (
        <div className="App">
            <Stripe
                stripeKey="pk_test_51Hs4PpDNHqlXLssuLBb1e6Diq8zmEWDewsbZ6VhDX1k1S0UNJpiZPnYPKt7mKdqqllq5QatcKnhax4ExJkoDLXvE002V3T0UDu"
                token={handleToken}
            />
        </div>
    );
}
export default StripeCheckout;