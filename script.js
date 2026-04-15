/* ===== PARTICLE GRID CANVAS ===== */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles, mouse;

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    mouse = { x: w / 2, y: h / 2 };
    const spacing = 80;
    const cols = Math.ceil(w / spacing) + 1;
    const rows = Math.ceil(h / spacing) + 1;
    particles = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        particles.push({
          x: i * spacing,
          y: j * spacing,
          ox: i * spacing,
          oy: j * spacing,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      const dx = mouse.x - p.ox;
      const dy = mouse.y - p.oy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200;
      if (dist < maxDist) {
        const force = (1 - dist / maxDist) * 20;
        p.x = p.ox + (dx / dist) * force;
        p.y = p.oy + (dy / dist) * force;
      } else {
        p.x += (p.ox - p.x) * 0.1;
        p.y += (p.oy - p.y) * 0.1;
      }
      const alpha = dist < maxDist ? 0.15 + (1 - dist / maxDist) * 0.35 : 0.08;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(108, 99, 255, ${alpha})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(108, 99, 255, ${0.04 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  init();
  draw();
})();

/* ===== CURSOR GLOW ===== */
(function () {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;
  let mx = 0, my = 0, gx = 0, gy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animate);
  }

  animate();
})();

/* ===== SERVICE CARD MOUSE TRACKING ===== */
document.querySelectorAll('.service-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width) * 100 + '%');
    card.style.setProperty('--mouse-y', ((e.clientY - rect.top) / rect.height) * 100 + '%');
  });
});

/* ===== NAV SCROLL ===== */
(function () {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = y;
  });
})();

/* ===== MOBILE NAV ===== */
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });
})();

/* ===== SCROLL REVEAL ===== */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* ===== COUNTER ANIMATION ===== */
(function () {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          let current = 0;
          const duration = 2000;
          const step = target / (duration / 16);

          function count() {
            current += step;
            if (current >= target) {
              el.textContent = target.toLocaleString();
              return;
            }
            el.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(count);
          }

          count();
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
})();

