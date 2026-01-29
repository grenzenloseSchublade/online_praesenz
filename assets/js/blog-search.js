document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('blog-search-input');
  if (!input) return;

  var clearBtn = document.getElementById('blog-search-clear');
  var entries = document.querySelectorAll('#blog-entries .post-item');
  var emptyMessage = document.getElementById('blog-empty-message');

  function normalize(value) {
    return (value || '').toLowerCase().trim();
  }

  function applyFilter() {
    var query = normalize(input.value);
    var visibleCount = 0;
    entries.forEach(function(item) {
      var haystack = item.getAttribute('data-search') || '';
      var visible = query === '' || haystack.indexOf(query) !== -1;
      item.style.display = visible ? '' : 'none';
      if (visible) visibleCount += 1;
    });
    if (emptyMessage) {
      emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  input.addEventListener('input', applyFilter);
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      input.value = '';
      applyFilter();
      input.focus();
    });
  }
});
