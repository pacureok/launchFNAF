let inMenu = true;
let currentIndex = 0;
const totalCards = 11;
let hovering = false;
let down = true;
let up = false;
let left = false;
let right = true;
let deactivate = true;

let launcherKey = "launcherSHO";
let musicKey = "musicOnOff";
let soundKey = "soundOnOff";

let launcherSHO = localStorage.getItem(launcherKey);
let playMusic = localStorage.getItem(musicKey);
let playSound = localStorage.getItem(soundKey);

const select = new Audio('sounds/blip.wav');
const error = new Audio('sounds/error.wav');
const bm = new Audio('sounds/background.wav');
const back = new Audio('sounds/back.wav');

bm.volume = 0.75;
bm.loop = true;

const cardSelector = document.querySelectorAll('.game-card');
const cardSelectorSource = document.querySelectorAll('.game-card a'); // Esto selecciona los 'a' dentro de las '.game-card'
const menu = document.getElementById("menu");
const selection = document.getElementById("selection");
const options = document.querySelector('.launcher-options');
const musicIcon = document.querySelector('.music');
const soundIcon = document.querySelector('.sound');

// Arrays de enlaces (mantienen su propósito original para la lógica launcherSHO)
const steamlinks = [
    'steam://run/319510',
    'steam://run/332800',
    'steam://run/354140',
    'steam://run/388090',
    "javascript:alert('Sorry! We have not added a way to launch FNAF World yet...');",
    'steam://run/506610',
    'steam://run/738060',
    'steam://run/871720',
    'steam://run/732690',
    'steam://run/747660',
    'steam://run/2287520'
];

const htmllinks = [
    'https://pacureok.github.io/FNAF1/',
    'https://pacureok.github.io/FNAF2/',
    'https://pacureok.github.io/FNAF3/',
    'https://irv77.github.io/hd_fnaf/4/',
    'https://irv77.github.io/hd_fnaf/w/',
    "javascript:alert('Sorry! We have not added Sister Location to web browser yet...');",
    'https://irv77.github.io/hd_fnaf/ps/',
    'https://pacureok.github.io/UCNFNAF/', // UCN es el índice 7
    "javascript:alert('Sorry! There is not Help Wanted 1 in web browser...');",
    "javascript:alert('Sorry! There is not Security Breach in web browser...');",
    "javascript:alert('Sorry! There is not Help Wanted 2 in web browser...');"
];

// Inicialización de las preferencias de localStorage
if (!launcherSHO) { launcherSHO = 'steam'; localStorage.setItem(launcherKey, launcherSHO); }
if (!playMusic) { playMusic = 'true'; localStorage.setItem(musicKey, playMusic); }
if (!playSound) { playSound = 'true'; localStorage.setItem(soundKey, playSound); }

// Actualización inicial de los íconos
if (launcherSHO === 'off') { options.src = 'images/icons/launcher-off.svg'; }
if (launcherSHO === 'html') { options.src = 'images/icons/launcher-html.svg'; }
if (launcherSHO === 'steam') { options.src = 'images/icons/launcher-steam.svg'; }
if (playMusic === 'true') { musicIcon.src = 'images/icons/music.svg'; }
if (playMusic === 'false') { musicIcon.src = 'images/icons/music-off.svg'; }
if (playSound === 'true') { soundIcon.src = 'images/icons/sound.svg'; }
if (playSound === 'false') { soundIcon.src = 'images/icons/sound-off.svg'; }

function activator() {
    if (playSound === 'true') { back.currentTime = 0; back.play(); }
    menu.style.display = "none";
    selection.style.display = "flex";
    inMenu = false;
    setTimeout(function () {
        updateCarousel(); // Asegura que el carrusel se actualice al entrar
    }, 100);
    if (playMusic === 'true') {
        bm.play();
    }
}

