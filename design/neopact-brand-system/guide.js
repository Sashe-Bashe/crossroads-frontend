(() => {
  'use strict';
  const toast = document.getElementById('copy-status');
  let toastTimer;
  function announce(message) {
    toast.textContent = message;
    toast.classList.add('g-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('g-visible'), 2500);
  }
  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.cssText = 'position:fixed;left:-9999px;top:0';
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand('copy');
        textarea.remove();
        if (!copied) throw new Error('Copy unavailable');
      }
      announce(`${text} copied`);
    } catch {
      announce(`Copy this color: ${text}`);
    }
  }
  document.querySelectorAll('[data-copy]').forEach(button => {
    button.addEventListener('click', () => copyText(button.dataset.copy));
  });
  const dialog = document.getElementById('offer-dialog');
  let previousFocus;
  document.querySelectorAll('[data-open-demo]').forEach(button => {
    button.addEventListener('click', () => {
      previousFocus = button;
      dialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-demo]').forEach(button => {
    button.addEventListener('click', () => dialog.close());
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => previousFocus?.focus());
})();
