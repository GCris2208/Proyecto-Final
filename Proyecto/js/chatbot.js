const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${VESTIA_CONFIG.MODEL_NAME}:generateContent?key=${VESTIA_CONFIG.API_KEY}`;
let chatHistory = JSON.parse(localStorage.getItem('vestia_chat_history')) || [];
const SYSTEM_INSTRUCTION = {
    role: "user",
    parts: [{
        text: `Eres VestIA, un asistente de estilo experto y amable para una boutique de moda.
        TU OBJETIVO: Ayudar al usuario a encontrar ropa y sugerir combinaciones.
        
        IMPORTANTE: Tu respuesta debe ser SIEMPRE un JSON válido.
        
        REGLAS PARA EL CAMPO "filtros" -> "category":
        Debes analizar la intención del usuario y elegir la MEJOR categoría de esta lista estricta:
        
        1. "hombre" (Si busca ropa general de caballero)
        2. "mujer" (Si busca ropa general de dama)
        3. "zapatos" (Si busca calzado, tenis, botas)
        4. "franelas" (Si busca camisas, camisetas, t-shirts de hombre)
        5. "tops" (Si busca blusas, tops de mujer)
        6. "vestidos" (Si busca vestidos)
        7. "lentes" (Si busca gafas de sol)
        8. "bolsos" (Si busca carteras o bolsos)
        9. "todo" (Solo si pide ver todo el catálogo o no especifica nada)

        EJEMPLOS DE RAZONAMIENTO:
        - Usuario: "Busco ropa para salir de chico" -> category: "hombre"
        - Usuario: "Quiero unos tacones" -> category: "zapatos"
        - Usuario: "Necesito una camisa para la oficina" -> category: "franelas"
        - Usuario: "Quiero unos vestidos para un evento" -> category: "vestidos"
        - Usuario: "Busco algo para mi esposa" -> category: "mujer"

        ESTRUCTURA DE RESPUESTA JSON:
        {
            "mensaje": "Texto amable y corto para el usuario con emojis",
            "recomienda_filtro": true, 
            "filtros": {
                "category": "UNA_DE_LAS_OPCIONES_DE_ARRIBA", 
                "color": "nombre_color_en_ingles_o_null",
                "price": "rango_o_null"
            }
        }
        No uses Markdown. Solo el objeto JSON crudo.`
    }]
};
async function enviarMensajeGemini(userMessage) {
    try {
        const requestBody = {
            contents: [
                SYSTEM_INSTRUCTION, 
                ...chatHistory,     
                {
                    role: "user",
                    parts: [{ text: userMessage }]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) throw new Error(`Error API: ${response.status}`);

        const data = await response.json();
        
        let aiResponseText = data.candidates[0].content.parts[0].text;
        aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

        const aiResponseJson = JSON.parse(aiResponseText);

        chatHistory.push(
            { role: "user", parts: [{ text: userMessage }] },
            { role: "model", parts: [{ text: aiResponseText }] }
        );
        localStorage.setItem('vestia_chat_history', JSON.stringify(chatHistory));

        return aiResponseJson;

    } catch (error) {
        console.error("Error en chatbot:", error);
        return { 
            mensaje: "Lo siento, tuve un error técnico de conexión.", 
            recomienda_filtro: false 
        };
    }
}


function getImageBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
async function enviarImagenGemini(imageFile) {
  try {
    const base64Image = await getImageBase64(imageFile);

    const requestBody = {
      contents: [
        SYSTEM_INSTRUCTION,
        {
          role: "user",
          parts: [
            { text: "Analiza esta prenda y dame recomendaciones" },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error(`Error API: ${response.status}`);

    const data = await response.json();

    let aiResponseText = data.candidates[0].content.parts[0].text;
    aiResponseText = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const aiResponseJson = JSON.parse(aiResponseText);

    // Humanizar el JSON.
    let mensajeHumano = aiResponseJson.mensaje;

    if (aiResponseJson.filtros) {
      const { category, color, price } = aiResponseJson.filtros;
      let detalles = [];

      if (category && category !== "todo") {
        detalles.push(`Categoría: ${category}`);
      }
      if (color) {
        detalles.push(`Color: ${color}`);
      }
      if (price) {
        detalles.push(`Precio: ${price}`);
      }

      if (detalles.length > 0) {
        mensajeHumano += `\n\nDetalles sugeridos → ${detalles.join(", ")}`;
      }
    }

    // Mostrar en modal
    document.getElementById("resultadoTexto").innerText = mensajeHumano;
    document.getElementById("resultadoModal").style.display = "block";

    return aiResponseJson;

  } catch (error) {
    console.error("Error en enviarImagenGemini:", error);
    document.getElementById("resultadoTexto").innerText = "Error al analizar la imagen.";
    document.getElementById("resultadoModal").style.display = "block";
    return null;
  }
}

// Cerrar modal
document.getElementById("closeModal").onclick = function() {
  document.getElementById("resultadoModal").style.display = "none";
};

// Cerrar modal al hacer clic fuera
window.onclick = function(event) {
  const modal = document.getElementById("resultadoModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Botón que dispara el análisis
document.getElementById("sendImageBtn").addEventListener("click", async () => {
  const file = document.getElementById("imageInput").files[0];
  if (file) {
    await enviarImagenGemini(file);
  } else {
    alert("Por favor selecciona una imagen primero.");
  }
});