
const { Server } = require('net');
const server = new Server();

const port = 8000;
const host = '0.0.0.0';
const END = 'END';

// Almacenar las conexiones activas y los usuarios
const connections = new Map(); // socket -> username
const users = new Map(); // username -> { socket, queue, originQueue }

const sendMessage = (message, autorMessage) => {
    for (const [username, user] of users.entries()) {

        if (user.socket !== autorMessage) {

            if (user.socket && !user.socket.destroyed) {
                // Cliente activo: enviar el mensaje  
                console.log(`message: ${message}`)
                user.socket.write(message);
            } else {
                // Cliente desconectado: guardar mensaje en la cola
                if (!user.originQueue) {
                    user.originQueue = autorMessage; // Registrar quién envió el mensaje
                }
                console.log(message)
                user.queue.push(message); // Guardar mensaje en cola

            }
        }
    }
};

/**
 * Manejar la conexión de los clientes
 */
server.on('connection', (socket) => {
    const { remotePort } = socket;
    socket.setEncoding('utf-8');

    socket.on('data', (message) => {

        if (!connections.has(socket)) {
            // Nuevo cliente: registro inicial
            const username = message.trim()

            connections.set(socket, username);

            if (!users.has(username)) {
                // Nuevo usuario, sin mensajes pendientes
                users.set(username, { socket, queue: [], originQueue: null });
            } else {
                // Usuario existente: reconexiónc
                const user = users.get(username);
                user.socket = socket; // Actualizar socket

                setTimeout(() => {
                    const originSocket = user.originQueue;
                    user.queue.forEach((msg) => sendMessage(msg, originSocket));

                    user.queue = [];
                    user.originQueue = null
                }, 50)

            }
        } else if (message === END) {
            // Cliente termina la conexión            
            socket.end();
        } else {
            // Mensaje recibido de un cliente activo                        
            const fullMessage = `${connections.get(socket)}: ${message.trim()}`;
            sendMessage(fullMessage, socket);
        }
    });

    socket.on('close', () => {
        const username = connections.get(socket);

        if (username) {
            const user = users.get(username);
            if (user) {
                user.socket = null; // Marcar como desconectado
                connections.delete(socket);
            }
        }
    });
});

// Iniciar el servidor
server.listen(port, host, () => {
    console.log(`Servidor TCP escuchando en ${host}:${port}`);
});
