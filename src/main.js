
const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('path');
let overlayWindow;

console.log('Hello from Electron 👋');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Cargar el preload.js compilado
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    mainWindow.loadURL('https://music.youtube.com')

    // Crear la ventana para el overlay
    overlayWindow = new BrowserWindow({
        width: 400,
        height: 100,
        frame: true,  // Sin marco
        transparent: true,  // Fondo transparente
        alwaysOnTop: true,  // Siempre arriba
        resizable: true,    // Permitir redimensionar
        movable: true,      // Permitir mover
        webPreferences: {
            preload: path.join(__dirname, 'preload-overlay.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    overlayWindow.loadFile('src/overlay.html');  // Carga el HTML que mostrará el overlay

    ipcMain.on('update-music-info', (event, musicInfo) => {
        console.log('Music info:', musicInfo);
        overlayWindow.webContents.send('update-overlay', musicInfo);  // Enviar datos a la ventana del overlay
    });

    // Quitar el menú de la aplicación
    Menu.setApplicationMenu(null);  // Esto elimina el menú predeterminado
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// app.on('ready', () => {
//     createWindow()
// })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
