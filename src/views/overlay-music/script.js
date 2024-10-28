// Generar barras de ecualizador dinámicamente
const equalizerContainer = document.querySelector('.equalizer');
const barCount = 20;

for (let i = 1; i <= barCount; i++) {
    const bar = document.createElement('div');
    bar.style.setProperty('--i', i);
    equalizerContainer.appendChild(bar);
}

// Helper para conversión de tiempo a segundos
function convertToSeconds(timeString) {
    const [minutes, seconds] = timeString.split(':').map(Number);
    return minutes * 60 + seconds;
}

const equalizerBars = document.querySelectorAll('.equalizer div');
let interval;

// Función para actualizar altura de barras del ecualizador
function updateBars() {
    equalizerBars.forEach((bar) => {
        bar.style.height = `${Math.floor(Math.random() * 20) + 4}px`;
        bar.style.transition = `height ${Math.random() * 0.3 + 0.2}s ease`;
    });
}

function pauseEqualizer() {
    clearInterval(interval);
    equalizerBars.forEach((bar) => bar.style.height = '4px');
}

function startEqualizer() {
    interval = setInterval(updateBars, 300);
}

let musicIsPlaying = false;
window.electronAPI.onUpdateOverlay((event, musicInfo) => {
    document.querySelector('.song-title').textContent = musicInfo.title || '';
    document.querySelector('.artist').textContent = musicInfo.artistAlbum || '';
    document.querySelector('.cover-art').src = musicInfo.thumbnail || 'default_thumbnail.png';

    const [currentTime, totalTime] = (musicInfo.timeInfo || '0:00 de 0:00').split(' de ');
    document.querySelector('.current-time').textContent = currentTime;
    document.querySelector('.total-time').textContent = totalTime;

    const currentTimeInSeconds = convertToSeconds(currentTime);
    const totalTimeInSeconds = convertToSeconds(totalTime);
    document.querySelector('.progress-bar').style.width = `${(currentTimeInSeconds / totalTimeInSeconds) * 100}%`;

    if (musicInfo.isPlaying && !musicIsPlaying) {
        musicIsPlaying = true;
        startEqualizer();
    } else if (!musicInfo.isPlaying && musicIsPlaying) {
        musicIsPlaying = false;
        pauseEqualizer();
    }
});
