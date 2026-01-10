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