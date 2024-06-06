(function() {
  "use strict"; // Použití přísného režimu JavaScriptu, který pomáhá detekovat chyby

  // Funkce pro přidání nebo odebrání třídy "scrolled" na základě vertikální pozice okna
  function toggleScrolled() {
    const selectBody = document.querySelector('body'); // Vybere element body
    const selectHeader = document.querySelector('#header'); // Vybere element s ID header
    // Pokud hlavička nemá žádnou z uvedených tříd, funkce skončí
    if (!selectHeader.classList.contains('scroll-up-sticky') && 
        !selectHeader.classList.contains('sticky-top') && 
        !selectHeader.classList.contains('fixed-top')) return;
    // Přidá nebo odebere třídu "scrolled" na body na základě vertikální pozice okna
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled); // Přidá posluchač události scroll, který volá funkci toggleScrolled

  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle'); // Vybere tlačítko pro přepínání mobilní navigace

  // Funkce pro přepínání mobilní navigace
  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active'); // Přepíná třídu "mobile-nav-active" na body
    mobileNavToggleBtn.classList.toggle('bi-list'); // Přepíná třídu "bi-list" na tlačítku
    mobileNavToggleBtn.classList.toggle('bi-x'); // Přepíná třídu "bi-x" na tlačítku
  }
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle); // Přidá posluchač události click na tlačítko, který volá funkci mobileNavToogle

  // Přidá posluchače události click na každý odkaz v navigačním menu
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) { // Pokud je aktivní mobilní navigace
        mobileNavToogle(); // Přepne mobilní navigaci
      }
    });
  });

  // Přidá posluchače události click na každý prvek s třídou "toggle-dropdown" v navigačním menu
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      if (document.querySelector('.mobile-nav-active')) { // Pokud je aktivní mobilní navigace
        e.preventDefault(); // Zabrání výchozí akci události
        this.parentNode.classList.toggle('active'); // Přepne třídu "active" na rodičovském prvku
        this.parentNode.nextElementSibling.classList.toggle('dropdown-active'); // Přepne třídu "dropdown-active" na dalším sourozeneckém prvku
        e.stopImmediatePropagation(); // Zastaví další propagaci aktuální události
      }
    });
  });

  const preloader = document.querySelector('#preloader'); // Vybere prvek s ID preloader
  if (preloader) {
    window.addEventListener('load', () => { // Přidá posluchač události load na okno
      preloader.remove(); // Odstraní preloader po načtení okna
    });
  }

  let scrollTop = document.querySelector('.scroll-top'); // Vybere prvek s třídou scroll-top

  // Funkce pro přidání nebo odebrání třídy "active" na základě vertikální pozice okna
  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => { // Přidá posluchač události click na prvek scrollTop
    e.preventDefault(); // Zabrání výchozí akci události
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Plynulý přechod na začátek stránky
    });
  });

  window.addEventListener('load', toggleScrollTop); // Přidá posluchač události load na okno, který volá funkci toggleScrollTop
  document.addEventListener('scroll', toggleScrollTop); // Přidá posluchač události scroll na dokument, který volá funkci toggleScrollTop

  // Funkce pro inicializaci knihovny AOS (Animate On Scroll)
  function aosInit() {
    AOS.init({
      duration: 600, // Doba trvání animace
      easing: 'ease-in-out', // Typ zrychlení animace
      once: true, // Animace se spustí pouze jednou
      mirror: false // Animace se nespustí při skrolování zpět
    });
  }
  window.addEventListener('load', aosInit); // Přidá posluchač události load na okno, který volá funkci aosInit

  // Inicializace knihovny GLightbox pro lehkou modální galerii
  const glightbox = GLightbox({
    selector: '.glightbox' // Výběr elementů pro lehkou modální galerii
  });

  // Inicializace knihovny PureCounter pro čítače
  new PureCounter();

  // Funkce pro inicializaci Swiper karuselů
  function initSwiper() {
    document.querySelectorAll('.swiper').forEach(function(swiper) {
      let config = JSON.parse(swiper.querySelector('.swiper-config').innerHTML.trim()); // Načtení konfigurace z HTML elementu
      new Swiper(swiper, config); // Inicializace nového Swiperu s načtenou konfigurací
    });
  }
  window.addEventListener('load', initSwiper); // Přidá posluchač události load na okno, který volá funkci initSwiper

  // Přejde na určitou část stránky, pokud je v URL hash (např. #section)
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  let navmenulinks = document.querySelectorAll('.navmenu a'); // Vybere všechny odkazy v navigačním menu

  // Funkce pro zvýraznění aktivního odkazu v navigačním menu na základě pozice na stránce
  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      // Zvýrazní aktivní odkaz, pokud je v zorném poli
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  }
  window.addEventListener('load', navmenuScrollspy); // Přidá posluchač události load na okno, který volá funkci navmenuScrollspy
  document.addEventListener('scroll', navmenuScrollspy); // Přidá posluchač události scroll na dokument, který volá funkci navmenuScrollspy

})();
