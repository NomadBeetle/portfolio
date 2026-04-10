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


const dot = document.querySelector(".cursor-dot");
const outline = document.querySelector(".cursor-outline");

window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Direct follow for the dot
    dot.style.left = `${posX}px`;
    dot.style.top = `${posY}px`;

    // Smooth follow for the outline
    outline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Add hover effect for buttons and links
const links = document.querySelectorAll('a, button');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        outline.style.backgroundColor = 'rgba(168, 85, 247, 0.1)';
    });
    link.addEventListener('mouseleave', () => {
        outline.style.transform = 'translate(-50%, -50%) scale(1)';
        outline.style.backgroundColor = 'transparent';
    });
});


init();

// --- Live System Stats Logic ---
const startTime = Date.now();
function updateSystemStats() {
    const cpu = document.getElementById('cpu-load');
    const mem = document.getElementById('mem-usage');
    const uptime = document.getElementById('uptime');

    if (cpu) cpu.innerText = `${Math.floor(Math.random() * 8 + 2).toString().padStart(2, '0')}%`;
    if (mem) mem.innerText = `${(Math.floor(Math.random() * 20) + 420)}MB`;
    
    if (uptime) {
        const diff = Math.floor((Date.now() - startTime) / 1000);
        const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
        const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const secs = (diff % 60).toString().padStart(2, '0');
        uptime.innerText = `${hrs}:${mins}:${secs}`;
    }
}
setInterval(updateSystemStats, 1000);

// --- Keyboard Navigation ---
document.addEventListener('keydown', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const key = e.key.toLowerCase();
        const routes = {
            'p': '#projects',
            'a': '#about',
            's': '#tech-stack',
            'c': '#contact',
            'h': '#' 
        };

        if (routes[key]) {
            e.preventDefault();
            
            // Special Case for Home
            if (key === 'h') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                showToast(`[ EXECUTING: cd ~/home ]`);
            } else {
                const target = document.querySelector(routes[key]);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    showToast(`[ EXECUTING: cd ${routes[key]} ]`);
                }
            }

            // Keep your visual feedback logic below this...
            const keysInLegend = document.querySelectorAll('.text-cyan-400');
            // ... (rest of your existing code)
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                showToast(`[ EXECUTING: cd ${routes[key]} ]`);
                window.navigator.vibrate(20); // Subtle haptic feedback for supported devices
            }
        }
    }
});

// --- Console Easter Egg ---
console.log(
    "%c NomadBeetle OS v1.0 %c Found a secret? Email me for a surprise. ",
    "color: #fff; background: #a855f7; padding: 5px 10px; border-radius: 5px 0 0 5px; font-family: monospace;",
    "color: #a855f7; background: #1e293b; padding: 5px 10px; border-radius: 0 5px 5px 0; font-family: monospace;"
);

// ==============================
// GSAP + ScrollTrigger setup
// ==============================
gsap.registerPlugin(ScrollTrigger);

// ==============================
// NAV SCROLL STATE
// ==============================
const nav = document.querySelector('.glass-nav');
const pathText = document.querySelector('.text-cyan-400');
const navSections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    
    // Dynamic Path Logic
    let current = 'home';
    navSections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    if(pathText) pathText.textContent = `~/${current}#`;
}, { passive: true });

// ==============================
// HERO CINEMATIC ENTRY
// ==============================
(function heroEntry() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-line, h1', { 
            opacity: 0, y: 50, skewY: 3, stagger: 0.12, duration: 1.1, delay: 0.3 
        })
      .from('#projects ~ section, #contact', { opacity: 0 }, 0)
      .from('.hero-image-wrap', { 
            opacity: 0, x: 40, duration: 1, ease: 'power2.out' 
        }, '-=0.7')
      .from('header', { 
            opacity: 0, y: -20, duration: 0.6 
        }, 0.1);
    
    // Boot text lines stagger
    const bootLines = document.querySelectorAll('.mono.text-lg.text-slate-400 span');
    bootLines.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(-8px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateX(0)';
        }, 800 + i * 200);
    });
})();

// ==============================
// SCROLL REVEAL (Intersection Observer)
// ==============================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

window.addEventListener('load', () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
            el.classList.add('visible');
        }
    });
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 2000);
});

// Force reveal all on scroll stop (belt + suspenders)
let revealTimer;
window.addEventListener('scroll', () => {
    clearTimeout(revealTimer);
    revealTimer = setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight + 100) {
                el.classList.add('visible');
            }
        });
    }, 100);
}, { passive: true });

// Also run once immediately on load
window.addEventListener('load', () => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100) {
            el.classList.add('visible');
        }
    });
    // And force ALL after 2s no matter what
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 2000);
});

// Fallback: force-reveal anything still hidden after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 1200);
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ==============================
// SKILL BAR ANIMATION
// ==============================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.classList.add('animated');
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillSection = document.getElementById('system-core');
if (skillSection) skillObserver.observe(skillSection);

// ==============================
// SECTION LINE ANIMATION
// ==============================
// Inject animated lines after each h2
document.querySelectorAll('section h2.mono').forEach(h2 => {
    const line = document.createElement('div');
    line.className = 'section-line';
    h2.parentNode.insertBefore(line, h2.nextSibling);
    
    const lineObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('animated');
                lineObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    lineObs.observe(line);
});

