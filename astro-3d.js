
(function () {
  'use strict';

  
  if (!window.astro3DController) {
    window.astro3DController = {
      setSpeaking() {},
      triggerWave() {},
      pointAtCard() {},
      setLookTarget() {}
    };
  }

  
  const POSES = {
    idle:    'assets/astro_pose_idle.png',
    explain: 'assets/astro_pose_explain.png',
    excited: 'assets/astro_pose_excited.png',
    wave:    'assets/astro_pose_wave.png'
  };

  
  const SPEAK_CYCLE  = ['explain', 'excited', 'wave'];
  const SPEAK_HOLD_MS = 1600;

  
  const S = {
    speaking:    false,
    waving:      false,  waveEnd:   0,
    pointing:    false,  pointEnd:  0,
    speakIdx:    0,      speakNext: 0,
    tiltX:       0,      tiltY:     0,
    curTiltX:    0,      curTiltY:  0,
    currentPose: 'idle',
    animRaf:     null
  }; 

  
  window.initAstor3DSceneModern = function () {

    const stage = document.getElementById('astorVisualStage');
    if (!stage) return;

    
    const oldCanvas = document.getElementById('astor3DCanvas');
    if (oldCanvas) oldCanvas.style.display = 'none';
    const oldImg = document.getElementById('astroImg');
    if (oldImg)    oldImg.style.display = 'none';

    
    if (!document.getElementById('astro-sprite-css')) {
      const style = document.createElement('style');
      style.id = 'astro-sprite-css';
      style.textContent = `
        
        #astroSpriteWrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 5;
          perspective: 900px;
        }

        
        #astroSpriteTilt {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.08s linear;
          will-change: transform;
        }

        
        .astro-pose-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          opacity: 0;
          transition: opacity 0.38s cubic-bezier(0.4, 0, 0.2, 1);
          user-select: none;
          pointer-events: none;
          will-change: opacity;
          filter: drop-shadow(0 18px 36px rgba(0,0,0,0.45))
                  drop-shadow(0  6px 14px rgba(0,0,0,0.30));
        }
        .astro-pose-img.active {
          opacity: 1;
        }

        
        #astroSpriteWrap {
          animation: astroFloat 4.4s ease-in-out infinite;
        }
        @keyframes astroFloat {
          0%,100% { transform: translateY(0px);    }
          50%      { transform: translateY(-14px);  }
        }

        
        #astorVisualStage.astro-speaking {
          box-shadow:
            0 0 0 2px rgba(0,229,255,0.35),
            0 0 32px 6px rgba(0,229,255,0.18),
            0 0 60px 12px rgba(99,102,241,0.12);
          transition: box-shadow 0.4s ease;
        }
        #astorVisualStage {
          transition: box-shadow 0.4s ease;
        }

        
        #astroGroundGlow {
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 65%;
          height: 24px;
          background: radial-gradient(ellipse, rgba(0,229,255,0.22) 0%, transparent 70%);
          pointer-events: none;
          z-index: 3;
          animation: glowPulse 4.4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.8; transform: translateX(-50%) scaleX(1);   }
          50%      { opacity: 0.4; transform: translateX(-50%) scaleX(0.75); }
        }
      `;
      document.head.appendChild(style);
    }

    
    const wrap = document.createElement('div');
    wrap.id = 'astroSpriteWrap';

    const tilt = document.createElement('div');
    tilt.id = 'astroSpriteTilt';
    wrap.appendChild(tilt);

    
    const imgs = {};
    Object.entries(POSES).forEach(([name, src]) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Astro ${name}`;
      img.className = 'astro-pose-img';
      img.id = `astroPose_${name}`;
      img.draggable = false;
      tilt.appendChild(img);
      imgs[name] = img;
    });

    
    imgs['idle'].classList.add('active');

    
    const groundGlow = document.createElement('div');
    groundGlow.id = 'astroGroundGlow';
    wrap.appendChild(groundGlow);

    stage.appendChild(wrap);

    
    function activatePose(name) {
      if (S.currentPose === name) return;
      S.currentPose = name;
      Object.entries(imgs).forEach(([k, el]) => {
        el.classList.toggle('active', k === name);
      });
    }

    
    let raf;
    function loop(now) {
      raf = requestAnimationFrame(loop);

      
      let targetPose = 'idle';

      if (S.waving && now < S.waveEnd) {
        targetPose = 'wave';
      } else if (S.pointing && now < S.pointEnd) {
        targetPose = 'explain';
      } else if (S.speaking) {
        
        if (now >= S.speakNext) {
          S.speakIdx  = (S.speakIdx + 1) % SPEAK_CYCLE.length;
          S.speakNext = now + SPEAK_HOLD_MS + (Math.random() * 400 - 200);
        }
        targetPose = SPEAK_CYCLE[S.speakIdx];
      }

      activatePose(targetPose);

      
      S.curTiltX += (S.tiltX - S.curTiltX) * 0.055;
      S.curTiltY += (S.tiltY - S.curTiltY) * 0.055;
      const rX = S.curTiltY * 7;
      const rY = S.curTiltX * 10;
      tilt.style.transform = `rotateX(${-rX}deg) rotateY(${rY}deg)`;
    }

    raf = requestAnimationFrame(loop);

    
    stage.addEventListener('mousemove', (e) => {
      const r = stage.getBoundingClientRect();
      S.tiltX = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      S.tiltY = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    }, { passive: true });
    stage.addEventListener('mouseleave', () => {
      S.tiltX = 0; S.tiltY = 0;
    });

    
    window.astro3DController = {

      setSpeaking(val) {
        S.speaking = !!val;
        if (val) {
          
          S.speakIdx  = 0;
          S.speakNext = performance.now();
          stage.classList.add('astro-speaking');
        } else {
          stage.classList.remove('astro-speaking');
        }
      },

      triggerWave() { 
        S.waving  = true;
        S.waveEnd = performance.now() + 3200;
        
        setTimeout(() => { S.waving = false; }, 3300);
      },

      pointAtCard() {
        S.pointing  = true;
        S.pointEnd  = performance.now() + 3600;
        setTimeout(() => { S.pointing = false; }, 3700);
      },

      setLookTarget(x, y) {
        S.tiltX = x;
        S.tiltY = y;
      }
    };

    console.log('✅ Astro Sprite Engine — 4-pose crossfade active.');
  };

})();
