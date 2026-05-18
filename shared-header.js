/**
 * Shared FMNR Header + Mega Menu
 * Include this script on any page to inject a consistent header with mega menu.
 * Usage: <script src="shared-header.js"></script>
 *
 * The script will:
 * 1. Inject required CSS styles into <head>
 * 2. Insert the header HTML as the first child of <body> (after any demo toolbar)
 * 3. Initialise mega menu interactions
 */
(function () {
  'use strict';

  /* ── CSS ─────────────────────────────────────────────────────────── */
  var css = `
    /* ── Shared Header ── */
    .site-header { background: #fff; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; box-shadow: 0 1px 0 rgba(0,0,0,0.06); }
    .header-inner { max-width: 1280px; margin: 0 auto; padding: 14px 48px; display: flex; align-items: center; justify-content: space-between; }
    .logo img { height: 33px; display: block; }
    .nav-links { display: flex; gap: 4px; }
    .nav-links a { font-family: var(--font-body); font-weight: 700; font-size: 14px; color: var(--color-charcoal); text-decoration: none; padding: 8px 12px; border-radius: 6px; transition: background 0.15s, color 0.15s; }
    .nav-links a:hover { background: #f5f5f7; }
    .nav-links a.active { color: var(--color-green); background: rgba(7,125,87,0.06); }
    .header-actions { display: flex; align-items: center; gap: 16px; }
    .btn-cta { background: var(--color-green); color: #fff; font-family: var(--font-body); font-weight: 700; font-size: 13px; letter-spacing: 0.04em; text-transform: uppercase; padding: 10px 20px; border-radius: 980px; text-decoration: none; transition: background 0.2s; }
    .btn-cta:hover { background: #065e42; }

    /* ── Mega menu panel ── */
    .mega-menu { position: absolute; top: 100%; left: 0; right: 0; background: #fff; border-top: 1px solid #ebebeb; box-shadow: 0 32px 80px rgba(0,0,0,0.1); z-index: 999; opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 0.22s cubic-bezier(0.4,0,0.2,1), visibility 0s linear 0.22s; }
    .mega-menu.open { opacity: 1; visibility: visible; pointer-events: auto; transition: opacity 0.22s cubic-bezier(0.4,0,0.2,1), visibility 0s linear 0s; }
    .mega-inner { max-width: 1280px; margin: 0 auto; padding: 28px 48px 36px; }

    /* Backdrop */
    .mega-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0); pointer-events: none; z-index: 998; transition: background 0.3s, backdrop-filter 0.3s; }
    .mega-backdrop.open { background: rgba(0,0,0,0.18); backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); pointer-events: auto; }

    /* ── Layout B — Editorial Feature ── */
    .lb { display: flex; align-items: stretch; }
    .lb-col1 { width: 280px; flex-shrink: 0; padding: 0; }
    .lb-feature { width: 100%; height: 100%; min-height: 300px; border-radius: 12px; overflow: hidden; position: relative; display: flex; flex-direction: column; justify-content: flex-end; text-decoration: none; background: linear-gradient(160deg, #1a4a2e 0%, #063020 100%); }
    .lb-feature img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .lb-feature-content { position: relative; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 70%); }
    .lb-feature-kicker { display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.25); padding: 3px 10px; border-radius: 4px; margin-bottom: 10px; }
    .lb-feature-title { font-family: var(--font-heading); font-size: 20px; text-transform: uppercase; color: #fff; line-height: 1; margin-bottom: 8px; }
    .lb-feature-desc { font-size: 13px; color: rgba(255,255,255,0.7); line-height: 1.4; }
    .lb-feature-cta { display: inline-block; margin-top: 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #fff; background: var(--color-green); padding: 8px 16px; border-radius: 6px; text-decoration: none; }

    .lb-col2 { flex: 1; padding: 0 0 0 32px; border-left: 1px solid rgba(0,0,0,0.08); margin-left: 32px; }
    .lb-section-label { font-family: var(--font-heading); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #86868b; margin-bottom: 16px; }
    .lb-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .lb-card { display: flex; flex-direction: column; gap: 8px; padding: 16px; border: 1px solid #e8e8e8; border-radius: 10px; text-decoration: none; background: #fff; transition: border-color 0.15s, box-shadow 0.15s; }
    .lb-card:hover { border-color: var(--color-green); box-shadow: 0 4px 12px rgba(7,125,87,0.1); }
    .lb-card-num { font-family: var(--font-heading); font-size: 28px; text-transform: uppercase; color: rgba(7,125,87,0.15); line-height: 1; }
    .lb-card-label { font-size: 14px; font-weight: 700; color: #1d1d1f; line-height: 1.2; }
    .lb-card-desc { font-size: 13px; color: #86868b; line-height: 1.4; }
    .lb-card-arrow { font-size: 13px; color: var(--color-green); margin-top: auto; font-weight: 700; }

    /* Body offset for fixed header */
    body { padding-top: 61px !important; }

    @media (max-width: 900px) {
      .header-inner { padding: 12px 24px; }
      .lb { flex-direction: column; }
      .lb-col1 { width: 100%; }
      .lb-feature { min-height: 200px; }
      .lb-col2 { border-left: none; margin-left: 0; padding: 24px 0 0; border-top: 1px solid rgba(0,0,0,0.08); margin-top: 24px; }
    }
  `;

  var styleEl = document.createElement('style');
  styleEl.id = 'shared-header-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── HTML ─────────────────────────────────────────────────────────── */
  var headerHTML = `
    <header class="site-header" id="site-header">
      <div class="header-inner">
        <a href="index.html" class="logo"><img src="fmnr-logo-figma.png" alt="FMNR"></a>
        <nav class="nav-links" id="nav-links">
          <a href="partner.html" data-mega="partner">Partner</a>
          <a href="#" data-mega="adopt">Adopt</a>
          <a href="impact.html" data-mega="impact">Impact</a>
          <a href="resources.html" data-mega="resources">Resource Hub</a>
          <a href="blog.html" data-mega="stories">Stories</a>
          <a href="#" data-mega="about">About</a>
        </nav>
        <div class="header-actions">
          <a href="contact.html" class="btn-cta">Get in touch</a>
        </div>
      </div>
      <div class="mega-backdrop" id="mega-backdrop"></div>
      <div class="mega-menu" id="mega-menu">
        <div class="mega-inner">
          <div class="lb" id="lb-content"></div>
        </div>
      </div>
    </header>
  `;

  /* Remove any existing inline header so there's no duplication */
  var existingHeader = document.querySelector('header.site-header, #site-header');
  if (existingHeader) existingHeader.remove();

  /* Insert after demo toolbar if present, otherwise as first child of body */
  var toolbar = document.getElementById('demo-toolbar');
  if (toolbar) {
    toolbar.insertAdjacentHTML('afterend', headerHTML);
  } else {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }

  /* ── Load Lucide icons if not already present ── */
  if (!window.lucide && !document.querySelector('script[src*="lucide"]')) {
    var s = document.createElement('script');
    s.src = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
    document.head.appendChild(s);
  }

  /* ── Mega Menu Data ─────────────────────────────────────────────── */
  var data = {
    partner: {
      title: 'Partner',
      desc: 'Join the global movement to restore land and transform communities through FMNR.',
      href: 'partner.html',
      feature: { eyebrow: 'Featured', title: 'Scaling FMNR across Sub-Saharan Africa', desc: 'See how faith networks and NGOs are driving landscape restoration.', img: 'images/brand/WVA5019_WVA-FMNR-Playbook_Master_R4a_Page_01_Image_0001.jpg' },
      items: [
        { icon: 'heart-handshake', label: 'Faith-Based Partners', desc: 'Churches, pastors and faith network leaders' },
        { icon: 'network',         label: 'NGOs',                 desc: 'Development organisations and programme teams' },
        { icon: 'landmark',        label: 'Governments',          desc: 'Policy makers and national programme leaders' },
        { icon: 'trending-up',     label: 'Funders',              desc: 'Philanthropists, impact investors and grant-makers' }
      ]
    },
    adopt: {
      title: 'Adopt',
      desc: 'Practical tools, guides and community connections to bring FMNR to your landscape.',
      href: '#',
      feature: { eyebrow: 'Guide', title: 'Field guide to FMNR adoption', desc: 'Step-by-step practitioner guide.', img: 'images/brand/WVA5019_WVA-FMNR-Playbook_Master_R4a_Page_07_Image_0001.jpg' },
      items: [
        { icon: 'sprout',    label: 'How FMNR Works', desc: 'The technique and its core principles explained' },
        { icon: 'book-open', label: 'Adopt FMNR',     desc: 'Start implementing FMNR in your context' },
        { icon: 'library',   label: 'Resources',      desc: 'Tools and materials for adoption' }
      ]
    },
    impact: {
      title: 'Impact',
      desc: 'Stories, data and reporting on the global reach and outcomes of FMNR.',
      href: 'impact.html',
      feature: { eyebrow: 'Data', title: '1 Billion Hectare Vision', desc: 'Track progress toward our global target.', img: 'images/brand/WVA5019_WVA-FMNR-Playbook_Master_R4a_Page_20_Image_0001.jpg' },
      items: [
        { icon: 'bar-chart-2', label: 'The Impact of FMNR',  desc: 'Comprehensive impact overview' },
        { icon: 'microscope',  label: 'Evidence of Impact',  desc: 'Research and data on FMNR outcomes' },
        { icon: 'book-heart',  label: 'Impact Stories',      desc: 'Stories from FMNR communities' }
      ]
    },
    resources: {
      title: 'Resource Hub',
      desc: 'Research, training materials and country-specific resources for FMNR practitioners.',
      href: 'resources.html',
      feature: { eyebrow: 'New', title: 'FMNR e-Courses now available', desc: 'Online learning modules for practitioners.', img: 'images/brand/WVA5019_WVA-FMNR-Playbook_Master_R4a_Page_06_Image_0001.jpg' },
      items: [
        { icon: 'library',        label: 'All Resources',              desc: 'Browse the complete resource library' },
        { icon: 'microscope',     label: 'Research',                    desc: 'Academic research and evidence base' },
        { icon: 'globe',          label: 'Country-Specific Resources', desc: 'Resources by country and region' },
        { icon: 'book-open',      label: 'FMNR Manual',                desc: 'The comprehensive FMNR manual' },
        { icon: 'film',           label: 'FMNR Media',                 desc: 'Videos, podcasts and multimedia' },
        { icon: 'graduation-cap', label: 'FMNR e-Courses',             desc: 'Online learning modules' },
        { icon: 'video',          label: 'FMNR Webinar',               desc: 'Watch recorded webinars' }
      ]
    },
    stories: {
      title: 'Stories',
      desc: 'Real stories from FMNR communities around the world.',
      href: 'blog.html',
      feature: { eyebrow: 'Latest', title: 'From desert to forest: Niger\u2019s transformation', desc: 'How millions of farmers changed the Sahel.', img: 'images/brand/WVA5019_WVA-FMNR-Playbook_Master_R4a_Page_06_Image_0001.jpg' },
      items: [
        { icon: 'book-open', label: 'All Stories',    desc: 'Browse all FMNR stories' },
        { icon: 'tag',       label: 'Story Category', desc: 'Coming soon' },
        { icon: 'tag',       label: 'Story Category', desc: 'Coming soon' }
      ]
    },
    about: {
      title: 'About',
      desc: 'The people, mission and values behind the FMNR Hub and World Vision.',
      href: '#',
      feature: { eyebrow: 'Meet', title: "Tony Rinaudo \u2014 The Forest Maker", desc: 'The story of the man behind the movement.', img: 'images/brand/WVA5019_WVA-FMNR-Playbook_Master_R4a_Page_19_Image_0001.jpg' },
      items: [
        { icon: 'star',           label: 'About FMNR',                         desc: 'The technique and movement explained' },
        { icon: 'user',           label: 'Tony Rinaudo \u2014 The Forest Maker', desc: 'The man who transformed the Sahel' },
        { icon: 'message-circle', label: 'Contact FMNR',                       desc: 'Get in touch with the team' },
        { icon: 'building-2',     label: 'FMNR and World Vision',              desc: 'Our partnership and mission' },
        { icon: 'rocket',         label: 'FMNR Scaling Projects',              desc: 'How FMNR is scaling worldwide' },
        { icon: 'activity',       label: 'FMNR Tracking Tool',                 desc: 'Monitor FMNR progress' },
        { icon: 'bell',           label: 'Latest Updates',                     desc: 'News and announcements' },
        { icon: 'help-circle',    label: 'FMNR FAQs',                          desc: 'Frequently asked questions' }
      ]
    }
  };

  /* ── Mega Menu Behaviour ─────────────────────────────────────────── */
  var menu = document.getElementById('mega-menu');
  var backdrop = document.getElementById('mega-backdrop');
  var contentEl = document.getElementById('lb-content');
  var activeKey = null;
  var closeTimer = null;

  function render(key) {
    var d = data[key];
    var cards = d.items.map(function (item, i) {
      return '<a class="lb-card" href="#">'
        + '<span class="lb-card-num">0' + (i + 1) + '</span>'
        + '<span class="lb-card-label">' + item.label + '</span>'
        + '<span class="lb-card-desc">' + item.desc + '</span>'
        + '<span class="lb-card-arrow">\u2192</span>'
        + '</a>';
    }).join('');

    contentEl.innerHTML =
      '<div class="lb-col1">'
      + '<a class="lb-feature" href="' + d.href + '">'
      +   '<img src="' + d.feature.img + '" alt="">'
      +   '<div class="lb-feature-content">'
      +     '<span class="lb-feature-kicker">' + d.feature.eyebrow + '</span>'
      +     '<div class="lb-feature-title">' + d.feature.title + '</div>'
      +     '<div class="lb-feature-desc">' + d.feature.desc + '</div>'
      +     '<span class="lb-feature-cta">Explore \u2192</span>'
      +   '</div>'
      + '</a>'
      + '</div>'
      + '<div class="lb-col2">'
      +   '<div class="lb-section-label">' + d.title + ' \u2014 All sections</div>'
      +   '<div class="lb-grid">' + cards + '</div>'
      + '</div>';

    if (window.lucide) lucide.createIcons();
  }

  function openMenu(key) {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    activeKey = key;
    render(key);
    menu.classList.add('open');
    backdrop.classList.add('open');
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-mega') === key);
    });
  }

  function closeMenu() {
    activeKey = null;
    menu.classList.remove('open');
    backdrop.classList.remove('open');
    document.querySelectorAll('.nav-links a').forEach(function (a) { a.classList.remove('active'); });
  }

  document.querySelectorAll('.nav-links a[data-mega]').forEach(function (a) {
    a.addEventListener('mouseenter', function () { openMenu(a.getAttribute('data-mega')); });
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (activeKey === a.getAttribute('data-mega') && menu.classList.contains('open')) closeMenu();
      else openMenu(a.getAttribute('data-mega'));
    });
  });

  menu.addEventListener('mouseenter', function () { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } });
  menu.addEventListener('mouseleave', function () { closeTimer = setTimeout(closeMenu, 300); });
  backdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* Respect demo toolbar offset */
  if (document.getElementById('demo-toolbar')) {
    var header = document.getElementById('site-header');
    if (header) header.style.top = '44px';
    document.body.style.paddingTop = (61 + 44) + 'px';
  }
})();
