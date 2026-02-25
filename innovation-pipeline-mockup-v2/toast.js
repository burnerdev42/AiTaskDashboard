/* ═══ ANANTA TOAST NOTIFICATION SYSTEM ═══
   Usage:
     showToast({ type, title, message, duration })
   Types: 'pending' | 'success' | 'error' | 'info'
*/
(function () {
  // Inject styles once
  if (!document.getElementById('ananta-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'ananta-toast-styles';
    style.textContent = `
      .ananta-toast-container {
        position: fixed;
        top: 80px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }
      .ananta-toast {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 14px;
        min-width: 360px;
        max-width: 440px;
        padding: 18px 22px;
        border-radius: 14px;
        border: 1px solid;
        backdrop-filter: blur(12px);
        font-family: 'Inter', system-ui, sans-serif;
        box-shadow: 0 12px 40px rgba(0,0,0,.45);
        transform: translateX(120%);
        opacity: 0;
        transition: transform .4s cubic-bezier(.22,1,.36,1), opacity .4s ease;
      }
      .ananta-toast.show {
        transform: translateX(0);
        opacity: 1;
      }
      .ananta-toast.hide {
        transform: translateX(120%);
        opacity: 0;
      }
      .ananta-toast-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .ananta-toast-icon svg {
        width: 20px;
        height: 20px;
      }
      .ananta-toast-body {
        flex: 1;
        min-width: 0;
      }
      .ananta-toast-title {
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 4px;
        line-height: 1.3;
      }
      .ananta-toast-message {
        font-size: 12px;
        line-height: 1.5;
        opacity: .85;
      }
      .ananta-toast-close {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 6px;
        opacity: .5;
        transition: opacity .2s, background .2s;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .ananta-toast-close:hover {
        opacity: 1;
        background: rgba(255,255,255,.1);
      }
      .ananta-toast-close svg {
        width: 16px;
        height: 16px;
      }
      .ananta-toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        border-radius: 0 0 14px 14px;
        transition: width linear;
      }

      /* ── Pending (yellow) ── */
      .ananta-toast.pending {
        background: linear-gradient(135deg, rgba(249,168,37,.12), rgba(255,238,88,.08));
        border-color: rgba(255,238,88,.35);
        color: #fff;
      }
      .ananta-toast.pending .ananta-toast-icon {
        background: rgba(255,238,88,.18);
        color: #ffee58;
      }
      .ananta-toast.pending .ananta-toast-title { color: #ffee58; }
      .ananta-toast.pending .ananta-toast-progress { background: #ffee58; }

      /* ── Success (green) ── */
      .ananta-toast.success {
        background: linear-gradient(135deg, rgba(67,160,71,.12), rgba(102,187,106,.08));
        border-color: rgba(102,187,106,.35);
        color: #fff;
      }
      .ananta-toast.success .ananta-toast-icon {
        background: rgba(102,187,106,.18);
        color: #66bb6a;
      }
      .ananta-toast.success .ananta-toast-title { color: #66bb6a; }
      .ananta-toast.success .ananta-toast-progress { background: #66bb6a; }

      /* ── Error (red) ── */
      .ananta-toast.error {
        background: linear-gradient(135deg, rgba(198,40,40,.12), rgba(239,83,80,.08));
        border-color: rgba(239,83,80,.35);
        color: #fff;
      }
      .ananta-toast.error .ananta-toast-icon {
        background: rgba(239,83,80,.18);
        color: #ef5350;
      }
      .ananta-toast.error .ananta-toast-title { color: #ef5350; }
      .ananta-toast.error .ananta-toast-progress { background: #ef5350; }

      /* ── Info (amber) ── */
      .ananta-toast.info {
        background: linear-gradient(135deg, rgba(232,167,88,.12), rgba(240,184,112,.08));
        border-color: rgba(232,167,88,.35);
        color: #fff;
      }
      .ananta-toast.info .ananta-toast-icon {
        background: rgba(232,167,88,.18);
        color: #e8a758;
      }
      .ananta-toast.info .ananta-toast-title { color: #e8a758; }
      .ananta-toast.info .ananta-toast-progress { background: #e8a758; }
    `;
    document.head.appendChild(style);
  }

  // Create container once
  let container = document.querySelector('.ananta-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'ananta-toast-container';
    document.body.appendChild(container);
  }

  const ICONS = {
    pending: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    success: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    error:   '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    info:    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
  };
  const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  /**
   * @param {Object} opts
   * @param {'pending'|'success'|'error'|'info'} opts.type
   * @param {string} opts.title
   * @param {string} opts.message
   * @param {number} [opts.duration=5000] - ms, 0 = persistent
   */
  window.showToast = function (opts) {
    const { type = 'info', title = '', message = '', duration = 5000 } = opts;

    const toast = document.createElement('div');
    toast.className = 'ananta-toast ' + type;
    toast.style.position = 'relative';
    toast.innerHTML = `
      <div class="ananta-toast-icon">${ICONS[type] || ICONS.info}</div>
      <div class="ananta-toast-body">
        <div class="ananta-toast-title">${title}</div>
        <div class="ananta-toast-message">${message}</div>
      </div>
      <button class="ananta-toast-close">${CLOSE_ICON}</button>
      ${duration ? '<div class="ananta-toast-progress" style="width:100%"></div>' : ''}
    `;

    container.appendChild(toast);

    // Trigger slide-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    // Close handler
    const closeBtn = toast.querySelector('.ananta-toast-close');
    const dismiss = () => {
      toast.classList.remove('show');
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    };
    closeBtn.addEventListener('click', dismiss);

    // Auto-dismiss with progress bar
    if (duration) {
      const bar = toast.querySelector('.ananta-toast-progress');
      if (bar) {
        bar.style.transition = `width ${duration}ms linear`;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => { bar.style.width = '0%'; });
        });
      }
      setTimeout(dismiss, duration);
    }

    return toast;
  };
})();
