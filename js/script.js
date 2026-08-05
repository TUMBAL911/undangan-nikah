/**
 * Wedding invitation behaviour.
 * All editable data lives in js/config.js — this file should rarely
 * need changing.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. Populate content from CONFIG
  --------------------------------------------------------- */
  function fillText(id, value) {
    const el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function populateContent() {
    const { groom, bride, venue, gift, weddingDateDisplay, weddingTimeDisplay } = CONFIG;

    fillText("coverGroomNick", groom.nickname);
    fillText("coverBrideNick", bride.nickname);
    fillText("coverDate", weddingDateDisplay);

    document.getElementById("groomPhoto").src = groom.photo;
    document.getElementById("bridePhoto").src = bride.photo;
    fillText("groomName", groom.fullName);
    fillText("brideName", bride.fullName);
    fillText(
      "groomParents",
      `${groom.childOrder} Bapak ${groom.father} & Ibu ${groom.mother}`
    );
    if (bride.father || bride.mother) {
      fillText(
        "brideParents",
        `${bride.childOrder} Bapak ${bride.father} & Ibu ${bride.mother}`
      );
    }

    fillText("eventDate", weddingDateDisplay);
    fillText("eventTime", weddingTimeDisplay);
    fillText("venueName", venue.name);
    fillText("venueAddress", venue.address);
    document.getElementById("mapsLink").href = venue.googleMapsUrl;

    fillText("giftBank", gift.bankName);
    fillText("giftNumber", gift.accountNumber);
    fillText("giftHolder", `a.n. ${gift.accountHolder}`);
    fillText("giftAddress", gift.deliveryAddress);

    document.getElementById("bgMusic").src = CONFIG.music.src;

    // Guest name personalization via ?to=Nama%20Tamu
    const params = new URLSearchParams(window.location.search);
    const guest = params.get(CONFIG.guestParamName);
    if (guest) {
      document.getElementById("guestGreeting").innerHTML =
        `Kepada Bapak/Ibu/Saudara/i <strong>${escapeHtml(guest)}</strong>`;
      document.getElementById("rsvpName").value = guest;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------------------------------------------------
     2. Google Calendar "Save the Date" link
  --------------------------------------------------------- */
  function buildCalendarLink() {
    const start = new Date(CONFIG.weddingDateTimeISO);
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // default 3h duration

    const fmt = (d) =>
      d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const title = `Pernikahan ${CONFIG.groom.nickname} & ${CONFIG.bride.nickname}`;
    const details = `Undangan pernikahan ${CONFIG.groom.fullName} & ${CONFIG.bride.fullName}.`;
    const location = CONFIG.venue.address;

    const url = new URL("https://calendar.google.com/calendar/render");
    url.searchParams.set("action", "TEMPLATE");
    url.searchParams.set("text", title);
    url.searchParams.set("dates", `${fmt(start)}/${fmt(end)}`);
    url.searchParams.set("details", details);
    url.searchParams.set("location", location);

    document.getElementById("calendarLink").href = url.toString();
  }

  /* ---------------------------------------------------------
     3. Countdown timer
  --------------------------------------------------------- */
  function startCountdown() {
    const target = new Date(CONFIG.weddingDateTimeISO).getTime();
    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      mins: document.getElementById("cd-mins"),
      secs: document.getElementById("cd-secs"),
    };

    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        els.days.textContent = "00";
        els.hours.textContent = "00";
        els.mins.textContent = "00";
        els.secs.textContent = "00";
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      els.days.textContent = String(d).padStart(2, "0");
      els.hours.textContent = String(h).padStart(2, "0");
      els.mins.textContent = String(m).padStart(2, "0");
      els.secs.textContent = String(s).padStart(2, "0");
    }
    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     4. RSVP radio toggle styling
  --------------------------------------------------------- */
  function wireAttendanceToggle() {
    const row = document.getElementById("attendanceRow");
    row.querySelectorAll(".radio-opt").forEach((label) => {
      label.addEventListener("click", () => {
        row.querySelectorAll(".radio-opt").forEach((l) => l.classList.remove("active"));
        label.classList.add("active");
      });
    });
  }

  /* ---------------------------------------------------------
     5. RSVP submission -> Google Apps Script
  --------------------------------------------------------- */
  function wireRsvpForm() {
    const form = document.getElementById("rsvpForm");
    const btn = document.getElementById("rsvpSubmit");
    const msg = document.getElementById("rsvpMsg");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.textContent = "";
      msg.className = "form-msg";

      const name = document.getElementById("rsvpName").value.trim();
      const attendance = form.querySelector('input[name="attendance"]:checked').value;
      const guests = document.getElementById("rsvpGuests").value || "1";
      const message = document.getElementById("rsvpMessage").value.trim();

      if (!name) {
        msg.textContent = "Mohon isi nama Anda terlebih dahulu.";
        msg.className = "form-msg err";
        return;
      }

      if (!CONFIG.scriptURL || CONFIG.scriptURL.startsWith("PASTE_")) {
        msg.textContent =
          "RSVP belum terhubung ke Google Sheets. Lihat README untuk menyelesaikan setup.";
        msg.className = "form-msg err";
        return;
      }

      btn.disabled = true;
      const originalLabel = btn.innerHTML;
      btn.textContent = "Mengirim…";

      try {
        // text/plain avoids a CORS preflight against Apps Script's /exec endpoint.
        const res = await fetch(CONFIG.scriptURL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({
            action: "rsvp",
            name,
            attendance,
            guests,
            message,
          }),
        });
        const data = await res.json();
        if (data && data.result === "success") {
          msg.textContent = "Terima kasih! RSVP Anda telah kami terima.";
          msg.className = "form-msg ok";
          form.reset();
          document.querySelectorAll(".radio-opt").forEach((l) => l.classList.remove("active"));
          document.querySelector('.radio-opt[data-val="Attending"]').classList.add("active");
          loadWishes(); // refresh wall immediately with the new wish
        } else {
          throw new Error((data && data.message) || "Unknown error");
        }
      } catch (err) {
        msg.textContent = "Terjadi kesalahan saat mengirim. Silakan coba lagi.";
        msg.className = "form-msg err";
        console.error(err);
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalLabel;
      }
    });
  }

  /* ---------------------------------------------------------
     6. Wedding wishes wall (poll Apps Script doGet)
  --------------------------------------------------------- */
  async function loadWishes() {
    const list = document.getElementById("wishesList");
    if (!CONFIG.scriptURL || CONFIG.scriptURL.startsWith("PASTE_")) return;

    try {
      const res = await fetch(`${CONFIG.scriptURL}?action=wishes`, { method: "GET" });
      const data = await res.json();
      if (!data || !Array.isArray(data.wishes)) return;

      if (data.wishes.length === 0) {
        list.innerHTML =
          '<p class="wishes-empty">Menjadi yang pertama mengirimkan doa untuk kedua mempelai. ✦</p>';
        return;
      }

      list.innerHTML = data.wishes
        .slice()
        .reverse()
        .map(
          (w) => `
          <div class="wish-card">
            <p class="wish-name">${escapeHtml(w.name)}<span class="wish-att">${
              w.attendance === "Attending" ? "Hadir" : "Tidak Hadir"
            }</span></p>
            <p class="wish-text">${escapeHtml(w.message || "")}</p>
          </div>`
        )
        .join("");
    } catch (err) {
      console.error("Failed to load wishes:", err);
    }
  }

  /* ---------------------------------------------------------
     7. Copy account number
  --------------------------------------------------------- */
  function wireCopyButton() {
    const btn = document.getElementById("copyAccount");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CONFIG.gift.accountNumber);
        btn.textContent = "Tersalin ✓";
        setTimeout(() => (btn.textContent = "Salin Nomor Rekening"), 1800);
      } catch {
        btn.textContent = "Gagal menyalin";
      }
    });
  }

  /* ---------------------------------------------------------
     8. Floating background music toggle
  --------------------------------------------------------- */
  function wireMusic() {
    const audio = document.getElementById("bgMusic");
    const btn = document.getElementById("musicToggle");
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
        btn.classList.remove("paused");
        btn.setAttribute("aria-pressed", "true");
      } else {
        audio.pause();
        btn.classList.add("paused");
        btn.setAttribute("aria-pressed", "false");
      }
    });
  }

  /* ---------------------------------------------------------
     9. Scroll reveal
  --------------------------------------------------------- */
  function wireReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  /* ---------------------------------------------------------
     Init
  --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    populateContent();
    buildCalendarLink();
    startCountdown();
    wireAttendanceToggle();
    wireRsvpForm();
    wireCopyButton();
    wireMusic();
    wireReveal();
    loadWishes();
    setInterval(loadWishes, CONFIG.wishesPollIntervalMs);
  });
})();
