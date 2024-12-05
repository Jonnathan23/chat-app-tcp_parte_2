const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { connectToServer, sendMessage, setUsername } = require('./js/socketHandler.js');


/**
 * @description Crea una ventana principal de Electron con las opciones predefinidas y
 * carga el archivo index.html en la misma. 
 * @returns {BrowserWindow} La ventana principal creada.
 */
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'js/preload.js'),
        }
    })

    mainWindow.loadFile(path.join(__dirname, 'index.html'))
}

app.whenReady().then(() => {
    createWindow()
    connectToServer((message) => {
        console.log(`Mensaje recibido del servidor en el proceso principal: ${message}`);
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow) {
            console.log(`Enviando mensaje al renderer: ${message}`);
            mainWindow.webContents.send('receive-message', message);
        } else {
            console.error('No se encontró una ventana activa para enviar el mensaje.');
        }
    });

    // Enviar mensajes al servidor
    ipcMain.on('send-message', (_, message) => sendMessage(message));

    // Configurar el nombre de usuario
    ipcMain.on('set-username', (_, user) => setUsername(user));


})