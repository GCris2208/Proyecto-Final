const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${VESTIA_CONFIG.API_KEY}`;

let chatHistory = JSON.parse(localStorage.getItem('vestia_chat_history')) || [];

const SYSTEM_INSTRUCTION = {
    role: "user",
    parts: [{
        text: `Eres "VestIA", un asistente de estilo experto y amable para una boutique de moda.
        TU OBJETIVO: Ayudar al usuario a encontrar ropa y sugerir combinaciones.
        REGLAS DE FORMATO:
        1. Responde SIEMPRE en formato JSON válido.
        2. Tu respuesta debe tener esta estructura exacta:
        {
            "mensaje": "Texto que leerá el usuario (amable y con emojis)",
            "recomienda_filtro": true/false, 
            "filtros": {
                "category": "nombre_categoria", 
                "color": "color_en_ingles",
                "price": "rango"
            }
        }
        3. No uses Markdown. Solo el objeto JSON crudo.`
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
        
        const aiResponseText = data.candidates[0].content.parts[0].text;
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
            mensaje: "Lo siento, tuve un error técnico. ¿Podemos intentar de nuevo?", 
            recomienda_filtro: false 
        };
    }
}