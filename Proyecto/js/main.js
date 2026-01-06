document.getElementById('sendChat').addEventListener('click', async () => {
    const input = document.getElementById('chatInput');
    const textoUsuario = input.value;
    if (!textoUsuario) return;

    // 1. Mostrar mensaje del usuario
    agregarMensajeAlChat(textoUsuario, 'user');
    input.value = '';

    // 2. Llamar a la IA (Ahora funciona porque enviarMensajeGemini es global)
    // Agregamos un indicador de carga opcional aquí si quisieras
    const respuestaIA = await enviarMensajeGemini(textoUsuario);

    // 3. Mostrar respuesta de la IA
    agregarMensajeAlChat(respuestaIA.mensaje, 'bot');

    // 4. Botón mágico
    if (respuestaIA.recomienda_filtro) {
        mostrarBotonFiltro(respuestaIA.filtros);
    }
});

function agregarMensajeAlChat(mensaje, sender) {
    const chatContainer = document.getElementById('chat-messages');
    const div = document.createElement('div');
    
    // Clases para alinear izquierda (bot) o derecha (user)
    div.className = `d-flex mb-3 ${sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`;
    
    const bubble = document.createElement('div');
    // Estilos diferentes para usuario (oscuro) y bot (blanco)
    bubble.className = sender === 'user' 
        ? 'bg-dark text-white p-3 rounded-3 shadow-sm' 
        : 'bg-white text-dark p-3 rounded-3 shadow-sm';
    
    bubble.style.fontSize = "0.9rem";
    bubble.style.maxWidth = "80%";
    bubble.textContent = mensaje;
    
    div.appendChild(bubble);
    chatContainer.appendChild(div);
    
    // Auto-scroll al fondo
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function mostrarBotonFiltro(filtros) {
    const chatContainer = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'd-flex mb-3 justify-content-start'; // Alinear con el bot

    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-dark mt-1';
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Ver productos recomendados';
    btn.onclick = () => {
        console.log("Aplicando filtros:", filtros);
        window.location.href = '#catalogo';
        // Aquí conectarás con filters.js más adelante
        // aplicarFiltrosDesdeIA(filtros); 
    };
    
    div.appendChild(btn);
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}