function deactivator() {
    if (deactivate === true) {
        if (playSound === 'true') { back.currentTime = 0; back.play(); }
        setTimeout(function () {
            bm.pause();
            error.currentTime = 0; // Reinicia el sonido de error, aunque no se use aquí
        }, 10);

        menu.style.display = "flex";
        selection.style.display = "none";
        inMenu = true;
        hovering = false;
        down = true;
        up = false;
        left = false;
        right = true;
        // Esta parte es importante: si el launcher es 'html' o 'off', no desactivamos completamente la transición con "back"
        // ya que los enlaces directos en HTML ya habrán navegado.
        if (launcherSHO === 'html' || launcherSHO === 'off') { deactivate = false; }
        else { deactivate = true; } // Si es Steam, permitimos la desactivación completa.
    } else { // Si deactivate es false (ej. ya se navegó a un HTML), solo reproduce sonido de "back"
        if (playSound === 'true') { back.currentTime = 0; back.play(); }
    }
}

document.addEventListener('keydown', function (event) {
    if (inMenu === false) { // Solo si estamos en la selección de juegos
        // Movimiento izquierda
        if (event.keyCode == 37) {
            if (left === true) { gameSelection('left'); }
            else { if (playSound === 'true') { error.currentTime = 0; error.play(); } }
            // Actualiza los estados de dirección
            left = (currentIndex - 1 >= 0);
            right = true; // Siempre puedes moverte a la derecha si estás en la izquierda
        }
        // Movimiento derecha
        if (event.keyCode == 39) {
            if (right === true) { gameSelection('right'); }
            else { if (playSound === 'true') { error.currentTime = 0; error.play(); } }
            // Actualiza los estados de dirección
            right = (currentIndex + 1 < totalCards);
            left = true; // Siempre puedes moverte a la izquierda si estás en la derecha
        }
        // Movimiento abajo (para el botón PLAY)
        if (event.keyCode == 40) {
            if (down === true) { playButtonHover(true); } // Activa el hover del botón PLAY
            else { if (playSound === 'true') { error.currentTime = 0; error.play(); } }
            down = false;
            up = true;
        }
        // Movimiento arriba (para salir del botón PLAY)
        if (event.keyCode == 38) {
            if (up === true) { playButtonHover(false); } // Desactiva el hover del botón PLAY
            else { if (playSound === 'true') { error.currentTime = 0; error.play(); } }
            up = false;
            down = true;
        }

        // --- Lógica de Lanzamiento con Enter o Espacio ---
        if (event.keyCode == 13 || event.keyCode == 32) { // Tecla Enter o Espacio
            if (hovering === true) { // Si el botón PLAY está en hover
                const currentCardLink = cardSelectorSource[currentIndex].href; // Obtiene el href del <a> del botón PLAY
                if (currentCardLink && currentCardLink !== 'javascript:void(0)') {
                    window.open(currentCardLink, "_self"); // Abre la URL del href
                    // No llamas a deactivator aquí porque la página va a cambiar.
                    // Si quisieras un efecto antes de la navegación, lo pondrías aquí.
                } else {
                    // Si no hay un href válido (por ejemplo, si el launcherSHO es 'off'
                    // o el href es un alert como en FNAF World y SL en HTML)
                    if (playSound === 'true') { error.currentTime = 0; error.play(); }
                    deactivator(); // Vuelve al menú, asumiendo que no hay lanzamiento.
                }
            }
        }
    } else if (inMenu === true && event.keyCode == 13) { // Si está en el menú principal y presiona Enter
        activator();
    }
    // Lógica para el botón ESC (volver al menú principal)
    if (inMenu === false && event.keyCode == 27) {
        deactivate = true; // Asegura que la desactivación sea completa
        deactivator();
    }
});

