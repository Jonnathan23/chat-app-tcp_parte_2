const crypto = require('crypto');

// Clave secreta y algoritmo de encriptación
const SECRET_KEY = '12345678901234567890123456789012'; // 32 caracteres
const ALGORITHM = 'aes-256-ctr';

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

module.exports = { encrypt, decrypt };