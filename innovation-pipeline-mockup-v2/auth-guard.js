/**
 * auth-guard.js — Page-level authentication gate for Ananta Lab.
 *
 * Include <script src="auth-guard.js"></script> as the FIRST script in <body>
 * (or in <head>) of every protected page.
 *
 * If the user is not logged in (ip_loggedIn !== 'true'), the entire page
 * redirects to signin.html with a ?return= parameter so the user lands
 * back on the same page after signing in.
 *
 * Pages that should NOT include this: signin.html, register.html
 */
(function () {
  'use strict';
  if (localStorage.getItem('ip_loggedIn') !== 'true') {
    var here = location.pathname.split('/').pop() + location.search;
    location.replace('signin.html?return=' + encodeURIComponent(here));
  }
})();
