(function () {
  "use strict";

  // Change this if the WhatsApp number ever changes (country code, no + or spaces).
  var WHATSAPP_NUMBER = "923008537376";

  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Mobile menu
  var menuBtn = document.getElementById("menuBtn");
  var mobileNav = document.getElementById("mobileNav");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-expanded", String(!open));
      menuBtn.textContent = open ? "Menu" : "Close";
      mobileNav.hidden = open;
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.textContent = "Menu";
        mobileNav.hidden = true;
      }
    });
  }

  // Small helper: create an element with text (never injects HTML)
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function loadJSON(path, cb) {
    fetch(path, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) cb(d); })
      .catch(function () { /* section simply stays hidden */ });
  }

  // Intro video: only shown when /video/intro.mp4 has been uploaded
  var introSection = document.getElementById("intro");
  var introVideo = document.getElementById("introVideo");
  if (introSection && introVideo) {
    fetch("/video/intro.mp4", { method: "HEAD" })
      .then(function (r) {
        if (!r.ok) return;
        introSection.hidden = false;
        var calm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!calm) { var p = introVideo.play(); if (p && p.catch) p.catch(function () {}); }
      })
      .catch(function () { /* stays hidden */ });
  }

  // Reviews: only shown when reviews.json has real reviews
  loadJSON("/reviews.json", function (data) {
    var list = data.reviews || [];
    var section = document.getElementById("reviews");
    var box = document.getElementById("reviewList");
    if (!section || !box || !list.length) return;

    list.forEach(function (r) {
      if (!r.text || !r.name) return;
      var fig = el("figure", "review");
      var rating = Math.round(Number(r.rating));
      if (rating >= 1 && rating <= 5) {
        var stars = el("div", "stars", "★".repeat(rating));
        stars.setAttribute("role", "img");
        stars.setAttribute("aria-label", rating + " out of 5 stars");
        fig.appendChild(stars);
      }
      fig.appendChild(el("blockquote", "", r.text));
      var cap = el("figcaption");
      cap.appendChild(el("strong", "", r.name));
      var extra = [r.city, r.date].filter(Boolean).join(", ");
      if (extra) cap.appendChild(document.createTextNode(", " + extra));
      fig.appendChild(cap);
      box.appendChild(fig);
    });

    if (data.googleReviewsUrl && /^https:\/\//.test(data.googleReviewsUrl)) {
      var p = document.getElementById("reviewsLink");
      var a = el("a", "", "Read or write a review on Google");
      a.href = data.googleReviewsUrl;
      a.target = "_blank";
      a.rel = "noopener";
      p.appendChild(a);
    }
    if (box.children.length) section.hidden = false;
  });

  // Gallery: only shown when gallery.json has photos
  loadJSON("/gallery.json", function (data) {
    var photos = data.photos || [];
    var section = document.getElementById("work");
    var grid = document.getElementById("galleryGrid");
    if (!section || !grid || !photos.length) return;

    photos.forEach(function (ph) {
      if (!ph.src) return;
      var fig = el("figure");
      var img = document.createElement("img");
      img.src = ph.src;
      img.alt = ph.alt || ph.caption || "pakelectroo electrical work";
      img.loading = "lazy";
      fig.appendChild(img);
      if (ph.caption) fig.appendChild(el("figcaption", "", ph.caption));
      grid.appendChild(fig);
    });
    if (grid.children.length) section.hidden = false;
  });

  // Contact form: build a WhatsApp message and open it
  var form = document.getElementById("waForm");
  var errorBox = document.getElementById("formError");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.elements["name"].value.trim();
      var service = form.elements["service"].value;
      var location = form.elements["location"].value.trim();
      var details = form.elements["details"].value.trim();

      if (!name || !details) {
        errorBox.textContent = "Please add your name and describe the problem.";
        errorBox.hidden = false;
        (name ? form.elements["details"] : form.elements["name"]).focus();
        return;
      }
      errorBox.hidden = true;

      var lines = [
        "Hello pakelectroo, my name is " + name + ".",
        "Service: " + service
      ];
      if (location) lines.push("Area: " + location);
      lines.push("", details);

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }
})();
