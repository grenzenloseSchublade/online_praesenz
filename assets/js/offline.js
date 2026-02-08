/**
 * Offline Page Script
 * Automatischer Reload wenn der Benutzer wieder online ist
 */
(function() {
  'use strict';

  // Prüfen, ob der Benutzer wieder online ist
  window.addEventListener('online', function() {
    window.location.reload();
  });

  // Reload-Button Event Listener
  var reloadBtn = document.querySelector('.offline-page__reload-btn');
  if (reloadBtn) {
    reloadBtn.addEventListener('click', function() {
      window.location.reload();
    });
  }
})();
