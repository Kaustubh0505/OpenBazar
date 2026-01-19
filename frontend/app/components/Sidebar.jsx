import { PackagePlus, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar({ categories, selectedCategory, onCategorySelect }) {
  const router = useRouter();

  return (
    <aside
      className="
        w-full lg:w-64
        bg-white
        border border-gray-200
        rounded-sm
        p-5
        h-fit
        sticky top-24
      "
    >
      {/* Title */}
      <h2 className="text-lg font-semibold text-black mb-5 tracking-wide">
        Categories
      </h2>

      {/* Categories */}
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className={`
              w-full text-left px-4 py-2 text-sm transition cursor-pointer
              ${selectedCategory === null
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            All Products
          </button>
        </li>

        {categories.map((category) => (
          <li key={category._id}>
            <button
              onClick={() => onCategorySelect(category._id)}
              className={`
                w-full text-left px-4 py-2 text-sm transition cursor-pointer
                ${selectedCategory === category._id
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Thrift Marketplace */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4 tracking-wider">
          Thrift Marketplace
        </h3>

        <ul className="space-y-1">
          <li>
            <button
              onClick={() => router.push("/sell-item")}
              className="
                w-full flex items-center gap-3
                px-4 py-2 text-sm
                text-gray-700
                hover:bg-gray-100
                transition
                cursor-pointer
              "
            >
              <PackagePlus className="h-4 w-4" />
              Sell Your Item
            </button>
          </li>

          <li>
            <button
              onClick={() => router.push("/thrift-store")}
              className="
                w-full flex items-center gap-3
                px-4 py-2 text-sm
                text-gray-700
                hover:bg-gray-100
                transition
                cursor-pointer
              "
            >
              <Store className="h-4 w-4" />
              Buy Thrifted Items
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
