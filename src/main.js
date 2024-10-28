
const { app, BrowserWindow, ipcMain, screen } = require('electron')
const path = require('path');
let overlayWindow;

console.log('Hello from Electron 👋');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets/icons/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Cargar el preload.js compilado
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    mainWindow.loadURL('https://music.youtube.com')

    // Crear la ventana para el overlay
    overlayWindow = new BrowserWindow({
        width: 500,
        height: 160,
        frame: false,  // Sin marco
        transparent: true,  // Fondo transparente
        alwaysOnTop: true,  // Siempre arriba
        resizable: true,    // Permitir redimensionar
        movable: true,      // Permitir mover
        skipTaskbar: true, // No mostrar en la barra de tareas
        webPreferences: {
            preload: path.join(__dirname, 'preload-overlay.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    // Obtener el tamaño de la pantalla
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    // Establecer la posición de la ventana en la esquina inferior derecha
    overlayWindow.setPosition(width - overlayWindow.getBounds().width, height - overlayWindow.getBounds().height);

    overlayWindow.loadFile('src/overlay.html');  // Carga el HTML que mostrará el overlay

    ipcMain.on('update-music-info', (event, musicInfo) => {
        if (!overlayWindow || overlayWindow.isDestroyed()) return;  // Verificar si la ventana del overlay ha sido destruida

        console.log('Music info:', musicInfo);
        overlayWindow.webContents.send('update-overlay', musicInfo);  // Enviar datos a la ventana del overlay
    });

    // Si la ventana principal se cierra, salir de la aplicación
    mainWindow.on('closed', () => {
        app.quit();
    });

    mainWindow.on('close', (event) => {
        // Forzar el cierre sin importar el estado de la música
        mainWindow.destroy(); // Esto destruirá la ventana de inmediato
    });


    overlayWindow.on('closed', () => {
        app.quit();
    });

    // Quitar el menú de la aplicación
    // Menu.setApplicationMenu(null);  // Esto elimina el menú predeterminado
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