/* ===== i18n LANGUAGE TOGGLE (EN / ES) ===== */
(function () {
  const translations = {
    en: {
      'nav.services': 'Services',
      'nav.work': 'Work',
      'nav.about': 'About',
      'nav.cta': 'Get in Touch',

      'hero.badge': 'Based in Jersey City, NJ',
      'hero.title1': 'Build software',
      'hero.title2': 'that <em class="gradient-text">moves</em> organizations',
      'hero.title3': 'forward.',
      'hero.sub': 'Search Engine Optimization & web development for Hudson County, NJ & beyond.',
      'hero.ctaPrimary': 'View Our Work',
      'hero.ctaSecondary': 'Start a Project',
      'hero.statClients': 'Clients Served',

      'services.tag': 'What We Do',
      'services.title': 'Engineering solutions<br />at the intersection of<br /><span class="gradient-text">code &amp; community.</span>',
      'services.sub': 'Freelance software development & search engine optimization for Hudson County, NJ & beyond.',
      'services.card1Title': 'Software Development',
      'services.card1Desc': 'Custom web & mobile applications built with modern, full-stack architecture — from first wireframe to live deployment.',
      'services.card2Title': 'Search Engine Optimization',
      'services.card2Desc': 'Get found by the people searching for you — technical SEO, on-page optimization, and local search strategy for Hudson County businesses.',
      'services.tag1': 'Local SEO',
      'services.tag2': 'Analytics',

      'work.tag': 'Selected Work',
      'work.title': 'Products that serve<br /><span class="gradient-text">real communities.</span>',
      'work.museCat': 'Non-Profit Platform',
      'work.museDesc': 'A subscription-based MERN platform for <a href="https://www.jerseycitypoetryfestival.org/">Jersey City\'s Poet Laureate, Melida Rodas.</a> Local artists discover and post cultural events on an interactive map with calendar integration and Stripe-powered paywalled content.',
      'work.housesCat': 'Civic Automation',
      'work.housesDesc': 'Built for <a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting,</a> this project automates Affirmative Fair Housing Marketing Plan reports for Jersey City\'s Department of Affordable Housing, eliminating manual Census data lookup for real estate clients.',
      'work.viewProject': 'View Project',

      'about.tag': 'About',
      'about.title': 'A freelance developer<br />who\'s shipped at<br /><span class="gradient-text">every scale.</span>',
      'about.bio1': 'I\'m <strong>Roberto Rodas-Herndon</strong>, a Boston University Computer Science graduate &amp; software developer. While at Boston University, I served as <strong>President of the Hack4Impact chapter (2021–2023)</strong>, leading a student-run team that built free software for non-profits — the same mission that inspired the founding of HudsonTech.',
      'about.bio2': 'From navigating <strong>Pinterest\'s</strong> codebase at their headquarters in San Francisco alongside senior engineers, to providing technical insights across the enterprise at <strong>PSEG</strong>, I bring big-company engineering rigor to organizations that need it most — those shaping their communities.',
      'about.bio3': 'Every project ships with modern architecture and a focus on real-world impact. I\'m also <strong>bilingual (English &amp; Spanish)</strong>, which helps me serve Hudson County\'s diverse communities directly in their language.',

      'timeline.role1': 'Founded HudsonTech LLC',
      'timeline.desc1': 'Freelance software development for Hudson County, NJ & beyond.',
      'timeline.role2': 'Data Scientist — PSEG',
      'timeline.desc2': 'Public Service Enterprise Group — one of the largest publicly-traded energy & utility companies in the U.S., serving millions of customers across New Jersey.',
      'timeline.role3': 'Data Engineer — PowerOptions',
      'timeline.desc3': 'New England\'s largest energy-buying consortium, helping non-profits and public entities negotiate better rates on electricity & natural gas.',
      'timeline.role4': 'Software Engineer Intern — Pinterest',
      'timeline.desc4': 'Image-sharing and social media platform headquartered in San Francisco, where I built internal observability tools alongside senior engineers.',
      'timeline.role5': 'President — BU Hack4Impact',
      'timeline.desc5': 'A national network of college-student chapters that build free software for non-profits. I led the Boston University chapter for two years.',

      'contact.tag': 'Start a Project',
      'contact.title': 'Let\'s build something<br /><span class="gradient-text">that matters.</span>',
      'contact.cta': 'Let\'s Chat',

      'footer.copy': '© 2026 HudsonTech LLC. Jersey City, NJ.'
    },
    es: {
      'nav.services': 'Servicios',
      'nav.work': 'Proyectos',
      'nav.about': 'Acerca',
      'nav.cta': 'Contáctame',

      'hero.badge': 'Ubicado en Jersey City, NJ',
      'hero.title1': 'Creamos software',
      'hero.title2': 'que <em class="gradient-text">impulsa</em> a las organizaciones',
      'hero.title3': 'hacia el futuro.',
      'hero.sub': 'Optimización para motores de búsqueda y desarrollo web para el condado de Hudson, NJ y más allá.',
      'hero.ctaPrimary': 'Ver Proyectos',
      'hero.ctaSecondary': 'Iniciar un Proyecto',
      'hero.statClients': 'Clientes Atendidos',

      'services.tag': 'Lo Que Hacemos',
      'services.title': 'Soluciones de ingeniería<br />en la intersección del<br /><span class="gradient-text">código y la comunidad.</span>',
      'services.sub': 'Desarrollo de software y optimización para motores de búsqueda independientes para el condado de Hudson, NJ y más allá.',
      'services.card1Title': 'Desarrollo de Software',
      'services.card1Desc': 'Aplicaciones web y móviles personalizadas con arquitectura full-stack moderna — desde el primer boceto hasta el despliegue final.',
      'services.card2Title': 'Optimización para Motores de Búsqueda',
      'services.card2Desc': 'Haz que te encuentren las personas que te buscan — SEO técnico, optimización en la página y estrategia de búsqueda local para negocios del condado de Hudson.',
      'services.tag1': 'SEO Local',
      'services.tag2': 'Analítica',

      'work.tag': 'Proyectos Destacados',
      'work.title': 'Productos que sirven a<br /><span class="gradient-text">comunidades reales.</span>',
      'work.museCat': 'Plataforma Sin Fines de Lucro',
      'work.museDesc': 'Una plataforma MERN por suscripción creada para <a href="https://www.jerseycitypoetryfestival.org/">la Poeta Laureada de Jersey City, Melida Rodas.</a> Los artistas locales descubren y publican eventos culturales en un mapa interactivo con calendario integrado y contenido exclusivo con Stripe.',
      'work.housesCat': 'Automatización Cívica',
      'work.housesDesc': 'Creado para <a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting,</a> este proyecto automatiza los informes del Plan de Comercialización de Vivienda Justa Afirmativa para el Departamento de Vivienda Asequible de Jersey City, eliminando la búsqueda manual de datos del Censo.',
      'work.viewProject': 'Ver Proyecto',

      'about.tag': 'Acerca',
      'about.title': 'Un desarrollador independiente<br />con experiencia a<br /><span class="gradient-text">cualquier escala.</span>',
      'about.bio1': 'Soy <strong>Roberto Rodas-Herndon</strong>, graduado en Ciencias de la Computación de Boston University y desarrollador de software. Durante mis estudios fui <strong>Presidente del capítulo de Hack4Impact (2021–2023)</strong>, liderando un equipo estudiantil que creaba software gratuito para organizaciones sin fines de lucro — la misma misión que inspiró la fundación de HudsonTech.',
      'about.bio2': 'Desde navegar el código de <strong>Pinterest</strong> en su sede de San Francisco junto a ingenieros senior, hasta aportar perspectivas técnicas a toda la empresa en <strong>PSEG</strong>, traigo el rigor de ingeniería de grandes compañías a las organizaciones que más lo necesitan — aquellas que dan forma a sus comunidades.',
      'about.bio3': 'Cada proyecto se entrega con arquitectura moderna y enfoque en impacto real. También soy <strong>bilingüe (inglés y español)</strong>, lo que me permite servir a las diversas comunidades del condado de Hudson directamente en su idioma.',

      'timeline.role1': 'Fundé HudsonTech LLC',
      'timeline.desc1': 'Desarrollo de software independiente para el condado de Hudson, NJ y más allá.',
      'timeline.role2': 'Científico de Datos — PSEG',
      'timeline.desc2': 'Public Service Enterprise Group — una de las mayores empresas de energía y servicios públicos de EE.UU., atendiendo a millones de clientes en Nueva Jersey.',
      'timeline.role3': 'Ingeniero de Datos — PowerOptions',
      'timeline.desc3': 'El mayor consorcio de compra de energía de Nueva Inglaterra, ayudando a organizaciones sin fines de lucro y entidades públicas a negociar mejores tarifas de electricidad y gas natural.',
      'timeline.role4': 'Ingeniero de Software — Pinterest',
      'timeline.desc4': 'Plataforma de redes sociales con sede en San Francisco, donde desarrollé herramientas internas de observabilidad junto a ingenieros senior.',
      'timeline.role5': 'Presidente — BU Hack4Impact',
      'timeline.desc5': 'Una red nacional de capítulos universitarios que crean software gratuito para organizaciones sin fines de lucro. Lideré el capítulo de Boston University durante dos años.',

      'contact.tag': 'Iniciar un Proyecto',
      'contact.title': 'Creemos algo<br /><span class="gradient-text">que importe.</span>',
      'contact.cta': 'Conversemos',

      'footer.copy': '© 2026 HudsonTech LLC. Jersey City, NJ.'
    }
  };

  function applyLanguage(lang) {
    const dict = translations[lang] || translations.en;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });

    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('.lang-opt').forEach((opt) => {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    try { localStorage.setItem('hudsontech_lang', lang); } catch (e) {}
  }

  const toggle = document.getElementById('langToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('lang') || 'en';
      applyLanguage(current === 'en' ? 'es' : 'en');
    });
  }

  let saved = 'en';
  try { saved = localStorage.getItem('hudsontech_lang') || 'en'; } catch (e) {}
  applyLanguage(saved);
})();

/* ===== SMOOTH SCROLL FOR ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
