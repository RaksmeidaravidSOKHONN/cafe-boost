// components/MenuCard.tsx
import type { MenuItem } from "@/types/menu";

interface Props {
  item: MenuItem;
  isOrderEnabled?: boolean;
  onAddToCart?: (item: MenuItem) => void;
}

export default function MenuCard({ item, isOrderEnabled, onAddToCart }: Props) {
  return (
    <div className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
      {/* Icon or Category Emoji */}
      <div className="text-3xl mb-4">
        {/* {item.category === "Coffee" ? "☕" : item.category === "Tea" ? "🍵" : "🥐"} */}
      </div>

      {/* Item Name */}
      <h3 className="text-xl font-semibold mb-2">{item.name}</h3>

      {/* Description */}
      <p className="text-gray-600 mb-4">{item.description || "Delicious café item"}</p>

      {/* Price */}
      <p className="text-lg font-bold text-amber-700 mb-6">${item.price.toFixed(2)}</p>

      {/* Add to Cart Button */}
      {isOrderEnabled && onAddToCart && (
        <button
          onClick={() => onAddToCart(item)}
          className="inline-block bg-linear-to-r from-amber-600 to-amber-800 text-white px-5 py-2 rounded-full font-medium hover:opacity-90 transition"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
