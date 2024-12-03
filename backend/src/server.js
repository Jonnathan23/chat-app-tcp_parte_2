const crypto = require('crypto');

// Clave secreta y algoritmo de encriptación
const SECRET_KEY = '12345678901234567890123456789012'; // 32 caracteres
const ALGORITHM = 'aes-256-ctr';


const { Server } = require('net')
const server = new Server()

const port = 8000
const host = '0.0.0.0'
const END = 'END'

const connections = new Map()

//* Funciones

/**
 * @description Encriptar un mensaje
 * @param {*} text 
 * @returns void
 */
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Vector de inicialización
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};


/**
 * @description Desencriptar un mensaje
 * @param {*} encryptedText 
 * @returns void
 */
const decrypt = (encryptedText) => {
    const [iv, content] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()]);
    return decrypted.toString('utf-8');
};


/**
 * @description Enviar un mensaje a todos los clientes excepto el origen
 * @param {*} message -> mensaje de socket
 * @param {*} origin  -> Socket origen
 */
const sendMessage = (message, origin) => {
    for (const socket of connections.keys()) {
        if (socket !== origin) {
            console.log(message)
            const encryptedMessage = encrypt(message);           
            socket.write(encryptedMessage)
        }
    }
}


/**
 * @description Manejar la conexión de los clientes
 */
server.on('connection', (socket) => {
    console.log(`Cliente conectado: ${socket.remoteAddress}:${socket.remotePort}`);
    const { remotePort } = socket
    socket.setEncoding('utf-8')

    socket.on('data', (message) => {
        
        // Establece el nombre de usuario o envia mensaje
        if (!connections.has(socket)) {
            const username = decrypt(message.trim())
            console.log(`Username: ${username} set for ${remotePort}`)

            connections.set(socket, username)

            
        } else if (message === END) {
            console.log(`Conexion ${remotePort} finalizada`)
            socket.end()

        } else {       
            console.log(message)
            const decryptedMessage = decrypt(message);
            const fullMessage = `${connections.get(socket)}: ${decryptedMessage}`
            sendMessage(fullMessage, socket)
        }
    })

    socket.on('close', () => {
        console.log(`Conexion ${remotePort} finalizada`)
        connections.delete(socket)
    })
})

server.listen(port, host, () => {
    console.log(`Servidor TCP escuchando en el puerto ${port}`);
})