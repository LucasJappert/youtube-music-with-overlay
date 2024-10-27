const { ipcRenderer, contextBridge } = require('electron');

// Exponer la función para que el overlay reciba actualizaciones
contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateOverlay: (callback) => ipcRenderer.on('update-overlay', callback)
});
