(function () {
  if (customElements.get("cube-field")) return;

  // ---------------------------------------------------------------------------
  // Tuning knobs: everything dramatic lives here.
  // ---------------------------------------------------------------------------
  const CONFIG = {
    bg: "#12141A",
    palette: ["#35E0FF", "#B79CFF", "#2CF6C3"],
    colorDrift: 0.00004, // palette cycles per ms (smooth blend between colors)

    // Population
    cubesDesktop: 140,
    cubesMobile: 36,
    fieldRadius: 90, // bigger = sparser field, fog reaches farther
    minGap: 9, // minimum empty space between cubes (world units), on top of their sizes
    nearFade: 7, // cubes fade out over this distance as they reach the camera
    sizeMin: 0.6, // cube half-size range; skewed toward small with a few big ones
    sizeMax: 3.2,

    // Rendering budget
    fpsDesktop: 30,
    fpsMobile: 24,
    dprDesktop: 1.5, // cap on devicePixelRatio
    dprMobile: 1,
    lineWidth: 5, // near-camera width; thins with distance
    maxAlpha: 0.9,
    scale: 400, // projection scale (lower = wider field of view)

    // Motion
    baseSpeed: 0.04, // forward drift per 60Hz frame
    velocityBoost: 0.004, // extra speed per px of scroll velocity
    maxSpeedBoost: 0.35, // cap on the scroll-velocity boost
    tumble: 0.002, // max cube spin, radians per 60Hz frame (try 0.0005-0.004)
    mobileTumble: 0.5, // multiplier on mobile
    ease: 0.02, // camera easing (lower = floatier, lags further behind scroll)
    maxTurnRate: 0.004, // hard cap on camera turn, radians per 60Hz frame (~14°/s)

    // Scroll mapping (full page scroll = these totals)
    scrollYaw: Math.PI * 0.5, // 90° over the whole page
    scrollPitch: 0.12, // peak pitch, swings up and back over the scroll
    scrollRoll: 0.15, // peak roll, banks in the middle of the page
    scrollRise: 8, // camera height gain
    mobileSwing: 0.6, // multiplier on yaw/pitch/roll on mobile
  };

  const NEAR = 0.1;
  const TAU = Math.PI * 2;

  // Move `cur` toward `target` with easing, but never faster than `maxStep`.
  // The cap is what gives the camera "weight": a fast scroll can't whip it.
  const approach = (cur, target, k, maxStep) => {
    const step = (target - cur) * k;
    return cur + Math.max(-maxStep, Math.min(maxStep, step));
  };

  const hexToRgb = (h) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const PALETTE = CONFIG.palette.map(hexToRgb);

  // Vertex i: bit0 = x, bit1 = y, bit2 = z (0 -> -1, 1 -> +1)
  const CORNERS = [
    [-1, -1, -1], [1, -1, -1], [-1, 1, -1], [1, 1, -1],
    [-1, -1, 1], [1, -1, 1], [-1, 1, 1], [1, 1, 1],
  ];
  const EDGES = [
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  class CubeField extends HTMLElement {
    connectedCallback() {
      this.setAttribute("aria-hidden", "true");
      this.setAttribute("role", "presentation");

      // Background on the host prevents a flash before the first draw.
      Object.assign(this.style, {
        position: "fixed",
        inset: "0",
        width: "100%",
        height: "100vh",
        display: "block",
        pointerEvents: "none",
        zIndex: "0",
        backgroundColor: CONFIG.bg,
      });
      // lvh keeps the canvas from resizing as mobile URL bars collapse.
      // Browsers without lvh ignore this and keep 100vh.
      this.style.height = "100lvh";

      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      Object.assign(this.canvas.style, {
        width: "100%",
        height: "100%",
        display: "block",
      });
      this.appendChild(this.canvas);

      // Camera state
      this.camX = 0;
      this.camY = 0;
      this.camZ = -10;
      this.yaw = 0;
      this.pitch = 0;
      this.roll = 0;
      this.targetYaw = 0;
      this.targetPitch = 0;
      this.targetRoll = 0;
      this.targetCamY = 0;

      // Scroll state (cached; no layout reads in the frame loop)
      this.scrollY = window.scrollY || 0;
      this.prevScrollY = this.scrollY;
      this.maxScroll = 0;
      this.scrollVel = 0;

      // Scratch values for projection (avoids per-frame allocations)
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this.vx = new Float32Array(8); // camera-space vertices (for near-plane clipping)
      this.vy = new Float32Array(8);
      this.vz = new Float32Array(8);

      this.shapes = [];
      this.w = 0;
      this.h = 0;
      this.mobile = false;
      this.raf = 0;
      this.last = 0;

      this.reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.reduced = this.reducedMq.matches;

      this.tick = this.tick.bind(this);
      this.onScroll = () => {
        this.scrollY = window.scrollY || 0;
      };
      this.onResize = () => {
        if (this.measure(false)) {
          this.updateScrollMetrics();
          if (this.reduced) this.draw(0);
        }
      };
      this.onVisibility = () => {
        if (document.hidden) this.stop();
        else if (!this.reduced) this.start();
      };
      this.onMotionChange = () => {
        this.reduced = this.reducedMq.matches;
        if (this.reduced) {
          this.stop();
          this.draw(0);
        } else {
          this.start();
        }
      };

      window.addEventListener("scroll", this.onScroll, { passive: true });
      window.addEventListener("resize", this.onResize);
      document.addEventListener("visibilitychange", this.onVisibility);
      this.reducedMq.addEventListener("change", this.onMotionChange);

      // Page height changes as content loads; re-measure without polling.
      if (typeof ResizeObserver !== "undefined") {
        this.ro = new ResizeObserver(() => this.updateScrollMetrics());
        this.ro.observe(document.body);
      }

      this.measure(true);
      this.updateScrollMetrics();
      this.draw(0); // first frame immediately, so there's no empty gap

      if (!this.reduced && !document.hidden) this.start();
    }

    disconnectedCallback() {
      this.stop();
      window.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("resize", this.onResize);
      document.removeEventListener("visibilitychange", this.onVisibility);
      this.reducedMq.removeEventListener("change", this.onMotionChange);
      if (this.ro) this.ro.disconnect();
    }

    // ---- lifecycle ---------------------------------------------------------

    start() {
      if (this.raf) return;
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }

    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = 0;
    }

    // Returns true if the canvas was resized.
    measure(force) {
      const w = window.innerWidth || 1920;
      const h = window.innerHeight || 1080;
      const touch = window.matchMedia("(pointer: coarse)").matches;

      // On touch devices the URL bar changes innerHeight while scrolling.
      // Ignore height-only changes so the canvas isn't reallocated mid-scroll.
      if (!force && w === this.w && (touch || h === this.h)) return false;

      const wasMobile = this.mobile;
      this.w = w;
      this.h = h;
      this.mobile = w < 768;

      const dprCap = this.mobile ? CONFIG.dprMobile : CONFIG.dprDesktop;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      this.cx = w / 2;
      this.cy = h / 2;

      if (force || wasMobile !== this.mobile) this.buildScene();
      return true;
    }

    updateScrollMetrics() {
      const doc = document.documentElement;
      this.maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);
    }

    // ---- scene -------------------------------------------------------------

    buildScene() {
      const R = CONFIG.fieldRadius;
      const count = this.mobile ? CONFIG.cubesMobile : CONFIG.cubesDesktop;
      const tumble =
        CONFIG.tumble * (this.mobile ? CONFIG.mobileTumble : 1);

      this.shapes = [];
      for (let i = 0; i < count; i++) {
        const c = {
          x: this.camX + (Math.random() * 2 - 1) * R,
          y: this.camY + (Math.random() * 2 - 1) * R,
          z: this.camZ + (Math.random() * 2 - 1) * R,
          size:
            CONFIG.sizeMin +
            Math.pow(Math.random(), 2) * (CONFIG.sizeMax - CONFIG.sizeMin),
          ax: Math.random() * TAU,
          ay: Math.random() * TAU,
          az: Math.random() * TAU,
          rx: (Math.random() * 2 - 1) * tumble,
          ry: (Math.random() * 2 - 1) * tumble,
          rz: (Math.random() * 2 - 1) * tumble,
          phase: Math.random() * PALETTE.length,
          verts: new Float32Array(24),
        };
        // Re-roll the position until it clears every cube placed so far
        for (let tries = 0; tries < 30 && !this.isClear(c); tries++) {
          c.x = this.camX + (Math.random() * 2 - 1) * R;
          c.y = this.camY + (Math.random() * 2 - 1) * R;
          c.z = this.camZ + (Math.random() * 2 - 1) * R;
        }
        this.orient(c);
        this.shapes.push(c);
      }
    }

    // True if cube `c` keeps CONFIG.minGap clear of every other cube.
    isClear(c) {
      for (let i = 0; i < this.shapes.length; i++) {
        const o = this.shapes[i];
        if (o === c) continue;
        const min = (c.size + o.size) * 1.8 + CONFIG.minGap;
        const dx = c.x - o.x, dy = c.y - o.y, dz = c.z - o.z;
        if (dx * dx + dy * dy + dz * dz < min * min) return false;
      }
      return true;
    }

    // Rebuild a cube's 8 rotated, scaled vertex offsets from its angles.
    orient(c) {
      const sx = Math.sin(c.ax), cxx = Math.cos(c.ax);
      const sy = Math.sin(c.ay), cyy = Math.cos(c.ay);
      const sz = Math.sin(c.az), czz = Math.cos(c.az);
      const s = c.size;
      const out = c.verts;

      for (let i = 0; i < 8; i++) {
        const x = CORNERS[i][0] * s;
        const y = CORNERS[i][1] * s;
        const z = CORNERS[i][2] * s;

        const y1 = y * cxx - z * sx;
        const z1 = y * sx + z * cxx;

        const x2 = x * cyy + z1 * sy;
        const z2 = -x * sy + z1 * cyy;

        out[i * 3] = x2 * czz - y1 * sz;
        out[i * 3 + 1] = x2 * sz + y1 * czz;
        out[i * 3 + 2] = z2;
      }
    }

    // ---- frame loop --------------------------------------------------------

    tick(now) {
      this.raf = requestAnimationFrame(this.tick);

      const interval = 1000 / (this.mobile ? CONFIG.fpsMobile : CONFIG.fpsDesktop);
      const elapsed = now - this.last;
      if (elapsed < interval - 1) return; // -1ms tolerates rAF jitter

      const dt = Math.min(elapsed, 100) / (1000 / 60); // 1 = one 60Hz frame
      this.last = now;

      this.update(dt);
      this.draw(now);
    }

    update(dt) {
      const swing = this.mobile ? CONFIG.mobileSwing : 1;
      const t =
        this.maxScroll > 0
          ? Math.min(1, Math.max(0, this.scrollY / this.maxScroll))
          : 0;

      this.targetYaw = t * CONFIG.scrollYaw * swing;
      this.targetPitch = Math.sin(t * TAU) * CONFIG.scrollPitch * swing;
      this.targetRoll = Math.sin(t * Math.PI) * CONFIG.scrollRoll * swing;
      this.targetCamY = t * CONFIG.scrollRise;

      // Scroll velocity (px per 60Hz frame), smoothed
      const raw = Math.abs(this.scrollY - this.prevScrollY) / dt;
      this.prevScrollY = this.scrollY;
      this.scrollVel += (raw - this.scrollVel) * (1 - Math.pow(0.9, dt));

      const speed =
        CONFIG.baseSpeed +
        Math.min(this.scrollVel * CONFIG.velocityBoost, CONFIG.maxSpeedBoost);

      // Frame-rate independent easing
      const k = 1 - Math.pow(1 - CONFIG.ease, dt);
      const maxStep = CONFIG.maxTurnRate * dt;
      this.yaw = approach(this.yaw, this.targetYaw, k, maxStep);
      this.pitch = approach(this.pitch, this.targetPitch, k, maxStep);
      this.roll = approach(this.roll, this.targetRoll, k, maxStep);
      this.camY += (this.targetCamY - this.camY) * k;

      this.camX += Math.sin(this.yaw) * speed * dt;
      this.camZ += Math.cos(this.yaw) * speed * dt;

      const R = CONFIG.fieldRadius;
      const size = R * 2;

      for (let i = 0; i < this.shapes.length; i++) {
        const s = this.shapes[i];

        s.ax += s.rx * dt;
        s.ay += s.ry * dt;
        s.az += s.rz * dt;
        this.orient(s);

        // A wrapped cube lands on the far (fogged, invisible) face of the field.
        // Re-roll its other two coordinates so it doesn't land on top of another.
        let wrapped = 0;
        if (s.x - this.camX > R) { s.x -= size; wrapped = 1; }
        else if (s.x - this.camX < -R) { s.x += size; wrapped = 1; }

        if (s.y - this.camY > R) { s.y -= size; wrapped = 2; }
        else if (s.y - this.camY < -R) { s.y += size; wrapped = 2; }

        if (s.z - this.camZ > R) { s.z -= size; wrapped = 3; }
        else if (s.z - this.camZ < -R) { s.z += size; wrapped = 3; }

        if (wrapped) {
          for (let tries = 0; tries < 8 && !this.isClear(s); tries++) {
            if (wrapped !== 1) s.x = this.camX + (Math.random() * 2 - 1) * R;
            if (wrapped !== 2) s.y = this.camY + (Math.random() * 2 - 1) * R;
            if (wrapped !== 3) s.z = this.camZ + (Math.random() * 2 - 1) * R;
          }
        }
      }
    }

    // Transform a world point into camera space; result in this._x/_y/_z.
    toCam(x, y, z) {
      x -= this.camX;
      y -= this.camY;
      z -= this.camZ;

      const dx = x * this.cyaw - z * this.syaw;
      let dz = x * this.syaw + z * this.cyaw;

      const dy = y * this.cpitch - dz * this.spitch;
      dz = y * this.spitch + dz * this.cpitch;

      this._x = dx * this.croll - dy * this.sroll;
      this._y = dx * this.sroll + dy * this.croll;
      this._z = dz;
    }

    draw(now) {
      const ctx = this.ctx;

      this.cyaw = Math.cos(this.yaw);
      this.syaw = Math.sin(this.yaw);
      this.cpitch = Math.cos(this.pitch);
      this.spitch = Math.sin(this.pitch);
      this.croll = Math.cos(this.roll);
      this.sroll = Math.sin(this.roll);

      ctx.fillStyle = CONFIG.bg;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.lineCap = "round";

      const R = CONFIG.fieldRadius;
      const N = PALETTE.length;
      const scale = CONFIG.scale;
      const vx = this.vx;
      const vy = this.vy;
      const vz = this.vz;

      for (let i = this.shapes.length; i--; ) {
        const c = this.shapes[i];

        // Distance fog: fades to the background color via alpha
        const dist = Math.hypot(
          c.x - this.camX,
          c.y - this.camY,
          c.z - this.camZ
        );
        const f = dist / R;
        let alpha = (1 - f * f) * CONFIG.maxAlpha;
        if (alpha < 0.02) continue;

        // Cull cubes fully behind the camera
        this.toCam(c.x, c.y, c.z);
        if (this._z + c.size * 1.8 <= NEAR) continue;

        // Fade out as the cube reaches the camera, so it dissolves instead of
        // popping or smearing huge lines across the screen
        const near = (this._z - c.size) / CONFIG.nearFade;
        if (near < 1) alpha *= Math.max(0, near);
        if (alpha < 0.02) continue;

        // Project 8 vertices (not 24 line endpoints)
        const v = c.verts;
        for (let j = 0; j < 8; j++) {
          this.toCam(c.x + v[j * 3], c.y + v[j * 3 + 1], c.z + v[j * 3 + 2]);
          vx[j] = this._x;
          vy[j] = this._y;
          vz[j] = this._z;
        }

        // Smooth palette blend
        const p = (now * CONFIG.colorDrift + c.phase) % N;
        const i0 = Math.floor(p);
        const a = PALETTE[i0];
        const b = PALETTE[(i0 + 1) % N];
        const m = p - i0;
        const r = Math.round(a[0] + (b[0] - a[0]) * m);
        const g = Math.round(a[1] + (b[1] - a[1]) * m);
        const bl = Math.round(a[2] + (b[2] - a[2]) * m);

        ctx.strokeStyle = "rgba(" + r + "," + g + "," + bl + "," + alpha.toFixed(3) + ")";
        ctx.lineWidth = Math.max(0.6, CONFIG.lineWidth / (1 + dist * 0.08));

        ctx.beginPath();
        for (let e = 0; e < 12; e++) {
          const ia = EDGES[e][0];
          const ib = EDGES[e][1];
          let za = vz[ia], zb = vz[ib];
          if (za <= NEAR && zb <= NEAR) continue;

          // Clip edges that cross the near plane instead of dropping them,
          // so lines shrink past the camera rather than vanishing
          let xa = vx[ia], ya = vy[ia], xb = vx[ib], yb = vy[ib];
          if (za <= NEAR) {
            const t = (NEAR - za) / (zb - za);
            xa += (xb - xa) * t; ya += (yb - ya) * t; za = NEAR;
          } else if (zb <= NEAR) {
            const t = (NEAR - zb) / (za - zb);
            xb += (xa - xb) * t; yb += (ya - yb) * t; zb = NEAR;
          }
          ctx.moveTo(this.cx + (xa / za) * scale, this.cy + (ya / za) * scale);
          ctx.lineTo(this.cx + (xb / zb) * scale, this.cy + (yb / zb) * scale);
        }
        ctx.stroke();
      }
    }
  }

  customElements.define("cube-field", CubeField);
})();
