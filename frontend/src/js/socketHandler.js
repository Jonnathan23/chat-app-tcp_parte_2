// socketHandler.js
const { Socket } = require('net');

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

        console.log('  -- data:', data.toString());                        

        if (onMessageReceived) onMessageReceived(data.toString());


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
                socket.write(username);
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
        socket.write(message);
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
        socket.write(user);
    }
};



module.exports = { connectToServer, sendMessage, setUsername };