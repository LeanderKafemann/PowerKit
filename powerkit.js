/*!
 * PowerKit JS – Interactive Components
 * Version 1.0.0
 * https://github.com/LeanderKafemann/PowerKit-
 */

(function (global) {
  'use strict';

  /* ============================================================
     Internal helpers
     ============================================================ */

  /** Query a single element (optionally scoped to a root) */
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  /** Query all elements */
  function qsAll(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  /** Add an event listener and return a cleanup function */
  function on(el, type, handler, opts) {
    if (!el) return function () {};
    el.addEventListener(type, handler, opts || false);
    return function () { el.removeEventListener(type, handler, opts || false); };
  }

  /** Toggle a class on an element */
  function toggleClass(el, cls, force) {
    if (!el) return;
    if (force === undefined) {
      el.classList.toggle(cls);
    } else {
      el.classList[force ? 'add' : 'remove'](cls);
    }
  }

  /** Trap focus within a container */
  function trapFocus(container) {
    var FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';
    var focusable = qsAll(FOCUSABLE, container);
    if (!focusable.length) return function () {};
    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }

    container.addEventListener('keydown', handler);
    first.focus();
    return function () { container.removeEventListener('keydown', handler); };
  }

  /** Generate a short unique id */
  var _uid = 0;
  function uid() { return 'pk-' + (++_uid); }

  /* ============================================================
     1. Modal
     Usage:
       PowerKit.modal.open('#my-modal');
       PowerKit.modal.close('#my-modal');
       <!-- HTML -->
       <div class="pk-overlay pk-hidden" id="my-modal" data-modal>
         <div class="pk-modal">
           <div class="pk-modal-header">
             <h2 class="pk-modal-title">Title</h2>
             <button class="pk-modal-close" data-modal-close>&times;</button>
           </div>
           <div class="pk-modal-body">…</div>
           <div class="pk-modal-footer">…</div>
         </div>
       </div>
     ============================================================ */

  var modal = (function () {
    var _stack = [];
    var _cleanups = {};
    var _scrollY = 0;

    function lockScroll() {
      _scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + _scrollY + 'px';
      document.body.style.width = '100%';
    }

    function unlockScroll() {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, _scrollY);
    }

    function open(target) {
      var overlay = typeof target === 'string' ? qs(target) : target;
      if (!overlay) return;
      if (!overlay.id) overlay.id = uid();

      toggleClass(overlay, 'pk-hidden', false);
      overlay.setAttribute('aria-hidden', 'false');

      if (!_stack.length) lockScroll();
      _stack.push(overlay.id);

      // Trap focus
      var modalEl = qs('.pk-modal, .pk-drawer', overlay) || overlay;
      var release = trapFocus(modalEl);

      // Close on backdrop click
      var offBackdrop = on(overlay, 'click', function (e) {
        if (e.target === overlay) close(overlay);
      });

      // Close on Escape
      var offEsc = on(document, 'keydown', function (e) {
        if (e.key === 'Escape') close(overlay);
      });

      _cleanups[overlay.id] = function () {
        release();
        offBackdrop();
        offEsc();
      };

      overlay.dispatchEvent(new CustomEvent('pk:open'));
    }

    function close(target) {
      var overlay = typeof target === 'string' ? qs(target) : target;
      if (!overlay) return;

      toggleClass(overlay, 'pk-hidden', true);
      overlay.setAttribute('aria-hidden', 'true');

      var idx = _stack.indexOf(overlay.id);
      if (idx > -1) _stack.splice(idx, 1);
      if (!_stack.length) unlockScroll();

      if (_cleanups[overlay.id]) {
        _cleanups[overlay.id]();
        delete _cleanups[overlay.id];
      }

      overlay.dispatchEvent(new CustomEvent('pk:close'));
    }

    function init() {
      // Open triggers: data-modal-open="#target"
      on(document, 'click', function (e) {
        var trigger = e.target.closest('[data-modal-open]');
        if (trigger) { open(trigger.dataset.modalOpen); return; }

        // Close triggers
        var closer = e.target.closest('[data-modal-close]');
        if (closer) {
          var overlay = closer.closest('[data-modal]') || closer.closest('.pk-overlay');
          if (overlay) close(overlay);
        }
      });
    }

    return { open: open, close: close, init: init };
  }());


  /* ============================================================
     2. Dropdown
     Usage:
       <div class="pk-dropdown">
         <button data-dropdown-toggle="#my-dd">Open</button>
         <div class="pk-dropdown-menu pk-hidden" id="my-dd">…</div>
       </div>
     ============================================================ */

  var dropdown = (function () {
    var _active = null;

    function open(menu, trigger) {
      if (_active && _active !== menu) close(_active);
      toggleClass(menu, 'pk-hidden', false);
      menu.setAttribute('aria-hidden', 'false');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
      _active = menu;
      menu.dispatchEvent(new CustomEvent('pk:open'));
    }

    function close(menu) {
      if (!menu) return;
      toggleClass(menu, 'pk-hidden', true);
      menu.setAttribute('aria-hidden', 'true');
      var trigger = qs('[data-dropdown-toggle="#' + menu.id + '"], [aria-controls="' + menu.id + '"]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      _active = null;
      menu.dispatchEvent(new CustomEvent('pk:close'));
    }

    function closeAll() {
      qsAll('.pk-dropdown-menu:not(.pk-hidden)').forEach(close);
    }

    function init() {
      on(document, 'click', function (e) {
        var trigger = e.target.closest('[data-dropdown-toggle]');
        if (trigger) {
          e.stopPropagation();
          var target = trigger.dataset.dropdownToggle;
          var menu = qs(target) || trigger.nextElementSibling;
          if (!menu) return;
          if (!menu.id) menu.id = uid();
          if (menu.classList.contains('pk-hidden')) {
            open(menu, trigger);
          } else {
            close(menu);
          }
          return;
        }

        // Close on outside click
        if (_active && !e.target.closest('.pk-dropdown')) {
          close(_active);
        }
      });

      on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && _active) close(_active);
      });
    }

    return { open: open, close: close, closeAll: closeAll, init: init };
  }());


  /* ============================================================
     3. Tabs
     Usage:
       <div class="pk-tabs" data-tabs>
         <div class="pk-tab-list">
           <button class="pk-tab-btn pk-active" data-tab="tab1">Tab 1</button>
           <button class="pk-tab-btn" data-tab="tab2">Tab 2</button>
         </div>
         <div class="pk-tab-panel" id="tab1">…</div>
         <div class="pk-tab-panel pk-hidden" id="tab2">…</div>
       </div>
     ============================================================ */

  var tabs = (function () {
    function initContainer(container) {
      var buttons = qsAll('[data-tab]', container);

      buttons.forEach(function (btn) {
        on(btn, 'click', function () { activate(btn, container); });
        on(btn, 'keydown', function (e) {
          var idx = buttons.indexOf(btn);
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            buttons[(idx + 1) % buttons.length].focus();
          }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            buttons[(idx - 1 + buttons.length) % buttons.length].focus();
          }
        });
      });
    }

    function activate(btn, container) {
      var tabId = btn.dataset.tab;
      var buttons = qsAll('[data-tab]', container);

      buttons.forEach(function (b) {
        toggleClass(b, 'pk-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      qsAll('.pk-tab-panel', container).forEach(function (panel) {
        var visible = panel.id === tabId;
        toggleClass(panel, 'pk-hidden', !visible);
        panel.setAttribute('aria-hidden', visible ? 'false' : 'true');
      });

      container.dispatchEvent(new CustomEvent('pk:tab-change', { detail: { tab: tabId } }));
    }

    function init() {
      qsAll('[data-tabs]').forEach(initContainer);
    }

    return { init: init, activate: activate };
  }());


  /* ============================================================
     4. Accordion
     Usage:
       <div class="pk-accordion" data-accordion>
         <div class="pk-accordion-item">
           <button class="pk-accordion-trigger">
             Title
             <svg class="pk-accordion-icon" …>…</svg>
           </button>
           <div class="pk-accordion-content">
             <div class="pk-accordion-body">…</div>
           </div>
         </div>
       </div>
     ============================================================ */

  var accordion = (function () {
    function toggle(trigger, allowMultiple) {
      var item = trigger.closest('.pk-accordion-item');
      if (!item) return;
      var isOpen = item.classList.contains('pk-open');

      if (!allowMultiple) {
        var parent = item.closest('.pk-accordion');
        if (parent) {
          qsAll('.pk-accordion-item.pk-open', parent).forEach(function (el) {
            toggleClass(el, 'pk-open', false);
            var t = qs('.pk-accordion-trigger', el);
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }
      }

      toggleClass(item, 'pk-open', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      item.dispatchEvent(new CustomEvent('pk:accordion-' + (!isOpen ? 'open' : 'close')));
    }

    function init() {
      on(document, 'click', function (e) {
        var trigger = e.target.closest('.pk-accordion-trigger');
        if (!trigger) return;
        var acc = trigger.closest('[data-accordion]');
        var allowMultiple = acc && acc.dataset.accordion === 'multiple';
        toggle(trigger, allowMultiple);
      });
    }

    return { init: init, toggle: toggle };
  }());


  /* ============================================================
     5. Alert / Dismiss
     Usage:
       <div class="pk-alert pk-alert-info" data-alert>
         …
         <button class="pk-alert-close" data-alert-close>&times;</button>
       </div>
     ============================================================ */

  var alert = (function () {
    function dismiss(el) {
      el.style.transition = 'opacity 0.2s ease, transform 0.2s ease, max-height 0.3s ease';
      el.style.opacity = '0';
      el.style.transform = 'translateY(-4px)';
      el.style.maxHeight = el.offsetHeight + 'px';
      setTimeout(function () {
        el.style.maxHeight = '0';
        el.style.padding = '0';
        el.style.margin = '0';
        el.style.overflow = 'hidden';
      }, 200);
      setTimeout(function () { el.remove(); }, 500);
    }

    function init() {
      on(document, 'click', function (e) {
        var closer = e.target.closest('[data-alert-close]');
        if (!closer) return;
        var alertEl = closer.closest('[data-alert]') || closer.closest('.pk-alert');
        if (alertEl) dismiss(alertEl);
      });
    }

    return { init: init, dismiss: dismiss };
  }());


  /* ============================================================
     6. Toast
     Usage:
       PowerKit.toast.show({ message: 'Saved!', type: 'success', duration: 3000 });
     ============================================================ */

  var toast = (function () {
    var _container;

    function getContainer() {
      if (!_container) {
        _container = document.createElement('div');
        _container.className = 'pk-toast-container';
        _container.setAttribute('aria-live', 'polite');
        _container.setAttribute('role', 'status');
        document.body.appendChild(_container);
      }
      return _container;
    }

    /**
     * @param {Object|string} options
     *   message  {string}  - Text to display
     *   type     {string}  - 'success' | 'error' | 'warning' | 'info' (default: 'info')
     *   duration {number}  - Auto-close ms (default: 4000, 0 = no auto-close)
     *   icon     {string}  - Optional HTML for a leading icon
     */
    function show(options) {
      if (typeof options === 'string') options = { message: options };
      var cfg = Object.assign({ type: 'info', duration: 4000 }, options);

      var icons = {
        success: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
        error:   '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>',
        warning: '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
        info:    '<svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2"/><path stroke="#3b82f6" stroke-width="2" stroke-linecap="round" d="M12 16v-4m0-4h.01"/></svg>'
      };

      var closeIcon = '<svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2.5" stroke-linecap="round" d="M6 18L18 6M6 6l12 12"/></svg>';

      var t = document.createElement('div');
      t.className = 'pk-toast pk-toast-' + cfg.type;
      t.setAttribute('role', 'alert');
      t.innerHTML =
        '<span class="pk-toast-icon">' + (cfg.icon || icons[cfg.type] || icons.info) + '</span>' +
        '<span class="pk-toast-msg" style="flex:1">' + cfg.message + '</span>' +
        '<button class="pk-modal-close" aria-label="Close" style="color:rgba(255,255,255,.6)">' + closeIcon + '</button>';

      getContainer().appendChild(t);

      on(t.querySelector('button'), 'click', function () { remove(t); });

      if (cfg.duration > 0) {
        setTimeout(function () { remove(t); }, cfg.duration);
      }

      return t;
    }

    function remove(t) {
      toggleClass(t, 'pk-toast-hide', true);
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 300);
    }

    return { show: show, remove: remove };
  }());


  /* ============================================================
     7. Toggle (dark mode)
     Usage:
       <button data-theme-toggle>Toggle dark</button>
     ============================================================ */

  var theme = (function () {
    var _current = localStorage.getItem('pk-theme') || 'light';

    function apply(mode) {
      _current = mode;
      document.documentElement.classList.toggle('pk-dark', mode === 'dark');
      document.body.classList.toggle('pk-dark', mode === 'dark');
      localStorage.setItem('pk-theme', mode);
      document.dispatchEvent(new CustomEvent('pk:theme-change', { detail: { theme: mode } }));
    }

    function toggle() {
      apply(_current === 'dark' ? 'light' : 'dark');
    }

    function getCurrent() { return _current; }

    function init() {
      // Restore saved preference
      apply(_current);

      on(document, 'click', function (e) {
        if (e.target.closest('[data-theme-toggle]')) toggle();
      });
    }

    return { apply: apply, toggle: toggle, getCurrent: getCurrent, init: init };
  }());


  /* ============================================================
     8. Toggle Switch helper
     Makes .pk-toggle work without custom JS
     ============================================================ */

  function initToggles() {
    on(document, 'change', function (e) {
      var input = e.target.closest('.pk-toggle-input');
      if (!input) return;
      var thumb = input.parentElement.querySelector('.pk-toggle-thumb');
      if (thumb) {
        thumb.style.transform = input.checked ? 'translateX(1.25rem)' : '';
      }
    });
  }


  /* ============================================================
     9. Ripple Effect (optional enhancement for buttons)
     Automatically applied to all .pk-btn elements.
     ============================================================ */

  function initRipple() {
    on(document, 'click', function (e) {
      var btn = e.target.closest('.pk-btn');
      if (!btn) return;

      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;

      var ripple = document.createElement('span');
      ripple.style.cssText = [
        'position:absolute',
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + x + 'px',
        'top:' + y + 'px',
        'border-radius:50%',
        'background:rgba(255,255,255,0.3)',
        'transform:scale(0)',
        'animation:pk-ripple 0.5s linear',
        'pointer-events:none'
      ].join(';');

      var style = btn.getAttribute('style') || '';
      if (!style.includes('overflow')) {
        btn.style.overflow = 'hidden';
      }
      btn.style.position = btn.style.position || 'relative';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });

    // Inject ripple keyframe once
    if (!qs('#pk-ripple-style')) {
      var s = document.createElement('style');
      s.id = 'pk-ripple-style';
      s.textContent = '@keyframes pk-ripple{to{transform:scale(4);opacity:0}}';
      document.head.appendChild(s);
    }
  }


  /* ============================================================
     10. Smooth Scroll for anchor links
     ============================================================ */

  function initSmoothScroll() {
    on(document, 'click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus({ preventScroll: true });
      }
    });
  }


  /* ============================================================
     11. Navbar – mobile toggle
     Usage:
       <button data-navbar-toggle="#mobile-nav">☰</button>
       <div id="mobile-nav" class="pk-hidden">…</div>
     ============================================================ */

  function initNavbar() {
    on(document, 'click', function (e) {
      var btn = e.target.closest('[data-navbar-toggle]');
      if (!btn) return;
      var target = qs(btn.dataset.navbarToggle);
      if (target) toggleClass(target, 'pk-hidden');
    });
  }


  /* ============================================================
     Public API
     ============================================================ */

  var PowerKit = {
    modal:    modal,
    dropdown: dropdown,
    tabs:     tabs,
    accordion: accordion,
    alert:    alert,
    toast:    toast,
    theme:    theme,

    /**
     * Initialize all components at once.
     * Call after DOM is ready.
     */
    init: function () {
      modal.init();
      dropdown.init();
      tabs.init();
      accordion.init();
      alert.init();
      theme.init();
      initToggles();
      initRipple();
      initSmoothScroll();
      initNavbar();

      document.dispatchEvent(new CustomEvent('pk:ready'));
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { PowerKit.init(); });
  } else {
    PowerKit.init();
  }

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = PowerKit;
  } else {
    global.PowerKit = PowerKit;
  }

}(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this));
