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
      'hero.title1': 'I build software',
      'hero.title2': 'that <em class="gradient-text">moves</em> organizations',
      'hero.title3': 'forward.',
      'hero.sub': 'Freelance software development for Hudson County businesses & beyond.',
      'hero.ctaPrimary': 'View My Work',
      'hero.ctaSecondary': 'Start a Project',
      'hero.statClients': 'Clients Served',

      'services.tag': 'What We Do',
      'services.title': 'Engineering solutions<br />at the intersection of<br /><span class="gradient-text">code &amp; community.</span>',
      'services.sub': 'Freelance software development for Hudson County, NJ & beyond.',
      'services.card1Title': 'Software Development',
      'services.card1Desc': 'Custom web and mobile applications — including React Native and native iOS apps — that turn manual work into measurable outcomes. I build software that saves organizations time, reaches more of the people they serve, and delivers the kind of operational leverage that usually only enterprise teams can afford.',
      'services.benefit1': '<strong>Cut operating costs.</strong> Automate repetitive tasks — data entry, reporting, scheduling, invoicing — so your team can focus on mission-critical work instead of manual busywork.',
      'services.benefit2': '<strong>Unlock new revenue.</strong> Subscription platforms, online payments, paywalled content, and e-commerce flows — purpose-built to open revenue streams your current website can\'t.',
      'services.benefit3': '<strong>Reach your community where they are.</strong> Mobile apps, push notifications, and real-time tools meet members on the device they already use, driving engagement and retention.',
      'services.benefit4': '<strong>Make smarter decisions.</strong> Dashboards, analytics, and AI-powered insights turn the data you already collect into clear direction for your next move.',

      'work.tag': 'Selected Work',
      'work.title': 'Products that serve<br /><span class="gradient-text">real communities.</span>',
      'work.museCat': 'Non-Profit Platform',
      'work.museDesc': 'A subscription-based platform built for <a href="https://www.jerseycitypoetryfestival.org/">Jersey City\'s Poet Laureate, Melida Rodas.</a> Local artists discover and post cultural events on an interactive map with calendar integration and premium content access.',
      'work.housesCat': 'Civic Automation',
      'work.housesDesc': 'Built for <a href="https://www.quetzalconsultingnj.com/affordablehousingstock" target="_blank" rel="noopener">Quetzal Consulting,</a> this project automates Affirmative Fair Housing Marketing Plan reports for Jersey City\'s Department of Affordable Housing, eliminating manual Census data lookup for real estate clients.',
      'work.viewProject': 'View Project',

      'about.tag': 'About',
      'about.title': 'A freelance developer<br />who\'s shipped at<br /><span class="gradient-text">every scale.</span>',
      'about.bio1': 'I\'m <strong>Roberto Rodas-Herndon</strong>, a Boston University Computer Science graduate &amp; software developer. While at Boston University, I served as <strong>President of the Hack4Impact chapter (2021–2023)</strong>, leading a student-run team that built free software for non-profits — the same mission that inspired the founding of HudsonTech.',
      'about.bio2': 'From navigating <strong>Pinterest\'s</strong> codebase at their headquarters in San Francisco alongside senior engineers, to providing technical insights across the enterprise at <strong>PSEG</strong>, I bring big-company engineering rigor to organizations that need it most — those shaping their communities.',
      'about.bio3': 'Every project ships with modern architecture and a focus on real-world impact. I\'m also <strong>bilingual (English &amp; Spanish)</strong>, which helps me serve Hudson County\'s diverse communities directly in their language.',

      'timeline.role1': 'Founded HudsonTech LLC',
      'timeline.desc1': 'Freelance software development for Hudson County businesses & beyond.',
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
      'hero.title1': 'Construyo software',
      'hero.title2': 'que <em class="gradient-text">impulsa</em> organizaciones',
      'hero.title3': 'hacia adelante.',
      'hero.sub': 'Desarrollo de software independiente para los negocios del condado de Hudson y más allá.',
      'hero.ctaPrimary': 'Ver Mis Proyectos',
      'hero.ctaSecondary': 'Iniciar un Proyecto',
      'hero.statClients': 'Clientes Atendidos',

      'services.tag': 'Lo Que Hacemos',
      'services.title': 'Soluciones de ingeniería<br />en la intersección del<br /><span class="gradient-text">código y la comunidad.</span>',
      'services.sub': 'Desarrollo de software independiente para el condado de Hudson, NJ y más allá.',
      'services.card1Title': 'Desarrollo de Software',
      'services.card1Desc': 'Aplicaciones web y móviles personalizadas — incluyendo React Native y iOS nativo — que convierten el trabajo manual en resultados medibles. Construyo software que ahorra tiempo, llega a más personas y ofrece el tipo de ventaja operativa que normalmente solo los equipos empresariales pueden permitirse.',
      'services.benefit1': '<strong>Reduce costos operativos.</strong> Automatiza tareas repetitivas — entrada de datos, informes, programación, facturación — para que tu equipo pueda enfocarse en la misión en lugar del trabajo manual.',
      'services.benefit2': '<strong>Desbloquea nuevos ingresos.</strong> Plataformas de suscripción, pagos en línea, contenido exclusivo y flujos de comercio electrónico — diseñados para abrir canales de ingresos que tu sitio actual no puede.',
      'services.benefit3': '<strong>Llega a tu comunidad donde está.</strong> Aplicaciones móviles, notificaciones push y herramientas en tiempo real conectan con tus miembros en el dispositivo que ya usan, aumentando la participación y retención.',
      'services.benefit4': '<strong>Toma decisiones más inteligentes.</strong> Paneles, analítica e inteligencia artificial convierten los datos que ya recopilas en una dirección clara para tu próxima decisión.',

      'work.tag': 'Proyectos Destacados',
      'work.title': 'Productos que sirven a<br /><span class="gradient-text">comunidades reales.</span>',
      'work.museCat': 'Plataforma Sin Fines de Lucro',
      'work.museDesc': 'Una plataforma por suscripción creada para <a href="https://www.jerseycitypoetryfestival.org/">la Poeta Laureada de Jersey City, Melida Rodas.</a> Los artistas locales descubren y publican eventos culturales en un mapa interactivo con calendario integrado y acceso a contenido exclusivo.',
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
      'contact.title': 'Construyamos algo<br /><span class="gradient-text">que importe.</span>',
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
