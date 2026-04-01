// --- Music Logic ---
const musicBtn = document.getElementById('music-toggle');
const audio = document.getElementById('bg-audio');
const statusText = document.getElementById('status-text');
const bars = document.querySelectorAll('.bar');

let isPlaying = false;

musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
        audio.play();
        musicBtn.innerText = '[ PAUSE ]';
        statusText.innerText = 'BGM: ON';
        statusText.style.color = '#22d3ee';
        bars.forEach(bar => bar.classList.add('playing'));
        isPlaying = true;
    } else {
        audio.pause();
        musicBtn.innerText = '[ PLAY ]';
        statusText.innerText = 'BGM: OFF';
        statusText.style.color = '#a855f7';
        bars.forEach(bar => bar.classList.remove('playing'));
        isPlaying = false;
    }
});

// --- Draggable Stickers (Fixed Initial Positions) ---
const stickers = document.querySelectorAll('.sticker');

stickers.forEach(sticker => {
    let isDragging = false;
    let offsetX, offsetY;

    sticker.addEventListener('mousedown', (e) => {
        isDragging = true;
        sticker.style.transition = 'none';
        const rect = sticker.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        sticker.style.zIndex = 1000;
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        
        const container = sticker.parentElement.getBoundingClientRect();
        let x = e.clientX - container.left - offsetX;
        let y = e.clientY - container.top - offsetY;

        sticker.style.left = `${x}px`;
        sticker.style.top = `${y}px`;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        sticker.style.transition = 'transform 0.3s ease';
    });
});

// --- Real-Time System Clock ---
function updateClock() {
    const timeElement = document.getElementById('sys-time');
    if (timeElement) {
        const now = new Date();
        timeElement.innerText = now.toLocaleTimeString();
    }
}
setInterval(updateClock, 1000);
updateClock();

// --- Three.js Background ---
let scene, camera, renderer, stars;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 1;
    camera.rotation.x = Math.PI/2;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 6000;
    const posArray = new Float32Array(starCount * 3);

    for(let i=0; i<starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 600;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true
    });

    stars = new THREE.Points(starGeo, starMaterial);
    scene.add(stars);
    animate();
}

function animate() {
    stars.rotation.y += 0.002;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();