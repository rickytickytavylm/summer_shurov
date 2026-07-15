/* ============================================================
   Трезвое лето с Шуровым — логика лендинга
   ============================================================ */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
   * Splash: фото → логотип → лендинг.
   * ------------------------------------------------------------------ */
  (function initSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var holdMs = reduceMotion ? 200 : 800;
    var exitMs = reduceMotion ? 120 : 400;

    window.setTimeout(function () {
      splash.classList.add("splash--exit");
      document.body.classList.remove("is-splashing");
      window.setTimeout(function () {
        splash.remove();
      }, exitMs + 50);
    }, holdMs);
  })();

  /* ------------------------------------------------------------------
   * UTM-метки для исходящих ссылок.
   * Меняй здесь один раз — применится ко всем ссылкам с атрибутом data-utm.
   * ------------------------------------------------------------------ */
  var UTM = {
    utm_source: "letoshurova",
    utm_medium: "landing",
    utm_campaign: "trezvoe_leto"
  };

  function withUtm(url, extra) {
    try {
      var u = new URL(url, window.location.href);
      Object.keys(UTM).forEach(function (k) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, UTM[k]);
      });
      if (extra) u.searchParams.set("utm_content", extra);
      return u.toString();
    } catch (e) {
      return url;
    }
  }

  /* ------------------------------------------------------------------
   * Аналитика: единая точка отправки событий (Я.Метрика + GA).
   * data-analytics="event_name" на любом элементе -> клик логируется.
   * ------------------------------------------------------------------ */
  function track(event) {
    try {
      if (typeof window.gtag === "function") {
        window.gtag("event", event, { event_category: "engagement" });
      }
      if (typeof window.ym === "function" && window.YM_COUNTER_ID) {
        window.ym(window.YM_COUNTER_ID, "reachGoal", event);
      }
      // console.log("[analytics]", event);
    } catch (e) {}
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-analytics]");
    if (el) track(el.getAttribute("data-analytics"));
  });

  /* ------------------------------------------------------------------
   * Проставляем UTM всем внешним ссылкам с data-utm и защищаем target.
   * ------------------------------------------------------------------ */
  document.querySelectorAll("a[data-utm]").forEach(function (a) {
    // Заглушки (data-pending) — ссылку ещё не дал заказчик
    if (a.hasAttribute("data-pending")) {
      a.addEventListener("click", function (e) {
        if (a.getAttribute("href") === "#" || !a.getAttribute("href")) {
          e.preventDefault();
          alert("Ссылка будет добавлена после согласования с заказчиком.");
        }
      });
      return;
    }
    var href = a.getAttribute("href");
    if (href && /^https?:/i.test(href)) {
      a.setAttribute("href", withUtm(href, a.getAttribute("data-analytics") || ""));
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener");
    }
  });

  /* ------------------------------------------------------------------
   * Плавный скролл по якорям (data-scroll).
   * ------------------------------------------------------------------ */
  document.querySelectorAll("a[data-scroll]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id && id.charAt(0) === "#") {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });

  /* ------------------------------------------------------------------
   * Header: прозрачный над hero → зелёный после скролла.
   * ------------------------------------------------------------------ */
  var header = document.getElementById("topbar");
  var heroEl = document.getElementById("hero");

  function updateHeader() {
    if (!header || !heroEl) return;
    var threshold = heroEl.offsetHeight - 100;
    var overHero = window.scrollY <= threshold;
    header.classList.toggle("is-scrolled", !overHero);
    header.classList.toggle("header--hero", overHero);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ------------------------------------------------------------------
   * Мобильный tab bar: подсветка активной секции при скролле.
   * ------------------------------------------------------------------ */
  var tabItems = Array.prototype.slice.call(document.querySelectorAll(".tabbar__item"));
  var watched = ["hero", "how", "videos", "help"];
  var sections = watched.map(function (id) { return document.getElementById(id); }).filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          tabItems.forEach(function (t) {
            t.classList.toggle("is-active", t.getAttribute("data-target") === id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ------------------------------------------------------------------
   * Список соцсетей для отметки (единый источник).
   * ------------------------------------------------------------------ */
  // Настоящие логотипы (Simple Icons, скачаны локально в assets/icons).
  // Для соцсетей без иконки в библиотеке — фирменная монограмма.
  var BRANDS = {
    instagram: { file: "instagram" },
    vk: { file: "vk" },
    tiktok: { file: "tiktok" },
    telegram: { file: "telegram" },
    youtube: { file: "youtube" },
    ok: { file: "odnoklassniki" },
    pinterest: { file: "pinterest" },
    max: { img: "max.webp", full: true },
    dzen: { img: "dzen.webp", full: true, pad: true },
    rutube: { img: "rutube.webp", full: true, pad: true },
    yappy: { img: "yappy.webp", full: true },
    looky: { img: "looky.webp", full: true }
  };

  var SOCIALS = [
    { net: "Instagram", handle: "@shurov_school", url: "https://www.instagram.com/shurov_school", brand: "instagram" },
    { net: "Instagram", handle: "@dr.shurov", url: "https://www.instagram.com/dr.shurov", brand: "instagram" },
    { net: "Instagram", handle: "@shurov_rc", url: "https://www.instagram.com/shurov_rc", brand: "instagram" },
    { net: "VK", handle: "dr.shurov", url: "https://vk.ru/dr.shurov", brand: "vk" },
    { net: "TikTok", handle: "@doctor.shurov", url: "https://www.tiktok.com/@doctor.shurov", brand: "tiktok" },
    { net: "Telegram", handle: "Shurovhelp", url: "https://telegram.me/Shurovhelp", brand: "telegram" },
    { net: "MAX", handle: "Shurovhelp", url: "https://max.ru/Shurovhelp", brand: "max" },
    { net: "Дзен", handle: "klinika_dr_shurova", url: "https://dzen.ru/klinika_dr_shurova", brand: "dzen" },
    { net: "YouTube", handle: "@pervyy_shag", url: "https://youtube.com/@pervyy_shag", brand: "youtube" },
    { net: "RuTube", handle: "channel 1816666", url: "https://rutube.ru/channel/1816666/videos/", brand: "rutube" },
    { net: "Одноклассники", handle: "group", url: "https://ok.ru/group/70000035076228", brand: "ok" },
    { net: "Pinterest", handle: "dr_shurova", url: "https://ru.pinterest.com/dr_shurova", brand: "pinterest" },
    { net: "Yappy", handle: "dr.shurov", url: "https://yappy.media/n/dr.shurov", brand: "yappy" },
    { net: "Looky", handle: "dr.shurov", url: "https://share.looky.com/profile/dr.shurov", brand: "looky" }
  ];

  function brandIcon(brand) {
    var b = BRANDS[brand] || { mono: "•", c: "#1c1c1e" };
    if (b.full) {
      var cls = "social-card__ic social-card__ic--full" + (b.pad ? " social-card__ic--pad" : "");
      return '<span class="' + cls + '"><img src="assets/icons/' + b.img + '" alt="" width="56" height="56" loading="lazy" /></span>';
    }
    if (b.file) {
      return '<span class="social-card__ic"><img src="assets/icons/' + b.file + '.svg" alt="" width="30" height="30" loading="lazy" /></span>';
    }
    return '<span class="social-card__ic social-card__ic--mono" style="background:' + b.c + '"><span>' + b.mono + "</span></span>";
  }

  var socialsWrap = document.getElementById("socials");
  if (socialsWrap) {
    var html = SOCIALS.map(function (s) {
      var slug = "social_" + s.brand;
      var href = withUtm(s.url, slug);
      return (
        '<a class="social-card" href="' + href + '" target="_blank" rel="noopener" ' +
        'data-analytics="' + slug + '">' +
          brandIcon(s.brand) +
          '<span class="social-card__net">' + s.net + "</span>" +
          '<span class="social-card__handle">' + s.handle + "</span>" +
        "</a>"
      );
    }).join("");
    socialsWrap.innerHTML = html;
  }

  /* ------------------------------------------------------------------
   * Лента постов участников (Instagram-style) из videos.js.
   * ------------------------------------------------------------------ */
  var grid = document.getElementById("video-grid");

  function escapeHtml(str) {
    return String(str || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function formatDate(d) {
    if (!d) return "";
    var dt = new Date(d);
    if (isNaN(dt)) return escapeHtml(d);
    return dt.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  }

  function initials(name) {
    return String(name || "?")
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) { return w.charAt(0); })
      .join("")
      .toUpperCase();
  }

  function networkIcon(net) {
    var n = (net || "").toLowerCase();
    if (n.indexOf("instagram") >= 0) return "instagram";
    if (n.indexOf("tiktok") >= 0) return "tiktok";
    if (n.indexOf("vk") >= 0) return "vk";
    if (n.indexOf("youtube") >= 0) return "youtube";
    return "";
  }

  function avatarMarkup(v) {
    if (!v.avatar) {
      return '<span class="ig-post__avatar">' + escapeHtml(initials(v.author)) + '</span>';
    }
    var webp = v.avatar;
    var fallback = v.avatarFallback || v.avatar.replace(/\.webp$/i, ".png");
    return (
      '<span class="ig-post__avatar ig-post__avatar--photo">' +
        '<picture>' +
          '<source srcset="' + escapeHtml(webp) + '" type="image/webp" />' +
          '<img src="' + escapeHtml(fallback) + '" alt="" width="36" height="36" loading="lazy" decoding="async" />' +
        '</picture>' +
      '</span>'
    );
  }

  function renderVideos(items) {
    var published = items
      .filter(function (v) { return v.status === "опубликовано"; })
      .sort(function (a, b) {
        if (!!b.pinned !== !!a.pinned) return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
        return new Date(b.date || 0) - new Date(a.date || 0);
      });

    if (!published.length) {
      grid.innerHTML = '<p class="feed__empty">Скоро здесь появятся первые посты. Сними своё трезвое лето и стань первым!</p>';
      return;
    }

    grid.innerHTML = published.map(function (v) {
      var instaUrl = v.url || "https://www.instagram.com/shurov_school/";
      var pin = v.pinned ? '<span class="ig-post__pin" title="Закреплено"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 3h6a1 1 0 0 1 .8 1.6L14 7v4l2.5 2.5a1 1 0 0 1-.7 1.7H13v4l-1 2-1-2v-4H8.2a1 1 0 0 1-.7-1.7L10 11V7L8.2 4.6A1 1 0 0 1 9 3z"/></svg></span>' : "";
      var poster = v.poster ? ' poster="' + escapeHtml(v.poster) + '"' : "";

      return (
        '<a class="ig-post" href="' + escapeHtml(instaUrl) + '" target="_blank" rel="noopener noreferrer" data-analytics="video_insta">' +
          '<header class="ig-post__head">' +
            '<span class="ig-post__user">' +
              avatarMarkup(v) +
              '<span class="ig-post__meta">' +
                '<span class="ig-post__name">' + escapeHtml(v.author) + '</span>' +
                '<span class="ig-post__net">' + escapeHtml(v.network) + " · " + formatDate(v.date) + '</span>' +
              '</span>' +
            '</span>' +
            pin +
          '</header>' +
          '<div class="ig-post__media">' +
            '<video class="ig-post__video" muted loop playsinline preload="metadata"' + poster + '>' +
              '<source src="' + escapeHtml(v.src) + '" type="video/mp4" />' +
            '</video>' +
            '<button class="ig-post__sound" type="button" aria-label="Включить звук" aria-pressed="false">' +
              '<svg class="ig-post__sound-off" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>' +
              '<svg class="ig-post__sound-on" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/></svg>' +
            '</button>' +
            '<span class="ig-post__reel" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' +
          '</div>' +
          '<div class="ig-post__bar">' +
            '<span class="ig-post__action" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s-8-4.5-8-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11-8 11z"/></svg></span>' +
            '<span class="ig-post__action" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8 8 0 0 1-7.6 4.7 8 8 0 0 1-7.6-4.7 8.4 8.4 0 0 1-.9-3.8V6l8-3 8 3z"/></svg></span>' +
            '<span class="ig-post__action" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></span>' +
          '</div>' +
          '<div class="ig-post__body">' +
            '<p class="ig-post__caption"><strong>' + escapeHtml(v.author) + '</strong> ' + escapeHtml(v.caption) + '</p>' +
            '<p class="ig-post__tags">#вашвыбор #летоСШуровым</p>' +
          '</div>' +
        '</a>'
      );
    }).join("");

    initFeedVideos();
  }

  /* Автовоспроизведение роликов в ленте: играем только видимые,
     звук — по тапу (как в reels), одновременно звучит один. */
  function initFeedVideos() {
    var videos = Array.prototype.slice.call(grid.querySelectorAll(".ig-post__video"));
    if (!videos.length) return;

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function safePlay(vid) {
      var p = vid.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    }

    videos.forEach(function (vid) {
      var media = vid.closest(".ig-post__media");
      var soundBtn = media.querySelector(".ig-post__sound");

      if (soundBtn) {
        soundBtn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var turnOn = vid.muted;
          videos.forEach(function (other) {
            if (other !== vid) {
              other.muted = true;
              var b = other.closest(".ig-post__media").querySelector(".ig-post__sound");
              if (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("is-on"); }
            }
          });
          vid.muted = !turnOn;
          soundBtn.setAttribute("aria-pressed", String(turnOn));
          soundBtn.classList.toggle("is-on", turnOn);
          if (turnOn) safePlay(vid);
        });
      }
    });

    if (reduceMotion) return;

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var vid = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
              safePlay(vid);
            } else {
              vid.pause();
            }
          });
        },
        { threshold: [0, 0.6, 1] }
      );
      videos.forEach(function (vid) { io.observe(vid); });
    } else {
      videos.forEach(safePlay);
    }
  }

  if (grid) {
    var data = window.VIDEOS_DATA || { items: [] };
    renderVideos(data.items || []);
  }

  /* ------------------------------------------------------------------
   * Год в подвале.
   * ------------------------------------------------------------------ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
   * Фоновое видео (секция «Почему важно»).
   * Безупречный цикл + экономия ресурсов: играем только когда видно,
   * уважаем prefers-reduced-motion, страхуем зацикливание на iOS.
   * ------------------------------------------------------------------ */
  (function () {
    var video = document.querySelector(".why-video");
    if (!video) return;

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      video.removeAttribute("autoplay");
      video.pause();
      return;
    }

    var wanted = true;

    function tryPlay() {
      if (!wanted) return;
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    }

    // Страховка бесшовной петли (некоторые движки «спотыкаются» на loop).
    video.addEventListener("ended", function () {
      try {
        video.currentTime = 0;
      } catch (e) {}
      tryPlay();
    });

    // Играем только когда секция в зоне видимости.
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            wanted = entry.isIntersecting;
            if (wanted) tryPlay();
            else video.pause();
          });
        },
        { threshold: 0.15 }
      );
      io.observe(video);
    } else {
      tryPlay();
    }

    // Возобновляем после возврата на вкладку.
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) tryPlay();
    });

    tryPlay();
  })();

  /* ===== Модальное окно с формой amoCRM ===== */
  (function () {
    var modal = document.getElementById("press-modal");
    if (!modal) return;

    var formHost = document.getElementById("press-form");
    var lastFocused = null;
    var formLoaded = false;

    function loadAmoForm() {
      if (formLoaded || !formHost) return;
      formLoaded = true;

      var loader = document.createElement("div");
      loader.className = "modal__loading";
      loader.textContent = "Загружаем форму…";
      formHost.appendChild(loader);

      function removeLoader() {
        if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
      }

      // Конфиг amoCRM
      (function (a, m, o, c, r, m2) {
        a[o + c] = a[o + c] || {
          setMeta: function (p) {
            this.params = (this.params || []).concat([p]);
          },
        };
        a[o + r] = a[o + r] || function (f) {
          a[o + r].f = (a[o + r].f || []).concat([f]);
        };
        a[o + r]({ id: "1731270", hash: "f2395647aecae87a839850eb49e2d10d", locale: "ru" });
        a[o + m2] = a[o + m2] || function (f, k) {
          a[o + m2].f = (a[o + m2].f || []).concat([[f, k]]);
        };
      })(window, 0, "amo_forms_", "params", "load", "loaded");

      // Колбэк amoCRM: срабатывает, когда форма отрисована.
      if (typeof window.amo_forms_loaded === "function") {
        window.amo_forms_loaded(function () {
          removeLoader();
        });
      }

      // Форма amoCRM рендерится рядом со своим скриптом — кладём его в контейнер.
      var s = document.createElement("script");
      s.id = "amoforms_script_1731270";
      s.async = true;
      s.charset = "utf-8";
      s.src = "https://forms.amocrm.ru/forms/assets/js/amoforms.js?1784117147";
      formHost.appendChild(s);

      // Наблюдаем за контейнером: как только amoCRM вставит форму — убираем плейсхолдер.
      var mo = new MutationObserver(function () {
        var hasForm = formHost.querySelector("form, iframe, .amoforms__fields-list, [class*='amoforms']");
        if (hasForm) {
          removeLoader();
          mo.disconnect();
        }
      });
      mo.observe(formHost, { childList: true, subtree: true });

      // Фолбэк: если форма не появилась за 12 секунд — показываем прямую ссылку.
      setTimeout(function () {
        if (formHost.querySelector("form, iframe, .amoforms__fields-list, [class*='amoforms']")) return;
        mo.disconnect();
        formHost.innerHTML =
          '<p class="modal__loading">Форма не загрузилась. Напишите нам напрямую: ' +
          '<a href="mailto:info@perviyshag1.getcourse.ru" style="color:var(--apple-green,#34c759);font-weight:600;">info@perviyshag1.getcourse.ru</a></p>';
      }, 12000);
    }

    function openModal() {
      lastFocused = document.activeElement;
      loadAmoForm();
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var closeBtn = modal.querySelector(".modal__close");
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    document.querySelectorAll("[data-open-modal='press']").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });

    modal.querySelectorAll("[data-close-modal]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  })();
})();
