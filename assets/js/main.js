/* ==========================================================================
   MERVE COMFORT APARTS — main.js
   Kein Framework, keine externen Bibliotheken.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     CONFIG — HIER DIE ECHTEN DATEN EINTRAGEN
     ====================================================================== */
  var CONFIG = {

    // TODO: WhatsApp-Nummer im internationalen Format, ohne "+", ohne Leerzeichen.
    //       Beispiel Deutschland: '4917012345678'   Beispiel Türkei: '905321234567'
    whatsappNumber: '',

    // TODO: E-Mail-Adresse für Anfragen, z. B. 'info@merve-comfort-aparts.de'
    email: '',

    // TODO: Adresse, an die das Formular gesendet wird.
    //       Am einfachsten ein fertiger Dienst, z. B.
    //       Formspree:  'https://formspree.io/f/xxxxxxx'
    //       Netlify / eigener Server funktionieren genauso (POST, JSON).
    //       Bleibt das Feld leer, öffnet das Formular stattdessen WhatsApp
    //       mit einer fertig ausgefüllten Nachricht.
    formEndpoint: ''
  };

  /* ------------------------------------------------------------ Helfer -- */
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function deDate(iso) {
    if (!iso) return '';
    var p = iso.split('-');
    return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso;
  }

  function todayISO() {
    var d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  function addDays(iso, n) {
    var d = new Date(iso + 'T12:00:00');
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /* Kleiner Hinweis unten am Bildschirm – nur für noch nicht gesetzte Platzhalter. */
  var toastEl = null, toastTimer = null;
  function notify(text) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 5000);
  }

  /* ================================================================ JAHR */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================================ WHATSAPP */
  function waMessage(data) {
    var lines = ['Hallo Merve Comfort Aparts,', ''];
    if (data && data.anreise) {
      lines.push('ich möchte die Verfügbarkeit anfragen.', '');
      lines.push('Anreise: ' + deDate(data.anreise));
      lines.push('Abreise: ' + deDate(data.abreise));
      lines.push('Gäste: ' + data.gaeste);
      if (data.apartment) lines.push('Apartment: ' + data.apartment);
      if (data.name)      lines.push('Name: ' + data.name);
      if (data.telefon)   lines.push('Telefon: ' + data.telefon);
      if (data.email)     lines.push('E-Mail: ' + data.email);
      if (data.nachricht) lines.push('', data.nachricht);
    } else {
      lines.push('ich habe eine Frage zu Ihren Ferienwohnungen.');
    }
    return lines.join('\n');
  }

  function waURL(data) {
    if (!CONFIG.whatsappNumber) return null;
    return 'https://wa.me/' + CONFIG.whatsappNumber.replace(/\D/g, '') +
           '?text=' + encodeURIComponent(waMessage(data));
  }

  var waLinks = $$('[data-whatsapp]');
  var waReady = !!CONFIG.whatsappNumber;
  waLinks.forEach(function (a) {
    if (waReady) {
      a.href = waURL(null);
      a.target = '_blank';
      a.rel = 'noopener';
    } else {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        notify('TODO: WhatsApp-Nummer in assets/js/main.js eintragen (CONFIG.whatsappNumber).');
      });
    }
  });

  /* Platzhalter-Links für Impressum / Datenschutz / AGB */
  $$('[data-legal]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.getAttribute('href') !== '#') return;
      e.preventDefault();
      notify('TODO: Seite "' + a.dataset.legal + '" anlegen und hier verlinken.');
    });
  });

  /* ============================================================== HEADER */
  var header = $('#header');
  var onScroll = function () {
    header.classList.toggle('is-stuck', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ========================================================= MOBILE MENU */
  var burger = $('#burger');
  var menu = $('#mobilemenu');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.querySelector('.sr-only').textContent = open ? 'Menü schließen' : 'Menü öffnen';
    menu.hidden = !open;
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) header.classList.add('is-stuck');
    else onScroll();
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      burger.focus();
    }
  });

  /* ======================================================= REVEAL ON SCROLL */
  var revealEls = $$('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ========================================================== STICKY CTA */
  var sticky = $('#stickycta');
  var hero = $('#hero');
  if (sticky && hero && 'IntersectionObserver' in window) {
    sticky.hidden = false;
    var anfrage = $('#anfrage');
    var show = function () {
      sticky.classList.add('is-visible');
      document.body.classList.add('has-stickycta');
    };
    var hide = function () {
      sticky.classList.remove('is-visible');
      document.body.classList.remove('has-stickycta');
    };
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) hide(); else show();
    }, { threshold: 0 }).observe(hero);

    // im Anfrage-Abschnitt selbst ist die Leiste überflüssig
    if (anfrage) {
      new IntersectionObserver(function (e) {
        if (e[0].isIntersecting) hide();
      }, { threshold: 0.15 }).observe(anfrage);
    }
  }

  /* ========================================================= DATUMSFELDER */
  var today = todayISO();
  var fAn = $('#f-anreise'), fAb = $('#f-abreise');
  var qAn = $('#q-anreise'), qAb = $('#q-abreise');

  function linkDates(from, to) {
    if (!from || !to) return;
    from.min = today;
    to.min = today;
    from.addEventListener('change', function () {
      if (!from.value) return;
      to.min = addDays(from.value, 1);
      if (to.value && to.value <= from.value) to.value = addDays(from.value, 1);
    });
  }
  linkDates(fAn, fAb);
  linkDates(qAn, qAb);

  /* ==================================================== SCHNELLANFRAGE -> */
  var quick = $('#schnellanfrage');
  var form = $('#anfrageform');

  function scrollToForm(focusEl) {
    var target = $('#anfrage');
    if (!target) return;
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (focusEl) {
      setTimeout(function () { focusEl.focus({ preventScroll: true }); }, reduceMotion ? 0 : 620);
    }
  }

  if (quick && form) {
    quick.addEventListener('submit', function (e) {
      e.preventDefault();
      if (qAn.value) fAn.value = qAn.value;
      if (qAb.value) fAb.value = qAb.value;
      $('#f-gaeste').value = $('#q-gaeste').value;
      if (fAn.value) fAb.min = addDays(fAn.value, 1);
      scrollToForm(fAn.value && fAb.value ? $('#f-name') : fAn);
    });
  }

  /* "Diese Wohnung anfragen" – Auswahl im Formular vorbelegen */
  $$('[data-apartment]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var sel = $('#f-apartment');
      if (sel) {
        var val = a.dataset.apartment;
        var hit = Array.prototype.some.call(sel.options, function (o) {
          if (o.value === val) { sel.value = val; return true; }
          return false;
        });
        if (!hit) sel.selectedIndex = 0;
      }
      scrollToForm(fAn && !fAn.value ? fAn : $('#f-name'));
    });
  });

  /* ============================================================ LIGHTBOX */
  var gallery = $('#gallery');
  var lb = $('#lightbox');
  if (gallery && lb) {
    var figs = $$('figure img', gallery);
    var lbImg = $('#lbimg'), lbCount = $('#lbcount');
    var idx = 0, lastFocus = null;

    function fullSrc(img) {
      // Platzhalter von Unsplash in höherer Auflösung laden; lokale Bilder unverändert.
      return img.src.indexOf('images.unsplash.com') > -1
        ? img.src.replace(/([?&])w=\d+/, '$1w=1800')
        : img.src;
    }

    function render() {
      var img = figs[idx];
      lbImg.src = fullSrc(img);
      lbImg.alt = img.alt;
      lbCount.textContent = (idx + 1) + ' / ' + figs.length;
    }

    function openLB(i) {
      idx = i;
      lastFocus = document.activeElement;
      lb.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      render();
      $('#lbclose').focus();
    }

    function closeLB() {
      lb.hidden = true;
      lbImg.src = '';
      document.documentElement.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    function step(n) {
      idx = (idx + n + figs.length) % figs.length;
      render();
    }

    figs.forEach(function (img, i) {
      var fig = img.parentElement;
      fig.setAttribute('role', 'button');
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('aria-label', 'Bild vergrößern: ' + img.alt);
      fig.addEventListener('click', function () { openLB(i); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLB(i); }
      });
    });

    $('#lbclose').addEventListener('click', closeLB);
    $('#lbprev').addEventListener('click', function () { step(-1); });
    $('#lbnext').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target.classList.contains('lightbox__stage')) closeLB();
    });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ============================================================ FORMULAR */
  if (form) {
    var done = $('#formdone');
    var doneText = $('#formdone-text');
    var submitBtn = form.querySelector('button[type="submit"]');

    function setError(id, field, msg) {
      var el = $('#' + id);
      if (el) el.textContent = msg || '';
      if (field) {
        if (msg) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
      }
    }

    function validate() {
      var ok = true, first = null;
      var name = $('#f-name'), mail = $('#f-email'), tel = $('#f-telefon'),
          ds = $('#f-datenschutz');

      setError('e-anreise', fAn, ''); setError('e-abreise', fAb, '');
      setError('e-name', name, '');  setError('e-kontakt', null, '');
      setError('e-datenschutz', null, '');

      if (!fAn.value) {
        setError('e-anreise', fAn, 'Bitte ein Anreisedatum wählen.'); ok = false; first = first || fAn;
      } else if (fAn.value < today) {
        setError('e-anreise', fAn, 'Das Datum liegt in der Vergangenheit.'); ok = false; first = first || fAn;
      }

      if (!fAb.value) {
        setError('e-abreise', fAb, 'Bitte ein Abreisedatum wählen.'); ok = false; first = first || fAb;
      } else if (fAn.value && fAb.value <= fAn.value) {
        setError('e-abreise', fAb, 'Die Abreise muss nach der Anreise liegen.'); ok = false; first = first || fAb;
      }

      if (name.value.trim().length < 2) {
        setError('e-name', name, 'Bitte Ihren Namen angeben.'); ok = false; first = first || name;
      }

      if (!mail.value.trim() && !tel.value.trim()) {
        setError('e-kontakt', null, 'Bitte E-Mail oder Telefonnummer angeben, damit wir antworten können.');
        mail.setAttribute('aria-invalid', 'true');
        tel.setAttribute('aria-invalid', 'true');
        ok = false; first = first || mail;
      } else {
        mail.removeAttribute('aria-invalid');
        tel.removeAttribute('aria-invalid');
      }

      if (!ds.checked) {
        setError('e-datenschutz', null, 'Bitte der Datenverarbeitung zustimmen.');
        ok = false; first = first || ds;
      }

      if (first) first.focus({ preventScroll: false });
      return ok;
    }

    function collect() {
      return {
        anreise:    fAn.value,
        abreise:    fAb.value,
        gaeste:     $('#f-gaeste').value,
        apartment:  $('#f-apartment').value,
        name:       $('#f-name').value.trim(),
        email:      $('#f-email').value.trim(),
        telefon:    $('#f-telefon').value.trim(),
        nachricht:  $('#f-nachricht').value.trim(),
        _betreff:   'Neue Anfrage über die Website'
      };
    }

    function showDone(msg) {
      doneText.innerHTML = msg;
      form.hidden = true;
      done.hidden = false;
      done.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: von Bots ausgefüllt -> stillschweigend beenden
      if ($('#f-website').value) { showDone('Danke, Ihre Anfrage ist eingegangen.'); return; }
      if (!validate()) return;

      var data = collect();
      submitBtn.disabled = true;
      var label = submitBtn.textContent;
      submitBtn.textContent = 'Wird gesendet …';

      function reset() {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }

      function fallbackWhatsApp(prefix) {
        var url = waURL(data);
        if (url) {
          var w = window.open(url, '_blank', 'noopener');
          if (!w) window.location.href = url;
          showDone(prefix + 'Wir haben Ihre Angaben in eine WhatsApp-Nachricht übernommen – bitte dort noch absenden.');
        } else {
          showDone(
            '<strong>Hinweis für die Website-Betreuung:</strong> Die Anfrage wurde noch nicht versendet. ' +
            'Bitte in <code>assets/js/main.js</code> entweder <code>CONFIG.formEndpoint</code> ' +
            'oder <code>CONFIG.whatsappNumber</code> eintragen.'
          );
        }
        reset();
      }

      if (CONFIG.formEndpoint) {
        fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          showDone('Wir haben Ihre Anfrage erhalten und melden uns persönlich bei Ihnen zurück.');
          reset();
        }).catch(function () {
          fallbackWhatsApp('Das Formular konnte gerade nicht senden. ');
        });
      } else {
        fallbackWhatsApp('');
      }
    });

    $('#formreset').addEventListener('click', function () {
      form.reset();
      done.hidden = true;
      form.hidden = false;
      fAn.focus();
    });
  }
})();
