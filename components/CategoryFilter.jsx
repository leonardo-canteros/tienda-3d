// components/CategoryFilter.jsx
export default function CategoryFilter({
  categorias,
  categoriaSeleccionada,
  onSelect,
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center md:justify-end">
      {categorias.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            categoriaSeleccionada === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-800 hover:bg-gray-700 text-gray-300"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