// ==============================
// ACHIEVEMENT COUNTER ANIMATION
// ==============================
function animateCount(el, target, suffix = '') {
    const isFloat = target % 1 !== 0;
    let start = 0;
    const duration = 1400;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = isFloat
            ? (eased * target).toFixed(2)
            : Math.floor(eased * target);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
}

const achieveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('h3.text-4xl');
            counters.forEach(el => {
                const raw = el.textContent.trim();
                const hasPlus = raw.includes('+');
                const num = parseFloat(raw.replace('+', '').replace('%', ''));
                const suffix = hasPlus ? '+' : (raw.includes('%') ? '%' : '');
                animateCount(el, num, suffix);
            });
            achieveObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

const achieveSection = document.getElementById('achievements');
if (achieveSection) achieveObserver.observe(achieveSection);

// ==============================
// MOUSE PARALLAX (hero + star bg)
// ==============================
document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    // Hero image parallax
    const wrap = document.querySelector('.hero-image-wrap');
    if (wrap) {
        wrap.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
    }

    // Star field camera drift
    if (stars) {
        stars.rotation.x = dy * 0.06;
        stars.rotation.z = dx * 0.04;
    }
}, { passive: true });

// ==============================
// 3D CARD TILT
// ==============================
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotY = ((x - cx) / cx) * 8;
        const rotX = -((y - cy) / cy) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s linear';
    });
});

// ==============================
// MAGNETIC BUTTONS
// ==============================
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ==============================
// USER ID BADGE — click to copy + glitch
// ==============================
const badge = document.getElementById('user-id-badge');
if (badge) {
    badge.addEventListener('click', () => {
        navigator.clipboard.writeText('NomadBeetle').catch(() => {});
        showToast('[ HANDLE COPIED ]');
        badge.style.color = '#a855f7';
        setTimeout(() => { badge.style.color = ''; }, 800);
    });
}

// ==============================
// EMAIL LINK — click to copy
// ==============================
const emailLink = document.querySelector('a[href*="azaanahmed"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        // still opens Gmail — just also copies
        navigator.clipboard.writeText('azaanahmed1369@gmail.com').catch(() => {});
        showToast('[ EMAIL COPIED ]');
    });
}

// ==============================
// TOAST HELPER
// ==============================
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
}

// ==============================
// SCROLL-BASED THREE.JS COLOR SHIFT
// ==============================
window.addEventListener('scroll', () => {
    if (!stars) return;
    const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    // Shift star color from white → subtle purple as user scrolls
    const r = Math.round(255 - scrollFraction * 80);
    const g = Math.round(255 - scrollFraction * 170);
    const b = 255;
    stars.material.color.setRGB(r / 255, g / 255, b / 255);
}, { passive: true });

// ==============================
// TERMINAL TYPING EFFECT (about section)
// ==============================
(function setupTyping() {
    const aboutP = document.querySelector('#about .os-window p');
    if (!aboutP) return;
    const originalText = aboutP.textContent.trim();
    aboutP.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    aboutP.appendChild(cursor);

    let typed = false;
    const typingObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !typed) {
                typed = true;
                let i = 0;
                const interval = setInterval(() => {
                    if (i < originalText.length) {
                        aboutP.insertBefore(document.createTextNode(originalText[i]), cursor);
                        i++;
                    } else {
                        clearInterval(interval);
                        // cursor stays blinking
                    }
                }, 22);
                typingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    typingObserver.observe(aboutP);
})();

document.addEventListener('keydown', (e) => {
    // Only trigger if not typing in an input (if you add any later)
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const key = e.key.toLowerCase();
        
        const routes = {
            'p': '#projects',
            'a': '#about',
            's': '#tech-stack',
            'c': '#contact',
            'h': '#' // Home
        };

        if (routes[key]) {
            e.preventDefault();
            document.querySelector(routes[key]).scrollIntoView({ behavior: 'smooth' });
            showToast(`[ EXECUTING: cd ${routes[key]} ]`);
        }
    }
});

// const startTime = Date.now();
// function updateSystemStats() {
//     // Fake CPU fluctuation
//     document.getElementById('cpu-load').innerText = 
//         `${Math.floor(Math.random() * 10 + 2).toString().padStart(2, '0')}%`;
    
//     // Uptime calculation
//     const diff = Math.floor((Date.now() - startTime) / 1000);
//     const hrs = Math.floor(diff / 3600).toString().padStart(2, '0');
//     const mins = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
//     const secs = (diff % 60).toString().padStart(2, '0');
//     document.getElementById('uptime').innerText = `${hrs}:${mins}:${secs}`;
// }
// setInterval(updateSystemStats, 1000);

console.log(
    "%c NomadBeetle OS v1.0 %c Found a secret? Email me for a surprise. ",
    "color: #fff; background: #a855f7; padding: 5px 10px; border-radius: 5px 0 0 5px; font-family: monospace;",
    "color: #a855f7; background: #1e293b; padding: 5px 10px; border-radius: 0 5px 5px 0; font-family: monospace;"
);