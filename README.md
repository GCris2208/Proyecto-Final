# Proyecto-Final
Proyecto final POW Cristian Barrios. Marco Di Mare, Carlos Hernández

VestIA es un prototipo de e-commerce de moda que integra una inteligencia artificial generativa que te ayudara a ofrecer un servicio muy personalizado. El sistema permite buscar productos, gestionar un carrito de compras, recibir recomendaciones de estilo vía chat y analizar prendas mediante imágenes.

Tecnologias utilizadas:
-Frontend Core: HTML5, CSS3, JavaScript (ES6+ Vanilla).
-Framework UI: Bootstrap 5.3.2 (Sistema de rejilla, Modales, Offcanvas).
-Iconografía: FontAwesome 6.4.0.
-Inteligencia Artificial: Google Gemini 2.5 Flash API (Procesamiento de texto y visión).
-API de Datos: DummyJSON (Catálogo de productos ficticio).
-Persistencia: localStorage (Carrito, Historial de Chat, Perfil de Usuario).

Archivos del proyecto:
HTML
-index.html: Es el punto de entrada y que contiene una estructura semantica de la web (Navbar, Header/Hero, Catálogo, Modales).
  + Integra las librerías externas (Bootstrap, FontAwesome) y enlaza todos los scripts JS.

CSS
-css/styles.css: Define la identidad visual (inspirada en Nike/Moda minimalista).Define la identidad visual (inspirada en Nike/Moda minimalista).
  + Maneja variables CSS (:root), efectos hover, estilos del chat flotante y adaptaciones responsivas.

JAVASTCRIPT
-js/config.js: Se centra en una configuracion global. Contiene la API KEY de Gemini, la URL del modelo y la lista de categorías que se descargarán de la API de DummyJSON.

-js/products.js: Usa Promise.all y flatMap para descargar múltiples categorías de la API simultáneamente.
  + Genera las tarjetas HTML de los productos dinámicamente.
  + Filtra productos en tiempo real y traduce términos de búsqueda (ej: "zapatos" → "shoes") para coincidir con la API.

-js/cart.js: Gestiona el estado del carrito (array de objetos).
  + Funciones: addToCart, removeFromCart, updateQuantity
  + Simula la compra, guarda la orden en el historial del usuario y limpia el carrito.

-js/profile.js: Analiza el historial de compras del usuario para asignarle una "Insignia de Estilo" (ej: Sneakerhead, Estilo Caballero) basada en la categoría más comprada.
  +Gestiona la edición de datos del usuario (nombre, talla) y muestra el historial de pedidos.

-js/chatbot.js: Configura la conexion con google gemini
  + Contiene la SYSTEM_INSTRUCTION que fuerza a la IA a responder siempre en formato JSON.
  + Maneja la subida de imágenes, conversión a Base64 y envío a la IA para análisis de prendas.

-js/main.js: Controlador de la interfaz del Chat.
   + Recibe el JSON de la IA y decide qué hacer: mostrar un mensaje de texto o generar un botón de "Ver productos recomendados" que ejecuta filtros en el catálogo automáticamente.

js/filters.js: Maneja los eventos del DOM para la barra lateral y el menú de navegación.
 + Vincula los clics en enlaces (ej: "Hombre", "Vestidos") con la función de filtrado global.

Como ejecutarlo localmente: 
  + requisitos previos antes de probar:
      - TenerTener un editor de código (recomendado: VS Code).
      - Tener una conexión a internet activa (para cargar Bootstrap, FontAwesome y conectar con las APIs).

  + Paso a paso:
     1- Descargar el codigo y asegurar que tenga esta estructura
    /proyecto ├── index.html ├── css/ │ └── styles.css └── js/ ├── config.js ├── products.js ├── cart.js ├── chatbot.js ├── filters.js ├── profile.js └── main.js
    
    2- Abre el archivo js/config.js y verificar que la variable API_KEY tenga una clave válida de Google Gemini.
    3- Ejecutar con "Live Server":
      + Si usas VS Code, instala la extensión "Live Server".
      + Haz clic derecho sobre el archivo index.html.
      + Selecciona la opción "Open with Live Server" y esto abrira automaticamente tu navegador con una direccion omo http://127.0.0.1:5500.
      + Otra opcion es que el visual studio por la parte inferior de la pantalla hay como un estilo de barra que contiene varias cosas pero si observas bien estara la opcion de "live server" le das ahi y se hara el mismo proceso de que se abre el navegador automaticamente. 
