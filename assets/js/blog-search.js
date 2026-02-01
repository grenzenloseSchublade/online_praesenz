document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('blog-search-input');
  if (!input) return;

  const clearBtn = document.getElementById('blog-search-clear');
  const entries = document.querySelectorAll('#blog-entries .post-item');
  const emptyMessage = document.getElementById('blog-empty-message');

  function normalize(value) {
    return (value || '').toLowerCase().trim();
  }

  function applyFilter() {
    const query = normalize(input.value);
    let visibleCount = 0;
    entries.forEach(function(item) {
      const haystack = item.getAttribute('data-search') || '';
      const visible = query === '' || haystack.includes(query);
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
