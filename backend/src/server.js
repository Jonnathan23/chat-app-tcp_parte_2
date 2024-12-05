const { encrypt, decrypt } = require('./encryption.js');
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
        console.log(` -- username: ${username} ----`)
        console.log(` -- user.socket !== autorMessage: ${user.socket !== autorMessage}`)
        if (user.socket !== autorMessage) {
            console.log(` -- user.socket && !user.socket.destroyed: ${user.socket && !user.socket.destroyed}`)
            if (user.socket && !user.socket.destroyed) {
                // Cliente activo: enviar el mensaje

                console.log(`       -- Enviando mensaje ${message}`);
                const encryptMessage = encrypt(message);                
                user.socket.write(encryptMessage);
            } else {
                // Cliente desconectado: guardar mensaje en la cola
                console.log(`  -- Cliente ${username} desconectado. Guardando mensaje en cola: [${message}]`);

                if (!user.originQueue) {
                    user.originQueue = autorMessage; // Registrar quién envió el mensaje
                }
                user.queue.push(message); // Guardar mensaje en cola

            }
        }
    }
};

/**
 * Manejar la conexión de los clientes
 */
server.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    const { remotePort } = socket;
    socket.setEncoding('utf-8');

    socket.on('data', (message) => {
        console.log('Usuarios registrados:');
        let i = 0;
        for (const [username] of users.entries()) {
            console.log(`${i + 1} username: ${username}`);
            i++
        }
        console.log('-------');

        if (!connections.has(socket)) {
            // Nuevo cliente: registro inicial
            const username = decrypt(message.trim());
            console.log(`Username: ${username} registrado para el puerto ${remotePort}`);

            connections.set(socket, username);

            if (!users.has(username)) {
                // Nuevo usuario, sin mensajes pendientes
                users.set(username, { socket, queue: [], originQueue: null });
                console.log(`Usuario ${username} registrado correctamente`);
            } else {
                // Usuario existente: reconexión
                const user = users.get(username);
                user.socket = socket; // Actualizar socket

                console.log(`Usuario ${username} reconectado. Enviando mensajes pendientes...`);
                let i = 0
                user.queue.forEach((msg) => {
                    console.log(`  - ${i}  mensaje: ${msg}`);
                    const originSocket = user.originQueue;
                    sendMessage(msg, originSocket);
                    console.log(`\n`)
                    i++
                });

                user.queue = []; // Limpiar la cola después de enviar
                user.originQueue = null
                console.log('---- Fin de los mensajes ----')
            }
        } else if (message === END) {
            // Cliente termina la conexión
            console.log(`Cliente ${remotePort} desconectado`);
            socket.end();
        } else {
            // Mensaje recibido de un cliente activo
            const decryptedMessage = decrypt(message.trim());
            const fullMessage = `${connections.get(socket)}: ${decryptedMessage}`;
            sendMessage(fullMessage, socket);
        }
    });

    socket.on('close', () => {
        const username = connections.get(socket);
        console.log(`Conexión cerrada para usuario ${username} (puerto ${remotePort})`);

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
