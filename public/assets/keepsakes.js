/* Keepsakes shared behaviour: pre-order notice, scroll reveals. No dependencies. */
(function () {
  // Single source for the pre-order window. Change the date here, nowhere else.
  var CUTOFF_ISO = '2026-04-24T04:00:00Z'; // April 24, 2026, midnight Eastern
  var CUTOFF_LABEL = 'April 24, 2026';
  var cutoff = new Date(CUTOFF_ISO).getTime();
  window.KEEPSAKES = { cutoff: cutoff, cutoffLabel: CUTOFF_LABEL };

  document.documentElement.classList.add('ks-js');

  function pad(n) { return String(n).padStart(2, '0'); }
  function remaining() {
    var diff = cutoff - Date.now();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / 86400000), h: Math.floor((diff % 86400000) / 3600000),
      m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000)
    };
  }

  function paintNotices() {
    var r = remaining();
    document.querySelectorAll('[data-ks-notice]').forEach(function (el) {
      el.innerHTML = r
        ? 'Spring 2026 pre-orders close <strong>' + CUTOFF_LABEL + '</strong> · <span data-timer>' + r.d + 'd ' + pad(r.h) + 'h ' + pad(r.m) + 'm left</span>'
        : 'Spring 2026 pre-orders closed <strong>' + CUTOFF_LABEL + '</strong>.';
    });
    document.querySelectorAll('[data-ks-countdown]').forEach(function (el) {
      if (!r) { el.hidden = true; return; }
      el.hidden = false;
      ['d', 'h', 'm', 's'].forEach(function (k) {
        var n = el.querySelector('[data-unit="' + k + '"]');
        if (n) n.textContent = pad(r[k]);
      });
    });
    document.querySelectorAll('[data-ks-deadline-state]').forEach(function (el) {
      el.textContent = r ? 'Open now' : 'Closed';
      el.dataset.state = r ? 'open' : 'closed';
    });
    return r;
  }

  function init() {
    document.querySelectorAll('[data-ks-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    if (paintNotices()) setInterval(paintNotices, 1000);

    var items = document.querySelectorAll('.ks-reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(function (i) { i.classList.add('ks-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('ks-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
