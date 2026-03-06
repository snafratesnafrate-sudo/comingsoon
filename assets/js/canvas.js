/* ── SnaFrate Coming Soon — Canvas Animation ── */
(function () {
    const canvas = document.getElementById('c');
    const ctx    = canvas.getContext('2d');
    let W, H;
    const particles = [];

    const orbs = [
        { x: 0.15, y: 0.3,  r: 280, c: '#1E56B0', a: 0.18 },
        { x: 0.85, y: 0.7,  r: 220, c: '#1E56B0', a: 0.12 },
        { x: 0.5,  y: 0.85, r: 180, c: '#F4A300', a: 0.08 },
    ];

    function resize() {
        W = canvas.width  = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(true); }
        reset(init) {
            this.x     = Math.random() * W;
            this.y     = init ? Math.random() * H : H + 10;
            this.r     = Math.random() * 1.5 + 0.3;
            this.vx    = (Math.random() - 0.5) * 0.3;
            this.vy    = -(Math.random() * 0.6 + 0.2);
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.7 ? '#F4A300' : '#3b82f6';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.y < -10) this.reset(false);
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle  = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
        }
    }

    for (let i = 0; i < 120; i++) particles.push(new Particle());

    function drawOrbs() {
        orbs.forEach(o => {
            const grd = ctx.createRadialGradient(
                o.x * W, o.y * H, 0,
                o.x * W, o.y * H, o.r
            );
            const hex = Math.round(o.a * 255).toString(16).padStart(2, '0');
            grd.addColorStop(0, o.c + hex);
            grd.addColorStop(1, 'transparent');
            ctx.globalAlpha = 1;
            ctx.fillStyle   = grd;
            ctx.beginPath();
            ctx.arc(o.x * W, o.y * H, o.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function loop() {
        ctx.globalAlpha = 1;
        ctx.fillStyle   = '#080d1a';
        ctx.fillRect(0, 0, W, H);

        drawOrbs();

        particles.forEach(p => { p.update(); p.draw(); });

        ctx.globalAlpha = 1;
        requestAnimationFrame(loop);
    }

    loop();
})();
