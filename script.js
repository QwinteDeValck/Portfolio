/* ============================================================
   PORTFOLIO QWINTE DE VALCK — script.js
   Puur JavaScript, geen libraries.
   Bevat: projectdata + render, filteren, modal, mobiel menu,
   smooth scrolling, reveal-animaties, typewriter, back-to-top.
   ============================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     1. HULPFUNCTIES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     2. JAAR IN FOOTER
     ============================================================ */
  $('#year').textContent = new Date().getFullYear();

  /* ============================================================
     3. STICKY HEADER + BACK-TO-TOP
     ============================================================ */
  const navbar = $('#navbar');
  const backToTop = $('#back-to-top');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    backToTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ============================================================
     4. MOBIEL MENU (hamburger)
     ============================================================ */
  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');

  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  });

  // Menu sluiten na klikken op een link (mobiel)
  $$('.mobile-link', mobileMenu).forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ============================================================
     5. SCROLLSPY — actieve nav-link markeren
     ============================================================ */
  const sections = ['home', 'projecten', 'over-mij', 'contact'];
  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$('.nav-link').forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  /* ============================================================
     6. REVEAL-ANIMATIES BIJ SCROLLEN
     ============================================================ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$('.reveal').forEach((el) => revealObserver.observe(el));

  /* ============================================================
     7. TYPEWRITER EFFECT (hero)
     ============================================================ */
  const typedEl = $('#typed');
  const words = ['videogames', '3D-werelden', 'interactieve websites', 'motion graphics'];
  let wordIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const word = words[wordIndex];
    typedEl.textContent = word.slice(0, charIndex);

    if (!deleting && charIndex < word.length) {
      charIndex++;
      setTimeout(type, 80);
    } else if (!deleting && charIndex === word.length) {
      deleting = true;
      setTimeout(type, 1800);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      setTimeout(type, 40);
    } else {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(type, 400);
    }
  };
  type();

  /* ============================================================
     8. PROJECTEN — DATA
     PAS DE ARRAY HIERONDER AAN om projecten toe te voegen.
     Wil je een screenshot tonen? Zet dan bij `image` het pad naar
     je bestand, bv. "projects/web/mijn-site/screenshot.png".
     Zolang `image` leeg is, wordt er een gradient-placeholder
     met icoon getoond. `demo`/`github` leeg = knop verborgen.
     Wil je een interactief 3D-model tonen? Zet het pad bij
     `model` (een .glb export uit Blender/Maya).
     ============================================================ */
  const projects = [
    {
      title: 'Enemy — 3D Character Model',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'GLB'],
      summary: 'Een 3D character model, draaibaar in de browser.',
      context:
        'Een 3D character model dat realtime in de browser bekeken kan worden, geëxporteerd als GLB en gerenderd met WebGL.',
      role: 'Modelling en rigging zijn volledig zelf gedaan.',
      challenges: 'Het model moest efficiënt blijven voor realtime weergave in de browser.',
      techniques: ['3D modelling', 'GLB export', 'Realtime rendering'],
      icon: 'fa-cube',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: '',
      // Pad naar jouw .glb bestand (let op: forward slashes)
      model: 'Projects/3D Moddeling/enemy finak work.glb',
      demo: '',
      github: ''
    },
    {
      title: 'Human Walk Cycle',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Rigging'],
      summary: 'Een gerigde 3D character met een vloeiende walk cycle.',
      context:
        'Een 3D character die in Blender is gerigged en een natuurlijke walk cycle heeft gekregen.',
      role: 'Modelling, rigging en animatie zijn zelf gemaakt.',
      challenges: 'Een natuurlijke loopbeweging krijgen met correcte weight painting.',
      techniques: ['Rigging', 'Walk cycle', 'Weight painting'],
      icon: 'fa-person-walking',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: 'Projects/3D Moddeling/3DModdel_HumanRig.png',
      video: 'Projects/3D Moddeling/3DModdel_HumanWalk.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Horse Animation',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Animation'],
      summary: 'Een geanimeerd paardmodel met een geloofwaardige gang.',
      context: 'Een paardmodel met een rig en animatie, gemaakt in Blender.',
      role: 'Modelling, rigging en animatie zijn zelf gedaan.',
      challenges: 'De loopbeweging van een paard overtuigend animeren.',
      techniques: ['Animation', 'Rigging', 'Modelling'],
      icon: 'fa-horse',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: '',
      video: 'Projects/3D Moddeling/Horse_Animation.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Fish Sculpt',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Sculpting'],
      summary: 'Een organische vis, opgebouwd via sculpting.',
      context: 'Een organische vis die via sculpting in Blender is opgebouwd.',
      role: 'Het sculpten en textureren is volledig zelf gedaan.',
      challenges: 'Organische vormen en detail krijgen via sculpting.',
      techniques: ['Digital sculpting', 'Texture painting'],
      icon: 'fa-fish',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: 'Projects/3D Moddeling/3DModdel_FishSculpt.png',
      demo: '',
      github: ''
    },
    {
      title: 'Crate Animation',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Animation'],
      summary: 'Een 3D kist die open en dicht gaat.',
      context: 'Een 3D kist met een open/sluit animatie, gemaakt in Blender.',
      role: 'Modelling en animatie zijn zelf gemaakt.',
      challenges: 'Realistische beweging van het deksel en de scharnieren.',
      techniques: ['Animation', 'Modelling'],
      icon: 'fa-box-open',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: '',
      video: 'Projects/3D Moddeling/3DModdel_CrateOpen.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Chest',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Modelling'],
      summary: 'Een gedetailleerde 3D schatkist.',
      context: 'Een gedetailleerde 3D schatkist, gemodelleerd in Blender.',
      role: 'Het model is volledig zelf gemodelleerd.',
      challenges: 'Detail en het "houten" karakter van de kist overbrengen.',
      techniques: ['Hard-surface modelling'],
      icon: 'fa-cube',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: 'Projects/3D Moddeling/3DModdel_Chest.png',
      demo: '',
      github: ''
    },
    {
      title: 'Nature Props',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Modelling'],
      summary: '3D bloemen en bomen als environment props.',
      context: '3D bloemen en bomen, gemaakt om een omgeving mee op te vullen.',
      role: 'Alle props zijn zelf gemodelleerd.',
      challenges: 'Een natuurlijke look met een efficiënt aantal polygons.',
      techniques: ['Low-poly', 'Environment design'],
      icon: 'fa-seedling',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: 'Projects/3D Moddeling/3DModdel_Bloemen.png',
      demo: '',
      github: ''
    },
    {
      title: 'Unity — Poisson Tree Placement',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Unity', 'C#'],
      summary: 'Procedurele boomplaatsing met Poisson sampling.',
      context:
        'Een Unity-proefstuk dat bomen procedureel plaatst met Poisson disc sampling, zodat er geen overlapping ontstaat.',
      role: 'Het algoritme en de Unity-implementatie zijn zelf geschreven.',
      challenges: 'Natuurlijke spreiding krijgen zonder dat objecten elkaar overlappen.',
      techniques: ['Poisson sampling', 'Procedural generation', 'C#'],
      icon: 'fa-tree',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: '',
      video: 'Projects/Unity/Unity_PoissonTreePlacement.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Unity — Hand-Painted Terrain',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Unity', 'Terrain'],
      summary: 'Terrain-generatie via heightmaps met hand-painted details.',
      context:
        'Een Unity-terrain opgebouwd uit heightmaps, aangevuld met hand-painted hoogte- en kleurdetails.',
      role: 'De terrain-build en het hand-painting zijn zelf gedaan.',
      challenges: 'Een natuurlijk landschap krijgen dat soepel blijft draaien.',
      techniques: ['Heightmap', 'Terrain tools', 'Environment design'],
      icon: 'fa-mountain',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: 'Projects/Unity/Unity_HeightmapTerrain.png',
      video: 'Projects/Unity/Unity_HandPaintedTerrain.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Unity — Final Project',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Unity', 'C#'],
      summary: 'Het eindproject, gemaakt in Unity.',
      context: 'Een speelbaar project in Unity waarin verschillende mechanics samenkomen.',
      role: 'Het hele project is zelf opgezet en geprogrammeerd.',
      challenges: 'Alle losse onderdelen samenbrengen in één samenhangend geheel.',
      techniques: ['Unity', 'C#', 'Game design'],
      icon: 'fa-gamepad',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: '',
      video: 'Projects/Unity/Unity_FinalProject.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Plant VR',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Unity', 'VR/AR'],
      summary: 'Een plantenervaring voor VR en AR.',
      context: 'Een VR/AR-ervaring rond planten, opgezet in Unity.',
      role: 'De scene en interacties zijn zelf gebouwd.',
      challenges: 'Interacties die comfortabel en intuïtief aanvoelen in VR.',
      techniques: ['VR/AR', 'Unity', 'Interactie'],
      icon: 'fa-mobile-screen',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      image: 'Projects/VR AR/plant-vr.png',
      demo: '',
      github: ''
    },
    {
      title: 'Web2 — Fullstack Web App',
      category: 'web',
      categoryLabel: 'Web & Code',
      tech: ['Node.js', 'Express', 'HTML/CSS'],
      summary: 'Een fullstack web app, gebouwd met Node.js.',
      context:
        'Schoolproject voor het vak web2, waarin we met Node.js fullstack web development hebben geleerd.',
      role: 'Frontend en backend zijn zelf gebouwd.',
      challenges: 'Een complete fullstack flow leren bouwen met Node.js en Express.',
      techniques: ['Node.js', 'Fullstack', 'Express'],
      icon: 'fa-code',
      gradient: 'linear-gradient(135deg,#16a34a,#3b82f6)',
      image: '',
      embed: 'https://ehb-mct.github.io/web2-course-project-front-end-QwinteDeValck/login.html',
      demo: 'https://ehb-mct.github.io/web2-course-project-front-end-QwinteDeValck/login.html',
      github: ''
    },
    {
      title: 'Madam Donut — Promo',
      category: 'video',
      categoryLabel: 'Video & Motion',
      tech: ['Premiere Pro'],
      summary: 'Een promotiefilm voor Madam Donut.',
      context: 'Een korte promotiefilm, gemonteerd in Premiere Pro.',
      role: 'Montage en color grading zijn zelf gedaan.',
      challenges: 'Een vlot tempo dat past bij het merk.',
      techniques: ['Montage', 'Color grading'],
      icon: 'fa-clapperboard',
      gradient: 'linear-gradient(135deg,#f97316,#ef4444)',
      image: '',
      video: 'Projects/Video/Madam Donut promo video final edit.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Fly Me To The Moon',
      category: 'video',
      categoryLabel: 'Video & Motion',
      tech: ['Premiere Pro', 'After Effects'],
      summary: 'Een korte film geïnspireerd op "Fly Me To The Moon".',
      context: 'Een korte film, gemonteerd in Premiere Pro met effecten in After Effects.',
      role: 'Productie, montage en motion graphics zijn zelf gedaan.',
      challenges: 'Verhaal en ritme in een korte tijd overbrengen.',
      techniques: ['Montage', 'Motion graphics'],
      icon: 'fa-film',
      gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
      image: '',
      video: 'Projects/Video/Fly Me To The Moon Qwinte De Valck.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Dreamix — Teaser',
      category: 'video',
      categoryLabel: 'Video & Motion',
      tech: ['After Effects'],
      summary: 'Een teaservideo voor Dreamix.',
      context: 'Een korte teaser met motion graphics en effecten, gemaakt in After Effects.',
      role: 'De teaser is volledig zelf geanimeerd en gecompileerd.',
      challenges: 'Binnen enkele seconden spanning opbouwen.',
      techniques: ['Motion graphics', 'Effecten'],
      icon: 'fa-film',
      gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
      image: '',
      video: 'Projects/Video/dreamix teaser vid.mp4',
      demo: '',
      github: ''
    },
    {
      title: 'Eindwerk Project',
      category: '3d',
      categoryLabel: '3D & Games',
      tech: ['Blender', 'Unity', 'DaVinci Resolve'],
      summary: 'Het eindwerkproject, gebouwd met Blender en Unity, gemonteerd in DaVinci Resolve.',
      context:
        'Een video van ons eindwerkproject, gemaakt met een klasgenoot. Het project zelf is gebouwd met Blender en Unity; de video is gemonteerd in DaVinci Resolve.',
      role: 'Samen gemaakt met een klasgenoot.',
      challenges: 'Het hele eindwerk realiseren en in een film vastleggen.',
      techniques: ['Blender', 'Unity', 'DaVinci Resolve'],
      icon: 'fa-circle-play',
      gradient: 'linear-gradient(135deg,#0066ff,#3b82f6)',
      youtube: 'JRFxRkw4Q-k',
      demo: 'https://www.youtube.com/watch?v=JRFxRkw4Q-k',
      github: ''
    },
    {
      title: 'Web Design Concept',
      category: 'design',
      categoryLabel: 'Design & UX',
      tech: ['Photoshop', 'Figma'],
      summary: 'Een visueel concept voor een website.',
      context: 'Een visueel webdesign-concept, uitgewerkt tot een document.',
      role: 'Het concept en de vormgeving zijn volledig zelf gemaakt.',
      challenges: 'Een herkenbare stijl die past bij de opdracht.',
      techniques: ['Visual design', 'Moodboard'],
      icon: 'fa-palette',
      gradient: 'linear-gradient(135deg,#3b82f6,#0066ff)',
      image: '',
      pdf: 'Projects/Design/Web-Design_visual_concept_Qwinte_De_Valck.pdf',
      demo: 'Projects/Design/Web-Design_visual_concept_Qwinte_De_Valck.pdf',
      github: ''
    },
    {
      title: 'Festival Design',
      category: 'design',
      categoryLabel: 'Design & UX',
      tech: ['Photoshop'],
      summary: 'Een visueel ontwerp voor een festival.',
      context: 'Een festivalontwerp met posters en een visuele richting.',
      role: 'Het ontwerp is zelf gemaakt.',
      challenges: 'Een krachtige visuele identiteit die van ver opvalt.',
      techniques: ['Poster design', 'Art direction'],
      icon: 'fa-images',
      gradient: 'linear-gradient(135deg,#ec4899,#7c3aed)',
      image: '',
      pdf: 'Projects/Design/Qwinte_De_Valck_festival.pdf',
      demo: 'Projects/Design/Qwinte_De_Valck_festival.pdf',
      github: ''
    },
    {
      title: 'Moodboards',
      category: 'design',
      categoryLabel: 'Design & UX',
      tech: ['Photoshop'],
      summary: 'Moodboards als startpunt voor een visuele stijl.',
      context: 'Moodboards die de sfeer en kleur van een project bepalen.',
      role: 'De moodboards zijn zelf samengesteld.',
      challenges: 'De juiste sfeer in één beeld vangen.',
      techniques: ['Moodboarding', 'Color research'],
      icon: 'fa-images',
      gradient: 'linear-gradient(135deg,#3b82f6,#0066ff)',
      image: '',
      pdf: 'Projects/Design/moodboard_wesite_web2_Qwinte_De_Valck.pdf',
      demo: 'Projects/Design/moodboard_wesite_web2_Qwinte_De_Valck.pdf',
      github: ''
    },
    {
      title: 'Visuele Identiteit',
      category: 'design',
      categoryLabel: 'Design & UX',
      tech: ['Photoshop'],
      summary: 'Een eigen visuele identiteit, uitgewerkt in een document.',
      context: 'Een persoonlijke visuele identiteit met richtlijnen en voorbeelden.',
      role: 'De identiteit is volledig zelf ontworpen.',
      challenges: 'Een consequent geheel dat overal hetzelfde oogt.',
      techniques: ['Brand identity', 'Guidelines'],
      icon: 'fa-bezier-curve',
      gradient: 'linear-gradient(135deg,#ec4899,#7c3aed)',
      image: '',
      pdf: 'Projects/Design/Qwinte_De_Valck.pdf.pdf',
      demo: 'Projects/Design/Qwinte_De_Valck.pdf.pdf',
      github: ''
    }
  ];

  /* ============================================================
     10. PROJECTEN RENDEREN
     ============================================================ */
  const grid = $('#projects-grid');

  const mediaFor = (p) => {
    if (p.image) {
      // Echte screenshot uit jouw projectmap
      return `<img src="${encodeURI(p.image)}" alt="Screenshot van ${p.title}" loading="lazy" />`;
    }
    if (p.video) {
      // Video-thumbnail met play-on-hover
      return `<video src="${encodeURI(p.video)}" muted loop playsinline preload="metadata"
        onmouseenter="this.play()" onmouseleave="this.pause(); this.currentTime = 0;"></video>`;
    }
    if (p.youtube) {
      // YouTube-thumbnail met play-knop
      return `
        <img src="https://img.youtube.com/vi/${p.youtube}/hqdefault.jpg" alt="Video van ${p.title}" loading="lazy" />
        <span class="video-play"><i class="fa-solid fa-circle-play"></i></span>
      `;
    }
    // Gradient-placeholder met icoon + badges (3D / PDF / live site)
    return `
      <i class="fa-solid ${p.icon} ph-icon" aria-hidden="true"></i>
      <span class="ph-cat">${p.categoryLabel}</span>
      ${p.pdf ? `<span class="ph-cat ph-cat-pdf"><i class="fa-solid fa-file-pdf"></i> PDF</span>` : ''}
      ${p.embed ? `<span class="ph-cat ph-cat-site"><i class="fa-solid fa-globe"></i> Live site</span>` : ''}
      ${p.model ? `<span class="ph-cat ph-cat-3d"><i class="fa-solid fa-cube"></i> 3D interactief</span>` : ''}
    `;
  };

  const cardFor = (p, index) => `
    <article class="project-card reveal visible" data-category="${p.category}" data-index="${index}">
      <div class="project-media" style="background:${p.gradient}">
        ${mediaFor(p)}
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p class="project-summary">${p.summary}</p>
        <div class="mb-4 flex flex-wrap gap-2">
          ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-actions">
          <button type="button" class="btn-mini btn-mini-solid open-modal">
            <i class="fa-solid fa-eye"></i> Case Study
          </button>
          ${p.demo ? `<a href="${encodeURI(p.demo)}" target="_blank" rel="noopener" class="btn-mini btn-mini-outline" aria-label="Live demo"><i class="fa-solid fa-up-right-from-square"></i></a>` : ''}
          ${p.github ? `<a href="${encodeURI(p.github)}" target="_blank" rel="noopener" class="btn-mini btn-mini-outline" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>` : ''}
        </div>
      </div>
    </article>
  `;

  grid.innerHTML = projects.map(cardFor).join('');

  /* ============================================================
     11. FILTEREN OP CATEGORIE
     ============================================================ */
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card', grid);

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          // Herstart de fadeInUp-animatie voor een vloeiend effect
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
        }
      });
    });
  });

  /* ============================================================
     12. PROJECT DETAIL MODAL
     ============================================================ */
  const modal = $('#modal');
  const modalMedia = $('#modal-media');
  const modalViewer = $('#modal-viewer');
  const modalCat = $('#modal-cat');
  const modalTitle = $('#modal-title');
  const modalSummary = $('#modal-summary');
  const modalContext = $('#modal-context');
  const modalRole = $('#modal-role');
  const modalChallenges = $('#modal-challenges');
  const modalTech = $('#modal-tech');
  const modalActions = $('#modal-actions');

  const openModal = (index) => {
    const p = projects[index];
    if (!p) return;

    // Kies media: interactief 3D-model, video, PDF-preview of image/placeholder
    if (p.model && window.PortfolioViewer) {
      modalMedia.hidden = true;
      modalViewer.hidden = false;
      // Paden met spaties/hoofdletters correct encoden
      window.PortfolioViewer.open(modalViewer, encodeURI(p.model));
    } else {
      modalViewer.hidden = true;
      if (window.PortfolioViewer) window.PortfolioViewer.close();
      modalMedia.hidden = false;
      modalMedia.classList.toggle('is-pdf', !!p.pdf);
      modalMedia.classList.toggle('is-youtube', !!p.youtube);
      modalMedia.classList.toggle('is-site', !!p.embed);
      if (p.pdf) {
        modalMedia.innerHTML = `<iframe src="${encodeURI(p.pdf)}" title="${p.title}" loading="lazy"></iframe>`;
      } else if (p.youtube) {
        modalMedia.innerHTML = `<iframe src="https://www.youtube.com/embed/${p.youtube}?autoplay=1" title="${p.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
      } else if (p.embed) {
        modalMedia.innerHTML = `<iframe src="${encodeURI(p.embed)}" title="${p.title}" loading="lazy"></iframe>`;
      } else if (p.video) {
        modalMedia.innerHTML = `<video src="${encodeURI(p.video)}" controls autoplay muted loop playsinline ${p.image ? `poster="${encodeURI(p.image)}"` : ''}></video>`;
      } else if (p.image) {
        modalMedia.innerHTML = `<img src="${encodeURI(p.image)}" alt="Screenshot van ${p.title}" />`;
      } else {
        modalMedia.innerHTML = `<i class="fa-solid ${p.icon} ph-icon" aria-hidden="true"></i>`;
      }
    }

    modalCat.textContent = p.categoryLabel;
    modalTitle.textContent = p.title;
    modalSummary.textContent = p.summary;
    modalContext.textContent = p.context;
    modalRole.textContent = p.role;
    modalChallenges.textContent = p.challenges;
    modalTech.innerHTML = p.techniques.map((t) => `<span class="tech-tag">${t}</span>`).join('');
    modalActions.innerHTML = `
      ${p.demo ? `<a href="${encodeURI(p.demo)}" target="_blank" rel="noopener" class="btn btn-primary btn-sm"><i class="fa-solid fa-up-right-from-square"></i> ${p.video || p.model || p.youtube ? 'Live Demo' : 'Bekijk project'}</a>` : ''}
      ${p.github ? `<a href="${encodeURI(p.github)}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
    `;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal-close', modal).focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
    // 3D-renderer afsluiten om geheugen vrij te geven
    if (window.PortfolioViewer) window.PortfolioViewer.close();
  };

  // Kaart of "Case Study"-knop opent de modal
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-modal');
    const card = e.target.closest('.project-card');
    if (btn || card) {
      // Niet openen als er op een externe link geklikt wordt
      if (e.target.closest('a')) return;
      openModal(Number((btn || card).dataset.index));
    }
  });

  // Sluiten via X, backdrop of Escape
  $$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

});
