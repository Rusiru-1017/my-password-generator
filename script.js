// Galaxy Animation
const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const neonColors = ['#00f3ff', '#bc13fe', '#ff0055', '#ffffff'];

class NeonStar {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -10;
    this.z = Math.random() * 3 + 0.5;
    this.size = Math.random() * 3 + 0.5;
    this.speed = Math.random() * 1 + 0.3;
    this.opacity = Math.random() * 0.8 + 0.2;
    this.twinkleSpeed = Math.random() * 0.03 + 0.01;
    this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  draw() {
    const pulseSize = this.size * (1 + Math.sin(this.pulsePhase) * 0.3);
    
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, pulseSize * 4
    );
    gradient.addColorStop(0, `rgba(${this.hexToRgb(this.color)}, ${this.opacity * 0.8})`);
    gradient.addColorStop(0.5, `rgba(${this.hexToRgb(this.color)}, ${this.opacity * 0.3})`);
    gradient.addColorStop(1, `rgba(${this.hexToRgb(this.color)}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseSize * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 20;
    ctx.shadowColor = this.color;
    ctx.fillStyle = `rgba(${this.hexToRgb(this.color)}, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '255, 255, 255';
  }

  update() {
    this.y += this.speed * this.z;
    this.opacity += this.twinkleSpeed;
    this.pulsePhase += 0.05;

    if (this.opacity > 1 || this.opacity < 0.1) {
      this.twinkleSpeed *= -1;
    }

    if (this.y > canvas.height) {
      this.reset();
    }
  }
}

const stars = Array(300).fill().map(() => new NeonStar());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Password Generator
function generateSecurityKey(name, birthYear) {
  let hash = 0;
  const str = name + birthYear;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=';
  let key = '';
  let temp = Math.abs(hash);

  for (let i = 0; i < 20; i++) {
    key += chars[temp % chars.length];
    temp = Math.floor(temp / chars.length);
  }
  return key;
}

const keyForm = document.getElementById('keyForm');
const nameInput = document.getElementById('name');
const birthYearInput = document.getElementById('birthYear');
const securityKeyDisplay = document.getElementById('securityKey');
const resultSection = document.getElementById('resultSection');
const copyBtn = document.getElementById('copyBtn');

keyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const birthYear = birthYearInput.value;

  if (!name || !birthYear) {
    alert('Please fill in all fields');
    return;
  }

  const key = generateSecurityKey(name, birthYear);
  securityKeyDisplay.textContent = key;
  resultSection.style.display = 'block';
});

copyBtn.addEventListener('click', () => {
  const key = securityKeyDisplay.textContent;
  navigator.clipboard.writeText(key).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied! ✓';
    setTimeout(() => { copyBtn.textContent = originalText; }, 2000);
  });
});
