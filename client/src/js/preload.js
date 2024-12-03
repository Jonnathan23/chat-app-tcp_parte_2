const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message) => ipcRenderer.send('send-message', message), // Enviar mensajes al main process
    onMessage: (callback) => ipcRenderer.on('receive-message', (_, message) => callback(message)), // Escuchar mensajes
    setUsername: (username) => ipcRenderer.send('set-username', username),
});
