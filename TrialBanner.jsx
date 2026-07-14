"use client";
import { useState } from "react";

export default function TrialBanner({ subscriptionStatus, trialDaysLeft }) {
  const [loading, setLoading] = useState(false);

  if (subscriptionStatus === "active") return null; // paying customer, no banner

  const goToCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/billing/checkout", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url; // Stripe's real hosted checkout page
  };

  const urgent = trialDaysLeft <= 5;

  return (
    <div className={urgent ? "trial-banner urgent" : "trial-banner"}>
      {trialDaysLeft > 0 ? (
        <span>{trialDaysLeft} day{trialDaysLeft === 1 ? "" : "s"} left in your free trial — no card needed until then.</span>
      ) : (
        <span>Your free trial has ended. Add a payment method to keep posting.</span>
      )}
      {urgent && (
        <button onClick={goToCheckout} disabled={loading}>
          {loading ? "Redirecting…" : "Add payment method"}
        </button>
      )}
    </div>
  );
}