function gameSelection(direction) {
    if (playSound === 'true') {
        select.currentTime = 0;
        select.play();
    }
    if (direction === "left") {
        if (currentIndex - 1 >= 0) {
            currentIndex--;
        } else {
            // Ya en el primer elemento, no se puede ir más a la izquierda
            if (playSound === 'true') { error.currentTime = 0; error.play(); }
            left = false;
            right = true;
            return; // Salir de la función para evitar actualizar el carrusel
        }
    } else if (direction === "right") {
        if (currentIndex + 1 < totalCards) {
            currentIndex++;
        } else {
            // Ya en el último elemento, no se puede ir más a la derecha
            if (playSound === 'true') { error.currentTime = 0; error.play(); }
            right = false;
            left = true;
            return; // Salir de la función
        }
    }
    updateCarousel();
    changeGameSelected(currentIndex);
    // Reiniciar hover al cambiar de juego
    if (hovering === true) {
        playButtonHover(true);
    } else {
        playButtonHover(false); // Asegura que el hover se desactive si no estaba activo
    }
    // Actualizar estados de dirección después del movimiento
    left = (currentIndex > 0);
    right = (currentIndex < totalCards - 1);
}


function playButtonHover(activate) { // Renombrado a 'activate' para mayor claridad
    cardSelector.forEach(card => card.classList.remove('hover'));
    if (playSound === 'true') {
        select.currentTime = 0;
        select.play();
    }
    if (activate === true) {
        cardSelector[currentIndex].classList.add('hover');
        hovering = true;
    } else {
        hovering = false;
    }
}

function launcherOptions() {
    if (playSound === 'true') { select.currentTime = 0; select.play(); } // Sonido al cambiar opción
    if (launcherSHO === 'steam') { launcherSHO = 'off'; options.src = 'images/icons/launcher-off.svg'; }
    else if (launcherSHO === 'off') { launcherSHO = 'html'; options.src = 'images/icons/launcher-html.svg'; }
    else if (launcherSHO === 'html') { launcherSHO = 'steam'; options.src = 'images/icons/launcher-steam.svg'; }
    localStorage.setItem(launcherKey, launcherSHO);
    changeGameSelected(currentIndex); // Vuelve a aplicar los enlaces según la nueva opción
}

function musicOption() {
    if (playSound === 'true') { select.currentTime = 0; select.play(); } // Sonido al cambiar opción
    if (playMusic === 'true') {
        playMusic = 'false';
        bm.pause();
        musicIcon.src = 'images/icons/music-off.svg';
        localStorage.setItem(musicKey, playMusic);
    } else if (playMusic === 'false') {
        playMusic = 'true';
        bm.play();
        musicIcon.src = 'images/icons/music.svg';
        localStorage.setItem(musicKey, playMusic);
    }
}

function soundOption() {
    if (playSound === 'true') { select.currentTime = 0; select.play(); } // Sonido al cambiar opción
    if (playSound === 'true') {
        playSound = 'false';
        soundIcon.src = 'images/icons/sound-off.svg';
        localStorage.setItem(soundKey, playSound);
    } else if (playSound === 'false') {
        playSound = 'true';
        soundIcon.src = 'images/icons/sound.svg';
        localStorage.setItem(soundKey, playSound);
    }
}

