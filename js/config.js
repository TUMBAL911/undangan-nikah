/**
 * ============================================================
 *  WEDDING INVITATION — EDITABLE CONFIG
 * ------------------------------------------------------------
 *  This is the ONLY file you need to touch to update the
 *  invitation with real details, a new Apps Script URL, etc.
 *  Nothing else in the site needs to change.
 * ============================================================
 */
const CONFIG = {

  // ---- Couple -------------------------------------------------
groom: {
    name: "Adjie Prayogo Kurniawan S.Kom",
    nickname: "(Gonjol)",
    photo: "assets/groom.jpg",
    parents: "Putra dari Bapak Heryanto (Bogeng) & Ibu Hayati (Mamah Adjie)",
    father: "Heryanto (Bogeng)",
    mother: "Hayati (Mamah Adjie)",
    childOrder: "Putra dari"
  },
  bride: {
    name: "Aliyah Nurhasanah",
    nickname: "(Liyot)",
    photo: "assets/bride.jpg",
    parents: "Putri dari Bapak Rohmat & Ibu Juju",
    father: "Rohmat",
    mother: "Juju",
    childOrder: "Putri dari"
  },
  couplePhoto: "assets/couple.jpg",

  // ---- Date & Time ---------------------------------------------
  // ISO 8601 with timezone offset. Asia/Jakarta = +07:00 (WIB).
  weddingDateTimeISO: "2027-05-01T09:00:00",
  weddingDateDisplay: "1 Mei 2027",
  weddingTimeDisplay: "09:00 WIB – selesai",

  // ---- Venue -----------------------------------------------------
  venue: {
    name: "Kediaman Mempelai",
    address: "RT.01/RW.04, Jatibaru, Kec. Ciasem, Kabupaten Subang, Jawa Barat 41256",
    // Get this by searching the address on Google Maps, clicking "Share",
    // and pasting the short link OR the full maps.google.com URL here.
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=RT.01%2FRW.04%2C+Jatibaru%2C+Kec.+Ciasem%2C+Kabupaten+Subang%2C+Jawa+Barat+41256"
  },

  // ---- Gift / Kado -------------------------------------------
  gift: {
    bankName: "BRI",
    accountNumber: "1730010863422",
    accountHolder: "Aliyah Nurhasanh",
    deliveryAddress: "RT.01/RW.04, Jatibaru, Kec. Ciasem, Kabupaten Subang, Jawa Barat 41256"
  },

  // ---- Background music -----------------------------------------
  music: {
    src: "assets/music.mp3",
    title: "Coma Cole — Gonjol Remix"
  },

  // ---- Google Apps Script Web App URL --------------------------
  // 1. Follow apps-script/README (or the main README) to deploy Code.gs
  // 2. Paste the /exec URL you get here, exactly as given.
rsvpUrl: "https://script.google.com/macros/s/AKfycbz1fEu2gM-JcNNG7VblmwIJJMZV0032FhGjwTKx4afjvlTGFq2iWQToM9ZNSEPZl8zl/exec",

  // How often (ms) to refresh the wishes wall from the Sheet.
  wishesPollIntervalMs: 15000,

  // ---- Guest name from URL (optional personalization) ------------
  // Invitation links can be shared as page.html?to=Nama%20Tamu
  // and the cover will greet that guest by name.
  guestParamName: "to"
};
