

(function () {
  'use strict';
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
  function createSunTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const ctx = c.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#ff4500');
    grad.addColorStop(0.2, '#ff8c00');
    grad.addColorStop(0.5, '#ffa500');
    grad.addColorStop(0.8, '#ff7700');
    grad.addColorStop(1, '#ff3300');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 512);
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
    for (let i = 0; i < 14; i++) {
      const cx = (Math.random() * 0.7 + 0.15) * 1024;
      const cy = (Math.random() * 0.4 + 0.3) * 512;
      const r = Math.random() * 7 + 3;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(160, 40, 0, 0.45)';
      ctx.fill();
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
    ctx.fillStyle = '#0f3868';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = '#2d6a36';
    ctx.beginPath();
    ctx.ellipse(450, 240, 110, 130, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(230, 200, 75, 120, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(270, 330, 65, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(720, 200, 140, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(820, 370, 55, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#eef6ff';
    ctx.fillRect(0, 0, 1024, 38);
    ctx.fillRect(0, 474, 1024, 38);
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
    ctx.fillStyle = 'rgba(75, 25, 12, 0.55)';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * 1024, Math.random() * 300 + 100, Math.random() * 120 + 40, Math.random() * 70 + 20, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
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
    for (let i = 0; i < 400; i++) {
      const y = Math.random() * 512;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.3)' : 'rgba(90, 40, 15, 0.35)';
      ctx.fillRect(Math.random() * 1024, y, Math.random() * 200 + 50, Math.random() * 6 + 2);
    }
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
    ctx.clearRect(0, 0, 512, 32);
    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(160, 130, 90, 0.05)');
    grad.addColorStop(0.25, 'rgba(215, 190, 145, 0.85)');
    grad.addColorStop(0.58, 'rgba(235, 210, 165, 0.95)');
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
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fillRect(Math.random() * 512, Math.random() * 256, Math.random() * 90 + 20, Math.random() * 4 + 1);
    }
    return new THREE.CanvasTexture(c);
  }
  class SolarSystem3D {
    constructor() {
      this.initialized = false;
      this.motionPlaying = true;
      this.bodies = {};
      this.activeTarget = null;
      this.defaultCamPos = null;
      this.defaultLookTarget = null;
      this.targetLook = null;
      this.camLerpSpeed = 0.05;
      this.onBodySelectedCallback = null;
    }

    init(canvas, container, onBodySelected) {
      if (!window.THREE) {
        console.warn('Three.js not loaded!');
        return;
      }
      this.canvas = canvas;
      this.container = container;
      this.onBodySelectedCallback = onBodySelected;

      const width = container.clientWidth || 900;
      const height = container.clientHeight || 580;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 15000);
      this.defaultCamPos = new THREE.Vector3(0, 180, 460);
      this.defaultLookTarget = new THREE.Vector3(0, 0, 0);
      this.targetLook = new THREE.Vector3(0, 0, 0);
      this.camera.position.copy(this.defaultCamPos);
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.maxDistance = 1400;
      this.controls.minDistance = 18;
      this.controls.enablePan = false;
      this.controls.maxPolarAngle = Math.PI * 0.88;
      this.controls.minPolarAngle = Math.PI * 0.08;
      this.controls.target.copy(this.defaultLookTarget);
      this.buildSpaceBackground();
      this.sunLight = new THREE.PointLight(0xffffff, 3.2, 5000, 0.4);
      this.sunLight.position.set(0, 0, 0);
      this.scene.add(this.sunLight);

      this.ambientLight = new THREE.AmbientLight(0x3a4b66, 0.65);
      this.scene.add(this.ambientLight);
      this.buildSolarSystem();
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      this.bindEvents();

      this.initialized = true;
      this.animate();
    }

    buildSpaceBackground() {
      const galaxyGroup = new THREE.Group();
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
        armPos[i3 + 1] = randomY - 40;
        armPos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
        const mixedColor = radius < 250
          ? [1.0, 0.85, 0.6]
          : [0.35, 0.75, 1.0];
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
      galaxyGroup.rotation.x = Math.PI * 0.18;
      galaxyGroup.rotation.z = Math.PI * 0.12;
      this.scene.add(galaxyGroup);
      this.milkyWayGroup = galaxyGroup;
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
      const sunGeo = new THREE.SphereGeometry(24, 64, 64);
      const sunMat = new THREE.MeshBasicMaterial({
        map: createSunTexture()
      });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      sunMesh.userData = { id: 'sun' };
      this.scene.add(sunMesh);
      const coronaGeo = new THREE.SphereGeometry(27.5, 32, 32);
      const coronaMat = new THREE.MeshBasicMaterial({
        color: 0xff8c00,
        transparent: true,
        opacity: 0.25,
        side: THREE.BackSide
      });
      const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
      coronaMesh.userData = { id: 'sun' };
      sunMesh.add(coronaMesh);

      this.bodies.sun = {
        mesh: sunMesh,
        radius: 24,
        rotSpeed: 0.003,
        dist: 0
      };
      const planetsData = [
        { id: 'mercury', radius: 2.3, dist: 52, speed: 0.038, rot: 0.015, textureFn: createMercuryTexture, initialAngle: 0.6 },
        { id: 'venus',   radius: 5.7, dist: 84, speed: 0.024, rot: -0.008, textureFn: createVenusTexture, initialAngle: 1.9 },
        { id: 'earth',   radius: 6.0, dist: 134, speed: 0.016, rot: 0.02, textureFn: createEarthTexture, hasMoon: true, initialAngle: 3.4 },
        { id: 'mars',    radius: 3.2, dist: 186, speed: 0.012, rot: 0.018, textureFn: createMarsTexture, initialAngle: 4.8 },
        { id: 'jupiter', radius: 18.0, dist: 280, speed: 0.0075, rot: 0.035, textureFn: createJupiterTexture, initialAngle: 1.2 },
        { id: 'saturn',  radius: 14.5, dist: 384, speed: 0.0048, rot: 0.03, textureFn: createSaturnTexture, hasRings: true, initialAngle: 2.7 },
        { id: 'uranus',  radius: 8.0, dist: 478, speed: 0.0032, rot: 0.022, textureFn: createUranusTexture, initialAngle: 4.2 },
        { id: 'neptune', radius: 7.6, dist: 570, speed: 0.0022, rot: 0.024, textureFn: createNeptuneTexture, initialAngle: 5.6 }
      ];

      planetsData.forEach((p) => {
        const pivot = new THREE.Group();
        pivot.rotation.y = p.initialAngle || 0;
        this.scene.add(pivot);
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
        let moonBody = null;
        if (p.hasMoon) {
          const moonPivot = new THREE.Group();
          planetMesh.add(moonPivot);
          const moonGeo = new THREE.SphereGeometry(1.65, 32, 32);
          const moonMat = new THREE.MeshStandardMaterial({
            map: createMoonTexture(),
            roughness: 0.85
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.set(22, 0, 0);
          moonMesh.userData = { id: 'moon' };
          moonPivot.add(moonMesh);
          const moonPts = [];
          for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            moonPts.push(new THREE.Vector3(Math.cos(theta) * 22, 0, Math.sin(theta) * 22));
          }
          const moonOrbitLine = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(moonPts),
            new THREE.LineBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.22 })
          );
          planetMesh.add(moonOrbitLine);

          moonBody = {
            mesh: moonMesh,
            pivot: moonPivot,
            radius: 1.65,
            orbitSpeed: 0.045,
            rotSpeed: 0.015,
            parent: planetMesh
          };
          this.bodies.moon = moonBody;
          const issGroup = new THREE.Group();
          issGroup.userData = { id: 'iss' };
          const trussMat = new THREE.MeshStandardMaterial({ color: 0xe0e0e0, metalness: 0.92, roughness: 0.12 });
          const mainTrussGeo = new THREE.BoxGeometry(32, 1.2, 1.2);
          issGroup.add(new THREE.Mesh(mainTrussGeo, trussMat));
          const crossTrussGeo = new THREE.BoxGeometry(1.2, 1.2, 10);
          const crossTruss = new THREE.Mesh(crossTrussGeo, trussMat);
          crossTruss.userData = { id: 'iss' };
          issGroup.add(crossTruss);
          const habMat = new THREE.MeshStandardMaterial({ color: 0xc8c8c8, metalness: 0.78, roughness: 0.22 });
          const usLabGeo = new THREE.CylinderGeometry(1.4, 1.4, 11, 16);
          const usLab = new THREE.Mesh(usLabGeo, habMat);
          usLab.rotation.z = Math.PI / 2;
          usLab.position.set(2, 0, 0);
          usLab.userData = { id: 'iss' };
          issGroup.add(usLab);
          const rusMat = new THREE.MeshStandardMaterial({ color: 0xb8b8b8, metalness: 0.72, roughness: 0.28 });
          const rusModGeo = new THREE.CylinderGeometry(1.2, 1.2, 7, 16);
          const rusMod = new THREE.Mesh(rusModGeo, rusMat);
          rusMod.rotation.z = Math.PI / 2;
          rusMod.position.set(-5, 0, 0);
          rusMod.userData = { id: 'iss' };
          issGroup.add(rusMod);
          const nodeMat = new THREE.MeshStandardMaterial({ color: 0xe2e2e2, metalness: 0.82, roughness: 0.18 });
          const nodeGeo = new THREE.SphereGeometry(1.5, 12, 12);
          const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
          nodeMesh.position.set(0, 0, 0);
          nodeMesh.userData = { id: 'iss' };
          issGroup.add(nodeMesh);
          const cupolaMat = new THREE.MeshStandardMaterial({ color: 0x90b8d8, metalness: 0.5, roughness: 0.3, transparent: true, opacity: 0.85 });
          const cupolaGeo = new THREE.SphereGeometry(0.9, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2.5);
          const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
          cupola.position.set(1.5, -1.5, 0);
          cupola.rotation.z = Math.PI;
          cupola.userData = { id: 'iss' };
          issGroup.add(cupola);
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
            const mastGeo = new THREE.BoxGeometry(0.25, 0.25, Math.abs(z) - 0.6);
            const mast = new THREE.Mesh(mastGeo, mastMat2);
            mast.position.set(x, 0, z * 0.4);
            mast.userData = { id: 'iss' };
            issGroup.add(mast);
            const panelGeo = new THREE.BoxGeometry(9, 0.09, 4);
            const panel = new THREE.Mesh(panelGeo, mat);
            panel.position.set(x, 0, z);
            panel.userData = { id: 'iss' };
            issGroup.add(panel);
            const divGeo = new THREE.BoxGeometry(9, 0.12, 0.08);
            for (let d = -1.5; d <= 1.5; d += 1.0) {
              const div = new THREE.Mesh(divGeo, mastMat2);
              div.position.set(x, 0.06, z + d);
              div.userData = { id: 'iss' };
              issGroup.add(div);
            }
          });
          const radMat = new THREE.MeshStandardMaterial({ color: 0xfafafa, metalness: 0.3, roughness: 0.6 });
          [[-6, 0, 2.5], [6, 0, 2.5], [-6, 0, -2.5], [6, 0, -2.5]].forEach(([x, y, z]) => {
            const radGeo = new THREE.BoxGeometry(3.5, 0.07, 1.8);
            const rad = new THREE.Mesh(radGeo, radMat);
            rad.position.set(x, y + 1.0, z);
            rad.userData = { id: 'iss' };
            issGroup.add(rad);
          });
          const dockMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.85, roughness: 0.15 });
          [[-8, 0, 0], [4, 0, 0]].forEach(([x, y, z]) => {
            const dockGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 10);
            const dock = new THREE.Mesh(dockGeo, dockMat);
            dock.position.set(x, y + 2.0, z);
            dock.userData = { id: 'iss' };
            issGroup.add(dock);
          });
          const issClickGeo = new THREE.SphereGeometry(3.6, 8, 8);
          const issClickMat = new THREE.MeshBasicMaterial({ visible: false });
          const issClickMesh = new THREE.Mesh(issClickGeo, issClickMat);
          issClickMesh.userData = { id: 'iss' };
          issGroup.add(issClickMesh);
          issGroup.scale.setScalar(0.042);
          const issPivot = new THREE.Group();
          planetMesh.add(issPivot);
          issGroup.position.set(7.6, 0.3, 0);
          issPivot.add(issGroup);
          const issPts = [];
          for (let i = 0; i <= 64; i++) {
            const theta = (i / 64) * Math.PI * 2;
            issPts.push(new THREE.Vector3(Math.cos(theta) * 7.6, 0, Math.sin(theta) * 7.6));
          }
          const issOrbitLine = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(issPts),
            new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.45 })
          );
          planetMesh.add(issOrbitLine);

          this.bodies.iss = {
            id: 'iss',
            mesh: issGroup,
            pivot: issPivot,
            radius: 0.7,
            orbitSpeed: 0.024,
            rotSpeed: 0.005,
            dist: 7.6,
            parent: planetMesh
          };
        }
        if (p.hasRings) {
          const ringGeo = new THREE.RingGeometry(p.radius * 1.35, p.radius * 2.45, 64);
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
      let isPointerDown = false;
      let isDragging = false;
      let startX = 0;
      let startY = 0;

      this.canvas.addEventListener('mousedown', (e) => {
        isPointerDown = true;
        isDragging = false;
        startX = e.clientX;
        startY = e.clientY;
      });

      window.addEventListener('mouseup', () => {
        isPointerDown = false;
      });
      this.canvas.addEventListener('mousemove', (e) => {
        if (isPointerDown) {
          if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) {
            isDragging = true;
            if (this.activeTarget) {
              this.activeTarget = null;
            }
          }
        }
        const pos = getCoords(e);
        this.mouse.set(pos.x, pos.y);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const clickable = Object.values(this.bodies).map(b => b.mesh);
        const hits = this.raycaster.intersectObjects(clickable, true);
        const validHits = hits.filter(h => h.object && !h.object.isLine && !h.object.isLineLoop);
        this.canvas.style.cursor = validHits.length > 0 ? 'pointer' : 'default';
      });
      this.canvas.addEventListener('click', (e) => {
        if (isDragging) {
          isDragging = false;
          return;
        }
        const pos = getCoords(e);
        this.mouse.set(pos.x, pos.y);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const clickable = Object.values(this.bodies).map(b => b.mesh);
        const hits = this.raycaster.intersectObjects(clickable, true);
        const validHits = hits.filter(h => h.object && !h.object.isLine && !h.object.isLineLoop);

        if (validHits.length > 0) {
          let bodyId = null;
          let obj = validHits[0].object;
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
      this.canvas.addEventListener('wheel', () => {
        if (this.activeTarget) {
          this.activeTarget = null;
        }
      }, { passive: true });

      window.addEventListener('resize', () => this.resize());
    }

    focusBody(bodyId, triggerCallback = true) {
      const body = this.bodies[bodyId];
      if (!body) return;

      this.activeTarget = bodyId;

      if (triggerCallback && this.onBodySelectedCallback) {
        this.onBodySelectedCallback(bodyId);
      }
    }

    resetOverview() {
      this.activeTarget = null;
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
      if (this.milkyWayGroup) {
        this.milkyWayGroup.rotation.y += 0.0003;
      }
      Object.entries(this.bodies).forEach(([id, body]) => {
        if (body.mesh) {
          body.mesh.rotation.y += body.rotSpeed;
        }
        if (this.motionPlaying && body.pivot) {
          body.pivot.rotation.y += body.orbitSpeed * 0.3;
        }
      });
      if (this.activeTarget && this.bodies[this.activeTarget]) {
        const targetBody = this.bodies[this.activeTarget];
        const worldPos = new THREE.Vector3();
        targetBody.mesh.getWorldPosition(worldPos);
        this.targetLook.lerp(worldPos, this.camLerpSpeed);
        this.controls.target.copy(this.targetLook);
        let offsetDist;
        if (this.activeTarget === 'sun') {
          offsetDist = 95;
        } else {
          offsetDist = Math.max(targetBody.radius * 3.4, 22);
        }
        const desiredCamPos = worldPos.clone().add(new THREE.Vector3(offsetDist * 0.7, offsetDist * 0.45, offsetDist));
        this.camera.position.lerp(desiredCamPos, this.camLerpSpeed);
      } else {
        this.targetLook.lerp(this.defaultLookTarget, this.camLerpSpeed);
        this.controls.target.copy(this.targetLook);
        this.camera.position.lerp(this.defaultCamPos, this.camLerpSpeed);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
  }

  window.SolarSystem3D = SolarSystem3D;
  window.solarSystemController = new SolarSystem3D();

})();

