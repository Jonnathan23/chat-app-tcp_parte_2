const form = document.getElementById('myForm');
const listMessages = document.getElementById('listMessages');
const classOther = 'other-message';
const classMy = 'my-message';

const handleSubmit = (e) => {
    e.preventDefault();
    const message = e.target.message.value;

    if (message) {
        window.electron.sendMessage(message);
        addMessageToList(`Tú: ${message}`, classMy);
    }

    e.target.message.value = '';
};

const addMessageToList = (message, classStyle) => {    
    const li = document.createElement('li');
    li.classList.add(classStyle);
    li.textContent = message;
    listMessages.appendChild(li);
    console.log(`Mensaje añadido al DOM: ${message}`);
};

window.electron.onMessage((message) => addMessageToList(`${message}`, classOther));

form.addEventListener('submit', handleSubmit);