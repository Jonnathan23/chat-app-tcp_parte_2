const form = document.getElementById('myForm');
const listMessages = document.getElementById('listMessages');
const classOther = 'other-message';
const classMy = 'my-message';

/**
 * @description Enviar mensajes al servidor
 * @param {*} e 
 */
const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    if (message) {
        window.electron.sendMessage(message);
        addMessageToList(`Tú: ${message}`, classMy);
    }

    e.target.message.value = '';
};

/**
 * @description Añade mensajes a la lista
 * @param {string} message - mensaje del usuario o del servidor
 * @param {string} classStyle - nombre de la clase para el estilo css
 */
const addMessageToList = (message, classStyle) => {
    const li = document.createElement('li');
    li.classList.add(classStyle);
    li.textContent = message;
    listMessages.appendChild(li);
};


/**
 * @description Recibe mensajes del servidor
 */
window.electron.onMessage((message) => {
    addMessageToList(`${message}`, classOther);
});

// Manejar el evento del formulario
form.addEventListener('submit', handleSubmit);
