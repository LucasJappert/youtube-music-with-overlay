const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
let overlayWindow;

console.log('Hello from Electron 👋');

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'assets/icons/icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadURL('https://music.youtube.com');

    // Cerrar la aplicación al cerrar la ventana principal
    mainWindow.on('closed', () => app.quit());
    mainWindow.on('close', () => mainWindow.destroy()); // Forzar destrucción al cerrar

    return mainWindow;
};

const createOverlayWindow = () => {
    overlayWindow = new BrowserWindow({
        width: 500,
        height: 160,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: true,
        movable: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload-overlay.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Posicionar el overlay en la esquina inferior derecha de la pantalla
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    overlayWindow.setPosition(width - overlayWindow.getBounds().width, height - overlayWindow.getBounds().height);

    overlayWindow.loadFile('src/views/overlay-music/index.html');

    // Salir de la aplicación si se cierra el overlay
    overlayWindow.on('closed', () => app.quit());

    return overlayWindow;
};

// Evento para actualizar la información de la música en el overlay
ipcMain.on('update-music-info', (event, musicInfo) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
        console.log('Music info:', musicInfo);
        overlayWindow.webContents.send('update-overlay', musicInfo);
    }
});

// Crear las ventanas al estar la aplicación lista
app.whenReady().then(() => {
    createMainWindow();
    createOverlayWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
            createOverlayWindow();
        }
    });
});

// Salir de la aplicación al cerrar todas las ventanas en plataformas que no sean macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
