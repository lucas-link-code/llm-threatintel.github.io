/* ============================================================
   LLM ThreatIntel — Neural Network Background Animation
   Renders animated connected nodes in the top portion of the page
   Optimized: no radial gradients, throttled framerate, visibility-aware
   ============================================================ */

(function() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId = null, lastFrame = 0;

  const NODE_COUNT = 45;
  const CONNECT_DIST = 180;
  const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
  const NODE_SPEED = 0.25;
  const FRAME_INTERVAL = 42; // ~24fps

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < NODE_COUNT; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.55,
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r: Math.random() * 2.5 + 1.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.015
    });
  }

  function draw(timestamp) {
    animId = requestAnimationFrame(draw);

    if (timestamp - lastFrame < FRAME_INTERVAL) return;
    lastFrame = timestamp;

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += n.pulseSpeed;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H * 0.55) n.vy *= -1;
    }

    // Batch all connection lines in a single path
    ctx.beginPath();
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = dx * dx + dy * dy;
        if (distSq < CONNECT_DIST_SQ) {
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
        }
      }
    }
    ctx.strokeStyle = 'rgba(139,92,246,0.18)';
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Draw nodes as simple filled circles with soft glow via shadowBlur
    ctx.shadowColor = 'rgba(139,92,246,0.5)';
    ctx.shadowBlur = 12;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const glow = 0.5 + Math.sin(n.pulse) * 0.35;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,181,253,' + glow + ')';
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function start() {
    if (!animId) animId = requestAnimationFrame(draw);
  }
  function stop() {
    if (animId) { cancelAnimationFrame(animId); animId = null; }
  }

  document.addEventListener('visibilitychange', function() {
    if (document.hidden) stop(); else start();
  });

  start();
})();
