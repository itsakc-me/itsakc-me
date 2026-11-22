// Main JavaScript for itsakc-me portfolio

// 1. Smooth Scrolling with Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// Get scroll value
lenis.on('scroll', (e) => {
  // console.log(e)
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// 2. Custom Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Smooth follow
function animateCursor() {
  let dx = mouseX - cursorX;
  let dy = mouseY - cursorY;
  
  cursorX += dx * 0.15;
  cursorY += dy * 0.15;
  
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  
  requestAnimationFrame(animateCursor);
}
requestAnimationFrame(animateCursor);

// Hover effect for links and buttons
const interactiveElements = document.querySelectorAll('a, button, .skill-orb');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});


// 3. Ambient Star Canvas
const canvas = document.createElement('canvas');
canvas.id = 'ambient-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function initCanvas() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  
  stars = [];
  for(let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      speed: Math.random() * 0.05
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#D9A07D'; // Blush canyon color
  
  stars.forEach(star => {
    ctx.globalAlpha = star.alpha;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Twinkle effect
    star.alpha += star.speed;
    if(star.alpha > 1 || star.alpha < 0) {
      star.speed = -star.speed;
    }
  });
  
  // Slowly rotate the stars slightly based on scroll position (optional)
  requestAnimationFrame(drawStars);
}

initCanvas();
drawStars();

window.addEventListener('resize', initCanvas);

// 4. GSAP Animations Initialization
document.addEventListener("DOMContentLoaded", (event) => {
  // Register GSAP ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);
  
  // Wind lines animation
  const windPaths = document.querySelectorAll('.wind-path');
  windPaths.forEach((path, index) => {
    // Randomize initial x position
    gsap.set(path, { x: -200 + (Math.random() * 200) });
    
    // Infinite flowing animation
    gsap.to(path, {
      x: 1000,
      duration: 10 + (Math.random() * 5),
      ease: "none",
      repeat: -1,
      delay: Math.random() * 2,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % 1000)
      }
    });
  });

  // Bouncing balls
  gsap.to('.ball-1', { y: -50, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.ball-2', { y: -30, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 });
  gsap.to('.ball-3', { y: -80, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1 });

  // Fade up elements
  const fadeElements = document.querySelectorAll('.fade-up');
  fadeElements.forEach(el => {
    gsap.from(el, {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });
});
