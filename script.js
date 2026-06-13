// ============================================
// SUBTLE STAR ANIMATION (Small falling stars)
// ============================================
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const starColors = ['#00f3ff', '#bc13fe', '#ffffff', '#ffd700'];

class Star {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = -5;
    this.size = Math.random() * 1.5 + 0.3; // Very small stars
    this.speed = Math.random() * 0.8 + 0.2; // Slow falling
    this.opacity = Math.random() * 0.6 + 0.2;
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    this.color = starColors[Math.floor(Math.random() * starColors.length)];
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.y += this.speed;
    this.opacity += this.twinkleSpeed;

    if (this.opacity > 0.8 || this.opacity < 0.1) {
      this.twinkleSpeed *= -1;
    }

    if (this.y > canvas.height) {
      this.reset();
    }
  }
}

// Create 200 small subtle stars
const stars = Array(200).fill().map(() => new Star());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  stars.forEach(star => {
    star.update();
    star.draw();
  });
  
  requestAnimationFrame(animate);
}

animate();

// ============================================
// PASSWORD GENERATOR
// ============================================
function generateSecurityKey(name, birthDate) {
  let hash = 0;
  const str = name.toLowerCase() + birthDate;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let key = '';
  let temp = Math.abs(hash);

  for (let i = 0; i < 20; i++) {
    key += chars[temp % chars.length];
    temp = Math.floor(temp / chars.length);
  }
  
  // Format: XXXX-XXXX-XXXX-XXXX
  return key.match(/.{1,4}/g).join('-');
}

// Form handling
const keyForm = document.getElementById('keyForm');
const nameInput = document.getElementById('name');
const birthDateInput = document.getElementById('birthDate');
const securityKeyDisplay = document.getElementById('securityKey');
const resultSection = document.getElementById('resultSection');
const copyBtn = document.getElementById('copyBtn');

keyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const birthDate = birthDateInput.value;

  if (!name || !birthDate) {
    alert('Please fill in all fields');
    return;
  }

  const key = generateSecurityKey(name, birthDate);
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
