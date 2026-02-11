"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { QRCodeCanvas } from "qrcode.react";

export default function QRDisplayPage() {
  const params = useParams();
  const router = useRouter();
  const cafeId = typeof params?.id === "string" ? params.id : undefined;

  const [cafeName, setCafeName] = useState("Loading...");

  // ✅ Fetch café name from Supabase
  useEffect(() => {
    if (!cafeId) return;

    const fetchCafe = async () => {
      const { data, error } = await supabase
        .from("cafes")
        .select("name")
        .eq("id", cafeId)
        .single();

      if (!error && data) {
        setCafeName(data.name);
      } else {
        setCafeName("Café");
      }
    };

    fetchCafe();
  }, [cafeId]);

  // ✅ Compute menuUrl inline (no state, no effect)
  const menuUrl =
    typeof window !== "undefined" && cafeId
      ? `${window.location.origin}/qr/cafes/${cafeId}/menu`
      : "";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-linear-to-b from-white to-gray-50 px-6 py-12">
      {/* Café Name */}
      <h1 className="text-3xl font-bold mb-6">{cafeName}</h1>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        {menuUrl ? (
          <QRCodeCanvas
            value={menuUrl}
            size={256}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        ) : (
          <span className="text-gray-500">Loading QR...</span>
        )}
      </div>

      {/* Instruction Text */}
      <p className="text-center text-gray-600 mb-8">
        Scan the QR code to view the menu, or tap the button below.
      </p>

      {/* Fallback Button */}
      <button
        onClick={() => router.push(`/qr/cafes/${cafeId}/menu`)}
        className="w-full max-w-xs bg-linear-to-r from-amber-600 to-amber-800 text-white py-3 rounded-full font-medium shadow-lg hover:opacity-90 transition"
      >
        View Menu
      </button>
    </main>
  );
}
