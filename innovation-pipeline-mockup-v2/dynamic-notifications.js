// ═══ DYNAMIC NOTIFICATION INJECTION ═══ //
// Reads ip_notifications from localStorage and injects rejection (and future)
// notifications into the notification bell panel on every page.
(function injectDynamicNotifications() {
  const currentUser = JSON.parse(localStorage.getItem('ip_user') || '{}');
  const currentEmail = (currentUser.email || '').toLowerCase();
  if (!currentEmail) return;

  const notifs = JSON.parse(localStorage.getItem('ip_notifications') || '[]');
  const myNotifs = notifs.filter(n => n.recipientEmail === currentEmail);
  if (myNotifs.length === 0) return;

  const list = document.querySelector('.notification-list');
  const badge = document.getElementById('notifBadge');
  if (!list) return;

  let unreadCount = parseInt(badge ? badge.textContent : '0') || 0;

  myNotifs.forEach(n => {
    // Avoid duplicates
    const existing = list.querySelector('[data-notif-id="' + n.id + '"]');
    if (existing) return;

    const iconClass = n.itemType === 'Challenge' ? 'challenge' : 'idea';
    const iconName = n.itemType === 'Challenge' ? 'flag' : 'lightbulb';
    const isRejection = n.type === 'rejection';
    const tintBg = isRejection ? 'rgba(239,83,80,.12)' : 'rgba(102,187,106,.12)';
    const tintColor = isRejection ? '#ef5350' : '#66bb6a';
    const label = isRejection ? n.itemType + ' Rejected' : n.itemType + ' Update';

    const div = document.createElement('div');
    div.className = 'notification-item' + (n.read ? '' : ' unread');
    div.setAttribute('data-notif-id', n.id);
    div.onclick = function() {
      this.classList.remove('unread');
      // Persist read state
      const ns = JSON.parse(localStorage.getItem('ip_notifications') || '[]');
      const found = ns.find(x => x.id === n.id);
      if (found) { found.read = true; localStorage.setItem('ip_notifications', JSON.stringify(ns)); }
      if (badge) {
        let c = parseInt(badge.textContent) - 1;
        badge.textContent = Math.max(0, c);
        if (c <= 0) badge.style.display = 'none';
      }
    };
    div.innerHTML =
      '<div class="notification-icon ' + iconClass + '" style="background:' + tintBg + '">' +
        '<i data-lucide="' + iconName + '" style="color:' + tintColor + '"></i>' +
      '</div>' +
      '<div class="notification-content">' +
        '<div class="notification-title" style="color:' + tintColor + '">' + label + '</div>' +
        '<div class="notification-text">' + n.message + '</div>' +
        '<div class="notification-time">' + timeAgo(n.createdAt) + '</div>' +
      '</div>';

    list.insertBefore(div, list.firstChild);
    if (!n.read) unreadCount++;
  });

  if (badge) {
    badge.textContent = unreadCount;
    badge.style.display = unreadCount > 0 ? '' : 'none';
  }
  if (typeof lucide !== 'undefined') lucide.createIcons();

  function timeAgo(iso) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + ' min ago';
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + ' hr ago';
    return Math.floor(hrs / 24) + ' day(s) ago';
  }
})();
