/**
 * Astro World - Realistic 3D Photorealistic Solar System Simulation (Three.js)
 * Features:
 * - Real-time orbital motion according to relative Keplerian speeds
 * - Procedural photorealistic high-res textures for Sun, Moon, and 8 Planets
 * - Saturn and Uranus 3D Ring systems with Cassini Division
 * - Earth + Moon dual orbital hierarchy
 * - Interactive Raycasting: Hover glow & Click-to-Focus with smooth cinematic zoom
 * - OrbitControls for pan, zoom, orbit rotate
 */

(function () {
  'use strict';

  // Helper: generate soft circular glowing point texture for stars/galaxy (No squares!)
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(32, 32, 32, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }

  // Procedural 1024x512 High-Res Canvas Texture Generators
  function createSunTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    
    // Glowing incandescent solar surface
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ff4500');
    grad.addColorStop(0.2, '#ff8c00');
    grad.addColorStop(0.5, '#ffa500');
    grad.addColorStop(0.8, '#ff7700');
    grad.addColorStop(1, '#ff3300');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Dynamic solar flares and turbulent plasma convection cells
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const rx = Math.random() * 8 + 2;
      const ry = Math.random() * 4 + 1;
      ctx.beginPath();
      ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(255, 255, 220, 0.45)' : 'rgba(220, 50, 0, 0.35)';
      ctx.fill();
    }
    // Subtle real sunspot active regions (Umbra & Penumbra)
    for (let i = 0; i < 14; i++) {
      const cx = (Math.random() * 0.7 + 0.15) * 1024;
      const cy = (Math.random() * 0.4 + 0.3) * 512;
      const r = Math.random() * 7 + 3;
      // Penumbra (lighter border)
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160, 40, 0, 0.45)';
      ctx.fill();
      // Umbra (darker center)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(40, 10, 0, 0.85)';
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createMercuryTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#6e6a64';
    ctx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 2200; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const r = Math.random() * 5 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(40, 38, 35, 0.45)' : 'rgba(160, 155, 145, 0.4)';
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createVenusTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#c79c5e');
    grad.addColorStop(0.3, '#deb887');
    grad.addColorStop(0.7, '#eedaa2');
    grad.addColorStop(1, '#b58849');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    // Thick atmospheric sulfuric streaks
    for (let i = 0; i < 350; i++) {
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 235, 180, 0.25)' : 'rgba(160, 110, 50, 0.2)';
      ctx.fillRect(0, y, 1024, Math.random() * 12 + 2);
    }
    return new THREE.CanvasTexture(c);
  }

  function createEarthTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');

    // Ocean deep blue
    ctx.fillStyle = '#0f3868';
    ctx.fillRect(0, 0, 1024, 512);

    // Continents
    ctx.fillStyle = '#2d6a36';
    // Africa / Europe
    ctx.beginPath();
    ctx.ellipse(450, 240, 110, 130, 0, 0, Math.PI * 2);
    ctx.fill();
    // Americas
    ctx.beginPath();
    ctx.ellipse(230, 200, 75, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(270, 330, 65, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    // Asia / Australia
    ctx.beginPath();
    ctx.ellipse(720, 200, 140, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(820, 370, 55, 45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polar ice caps
    ctx.fillStyle = '#eef6ff';
    ctx.fillRect(0, 0, 1024, 38);
    ctx.fillRect(0, 474, 1024, 38);

    // Atmospheric swirling clouds
    for (let i = 0; i < 500; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 512, Math.random() * 45 + 15, Math.random() * 10 + 4, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createMoonTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#8f9298';
    ctx.fillRect(0, 0, 512, 256);

    // Lunar maria (dark plains)
    ctx.fillStyle = 'rgba(55, 58, 65, 0.65)';
    ctx.beginPath();
    ctx.arc(180, 100, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(280, 140, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(360, 90, 40, 0, Math.PI * 2);
    ctx.fill();

    // Impact craters
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(220, 225, 230, 0.45)' : 'rgba(35, 38, 42, 0.45)';
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 4 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    return new THREE.CanvasTexture(c);
  }

  function createMarsTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#b34626';
    ctx.fillRect(0, 0, 1024, 512);

    // Dark volcanic highlands (Syrtis Major)
    ctx.fillStyle = 'rgba(75, 25, 12, 0.55)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 300 + 100, Math.random() * 120 + 40, Math.random() * 70 + 20, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Polar ice caps
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1024, 25);
    ctx.fillRect(0, 487, 1024, 25);
    return new THREE.CanvasTexture(c);
  }

  function createJupiterTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');

    const bands = [
      '#a6734e', '#c89e74', '#e2cfb7', '#b57954', '#8a5232', 
      '#c2946b', '#ddc6ad', '#aa6b45', '#7a4224', '#ba8a63'
    ];
    const bandHeight = 512 / bands.length;
    bands.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, i * bandHeight, 1024, bandHeight);
    });

    // Swirling atmospheric storms
    for (let i = 0; i < 400; i++) {
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(90, 40, 15, 0.35)';
      ctx.fillRect(Math.random() * 1024, y, Math.random() * 200 + 50, Math.random() * 6 + 2);
    }

    // Great Red Spot
    ctx.fillStyle = '#c03a1b';
    ctx.beginPath();
    ctx.ellipse(650, 310, 52, 32, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e86a48';
    ctx.beginPath();
    ctx.ellipse(650, 310, 36, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(c);
  }

  function createSaturnTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#c9a875');
    grad.addColorStop(0.3, '#e8cca0');
    grad.addColorStop(0.6, '#d9ba88');
    grad.addColorStop(1, '#b59360');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);

    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 245, 220, 0.2)' : 'rgba(140, 110, 70, 0.2)';
      ctx.fillRect(0, Math.random() * 512, 1024, Math.random() * 8 + 2);
    }
    return new THREE.CanvasTexture(c);
  }

  function createSaturnRingTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 32;
    const ctx = c.getContext('2d');
    
    // Transparent base
    ctx.clearRect(0, 0, 512, 32);

    // Ring bands with Cassini Division
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(160, 130, 90, 0.05)');
    grad.addColorStop(0.25, 'rgba(215, 190, 145, 0.85)');
    grad.addColorStop(0.58, 'rgba(235, 210, 165, 0.95)');
    // Cassini division (dark gap)
    grad.addColorStop(0.60, 'rgba(10, 10, 15, 0.05)');
    grad.addColorStop(0.64, 'rgba(10, 10, 15, 0.05)');
    grad.addColorStop(0.66, 'rgba(195, 170, 125, 0.8)');
    grad.addColorStop(0.92, 'rgba(160, 135, 95, 0.6)');
    grad.addColorStop(1, 'rgba(120, 95, 60, 0.05)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 32);

    return new THREE.CanvasTexture(c);
  }

  function createUranusTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#75c8cb');
    grad.addColorStop(0.5, '#a4e5e7');
    grad.addColorStop(1, '#66b8bc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);
    return new THREE.CanvasTexture(c);
  }

  function createNeptuneTexture() {
    const c = document.createElement('canvas');
    c.width = 512; c.height = 256;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#1d48a3');
    grad.addColorStop(0.4, '#3873df');
    grad.addColorStop(0.7, '#245ac4');
    grad.addColorStop(1, '#153982');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 256);

    // Methane cirrus white clouds
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(Math.random() * 512, Math.random() * 256, Math.random() * 90 + 20, Math.random() * 4 + 1);
    }
    return new THREE.CanvasTexture(c);
  }

  // Master Solar System Controller
  class SolarSystem3D {
    constructor() {
      this.initialized = false;
      this.motionPlaying = true;
      this.bodies = {};
      this.activeTarget = null;
      this.defaultCamPos = new THREE.Vector3(0, 300, 540);
      this.defaultLookTarget = new THREE.Vector3(0, 0, 0);
      this.targetLook = new THREE.Vector3(0, 0, 0);
      this.camLerpSpeed = 0.05;
      this.onBodySelectedCallback = null;
    }

    init(canvas, container, onBodySelected) {
      if (!window.THREE) {
        console.error('Three.js not loaded!');
        return;
      }
      this.canvas = canvas;
      this.container = container;
      this.onBodySelectedCallback = onBodySelected;

      const width = container.clientWidth || 900;
      const height = container.clientHeight || 580;

      // Scene & Camera
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 15000);
      this.defaultCamPos = new THREE.Vector3(0, 180, 460);
      this.camera.position.copy(this.defaultCamPos);

      // WebGL Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // OrbitControls: balanced realistic space navigation (focused on solar system)
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxDistance = 1400; // Keep the whole system comfortably framed without flying away
      this.controls.minDistance = 18;
      this.controls.enablePan = false; // Keep focus anchored around the solar center
      this.controls.maxPolarAngle = Math.PI * 0.88; // Prevent inverted camera flipping
      this.controls.minPolarAngle = Math.PI * 0.08;
      this.controls.target.copy(this.defaultLookTarget);

      // Space Starfield Background Inside 3D Scene
      this.buildSpaceBackground();

      // Lighting: Central Sun Light + Ambient Cosmic Fill
      this.sunLight = new THREE.PointLight(0xffffff, 3.2, 5000, 0.4);
      this.sunLight.position.set(0, 0, 0);
      this.scene.add(this.sunLight);

      this.ambientLight = new THREE.AmbientLight(0x3a4b66, 0.65);
      this.scene.add(this.ambientLight);

      // Build Celestial Bodies
      this.buildSolarSystem();

      // Setup Raycaster for Click & Hover Detection
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.bindEvents();

      this.initialized = true;
      this.animate();
    }

    buildSpaceBackground() {
      // 1. Milky Way Galactic Disc Simulation (arms, core glow & dust lanes)
      const galaxyGroup = new THREE.Group();

      // Core Bulge Glow
      const coreCanvas = document.createElement('canvas');
      coreCanvas.width = 256; coreCanvas.height = 256;
      const coreCtx = coreCanvas.getContext('2d');
      const coreGrad = coreCtx.createRadialGradient(128, 128, 0, 128, 128, 128);
      coreGrad.addColorStop(0, 'rgba(255, 230, 180, 0.95)');
      coreGrad.addColorStop(0.25, 'rgba(255, 170, 90, 0.55)');
      coreGrad.addColorStop(0.6, 'rgba(120, 60, 150, 0.25)');
      coreGrad.addColorStop(1, 'transparent');
      coreCtx.fillStyle = coreGrad;
      coreCtx.fillRect(0, 0, 256, 256);

      const coreTexture = new THREE.CanvasTexture(coreCanvas);
      const coreSpriteMat = new THREE.SpriteMaterial({
        map: coreTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.85
      });
      const coreSprite = new THREE.Sprite(coreSpriteMat);
      coreSprite.scale.set(400, 400, 1);
      coreSprite.position.set(0, -60, 0);
      galaxyGroup.add(coreSprite);

      // Spiral arms particle clouds
      const armParticles = 4500;
      const armGeo = new THREE.BufferGeometry();
      const armPos = new Float32Array(armParticles * 3);
      const armColors = new Float32Array(armParticles * 3);
      const arms = 2;

      for (let i = 0; i < armParticles; i++) {
        const i3 = i * 3;
        const radius = Math.pow(Math.random(), 1.5) * 850 + 40;
        const spinAngle = radius * 0.007;
        const branchAngle = ((i % arms) / arms) * Math.PI * 2;
        
        const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 35;
        const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 25;
        const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 35;

        armPos[i3]     = Math.cos(branchAngle + spinAngle) * radius + randomX;
        armPos[i3 + 1] = randomY - 40; // slightly below planetary plane
        armPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Galactic center is warm gold; spiral arms are stellar cyan/violet
        const mixedColor = radius < 250
          ? [1.0, 0.85, 0.6] // Golden center
          : [0.35, 0.75, 1.0]; // Cool blue arms
        armColors[i3]     = mixedColor[0];
        armColors[i3 + 1] = mixedColor[1];
        armColors[i3 + 2] = mixedColor[2];
      }

      armGeo.setAttribute('position', new THREE.BufferAttribute(armPos, 3));
      armGeo.setAttribute('color', new THREE.BufferAttribute(armColors, 3));

      const dotTexture = createCircleTexture();

      const armMat = new THREE.PointsMaterial({
        size: 3.2,
        map: dotTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const galaxyPoints = new THREE.Points(armGeo, armMat);
      galaxyGroup.add(galaxyPoints);

      // Tilt the galaxy disk gracefully so it creates a majestic backdrop
      galaxyGroup.rotation.x = Math.PI * 0.18;
      galaxyGroup.rotation.z = Math.PI * 0.12;
      this.scene.add(galaxyGroup);
      this.milkyWayGroup = galaxyGroup;

      // 2. Outer Spherical Deep-Space Starfield
      const starGeo = new THREE.BufferGeometry();
      const starCount = 3500;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 2500 + Math.random() * 2000;
        const sinPhi = Math.sin(phi);

        positions[i]     = r * sinPhi * Math.cos(theta);
        positions[i + 1] = r * sinPhi * Math.sin(theta);
        positions[i + 2] = r * Math.cos(phi);

        const shade = Math.random();
        if (shade > 0.8) {
          colors[i] = 0.7; colors[i + 1] = 0.85; colors[i + 2] = 1.0;
        } else if (shade > 0.6) {
          colors[i] = 1.0; colors[i + 1] = 0.85; colors[i + 2] = 0.6;
        } else {
          colors[i] = 0.95; colors[i + 1] = 0.95; colors[i + 2] = 1.0;
        }
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const starMat = new THREE.PointsMaterial({
        size: 2.2,
        map: dotTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        depthWrite: false
      });
      const starField = new THREE.Points(starGeo, starMat);
      this.scene.add(starField);
    }

    buildSolarSystem() {
      // 1. THE SUN
      const sunGeo = new THREE.SphereGeometry(15, 64, 64);
      const sunMat = new THREE.MeshBasicMaterial({
        map: createSunTexture()
      });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      sunMesh.userData = { id: 'sun', name: 'الشمس' };
      this.scene.add(sunMesh);

      // Subtle Solar Halo (realistic soft atmospheric glow)
      const coronaGeo = new THREE.SphereGeometry(16.5, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xff8c00,
        transparent: true,
        opacity: 0.22,
        side: THREE.BackSide
      });
      sunMesh.add(new THREE.Mesh(coronaGeo, coronaMat));

      this.bodies.sun = {
        mesh: sunMesh,
        radius: 15,
        rotSpeed: 0.003,
        dist: 0
      };

      // 2. PLANET SPECS (Calibrated for balanced realism & visibility)
      const planetsData = [
        { id: 'mercury', radius: 2.8, dist: 46, speed: 0.038, rot: 0.015, textureFn: createMercuryTexture },
        { id: 'venus', radius: 5.6, dist: 78, speed: 0.024, rot: -0.008, textureFn: createVenusTexture },
        { id: 'earth', radius: 6.2, dist: 122, speed: 0.016, rot: 0.02, textureFn: createEarthTexture, hasMoon: true },
        { id: 'mars', radius: 4.2, dist: 172, speed: 0.012, rot: 0.018, textureFn: createMarsTexture },
        { id: 'jupiter', radius: 17.0, dist: 258, speed: 0.0075, rot: 0.035, textureFn: createJupiterTexture },
        { id: 'saturn', radius: 13.5, dist: 356, speed: 0.0048, rot: 0.03, textureFn: createSaturnTexture, hasRings: true },
        { id: 'uranus', radius: 8.8, dist: 452, speed: 0.0032, rot: 0.022, textureFn: createUranusTexture },
        { id: 'neptune', radius: 8.4, dist: 546, speed: 0.0022, rot: 0.024, textureFn: createNeptuneTexture }
      ];

      planetsData.forEach((p) => {
        // Orbit Pivot (rotates around Sun at (0,0,0))
        const pivot = new THREE.Group();
        this.scene.add(pivot);

        // Orbital Ring Track
        const orbitGeo = new THREE.BufferGeometry();
        const pts = [];
        const segments = 128;
        for (let i = 0; i <= segments; i++) {
          const theta = (i / segments) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(theta) * p.dist, 0, Math.sin(theta) * p.dist));
        }
        orbitGeo.setFromPoints(pts);
        const orbitLine = new THREE.LineLoop(orbitGeo, new THREE.LineBasicMaterial({
          color: 0x00e5ff,
          transparent: true,
          opacity: 0.22
        }));
        this.scene.add(orbitLine);

        // Planet Mesh
        const sphereGeo = new THREE.SphereGeometry(p.radius, 48, 48);
        const sphereMat = new THREE.MeshStandardMaterial({
          map: p.textureFn(),
          roughness: 0.75,
          metalness: 0.15
        });
        const planetMesh = new THREE.Mesh(sphereGeo, sphereMat);
        planetMesh.position.set(p.dist, 0, 0);
        planetMesh.userData = { id: p.id };
        pivot.add(planetMesh);

        // Special: Earth + Moon
        let moonBody = null;
        if (p.hasMoon) {
          const moonPivot = new THREE.Group();
          planetMesh.add(moonPivot);

          const moonGeo = new THREE.SphereGeometry(2.0, 32, 32);
          const moonMat = new THREE.MeshStandardMaterial({
            map: createMoonTexture(),
            roughness: 0.85
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.set(15, 0, 0);
          moonMesh.userData = { id: 'moon' };
          moonPivot.add(moonMesh);

          moonBody = {
            mesh: moonMesh,
            pivot: moonPivot,
            radius: 2.0,
            orbitSpeed: 0.065,
            rotSpeed: 0.015,
            parent: planetMesh
          };
          this.bodies.moon = moonBody;

          // ===== ISS — International Space Station (orbits Earth) =====
          const issGroup = new THREE.Group();
          issGroup.userData = { id: 'iss' };

          // ---- Central Integrated Truss Structure (ITS) — the spine of ISS ----
          const trussMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d8, metalness: 0.92, roughness: 0.12 });
          // Main truss bar
          const mainTrussGeo = new THREE.BoxGeometry(32, 1.2, 1.2);
          issGroup.add(new THREE.Mesh(mainTrussGeo, trussMat));
          // Secondary cross-truss (shorter, perpendicular)
          const crossTrussGeo = new THREE.BoxGeometry(1.2, 1.2, 10);
          const crossTruss = new THREE.Mesh(crossTrussGeo, trussMat);
          crossTruss.userData = { id: 'iss' };
          issGroup.add(crossTruss);

          // ---- Pressurized Habitation Modules (cylindrical segments) ----
          const habMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, metalness: 0.78, roughness: 0.22 });
          // Main lab module (US segment — longer)
          const usLabGeo = new THREE.CylinderGeometry(1.4, 1.4, 11, 16);
          const usLab = new THREE.Mesh(usLabGeo, habMat);
          usLab.rotation.z = Math.PI / 2;
          usLab.position.set(2, 0, 0);
          usLab.userData = { id: 'iss' };
          issGroup.add(usLab);
          // Russian segment (slightly smaller, offset)
          const rusMat = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, metalness: 0.72, roughness: 0.28 });
          const rusModGeo = new THREE.CylinderGeometry(1.2, 1.2, 7, 16);
          const rusMod = new THREE.Mesh(rusModGeo, rusMat);
          rusMod.rotation.z = Math.PI / 2;
          rusMod.position.set(-5, 0, 0);
          rusMod.userData = { id: 'iss' };
          issGroup.add(rusMod);
          // Node connector sphere (Unity/Harmony)
          const nodeMat = new THREE.MeshStandardMaterial({ color: 0xe2e2e2, metalness: 0.82, roughness: 0.18 });
          const nodeGeo = new THREE.SphereGeometry(1.5, 12, 12);
          const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
          nodeMesh.position.set(0, 0, 0);
          nodeMesh.userData = { id: 'iss' };
          issGroup.add(nodeMesh);
          // Cupola observation dome (small dome on bottom)
          const cupolaMat = new THREE.MeshStandardMaterial({ color: 0x90b8d8, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.85 });
          const cupolaGeo = new THREE.SphereGeometry(0.9, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2.5);
          const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
          cupola.position.set(1.5, -1.5, 0);
          cupola.rotation.z = Math.PI;
          cupola.userData = { id: 'iss' };
          issGroup.add(cupola);

          // ---- Solar Panel Arrays (8 wings — 4 pairs, iconic blue photovoltaic panels) ----
          const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a3f8a, metalness: 0.25, roughness: 0.55, emissive: 0x0a1f45, emissiveIntensity: 0.15 });
          const panelMat2 = new THREE.MeshStandardMaterial({ color: 0x1e4799, metalness: 0.25, roughness: 0.55, emissive: 0x0a1f45, emissiveIntensity: 0.1 });
          const panelDefs = [
            { x: -11, z:  5.5, mat: panelMat  },
            { x: -11, z: -5.5, mat: panelMat2 },
            { x:  11, z:  5.5, mat: panelMat  },
            { x:  11, z: -5.5, mat: panelMat2 }
          ];
          const mastMat2 = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.9, roughness: 0.1 });
          panelDefs.forEach(({ x, z, mat }) => {
            // Mast from truss to panel
            const mastGeo = new THREE.BoxGeometry(0.25, 0.25, Math.abs(z) - 0.6);
            const mast = new THREE.Mesh(mastGeo, mastMat2);
            mast.position.set(x, 0, z * 0.4);
            mast.userData = { id: 'iss' };
            issGroup.add(mast);
            // Panel wing (large flat surface)
            const panelGeo = new THREE.BoxGeometry(9, 0.09, 4);
            const panel = new THREE.Mesh(panelGeo, mat);
            panel.position.set(x, 0, z);
            panel.userData = { id: 'iss' };
            issGroup.add(panel);
            // Panel grid lines (thin dividers for realism)
            const divGeo = new THREE.BoxGeometry(9, 0.12, 0.08);
            for (let d = -1.5; d <= 1.5; d += 1.0) {
              const div = new THREE.Mesh(divGeo, mastMat2);
              div.position.set(x, 0.06, z + d);
              div.userData = { id: 'iss' };
              issGroup.add(div);
            }
          });

          // ---- Radiator panels (white thermal radiators along truss) ----
          const radMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, metalness: 0.3, roughness: 0.6 });
          [[-6, 0, 2.5], [6, 0, 2.5], [-6, 0, -2.5], [6, 0, -2.5]].forEach(([x, y, z]) => {
            const radGeo = new THREE.BoxGeometry(3.5, 0.07, 1.8);
            const rad = new THREE.Mesh(radGeo, radMat);
            rad.position.set(x, y + 1.0, z);
            rad.userData = { id: 'iss' };
            issGroup.add(rad);
          });

          // ---- Docking ports (small cylinders on ends) ----
          const dockMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.85, roughness: 0.15 });
          [[-8, 0, 0], [4, 0, 0]].forEach(([x, y, z]) => {
            const dockGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 10);
            const dock = new THREE.Mesh(dockGeo, dockMat);
            dock.position.set(x, y + 2.0, z);
            dock.userData = { id: 'iss' };
            issGroup.add(dock);
          });

          // ---- Invisible click-target sphere (easy raycasting) ----
          const issClickGeo = new THREE.SphereGeometry(7, 8, 8);
          const issClickMat = new THREE.MeshBasicMaterial({ visible: false });
          const issClickMesh = new THREE.Mesh(issClickGeo, issClickMat);
          issClickMesh.userData = { id: 'iss' };
          issGroup.add(issClickMesh);

          // ---- ISS orbits Earth: pivot attached to Earth mesh ----
          const issPivot = new THREE.Group();
          planetMesh.add(issPivot);

          issGroup.position.set(22, 2, 0);   // orbit distance from Earth center
          issGroup.scale.setScalar(0.95);    // slight scale for visibility
          issPivot.add(issGroup);

          this.bodies.iss = {
            mesh: issGroup,
            pivot: issPivot,
            radius: 7,
            orbitSpeed: 0.20,   // fast orbit (ISS: ~90 min real = fast animation)
            rotSpeed: 0.006,
            dist: 22,
            parent: planetMesh
          };
        }

        // Special: Saturn Rings
        if (p.hasRings) {
          const ringGeo = new THREE.RingGeometry(p.radius * 1.35, p.radius * 2.45, 64);
          // Align UVs for radial texture mapping
          const pos = ringGeo.attributes.position;
          const v3 = new THREE.Vector3();
          for (let i = 0; i < pos.count; i++) {
            v3.fromBufferAttribute(pos, i);
            ringGeo.attributes.uv.setXY(i, (v3.length() - p.radius * 1.35) / (p.radius * 1.1), 0.5);
          }
          const ringMat = new THREE.MeshBasicMaterial({
            map: createSaturnRingTexture(),
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.95
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2.35;
          planetMesh.add(ringMesh);
        }

        this.bodies[p.id] = {
          mesh: planetMesh,
          pivot: pivot,
          radius: p.radius,
          orbitSpeed: p.speed,
          rotSpeed: p.rot,
          dist: p.dist
        };
      });
    }

    bindEvents() {
      const getCoords = (e) => {
        const rect = this.canvas.getBoundingClientRect();
        return {
          x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
          y: -((e.clientY - rect.top) / rect.height) * 2 + 1
        };
      };

      // Allow dragging without triggering click-to-focus
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      this.canvas.addEventListener('mousedown', (e) => {
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
      });

      // Hover Pointer Cursor
      this.canvas.addEventListener('mousemove', (e) => {
        if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
          isDragging = true;
          // If user manually drags/navigates, unlock camera from auto-locking onto body
          if (this.activeTarget) {
            this.activeTarget = null;
          }
        }
        const pos = getCoords(e);
        this.mouse.set(pos.x, pos.y);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const clickable = Object.values(this.bodies).map(b => b.mesh);
        const hits = this.raycaster.intersectObjects(clickable, true);
        this.canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
      });

      // Click on Planet / Celestial Body (only if not dragging)
      this.canvas.addEventListener('click', (e) => {
        if (isDragging) return;
        const pos = getCoords(e);
        this.mouse.set(pos.x, pos.y);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const clickable = Object.values(this.bodies).map(b => b.mesh);
        const hits = this.raycaster.intersectObjects(clickable, true);

        if (hits.length > 0) {
          // Walk up the hit object's parents to find the userData.id
          let bodyId = null;
          let obj = hits[0].object;
          while (obj) {
            if (obj.userData && obj.userData.id) {
              bodyId = obj.userData.id;
              break;
            }
            obj = obj.parent;
          }
          if (bodyId) {
            this.focusBody(bodyId);
          }
        }
      });

      // Release focus on wheel scroll so user can freely zoom in/out anywhere
      this.canvas.addEventListener('wheel', () => {
        if (this.activeTarget) {
          this.activeTarget = null;
        }
      }, { passive: true });

      window.addEventListener('resize', () => this.resize());
    }

    focusBody(bodyId) {
      const body = this.bodies[bodyId];
      if (!body) return;

      this.activeTarget = bodyId;

      if (this.onBodySelectedCallback) {
        this.onBodySelectedCallback(bodyId);
      }
    }

    resetOverview() {
      this.activeTarget = null;
      this.targetLook.copy(this.defaultLookTarget);
      this.camera.position.set(0, 180, 460);
      this.controls.target.copy(this.defaultLookTarget);
      this.controls.update();
    }

    toggleMotion() {
      this.motionPlaying = !this.motionPlaying;
      return this.motionPlaying;
    }

    pause() {
      this.motionPlaying = false;
    }

    resume() {
      this.motionPlaying = true;
    }

    resize() {
      if (!this.container || !this.renderer || !this.camera) return;
      const width = this.container.clientWidth || 900;
      const height = this.container.clientHeight || 580;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    animate() {
      if (!this.initialized) return;
      requestAnimationFrame(() => this.animate());

      // 1. Orbital & Axial Rotations
      if (this.milkyWayGroup) {
        this.milkyWayGroup.rotation.y += 0.0003;
      }
      Object.entries(this.bodies).forEach(([id, body]) => {
        // Self-rotation
        if (body.mesh) {
          body.mesh.rotation.y += body.rotSpeed;
        }
        // Orbit revolution around Sun
        if (this.motionPlaying && body.pivot) {
          body.pivot.rotation.y += body.orbitSpeed * 0.3;
        }
      });

      // 2. Camera Tracking / Smooth Fly-to Focus
      if (this.activeTarget && this.bodies[this.activeTarget]) {
        const targetBody = this.bodies[this.activeTarget];
        const worldPos = new THREE.Vector3();
        targetBody.mesh.getWorldPosition(worldPos);

        // Smooth camera look target
        this.targetLook.lerp(worldPos, this.camLerpSpeed);
        this.controls.target.copy(this.targetLook);

        // Calculate offset position for ideal cinematic view
        const offsetDist = Math.max(targetBody.radius * 3.4, 28);
        const desiredCamPos = worldPos.clone().add(new THREE.Vector3(offsetDist * 0.7, offsetDist * 0.45, offsetDist));
        this.camera.position.lerp(desiredCamPos, this.camLerpSpeed);
      } else {
        // Overview mode
        this.targetLook.lerp(this.defaultLookTarget, this.camLerpSpeed);
        this.controls.target.copy(this.targetLook);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  window.SolarSystem3D = SolarSystem3D;
  window.solarSystemController = new SolarSystem3D();

})();

