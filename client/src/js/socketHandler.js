// socketHandler.js
const { Socket } = require('net');
const { encrypt, decrypt } = require('./encryption.js'); // Asegúrate de usar la ruta correcta

let socket;
let username = '';
const portHost = 8000;

/**
 * @description Contenedor de errores del socket
 */
const SocketErrors = {
    ECONNREFUSED: () => console.log('El servidor está inaccesible. Reintentando conexión...'),
    ECONNRESET: () => console.log('El servidor cerró la conexión inesperadamente. Reintentando...'),
    ETIMEDOUT: () => console.log('La conexión al servidor tardó demasiado. Reintentando...'),
};
const SocketErrorDefault = () => console.log('Error inesperado del socket');

/**
 * @description Configurar eventos para el socket
 * @param {Socket} socket - Instancia del socket
 * @param {Function} onMessageReceived - Callback para manejar mensajes del servidor
 */
const setupSocketEvents = (socket, onMessageReceived) => {

    socket.on('ready', () => console.log('Socket listo para enviar y recibir datos.'));

    socket.on('end', () => console.log('Servidor solicitó cierre de conexión.'));

    socket.on('timeout', () => console.warn('El socket ha entrado en tiempo de espera (timeout).'));


    // Evento 'data' recibe un mensaje del servidor
    socket.on('data', (data) => {

        const decryptedMessage = decrypt(data.toString());
        console.log('  -- Mensaje en el socketHandler.js:', decryptedMessage);
        console.log(`onMessageReceived ? ${onMessageReceived !== null}`);

        if (onMessageReceived) onMessageReceived(decryptedMessage);


    });

    socket.on('error', (err) => {
        console.error(' ----| | Error del socket | |---- ');
        const error = SocketErrors[err.code] || SocketErrorDefault;
        error();
    });

    socket.on('close', () => {
        console.log('Conexión cerrada.');
        setTimeout(() => {
            console.log('Intentando reconectar...');
            connectToServer(onMessageReceived);
        }, 3000);
    });
};

/**
 * @description Conectar al servidor
 * @param {Function} onMessageReceived - Callback para manejar mensajes del servidor
 */
const connectToServer = (onMessageReceived) => {
    try {
        socket = new Socket();
        socket.connect({ host: 'localhost', port: portHost }, () => {
            console.log('Conectado al servidor');
            if (username) {
                const encryptedUsername = encrypt(username);
                socket.write(encryptedUsername);
            }
        });

        setupSocketEvents(socket, onMessageReceived);
    } catch (error) {
        console.error('Error al conectar al servidor:', error);

    }
};

/**
 * @description Enviar un mensaje al servidor
 * @param {string} message - Mensaje a enviar
 */
const sendMessage = (message) => {
    if (socket && !socket.destroyed) {
        const encryptedMessage = encrypt(message);
        socket.write(encryptedMessage);
    } else {
        console.error('Socket no está conectado o está destruido');
    }
};

/**
 * @description Configurar el nombre de usuario
 * @param {string} user - Nombre de usuario
 */
const setUsername = (user) => {
    username = user;
    if (socket && !socket.destroyed) {
        const encryptedUsername = encrypt(user);
        socket.write(encryptedUsername);
    }
};



module.exports = { connectToServer, sendMessage, setUsername };