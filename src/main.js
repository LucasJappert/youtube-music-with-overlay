const { app, BrowserWindow, ipcMain, screen, Menu } = require('electron');
const path = require('path');
let overlayWindow;

console.log('Hello from Electron 👋');

const isDev = !app.isPackaged;

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'public/app-icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    console.log(process.env.NODE_ENV);
    mainWindow.loadURL('https://music.youtube.com');

    // Close the app when the main window is closed
    mainWindow.on('closed', () => app.quit());
    mainWindow.on('close', () => mainWindow.destroy());

    if (!isDev) Menu.setApplicationMenu(null);

    return mainWindow;
};

const createOverlayWindow = () => {
    overlayWindow = new BrowserWindow({
        width: 500,
        height: 160,
        icon: path.join(__dirname, 'public/app-icon.png'),
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        movable: true,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload-overlay.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    // Relocate the overlay to the bottom right corner of the screen
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    overlayWindow.setPosition(width - overlayWindow.getBounds().width, height - overlayWindow.getBounds().height);

    overlayWindow.loadFile('src/views/overlay-music/index.html');

    // Close the app when the overlay is closed
    overlayWindow.on('closed', () => app.quit());

    return overlayWindow;
};

// Event used for updating music information in the overlay
ipcMain.on('update-music-info', (event, musicInfo) => {
    if (overlayWindow && !overlayWindow.isDestroyed()) {
        console.log('Music info:', musicInfo);
        overlayWindow.webContents.send('update-overlay', musicInfo);
    }
});

// Close windows when the app is ready
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

// Close the app when all windows are closed in platforms other than macOS
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
