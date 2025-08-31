"use client";

import React, { useEffect, useState } from "react";

type CartCountdownProps = {
  createdAt: string; // ISO string like "2025-07-12T09:05:23.328Z"
};

const CartCountdown: React.FC<CartCountdownProps> = ({ createdAt }) => {
  const [timeLeft, setTimeLeft] = useState("");
console.log("dgfiaufhlasf")
  useEffect(() => {
    const expiryTime = new Date(createdAt).getTime() + 24 * 60 * 60 * 1000;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown(); // Run once immediately
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer); // Cleanup
  }, [createdAt]);

  return (
    <p className="text-sm text-red-500 hover:text-red-600">
      Your cart will expire in {timeLeft}
    </p>
  );
};

export default CartCountdown;
