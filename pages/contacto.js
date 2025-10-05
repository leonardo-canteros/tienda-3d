// pages/contacto.jsx
import { useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [imagen, setImagen] = useState(null);

  // Capturar imagen desde drag o input
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setImagen(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setImagen(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  // Generar link de WhatsApp
  const enviarPorWhatsApp = () => {
    const telefono = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5493794000000"; // cambia esto
    const texto = `👋 Hola! Soy ${nombre || "un cliente"} y quiero hacer un trabajo personalizado.%0A
💬 ${mensaje || "Te dejo mi idea y la imagen."}`;

    // Si el usuario subió una imagen, avisamos que la envíe por el chat
    const aviso = imagen
      ? "%0A📸 (Adjuntaré una imagen en el chat)"
      : "";

    const url = `https://wa.me/${telefono}?text=${texto}${aviso}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">Contacto</h1>

        {/* Texto informativo */}
        <p className="text-gray-300 mb-10 text-center leading-relaxed">
          En Paraná 3D realizamos <span className="text-blue-400 font-semibold">trabajos personalizados</span>.
          Si tenés una idea o querés un diseño a medida, contanos tu propuesta y
          enviá una imagen de referencia. Te responderemos por WhatsApp para
          coordinar los detalles.
        </p>

        {/* Formulario */}
        <div className="bg-gray-900/80 p-6 rounded-xl shadow-lg space-y-6">
          <div>
            <label className="block mb-2 font-semibold">Tu nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Leonardo Canteros"
              className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">Tu mensaje</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Contame qué querés diseñar o imprimir..."
              rows="4"
              className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            ></textarea>
          </div>

          {/* Subida o arrastre de imagen */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer"
          >
            {imagen ? (
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={URL.createObjectURL(imagen)}
                  alt="preview"
                  className="w-40 h-40 object-cover rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-300">{imagen.name}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-400">
                  Arrastrá una imagen o{" "}
                  <label className="text-blue-400 underline cursor-pointer">
                    seleccioná una
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </p>
              </>
            )}
          </div>

          {/* Botón enviar */}
          <button
            onClick={enviarPorWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 transition text-white font-semibold py-3 rounded-lg text-lg"
          >
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
