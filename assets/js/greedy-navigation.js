/*
 * Vanilla GreedyNav based on lukejacksonn/GreedyNav
 * Keeps visible links in the navbar and moves overflow to hidden menu.
 * 
 * WICHTIG: Diese Version überschreibt die jQuery-Version aus main.min.js
 */
(function() {
  'use strict';

  // Entferne alte jQuery Event-Listener von hidden-links (falls vorhanden)
  function removeOldListeners() {
    const hlinks = document.querySelector('.greedy-nav .hidden-links');
    const btn = document.querySelector('.greedy-nav .greedy-nav__toggle');
    if (hlinks && window.jQuery) {
      // jQuery off() entfernt die Event-Listener der jQuery-Version
      jQuery(hlinks).off('mouseleave mouseenter click');
      jQuery(btn).off('click');
    }
  }

  function outerWidth(el) {
    if (!el) return 0;
    const style = window.getComputedStyle(el);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
    return el.getBoundingClientRect().width + margin;
  }

  function setupGreedyNav(nav) {
    const btn = nav.querySelector('.greedy-nav__toggle');
    const vlinks = nav.querySelector('.visible-links');
    const hlinks = nav.querySelector('.hidden-links');
    const logo = nav.querySelector('.site-logo');
    const title = nav.querySelector('.site-title');
    const search = nav.querySelector('button.search__toggle');
    const logoImg = nav.querySelector('.site-logo img');

    if (!btn || !vlinks || !hlinks || !title) return;

    // Entferne alte jQuery Event-Listener (aus main.min.js)
    removeOldListeners();

    let numOfItems = 0;
    let breakWidths = [];
    let lastBreakpoint = null;
    let closingTime = 3000; // 3 Sekunden
    let timer;

    function addWidth(w) {
      if (typeof w !== 'number' || Number.isNaN(w)) return;
      const total = (breakWidths.length ? breakWidths[breakWidths.length - 1] : 0) + w;
      breakWidths.push(total);
      numOfItems += 1;
    }

    function measureLinks() {
      numOfItems = 0;
      breakWidths = [];
      // closingTime wird NICHT mehr hier überschrieben (Bug behoben)

      const vChildren = Array.from(vlinks.children);
      vChildren.forEach((child) => addWidth(outerWidth(child)));

      const hChildren = Array.from(hlinks.children);
      hChildren.forEach((child) => {
        const clone = child.cloneNode(true);
        clone.style.visibility = 'hidden';
        vlinks.appendChild(clone);
        addWidth(outerWidth(clone));
        vlinks.removeChild(clone);
      });
    }

    function currentBreakpoint() {
      const winWidth = window.innerWidth || document.documentElement.clientWidth;
      if (winWidth < 768) return 0;
      if (winWidth < 1024) return 1;
      if (winWidth < 1280) return 2;
      return 3;
    }

    function check() {
      const curBreakpoint = currentBreakpoint();
      if (curBreakpoint !== lastBreakpoint) {
        measureLinks();
        lastBreakpoint = curBreakpoint;
      }

      let numOfVisibleItems = vlinks.children.length;
      const availableSpace = nav.getBoundingClientRect().width
        - (logo ? outerWidth(logo) : 0)
        - outerWidth(title)
        - (search ? outerWidth(search) : 0)
        - (numOfVisibleItems !== breakWidths.length ? outerWidth(btn) : 0);

      const requiredSpace = breakWidths[numOfVisibleItems - 1] || 0;

      if (requiredSpace > availableSpace && numOfVisibleItems > 0) {
        hlinks.insertBefore(vlinks.lastElementChild, hlinks.firstChild);
        check();
      } else if (
        (availableSpace + (numOfVisibleItems === breakWidths.length - 1 ? outerWidth(btn) : 0))
        > (breakWidths[numOfVisibleItems] || 0)
      ) {
        if (hlinks.children.length > 0) {
          vlinks.appendChild(hlinks.firstElementChild);
          check();
        }
      }

      const hiddenCount = numOfItems - vlinks.children.length;
      btn.setAttribute('count', hiddenCount);
      if (hiddenCount <= 0) {
        btn.classList.add('hidden');
      } else {
        btn.classList.remove('hidden');
      }
    }

    btn.addEventListener('click', function() {
      hlinks.classList.toggle('hidden');
      btn.classList.toggle('close');
      clearTimeout(timer);
    });

    hlinks.addEventListener('click', function() {
      hlinks.classList.add('hidden');
      btn.classList.remove('close');
    });

    hlinks.addEventListener('mouseleave', function() {
      timer = setTimeout(function() {
        hlinks.classList.add('hidden');
        btn.classList.remove('close');
      }, closingTime);
    });

    hlinks.addEventListener('mouseenter', function() {
      clearTimeout(timer);
    });

    // Click außerhalb des Menüs schließt es (wichtig für Mobile und Desktop)
    document.addEventListener('click', function(e) {
      // Prüfe ob Klick außerhalb von Menü UND Toggle-Button war
      const isClickInsideMenu = hlinks.contains(e.target);
      const isClickOnToggle = btn.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle && !hlinks.classList.contains('hidden')) {
        hlinks.classList.add('hidden');
        btn.classList.remove('close');
        clearTimeout(timer);
      }
    });

    // Touch-Event für bessere Mobile-Unterstützung
    document.addEventListener('touchstart', function(e) {
      const isClickInsideMenu = hlinks.contains(e.target);
      const isClickOnToggle = btn.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnToggle && !hlinks.classList.contains('hidden')) {
        hlinks.classList.add('hidden');
        btn.classList.remove('close');
        clearTimeout(timer);
      }
    }, { passive: true });

    // Debounced resize handler für bessere Performance
    let resizeTimeout;
    function debouncedCheck() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(check, 100);
    }
    window.addEventListener('resize', debouncedCheck);

    if (logoImg && !(logoImg.complete && logoImg.naturalWidth !== 0)) {
      logoImg.addEventListener('load', check, { once: true });
      logoImg.addEventListener('error', check, { once: true });
    } else {
      check();
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('nav.greedy-nav');
    if (nav) setupGreedyNav(nav);
  });
})();
