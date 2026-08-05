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
    fullName: "Adjie Prayogo Kurniawan S.Kom",
    nickname: "Gonjol",
    father: "Heryanto (Bogeng)",
    mother: "Hayati (Mamah Adjie)",
    childOrder: "Putra pertama dari", // "Son of" prefix, edit as needed
    photo: "assets/groom.jpg"
  },
  bride: {
    fullName: "Aliyah Nurhasanah",
    nickname: "Liyot",
    father: "", // fill in bride's father's name
    mother: "", // fill in bride's mother's name
    childOrder: "Putri pertama dari",
    photo: "assets/bride.jpg"
  },
  couplePhoto: "assets/couple.jpg",

  // ---- Date & Time ---------------------------------------------
  // ISO 8601 with timezone offset. Asia/Jakarta = +07:00 (WIB).
  weddingDateTimeISO: "2027-05-22T09:00:00+07:00",
  weddingDateDisplay: "22 Mei 2027",
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
    bankName: "Bank (isi nama bank)",
    accountNumber: "1730010863422",
    accountHolder: "Isi nama pemegang rekening",
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
  scriptURL: https://script.google.com/macros/s/AKfycbyWNg7QOpyO1TtjXVtvborFAz_hk-jsID4XNe0PQQcjelv5Pp1B1SojNMUqmyUFCmf5KQ/exec,

  // How often (ms) to refresh the wishes wall from the Sheet.
  wishesPollIntervalMs: 15000,

  // ---- Guest name from URL (optional personalization) ------------
  // Invitation links can be shared as page.html?to=Nama%20Tamu
  // and the cover will greet that guest by name.
  guestParamName: "to"
};
