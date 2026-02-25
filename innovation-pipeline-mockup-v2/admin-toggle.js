/**
 * admin-toggle.js — Role-based Admin / User view for all Ananta Lab pages.
 *
 * Drop <script src="admin-toggle.js"></script> before </body> in any page.
 * The script will:
 *   1. Read role from localStorage (set during sign-in).
 *   2. Show a prominent gear button in admin mode -> navigates to Control Center.
 *   3. Apply visual cues (avatar colour) based on role.
 *   4. Keep the original tagline intact for both views.
 *   5. Expose window.anantaToggle.isAdmin() for pages that need role checks
 *      (e.g. notifications.html switches between user/admin panels).
 *
 * Admin email:  admin@ananta.tcs.com
 * User  email:  priya.sharma@tcs.com  (or any other)
 */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════
     CSS — prominent gear button for admin
     ═══════════════════════════════════════════════ */
  const css = `
/* ── Control Center Button (admin only) ── */
.ht-gear{display:none;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:linear-gradient(135deg,rgba(244,67,54,.08),rgba(244,67,54,.16));border:1.5px solid rgba(244,67,54,.25);cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);text-decoration:none;flex-shrink:0;position:relative}
.ht-gear svg{width:18px;height:18px;stroke:#f44336;stroke-width:1.8;fill:none;transition:transform .4s cubic-bezier(.4,0,.2,1)}
.ht-gear:hover{background:linear-gradient(135deg,rgba(244,67,54,.15),rgba(244,67,54,.25));border-color:rgba(244,67,54,.55);box-shadow:0 0 14px rgba(244,67,54,.25),0 2px 8px rgba(0,0,0,.2)}
.ht-gear:hover svg{transform:rotate(90deg)}
.ht-gear.ht-show{display:inline-flex}
.ht-gear.ht-active{background:linear-gradient(135deg,rgba(244,67,54,.18),rgba(244,67,54,.28));border-color:#f44336;box-shadow:0 0 12px rgba(244,67,54,.3),0 2px 6px rgba(0,0,0,.15)}
.ht-gear.ht-active svg{stroke:#ff6659}
/* ── Avatar dropdown menu ──────────────── */
.ht-avatar-wrap{position:relative;display:inline-flex;border-radius:50%}
.ht-avatar-menu{display:none;position:absolute;top:calc(100% + 8px);right:0;min-width:180px;background:#0f2744;border:1px solid #2a4560;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.45);z-index:300;overflow:hidden;animation:htMenuIn .15s ease}
.ht-avatar-menu.ht-open{display:block}
@keyframes htMenuIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.ht-avatar-menu .ht-menu-header{padding:14px 16px;border-bottom:1px solid #2a4560;font-size:12px;color:#9a9dba;line-height:1.5}
.ht-avatar-menu .ht-menu-header strong{display:block;font-size:13px;color:#e8eaf6;font-weight:600}
.ht-avatar-menu a,.ht-avatar-menu button{display:flex;align-items:center;gap:8px;width:100%;padding:10px 16px;border:none;background:none;color:#e8eaf6;font-family:inherit;font-size:13px;font-weight:500;cursor:pointer;text-decoration:none;transition:background .15s}
.ht-avatar-menu a:hover,.ht-avatar-menu button:hover{background:rgba(232,167,88,.08)}
.ht-avatar-menu .ht-menu-divider{height:1px;background:#2a4560;margin:0}
.ht-avatar-menu .ht-signout{color:#ef5350}
.ht-avatar-menu .ht-signout:hover{background:rgba(239,83,80,.08)}
`;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ═══════════════════════════════════════════════
     Locate insertion point
     ═══════════════════════════════════════════════ */
  const headerRight = document.querySelector('.header-right');
  if (!headerRight) return;

  const anchor =
    headerRight.querySelector('.notification-wrapper') ||
    headerRight.querySelector('[class*="avatar"]');
  if (!anchor) return;

  /* ═══════════════════════════════════════════════
     Build & insert gear button (admin only)
     ═══════════════════════════════════════════════ */
  const gear = document.createElement('a');
  gear.href = 'admin-dashboard.html';
  gear.className = 'ht-gear';
  gear.id = 'htGear';
  gear.title = 'Control Center';
  gear.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>';
  headerRight.insertBefore(gear, anchor);

  /* ═══════════════════════════════════════════════
     State — read from localStorage (set at sign-in)
     ═══════════════════════════════════════════════ */
  const isControlCenter = /admin-dashboard/i.test(location.pathname + location.search);
  const adminFlag = localStorage.getItem('ananta-admin') === '1' || isControlCenter;

  /* ═══════════════════════════════════════════════
     Avatar dropdown (profile + sign out)
     ═══════════════════════════════════════════════ */
  var avatarEl = headerRight.querySelector('[class*="avatar"]');
  if (avatarEl) {
    // Wrap avatar in a relative container
    var avatarWrap = document.createElement('div');
    avatarWrap.className = 'ht-avatar-wrap';
    avatarEl.parentNode.insertBefore(avatarWrap, avatarEl);
    avatarWrap.appendChild(avatarEl);

    // Remove the href so click opens menu instead of navigating
    avatarEl.removeAttribute('href');
    avatarEl.style.cursor = 'pointer';

    // Get user info
    var storedUser = null;
    try { storedUser = JSON.parse(localStorage.getItem('ip_user')); } catch(e) {}
    var userName = (storedUser && storedUser.name) || 'User';
    var userEmail = (storedUser && storedUser.email) || '';

    // Set avatar initials from stored user
    if (storedUser && storedUser.name) {
      avatarEl.textContent = storedUser.name.split(' ').map(function(n){ return n[0]; }).join('').toUpperCase().slice(0,2);
    }

    // Build dropdown menu
    var menu = document.createElement('div');
    menu.className = 'ht-avatar-menu';
    menu.id = 'htAvatarMenu';
    menu.innerHTML =
      '<div class="ht-menu-header"><strong>' + userName.replace(/</g,'&lt;') + '</strong>' + userEmail.replace(/</g,'&lt;') + '</div>' +
      '<a href="profile.html"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2\"/><circle cx=\"12\" cy=\"7\" r=\"4\"/></svg>&ensp;My Profile</a>' +
      '<div class="ht-menu-divider"></div>' +
      '<button class="ht-signout" id="htSignOut"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"1em\" height=\"1em\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\"/><polyline points=\"16 17 21 12 16 7\"/><line x1=\"21\" x2=\"9\" y1=\"12\" y2=\"12\"/></svg>&ensp;Sign Out</button>';
    avatarWrap.appendChild(menu);

    // Toggle menu on avatar click
    avatarEl.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      menu.classList.toggle('ht-open');
    });

    // Sign out handler
    document.getElementById('htSignOut').addEventListener('click', function() {
      localStorage.removeItem('ip_loggedIn');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('ananta-admin');
      window.location.href = 'signin.html';
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!avatarWrap.contains(e.target)) {
        menu.classList.remove('ht-open');
      }
    });
  }

  function apply() {
    var gr = document.getElementById('htGear');
    var av = headerRight.querySelector('[class*="avatar"]');

    if (adminFlag) {
      gr.classList.add('ht-show');
      if (isControlCenter) gr.classList.add('ht-active');
      if (av) { av.style.background = '#f44336'; av.style.color = '#fff'; }
    } else {
      gr.classList.remove('ht-show');
      gr.classList.remove('ht-active');
      if (av) { av.style.background = '#e8a758'; av.style.color = '#0d0f1a'; }
    }
    // Tagline stays as-is for both roles — no overwrite
  }

  /* ═══════════════════════════════════════════════
     Public API (backward-compatible)
     ═══════════════════════════════════════════════ */
  window.anantaToggle = {
    /** Returns current admin state */
    isAdmin: function () { return adminFlag; },
    /** No-op kept for backward compat — no more runtime toggling */
    onToggle: function () {}
  };

  // Apply initial state
  apply();
})();
