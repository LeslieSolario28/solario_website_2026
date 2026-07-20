(function () {
  'use strict';

  var launcher = document.getElementById('chat-launcher');
  var panel = document.getElementById('chat-panel');
  if (!launcher || !panel) return;

  var log = panel.querySelector('.chat-log');
  var form = panel.querySelector('.chat-form');
  var input = form.querySelector('input');
  var sendBtn = form.querySelector('button');
  var closeBtn = panel.querySelector('.chat-close');

  // Conversation history sent to the API (user/assistant only).
  var history = [];
  var greeted = false;

  var GREETING = '¡Hola! 👋 Soy el asistente de Solario. ¿Con qué te puedo ayudar hoy: una cotización, un tema de finanzas, o soporte técnico?';

  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Escape text, then linkify emails so they're clickable.
  function render(text) {
    var safe = esc(text);
    return safe.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>');
  }

  function addMsg(role, text) {
    var el = document.createElement('div');
    el.className = 'chat-msg ' + (role === 'user' ? 'user' : 'bot');
    el.innerHTML = render(text);
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function openPanel() {
    panel.classList.add('is-open');
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    if (!greeted) { addMsg('bot', GREETING); greeted = true; }
    setTimeout(function () { input.focus(); }, 200);
  }

  function closePanel() {
    panel.classList.remove('is-open');
    launcher.classList.remove('is-open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) closePanel();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    addMsg('user', text);
    history.push({ role: 'user', content: text });
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    var typing = addMsg('bot', 'Escribiendo…');
    typing.classList.add('typing');

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (res) {
        typing.remove();
        if (res.ok && res.d.reply) {
          addMsg('bot', res.d.reply);
          history.push({ role: 'assistant', content: res.d.reply });
        } else {
          addMsg('bot', (res.d && res.d.error) || 'Ocurrió un error. Intenta de nuevo.');
        }
      })
      .catch(function () {
        typing.remove();
        addMsg('bot', 'No pude conectar. Revisa tu conexión e intenta de nuevo.');
      })
      .then(function () {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
      });
  });
})();
