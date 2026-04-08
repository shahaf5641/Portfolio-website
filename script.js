const progressBar = document.querySelector('.scroll-progress');
const cursorAura = document.querySelector('.cursor-aura');
const cursorShell = document.querySelector('.dev-cursor');
const cursorDot = document.querySelector('.dev-cursor-dot');
const cursorLabel = document.querySelector('.dev-cursor-label');
const revealItems = document.querySelectorAll('.reveal');
const tiltItems = document.querySelectorAll('.tilt-card, .nav a, .project-link, .inline-links a, .contact-links a, .contact-email, .contact-phone');
const magneticItems = document.querySelectorAll('.magnetic, .contact-email, .contact-phone, .contact-links a, .project-link');
const labeledItems = document.querySelectorAll('[data-cursor-label]');
const copyEmailButtons = document.querySelectorAll('.copy-email');
const navLinks = document.querySelectorAll('.nav a');
const trackedSections = document.querySelectorAll('section[id]');

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }
}

function updateActiveNav() {
  let activeId = trackedSections.length > 0 ? trackedSections[0].id : '';
  const scrollMarker = window.scrollY + 180;

  trackedSections.forEach((section) => {
    if (section.offsetTop <= scrollMarker) {
      activeId = section.id;
    }
  });

  const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  if (nearBottom && trackedSections.length > 0) {
    activeId = trackedSections[trackedSections.length - 1].id;
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${activeId}`;
    link.classList.toggle('is-active', isActive);
  });
}

window.addEventListener('scroll', updateProgress);
window.addEventListener('scroll', updateActiveNav);
updateProgress();
updateActiveNav();

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.forEach((item) => item.classList.remove('is-active'));
    link.classList.add('is-active');
  });
});

copyEmailButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const email = button.dataset.email || '';
    const defaultText = button.dataset.defaultText || email;

    try {
      await navigator.clipboard.writeText(email);
      button.textContent = 'COPIED';
      button.classList.add('is-copied');

      window.setTimeout(() => {
        button.textContent = defaultText;
        button.classList.remove('is-copied');
      }, 1400);
    } catch (error) {
      button.textContent = email;
    }
  });
});

if (window.matchMedia('(min-width: 721px)').matches) {
  window.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    if (cursorAura) {
      cursorAura.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    if (cursorShell) {
      cursorShell.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(-42deg)`;
    }

    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }

    if (cursorLabel) {
      cursorLabel.style.transform = `translate3d(${x + 56}px, ${y - 16}px, 0)`;
    }
  });

  labeledItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      if (!cursorLabel) {
        return;
      }
      cursorLabel.textContent = item.dataset.cursorLabel || '';
      cursorLabel.classList.add('is-visible');
    });

    item.addEventListener('mouseleave', () => {
      if (cursorLabel) {
        cursorLabel.classList.remove('is-visible');
      }
    });
  });
}

if (window.gsap) {
  gsap.timeline()
    .from('.site-header', {
      y: -28,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
    })
    .from('.hero-line', {
      yPercent: 110,
      opacity: 0,
      duration: 0.95,
      ease: 'power4.out',
    }, '-=0.2')
    .from('.intro-item', {
      y: 22,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    }, '-=0.45');

  revealItems.forEach((item) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: window.ScrollTrigger ? {
        trigger: item,
        start: 'top 84%',
        once: true,
      } : undefined,
    });
  });

  magneticItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;

      gsap.to(item, {
        x: offsetX * 0.1,
        y: offsetY * 0.1,
        duration: 0.25,
        ease: 'power3.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power3.out',
      });
    });
  });
}

tiltItems.forEach((item) => {
  item.addEventListener('mousemove', (event) => {
    const rect = item.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -6;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    item.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

const sceneCanvas = document.getElementById('scene-canvas');

if (window.THREE && sceneCanvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({
    canvas: sceneCanvas,
    alpha: true,
    antialias: true,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const ambient = new THREE.AmbientLight(0x9bc1ff, 0.9);
  const pointA = new THREE.PointLight(0x6ff7d7, 2.1, 60);
  pointA.position.set(7, 6, 14);
  const pointB = new THREE.PointLight(0x78a6ff, 1.8, 60);
  pointB.position.set(-8, -3, 10);
  scene.add(ambient, pointA, pointB);

  const nodeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8fb7ff,
    metalness: 0.8,
    roughness: 0.18,
    transparent: true,
    opacity: 0.14,
  });

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x6ff7d7,
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });

  const core = new THREE.Mesh(new THREE.TorusKnotGeometry(2.6, 0.58, 180, 28), wireMaterial);
  core.position.set(4.8, 1.4, -5);
  networkGroup.add(core);

  const cluster = new THREE.Mesh(new THREE.IcosahedronGeometry(3.2, 1), nodeMaterial);
  cluster.position.set(-5.2, -2.2, -9);
  networkGroup.add(cluster);

  const ringGroup = new THREE.Group();
  ringGroup.position.set(-4.2, 3.8, -13);
  networkGroup.add(ringGroup);

  for (let i = 0; i < 4; i += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.6 + i * 0.5, 0.028, 16, 120),
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x6ff7d7 : 0x78a6ff,
        wireframe: true,
        transparent: true,
        opacity: 0.24,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = i * 0.45;
    ringGroup.add(ring);
  }

  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 850;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i += 1) {
    const s = i * 3;
    positions[s] = (Math.random() - 0.5) * 48;
    positions[s + 1] = (Math.random() - 0.5) * 28;
    positions[s + 2] = (Math.random() - 0.5) * 24;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0xb5d7ff,
      size: 0.05,
      transparent: true,
      opacity: 0.62,
    })
  );
  scene.add(particles);

  const pointer = { x: 0, y: 0 };
  const clock = new THREE.Clock();

  window.addEventListener('mousemove', (event) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = -(event.clientY / window.innerHeight - 0.5) * 2;
  });

  function render() {
    const t = clock.getElapsedTime();

    core.rotation.x = t * 0.15;
    core.rotation.y = t * 0.2;
    cluster.rotation.x = t * 0.08;
    cluster.rotation.y = t * 0.12;
    ringGroup.rotation.z = t * 0.1;
    ringGroup.rotation.x = Math.sin(t * 0.24) * 0.28;
    particles.rotation.y = t * 0.008;

    camera.position.x += ((pointer.x * 1.6) - camera.position.x) * 0.04;
    camera.position.y += ((pointer.y * 1.1) - camera.position.y) * 0.04;
    camera.lookAt(0, 0, -6);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  });
}
