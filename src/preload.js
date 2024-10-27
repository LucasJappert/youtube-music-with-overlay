const { ipcRenderer, contextBridge } = require('electron');

// Capturar la información del DOM
const getMusicInfo = () => {
    const playerBar = document.querySelector('ytmusic-player-bar');

    // Título de la canción
    const title = playerBar?.querySelector('yt-formatted-string.title')?.getAttribute('title') || 'No title found';

    // Artista y álbum
    const artistAlbum = playerBar?.querySelector('yt-formatted-string.byline')?.getAttribute('title') || 'No artist or album found';

    // Tiempo transcurrido y duración
    const timeInfo = playerBar?.querySelector('#progress-bar')?.getAttribute('aria-valuetext') || 'No time info found';

    // Portada de la canción (thumbnail)
    const thumbnail = playerBar?.querySelector('img.image')?.getAttribute('src') || 'No thumbnail found';

    return { title, artistAlbum, timeInfo, thumbnail };
}

// Enviar la información periódicamente al proceso principal
setInterval(() => {
    const musicInfo = getMusicInfo();
    ipcRenderer.send('update-music-info', musicInfo);
}, 1000); // Actualización cada segundo

