/* UMD-style module that works in browser and in Node (for tests) */
(function (root, factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else {
    root.GreeterApp = factory();
  }
})(typeof window !== 'undefined' ? window : global, function () {
  let currentAnimation = null;
  let removeTimer = null;

  function clearCurrentAnimation() {
    if (removeTimer) {
      clearTimeout(removeTimer);
      removeTimer = null;
    }
    if (currentAnimation && currentAnimation.parentNode) {
      currentAnimation.parentNode.removeChild(currentAnimation);
      currentAnimation = null;
    }
  }

  function createConfetti(root) {
    const container = document.createElement('div');
    container.className = 'anim-confetti';
    const colors = ['#ef4444','#f59e0b','#f97316','#10b981','#60a5fa','#a78bfa'];
    const count = 28;
    for (let i=0;i<count;i++){
      const p = document.createElement('span');
      p.className = 'confetti-piece';
      const left = Math.round(Math.random()*100);
      p.style.left = `${left}vw`;
      p.style.top = `${-10 - Math.random()*10}vh`;
      p.style.background = colors[Math.floor(Math.random()*colors.length)];
      p.style.transform = `rotate(${Math.random()*360}deg)`;
      p.style.animationDelay = `${Math.random()*400}ms`;
      container.appendChild(p);
    }
    return container;
  }

  function createPaper(root) {
    const container = document.createElement('div');
    container.className = 'anim-paper';
    const count = 18;
    for (let i=0;i<count;i++){
      const p = document.createElement('div');
      p.className = 'paper';
      const left = Math.random()*100;
      p.style.left = `${left}vw`;
      p.style.top = `${-15 - Math.random()*10}vh`;
      p.style.background = `linear-gradient(90deg, hsla(${Math.floor(Math.random()*360)},80%,75%,.95), rgba(255,255,255,0.6))`;
      p.style.animationDelay = `${Math.random()*350}ms`;
      container.appendChild(p);
    }
    return container;
  }

  function createBurst(root) {
    const container = document.createElement('div');
    container.className = 'anim-burst';
    const c = document.createElement('div');
    c.className = 'burst-circle';
    container.appendChild(c);
    return container;
  }

  const animations = [
    { name: 'confetti', factory: createConfetti, duration: 2600 },
    { name: 'paper', factory: createPaper, duration: 2600 },
    { name: 'burst', factory: createBurst, duration: 1000 }
  ];

  function pickRandomAnimation() {
    return animations[Math.floor(Math.random()*animations.length)];
  }

  function triggerRandomAnimation(root) {
    clearCurrentAnimation();
    const choice = pickRandomAnimation();
    const el = choice.factory(root);
    currentAnimation = el;
    root.appendChild(el);
    // ensure cleanup
    removeTimer = setTimeout(() => {
      clearCurrentAnimation();
    }, choice.duration + 600);
    return choice.name;
  }

  function init(doc=document) {
    const input = doc.getElementById('nameInput');
    const btn = doc.getElementById('greetBtn');
    const greeting = doc.getElementById('greeting');
    const animRoot = doc.getElementById('animation-root');
    if (!input || !btn || !greeting || !animRoot) return;

    btn.addEventListener('click', () => {
      const text = input.value?.trim() ?? '';
      greeting.textContent = text ? `Hello ${text}` : 'Hello';
      // trigger a random animation (non-overlapping)
      triggerRandomAnimation(animRoot);
    });
  }

  return { init, _private: { clearCurrentAnimation, triggerRandomAnimation, animations } };
});
