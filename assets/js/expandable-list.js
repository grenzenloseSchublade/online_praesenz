/**
 * Expandable List - JavaScript für ausklappbare Listen im CV
 */

document.addEventListener('DOMContentLoaded', function() {
  // Konfiguration für die Ausklapp-Funktionalität
  const config = {
    enableExpandableHint: true, // Hinweis anzeigen
    expandableByDefault: true   // Standardmäßig aktiviert
  };
  
  // Prüfen, ob die Ausklapp-Funktionalität für bestimmte Karten deaktiviert werden soll
  const disabledCards = document.querySelectorAll('.cv-entry-about-style[data-expandable="false"]');
  disabledCards.forEach(function(card) {
    // Alle ausklappbaren Elemente in dieser Karte finden
    const expandableItems = card.querySelectorAll('.has-subitems[data-expandable="true"]');
    expandableItems.forEach(function(item) {
      // Klasse hinzufügen, um die Ausklapp-Funktionalität zu deaktivieren
      item.classList.add('no-expand');
      item.removeAttribute('data-expandable');
    });
  });
  
  // Alle ausklappbaren Elemente finden (nur in aktivierten Karten)
  const expandableItems = document.querySelectorAll('.has-subitems[data-expandable="true"]:not(.no-expand)');
  
  // Hinweis für Benutzer hinzufügen (nur einmal anzeigen)
  if (config.enableExpandableHint && expandableItems.length > 0 && !localStorage.getItem('expandableHintShown')) {
    const firstItem = expandableItems[0];
    const hint = document.createElement('div');
    hint.className = 'expandable-hint';
    hint.innerHTML = '<i class="fas fa-info-circle"></i> Klicken Sie auf Einträge mit <i class="fas fa-chevron-down"></i> um Details anzuzeigen';
    hint.style.cssText = 'background-color: rgba(0, 0, 0, 0.5); padding: 0.7rem; border-radius: 4px; margin: 1rem 0; font-size: 0.85rem; color: rgba(255, 255, 255, 1); text-align: center; animation: pulse 2s infinite; border-left: 3px solid #4db6ac; box-shadow: 0 2px 4px rgba(0,0,0,0.2);';
    
    // Hinweis vor der Liste einfügen
    const parentList = firstItem.closest('ul');
    parentList.parentNode.insertBefore(hint, parentList);
    
    // Animation für den Hinweis
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 0.8; }
        50% { opacity: 1; }
        100% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
    
    // Hinweis nach 15 Sekunden ausblenden
    setTimeout(function() {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 1s ease';
      
      // Nach dem Ausblenden aus dem DOM entfernen
      setTimeout(function() {
        hint.remove();
      }, 1000);
      
      localStorage.setItem('expandableHintShown', 'true');
    }, 15000);
    
    // Klick auf den Hinweis entfernt ihn
    hint.addEventListener('click', function() {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.5s ease';
      
      setTimeout(function() {
        hint.remove();
        localStorage.setItem('expandableHintShown', 'true');
      }, 500);
    });
  }
  
  // Event-Listener für jedes ausklappbare Element
  expandableItems.forEach(function(item) {
    // Klick-Event hinzufügen
    item.addEventListener('click', function(e) {
      // Nur auf das Listenelement selbst reagieren, nicht auf Unterpunkte
      if (e.target !== item && !item.contains(e.target)) return;
      
      // Subitems finden
      const subitems = item.querySelector('ul.subitems');
      if (!subitems) return;
      
      // Toggle-Klasse für das Listenelement
      item.classList.toggle('expanded');
      
      // Toggle-Klasse für die Unterpunkte
      subitems.classList.toggle('expanded');
      
      // Verhindern, dass das Event an übergeordnete Elemente weitergegeben wird
      e.stopPropagation();
    });
  });
}); 