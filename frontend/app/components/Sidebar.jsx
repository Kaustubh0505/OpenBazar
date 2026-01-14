import { PackagePlus, Store } from "lucide-react";
import { useRouter } from "next/navigation";

export function Sidebar({ categories, selectedCategory, onCategorySelect }) {
  const router = useRouter();

  return (
    <aside className="w-full lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit sticky top-20">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Categories
      </h2>

      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full cursor-pointer text-left px-4 py-2.5 rounded-lg transition-colors ${selectedCategory === null
              ? "bg-gray-800 text-white font-medium"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            All Products
          </button>
        </li>

        {categories.map((category) => (
          <li key={category._id}>
            <button
              onClick={() => onCategorySelect(category._id)}
              className={`w-full cursor-pointer text-left px-4 py-2.5 rounded-lg transition-colors ${selectedCategory === category._id
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {category.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Thrift Marketplace Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
          Thrift Marketplace
        </h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => router.push('/sell-item')}
              className="w-full cursor-pointer text-left px-4 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2"
            >
              <PackagePlus className="h-4 w-4" />
              Sell Your Item
            </button>
          </li>
          <li>
            <button
              onClick={() => router.push('/thrift-store')}
              className="w-full cursor-pointer text-left px-4 py-2.5 rounded-lg transition-colors text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2"
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
