/* ============================================================
   LLM ThreatIntel — Neural Network Background Animation
   Lightweight constellation: simple filled circles, no gradients,
   no shadowBlur, visibility-aware pause
   ============================================================ */

(function() {
  const canvas = document.getElementById('neural-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], animId = null;

  const NODE_COUNT = 50;
  const CONNECT_DIST = 180;
  const NODE_SPEED = 0.25;

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
      r: Math.random() * 2.2 + 1
    });
  }

  function draw() {
    animId = requestAnimationFrame(draw);
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H * 0.55) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = 'rgba(139,92,246,' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(196,181,253,0.45)';
      ctx.fill();
    }
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
