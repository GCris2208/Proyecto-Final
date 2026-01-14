document.getElementById('sendChat').addEventListener('click', async () => {
    const input = document.getElementById('chatInput');
    const textoUsuario = input.value;
    if (!textoUsuario) return;
    agregarMensajeAlChat(textoUsuario, 'user');
    input.value = '';
    const respuestaIA = await enviarMensajeGemini(textoUsuario);
    agregarMensajeAlChat(respuestaIA.mensaje, 'bot');
    if (respuestaIA.recomienda_filtro) {
        mostrarBotonFiltro(respuestaIA.filtros);
    }
});

function agregarMensajeAlChat(mensaje, sender) {
    const chatContainer = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `d-flex mb-3 ${sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`;
    const bubble = document.createElement('div');
    bubble.className = sender === 'user' 
        ? 'bg-dark text-white p-3 rounded-3 shadow-sm' 
        : 'bg-white text-dark p-3 rounded-3 shadow-sm';
    bubble.style.fontSize = "0.9rem";
    bubble.style.maxWidth = "80%";
    bubble.textContent = mensaje;
    div.appendChild(bubble);
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// ACTUALIZA ESTO EN main.js
function mostrarBotonFiltro(filtros) {
    const chatContainer = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'd-flex mb-3 justify-content-start';
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-outline-dark mt-1';
    btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Ver productos recomendados';
    btn.onclick = () => {
        console.log("--- INICIANDO FILTRADO DESDE CHAT ---");
        window.location.href = '#catalogo';
        if (window.filterByCategory) {
            let categoriaSugerida = filtros.category || '';
            console.log("1. IA sugirió:", categoriaSugerida);
            let categoriaTraducida = '';
            if (window.traducirCategoria) {
                categoriaTraducida = window.traducirCategoria(categoriaSugerida);
                console.log("2. Diccionario tradujo a:", categoriaTraducida);
            } else {
                console.warn("ADVERTENCIA: window.traducirCategoria no está definida.");
            }
            const categoriaFinal = categoriaTraducida || categoriaSugerida || 'all';
            console.log("3. Enviando al filtro:", categoriaFinal);
            window.filterByCategory(categoriaFinal); 
        } else {
            console.error("ERROR CRÍTICO: window.filterByCategory no existe.");
        }
    };
    div.appendChild(btn);
    chatContainer.appendChild(div);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

const inputChat = document.getElementById('chatInput');
if (inputChat) {
    inputChat.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            document.getElementById('sendChat').click();
        }
    });
}