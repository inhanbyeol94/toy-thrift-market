memberData();

(function () {
  var w = window;
  if (w.ChannelIO) {
    return w.console.error('ChannelIO script included twice.');
  }
  var ch = function () {
    ch.c(arguments);
  };
  ch.q = [];
  ch.c = function (args) {
    ch.q.push(args);
  };
  w.ChannelIO = ch;
  function l() {
    if (w.ChannelIOInitialized) {
      return;
    }
    w.ChannelIOInitialized = true;
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
    var x = document.getElementsByTagName('script')[0];
    if (x.parentNode) {
      x.parentNode.insertBefore(s, x);
    }
  }
  if (document.readyState === 'complete') {
    l();
  } else {
    w.addEventListener('DOMContentLoaded', l);
    w.addEventListener('load', l);
  }
})();

async function memberData() {
  const res = await fetch('/members', { method: 'GET' });
  const member = await res.json();

  ChannelIO('boot', {
    pluginKey: '7c52df89-5c3a-4850-a4ab-e5ede279c199',
    profile: {
      name: member.name,
      mobileNumber: member.tel,
      email: member.email,
    },
  });
}
