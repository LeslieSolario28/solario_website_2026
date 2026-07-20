(function () {
  'use strict';

  var launcher = document.getElementById('chat-launcher');
  var panel = document.getElementById('chat-panel');
  if (!launcher || !panel) return;

  var log = panel.querySelector('.chat-log');
  var closeBtn = panel.querySelector('.chat-close');

  var LABELS = {
    cotizar: '💡 Cotización / Ventas',
    finanzas: '🧾 Finanzas / Facturación',
    soporte: '🔧 Soporte técnico / Se fue la luz',
    general: '💬 Pregunta general'
  };

  // Topic → response (bot message + contact routing + pre-written email).
  var TOPICS = {
    cotizar: {
      intro: 'Con gusto preparamos una propuesta para tu empresa. Escribe a:',
      emails: ['david@solario.mx', 'alejandro@solario.mx'],
      subject: 'Solicitud de cotización — Solario',
      body: 'Hola, me interesa una cotización.\n\nNombre:\nEmpresa:\nUbicación:\nConsumo aproximado (kWh/mes):\nComentarios:'
    },
    finanzas: {
      intro: 'Para temas de facturación, pagos o administración, escribe a:',
      emails: ['miguel@solario.mx'],
      subject: 'Consulta de finanzas — Solario',
      body: 'Hola, tengo una consulta de finanzas/facturación.\n\nNombre:\nEmpresa:\nDescripción:'
    },
    soporte: {
      intro: 'Lamentamos el inconveniente. Para soporte técnico escribe a:',
      emails: ['alejandro@solario.mx', 'david@solario.mx'],
      subject: 'Soporte técnico — Solario',
      body: 'Hola, necesito soporte técnico.\n\nNombre:\nEmpresa:\nQué está pasando:'
    },
    general: {
      intro: 'Con gusto te ayudamos. Escribe a:',
      emails: ['david@solario.mx', 'alejandro@solario.mx'],
      subject: 'Contacto — Solario',
      body: 'Hola, tengo una pregunta.\n\nNombre:\nEmpresa:\nMensaje:'
    }
  };

  var started = false;

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addBot(html) {
    var el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.innerHTML = html;
    log.appendChild(el);
    scrollDown();
    return el;
  }

  function addUser(text) {
    var el = document.createElement('div');
    el.className = 'chat-msg user';
    el.textContent = text;
    log.appendChild(el);
    scrollDown();
  }

  function addOptions(lead) {
    if (lead) addBot(lead);
    var wrap = document.createElement('div');
    wrap.className = 'chat-options';
    Object.keys(LABELS).forEach(function (key) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'chat-opt';
      b.textContent = LABELS[key];
      b.addEventListener('click', function () { choose(key, wrap); });
      wrap.appendChild(b);
    });
    log.appendChild(wrap);
    scrollDown();
  }

  function choose(key, wrap) {
    wrap.remove();            // remove the buttons that were just used
    addUser(LABELS[key]);     // show the user's choice as a message

    var t = TOPICS[key];
    var mailto = 'mailto:' + t.emails.join(',') +
      '?subject=' + encodeURIComponent(t.subject) +
      '&body=' + encodeURIComponent(t.body);
    var emailsHtml = t.emails.map(function (e) {
      return '<a class="chat-email" href="mailto:' + e + '">' + e + '</a>';
    }).join('');

    // Bot replies a moment later, like a real chat.
    setTimeout(function () {
      addBot(t.intro +
        '<div class="chat-emails">' + emailsHtml + '</div>' +
        '<a class="chat-btn" href="' + mailto + '">✉️ Escribir correo</a>');
      setTimeout(function () { addOptions('¿Te ayudo con algo más?'); }, 450);
    }, 400);
  }

  function start() {
    if (started) return;
    started = true;
    addBot('¡Hola! 👋 Soy el asistente de Solario. ¿Con qué te podemos ayudar?');
    addOptions();
  }

  function openPanel() {
    panel.classList.add('is-open');
    launcher.classList.add('is-open');
    launcher.setAttribute('aria-expanded', 'true');
    start();
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
})();