function updateCarousel() {
    const slider = document.querySelector('.cards-section');
    // Calcula el ancho de la tarjeta seleccionada (ya que puede variar)
    const selectedCardWidth = cardSelector[currentIndex].offsetWidth;
    // Calcula el ancho de una tarjeta 'normal' no seleccionada, por ejemplo, la primera
    // O puedes usar un valor fijo si todas tienen un ancho base similar
    const baseCardWidth = document.querySelector('.game-card').offsetWidth; // Ancho base de una tarjeta
    const cardGap = parseFloat(getComputedStyle(slider).gap); // Obtiene el valor del 'gap' CSS
    
    // Calcula la posición para centrar la tarjeta actual
    // La fórmula puede ser compleja debido a los diferentes tamaños y el gap
    // Un enfoque común es mover el slider por la diferencia entre la mitad del contenedor y la posición del centro de la tarjeta.
    
    // Aquí una simplificación que asume que el centro es el 'currentIndex' y el movimiento es relativo a eso.
    // Esta parte puede requerir ajustes finos dependiendo del CSS exacto y cómo se calcula el centro
    // La fórmula original era -currentIndex * (cardWidth / 2 + 5);
    // Para un carrusel donde el elemento seleccionado se mueve al centro, una mejor forma es usar scrollIntoView.
    
    // Alternativamente, si quieres mantener el translate, ajusta el cálculo:
    // El objetivo es alinear el centro de la tarjeta seleccionada con el centro visible del carrusel-container.
    // Esto es complejo con tamaños cambiantes y gaps. La solución de tu código original es una simplificación.
    // Por ahora, mantendremos tu enfoque de transform, pero la clave es centrar visualmente.

    // La función `changeGameSelected` ya maneja las escalas y el `order` CSS para centrar visualmente,
    // por lo que el `transform` aquí solo necesita mover el bloque general.
    // Si la idea es que la tarjeta seleccionada esté en el 'centro' real de la sección visible:
    
    // Puedes simplificar esto haciendo que el carrusel-container use `scroll-snap-align` en CSS
    // y luego usar `scrollIntoView` en el JS. Es más moderno y maneja mejor los tamaños variables.
    
    // Sin embargo, si quieres mantener el `transform`, tu lógica original con `cardWidth / 2 + 5` es un intento.
    // Para que funcione bien con tamaños variables y centrado, deberías calcular la posición de la tarjeta actual
    // y el centro del contenedor visible.

    // Por el momento, la solución más simple para asegurar la vista es centrar la tarjeta seleccionada en el contenedor padre
    // usando `scrollIntoView` o ajustando el `transform` para que el `selectedCard` sea el foco.
    
    // Una forma simple si no estás usando scroll-snap:
    // Mueve el slider para que la tarjeta actual esté al principio, luego ajusta
    const newPosition = -currentIndex * (selectedCardWidth + cardGap); // o un valor medio si los tamaños varían mucho
    slider.style.transform = `translateX(${newPosition}px)`;

    // Asegurarse de que el elemento seleccionado esté visible.
    // Esto es más robusto si el carrusel no se comporta exactamente con el transform.
    // cardSelector[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function changeGameSelected(index) {
    // Si el índice es el mismo, no hagas nada excepto reproducir el sonido (si es una re-selección manual)
    if (index === currentIndex && playSound === 'true') {
        select.currentTime = 0;
        select.play();
    }
    
    // Si el índice es diferente, actualiza currentIndex y los sonidos
    if (index !== currentIndex) {
        currentIndex = index;
        if (playSound === 'true') {
            select.currentTime = 0;
            select.play();
        }
    }

    // Actualiza los estados de izquierda/derecha
    left = (currentIndex > 0);
    right = (currentIndex < totalCards - 1);

    updateCarousel(); // Llama a updateCarousel para posicionar el slider

    // Restablece todas las clases de escala y hover
    cardSelector.forEach(card => {
        card.classList.remove('scale1', 'scale2', 'scale3', 'scale4', 'scale5', 'scale6', 'scale7', 'scale8', 'scale9', 'scale10');
        card.classList.remove('selected', 'hover'); // Elimina también 'selected' y 'hover'
    });

    // Aplica la clase 'selected' a la tarjeta actual
    cardSelector[currentIndex].classList.add('selected');

    // Aplica las clases de escala a las tarjetas adyacentes
    if (currentIndex - 1 >= 0) cardSelector[currentIndex - 1].classList.add('scale1');
    if (currentIndex + 1 < totalCards) cardSelector[currentIndex + 1].classList.add('scale1');
    if (currentIndex - 2 >= 0) cardSelector[currentIndex - 2].classList.add('scale2');
    if (currentIndex + 2 < totalCards) cardSelector[currentIndex + 2].classList.add('scale2');
    if (currentIndex - 3 >= 0) cardSelector[currentIndex - 3].classList.add('scale3');
    if (currentIndex + 3 < totalCards) cardSelector[currentIndex + 3].classList.add('scale3');
    if (currentIndex - 4 >= 0) cardSelector[currentIndex - 4].classList.add('scale4');
    if (currentIndex + 4 < totalCards) cardSelector[currentIndex + 4].classList.add('scale4');
    if (currentIndex - 5 >= 0) cardSelector[currentIndex - 5].classList.add('scale5');
    if (currentIndex + 5 < totalCards) cardSelector[currentIndex + 5].classList.add('scale5');
    if (currentIndex - 6 >= 0) cardSelector[currentIndex - 6].classList.add('scale6');
    if (currentIndex + 6 < totalCards) cardSelector[currentIndex + 6].classList.add('scale6');
    if (currentIndex - 7 >= 0) cardSelector[currentIndex - 7].classList.add('scale7');
    if (currentIndex + 7 < totalCards) cardSelector[currentIndex + 7].classList.add('scale7');
    if (currentIndex - 8 >= 0) cardSelector[currentIndex - 8].classList.add('scale8');
    if (currentIndex + 8 < totalCards) cardSelector[currentIndex + 8].classList.add('scale8');
    if (currentIndex - 9 >= 0) cardSelector[currentIndex - 9].classList.add('scale9');
    if (currentIndex + 9 < totalCards) cardSelector[currentIndex + 9].classList.add('scale9');
    if (currentIndex - 10 >= 0) cardSelector[currentIndex - 10].classList.add('scale10');
    if (currentIndex + 10 < totalCards) cardSelector[currentIndex + 10].classList.add('scale10');


    // --- Lógica para establecer el href dinámicamente según launcherSHO ---
    // ¡IMPORTANTE! Esto se encargará de los enlaces para TODOS los juegos.
    // Si ya tienes un `href` directo en el HTML para FNAF 1, 2, 3 y UCN,
    // esta parte del JavaScript sobrescribirá el `href` del HTML si `launcherSHO` no es 'html'.
    // Si quieres que el HTML tenga la máxima prioridad para esos 4 juegos,
    // puedes añadir una condición aquí para no modificar sus href si ya están definidos.

    // Este es el ajuste clave: para FNAF 1, 2, 3, UCN (índice 7), siempre queremos su HTML Link.
    // Para los demás, seguimos la lógica de launcherSHO.
    
    // Primero, asegura que `cardSelectorSource` sea un array iterable y que el elemento exista.
    // También asegúrate de que el botón PLAY esté dentro de una etiqueta `<a>` dentro de `.game-card`.

    const currentCardAnchor = cardSelector[currentIndex].querySelector('a');

    if (currentCardAnchor) { // Asegura que el <a> exista dentro de la tarjeta
        // Indices de los juegos que deben ir SIEMPRE a la web HTML específica
        const specificHtmlGames = [0, 1, 2, 7]; // FNAF 1, 2, 3, UCN

        if (specificHtmlGames.includes(currentIndex)) {
            currentCardAnchor.href = htmllinks[currentIndex]; // Siempre apunta al HTML
            deactivate = false; // Asumimos que no queremos que vuelva automáticamente si esto se lanza
        } else {
            // Para otros juegos, sigue la lógica de launcherSHO
            if (launcherSHO === 'off') {
                currentCardAnchor.href = 'javascript:void(0)';
                deactivate = false;
            } else if (launcherSHO === 'html') {
                currentCardAnchor.href = htmllinks[currentIndex];
                deactivate = false;
            } else if (launcherSHO === 'steam') {
                currentCardAnchor.href = steamlinks[currentIndex];
                deactivate = true; // Si es Steam, permitimos la desactivación para volver al launcher
            }
        }
    } else {
        console.warn(`No se encontró el elemento <a> dentro de la tarjeta con índice ${currentIndex}`);
    }

    // Mantener el estado de hover si ya estaba activo
    if (hovering === true) {
        cardSelector[currentIndex].classList.add('hover');
    } else {
        hovering = false; // Asegurarse de que `hovering` sea `false` si no está en hover
    }
}

function loaded() {
    setTimeout(function () {
        console.clear();
    }, 10);
    updateCarousel();
    changeGameSelected(currentIndex); // Asegúrate de que el primer juego esté seleccionado y con los enlaces correctos al cargar
}

document.addEventListener('DOMContentLoaded', loaded);
