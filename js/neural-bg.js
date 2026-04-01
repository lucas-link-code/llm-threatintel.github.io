/* ============================================================
   LLM ThreatIntel — Neural Network Background Animation
   Renders animated connected nodes in the top portion of the page
   ============================================================ */

(function() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [];
  const NODE_COUNT = 60, CONNECT_DIST = 200, NODE_SPEED = 0.3;

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

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      n.pulse += n.pulseSpeed;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H * 0.55) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.45;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw nodes with radial glow
    nodes.forEach(n => {
      const glow = 0.5 + Math.sin(n.pulse) * 0.35;

      // Outer halo
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 8);
      grad.addColorStop(0, `rgba(139,92,246,${glow * 0.25})`);
      grad.addColorStop(0.5, `rgba(139,92,246,${glow * 0.08})`);
      grad.addColorStop(1, 'rgba(139,92,246,0)');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 8, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,181,253,${glow})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();
