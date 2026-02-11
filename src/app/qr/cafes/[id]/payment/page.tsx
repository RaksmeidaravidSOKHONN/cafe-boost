"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import type { CartItem } from "@/types/menu";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();

  const cafeId = typeof params?.id === "string" ? params.id : undefined;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setMounted(true);
  }, []);

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayNow = async () => {
    if (!cafeId || cart.length === 0) return;

    try {
      // 1️⃣ Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          cafe_id: cafeId,
          total,
          payment_method: paymentMethod,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2️⃣ Insert items
      const itemsToInsert = cart.map((item) => ({
        order_id: order.id,
        menu_id: item.id,
        name: item.name,
        sugar_level: item.sugarLevel,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      alert("Order placed successfully 🎉");

      localStorage.removeItem("cart");
      setCart([]);

      router.push(`/qr/cafes/${cafeId}/menu`);
    } catch (err) {
      console.error("FULL ERROR:", JSON.stringify(err, null, 2));
      alert("Failed to place order");
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <section className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold tracking-tight mb-4 animate-fade-in">
          Payment & Order Summary
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-fade-in delay-100">
          Review your cart and confirm payment.
        </p>

        {cart.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {Object.values(
                cart.reduce((acc, item) => {
                  const key = `${item.id}-${item.sugarLevel}`;
                  if (!acc[key]) {
                    acc[key] = { ...item };
                  } else {
                    acc[key].quantity += item.quantity;
                  }
                  return acc;
                }, {} as Record<string, CartItem>)
              ).map((item, index) => (
                <div
                  key={`${item.id}-${item.sugarLevel}-${index}`}
                  className="group bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-sm text-gray-600">
                      Sugar: {item.sugarLevel}
                    </p>
                  </div>
                  <div className="text-amber-700 font-medium">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="font-bold text-xl mb-6">
              Total: ${total.toFixed(2)}
            </div>

            {/* Payment Method */}
            <label className="block mb-2 font-medium">Payment Method</label>
            <select
              className="w-full border rounded-lg p-3 mb-6"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="khqr">KHQR</option>
              <option value="aba">ABA Pay</option>
            </select>

            {/* Confirm Button */}
            <button
              onClick={handlePayNow}
              className="w-full bg-linear-to-r from-amber-600 to-amber-800 text-white py-3 rounded-full font-medium shadow-lg hover:opacity-90 transition"
            >
              Confirm & Pay
            </button>
          </>
        )}
      </section>
    </main>
  );
}
