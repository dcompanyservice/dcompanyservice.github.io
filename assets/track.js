/* Dcompany site usage counter (2026-10-20)
   Sends only: page path, which kind of button was pressed, and where the visit came from (site category or ?src= value).
   No IP, cookies or device info are stored on our server. Counts are kept per item per day. */
(function () {
  try {
    var API = 'https://api.sector-31.com/pv?p=';
    var path = location.pathname.toLowerCase();
    var seg = path.split('/');
    var lang = seg[1];
    if (lang !== 'ko' && lang !== 'ja' && lang !== 'en') return;
    var key = seg.slice(2).filter(function (x) { return x; }).join('-') || 'home';
    var send = function (p) { try { navigator.sendBeacon(API + encodeURIComponent(p)); } catch (e) {} };
    var clean = function (q) {
      var s = ''; q = String(q || '').toLowerCase();
      for (var i = 0; i < q.length && s.length < 20; i++) {
        var c = q.charAt(i);
        if ((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c === '-') s += c;
      }
      return s;
    };
    var ends = function (h, d) { return h === d || h.slice(-(d.length + 1)) === '.' + d; };

    send(path.slice(-1) === '/' ? path : path + '/');

    var src = '';
    try { src = clean(new URLSearchParams(location.search).get('src')); } catch (e) {}
    if (!src && document.referrer) {
      try {
        var h = new URL(document.referrer).hostname.toLowerCase();
        if (!ends(h, 'sector-31.com')) {
          src = (ends(h, 't.co') || ends(h, 'x.com') || ends(h, 'twitter.com')) ? 'x'
              : ends(h, 'instagram.com') ? 'ig'
              : (ends(h, 'youtube.com') || h === 'youtu.be') ? 'yt'
              : (ends(h, 'facebook.com') || ends(h, 'fb.com')) ? 'fb'
              : (h.indexOf('google.') >= 0) ? 'google'
              : (ends(h, 'naver.com')) ? 'naver'
              : (ends(h, 'yahoo.co.jp') || ends(h, 'yahoo.com')) ? 'yahoo'
              : 'other';
        }
      } catch (e) {}
    }
    if (src) send('/' + lang + '/from/' + src + '/' + key + '/');

    var kind = function (href) {
      var u = String(href || '').toLowerCase();
      if (u.indexOf('play.google.com') >= 0 || u.indexOf('com.android.vending') >= 0) return 'play';
      if (u.indexOf('apps.apple.com') >= 0) return 'appstore';
      if (u.indexOf('x.com/') >= 0 || u.indexOf('twitter.com/') >= 0) return 'x';
      if (u.indexOf('instagram.com') >= 0) return 'ig';
      if (u.indexOf('youtube.com') >= 0 || u.indexOf('youtu.be') >= 0) return 'yt';
      if (u.indexOf('discord') >= 0) return 'discord';
      if (u.indexOf('/sector31/playable') >= 0) return 'playable';
      if (u.indexOf('/novel/') >= 0) return 'novel';
      if (u.indexOf('mailto:') === 0) return 'mail';
      if (u.indexOf('http') === 0 && u.indexOf('sector-31.com') < 0) return 'ext';
      return '';
    };
    document.addEventListener('click', function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
      if (!a) return;
      var k = kind(a.getAttribute('href'));
      if (k) send('/' + lang + '/click/' + k + '/' + key + '/');
    }, true);
  } catch (e) {}
})();
