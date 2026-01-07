export function Sidebar({ categories, selectedCategory, onCategorySelect }) {
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
    </aside>
  );
}
