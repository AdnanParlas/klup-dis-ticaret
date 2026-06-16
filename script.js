/* ============================================================
   KLÜP Dış Ticaret - script.js
   Sunucusuz / statik. Tek ayar: aşağıdaki WHATSAPP_NUMBER.
   ============================================================ */

// ⚠️ BURAYI KENDİ NUMARANIZLA DEĞİŞTİRİN
// Uluslararası format, başında + veya 00 OLMADAN. Örn. Türkiye: 905xxxxxxxxx
const WHATSAPP_NUMBER = "905326534005";

/* --- WhatsApp linklerini kur --- */
document.querySelectorAll(".js-whatsapp").forEach(function (el) {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    var msg = el.getAttribute("data-msg") || "Merhaba, bilgi almak istiyorum.";
    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  });
});

/* ============================================================
   LİMANA GÖRE FİYAT HESAPLAYICI
   Fiyatlar tahmini/referans amaçlıdır. Çarpanları buradan ayarlayın.
   ============================================================ */

// Referans güzergâh: Shanghai -> İstanbul (görseldeki örnek fiyatlar)
var BASE = {
  fcl: { price: 1250, min: 25, max: 30 }, // Denizyolu komple
  lcl: { price: 760,  min: 28, max: 32 }, // Denizyolu parsiyel
  air: { price: 4350, min: 5,  max: 7  }  // Havayolu
};

// Çin çıkış limanları: fiyat çarpanı + denizyoluna eklenen gün
var ORIGINS = [
  { id: "shanghai",  name: "Shanghai (Şanghay)", f: 1.00, d: 0 },
  { id: "ningbo",    name: "Ningbo",             f: 1.01, d: 0 },
  { id: "shenzhen",  name: "Shenzhen (Şenzen)",  f: 1.03, d: 1 },
  { id: "guangzhou", name: "Guangzhou",          f: 1.04, d: 1 },
  { id: "qingdao",   name: "Qingdao (Çingdao)",  f: 1.06, d: 2 },
  { id: "xiamen",    name: "Xiamen (Şiamen)",    f: 1.05, d: 1 },
  { id: "tianjin",   name: "Tianjin (Tiencin)",  f: 1.08, d: 3 },
  { id: "dalian",    name: "Dalian",             f: 1.09, d: 3 },
  { id: "hongkong",  name: "Hong Kong",          f: 1.02, d: 1 },
  { id: "yiwu",      name: "Yiwu (iç bölge)",    f: 1.12, d: 2 }
];

// Türkiye varış limanları: fiyat çarpanı + denizyoluna eklenen gün
var DESTS = [
  { id: "ambarli",    name: "İstanbul (Ambarlı)",       f: 1.00, d: 0 },
  { id: "haydarpasa", name: "İstanbul (Haydarpaşa)",    f: 1.01, d: 0 },
  { id: "kocaeli",    name: "Kocaeli (Körfez/Evyap)",   f: 1.02, d: 1 },
  { id: "gemlik",     name: "Gemlik (Bursa)",           f: 1.03, d: 1 },
  { id: "tekirdag",   name: "Tekirdağ",                 f: 1.03, d: 1 },
  { id: "izmir",      name: "İzmir (Alsancak)",         f: 1.05, d: 2 },
  { id: "mersin",     name: "Mersin",                   f: 1.08, d: 3 },
  { id: "iskenderun", name: "İskenderun",               f: 1.10, d: 3 },
  { id: "antalya",    name: "Antalya",                  f: 1.09, d: 3 },
  { id: "samsun",     name: "Samsun",                   f: 1.12, d: 4 }
];

function fmtPrice(n) {
  return "$" + Math.round(n / 5) * 5; // en yakın 5'e yuvarla
}
function withThousands(s) {
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function buildOptions(select, list) {
  list.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p.id; o.textContent = p.name;
    select.appendChild(o);
  });
}

function calcRow(base, oFactor, dFactor, oDays, dDays, airDays) {
  var price = base.price * oFactor * dFactor;
  var min = base.min + (airDays ? 0 : oDays + dDays);
  var max = base.max + (airDays ? 0 : oDays + dDays);
  // hava için günlere küçük ekleme
  if (airDays) { min += Math.round((oDays + dDays) / 3); max += Math.round((oDays + dDays) / 3); }
  return { price: price, min: min, max: max };
}

function renderPrices() {
  var oSel = document.getElementById("originPort");
  var dSel = document.getElementById("destPort");
  var body = document.getElementById("priceBody");
  var summary = document.getElementById("routeSummary");
  if (!oSel || !dSel || !body) return;

  var o = ORIGINS.find(function (x) { return x.id === oSel.value; }) || ORIGINS[0];
  var d = DESTS.find(function (x) { return x.id === dSel.value; }) || DESTS[0];

  var rows = [
    { key: "fcl", label: "🚢 Denizyolu (FCL - Komple)", air: false },
    { key: "lcl", label: "🚢 Denizyolu (LCL - Parsiyel)", air: false },
    { key: "air", label: "✈️ Havayolu", air: true }
  ];

  body.innerHTML = "";
  rows.forEach(function (r) {
    var c = calcRow(BASE[r.key], o.f, d.f, o.d, d.d, r.air);
    var priceStr = withThousands(fmtPrice(c.price));
    var msg = "Merhaba, " + o.name + " -> " + d.name + " güzergâhı için " +
              r.label.replace(/^[^\s]+\s/, "") + " teklifi almak istiyorum.";
    var tr = document.createElement("tr");
    tr.innerHTML =
      '<td data-label="Yöntem">' + r.label + '</td>' +
      '<td data-label="Süre">' + c.min + '-' + c.max + ' gün</td>' +
      '<td data-label="Fiyat">' + priceStr + '</td>' +
      '<td><a href="#" class="btn btn-outline btn-xs js-whatsapp-dyn">Teklif Al</a></td>';
    tr.querySelector(".js-whatsapp-dyn").addEventListener("click", function (e) {
      e.preventDefault();
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
    });
    body.appendChild(tr);
  });

  if (summary) {
    summary.innerHTML = "<strong>" + o.name + "</strong> <span>→</span> <strong>" + d.name + "</strong>";
  }
}

(function initPricing() {
  var oSel = document.getElementById("originPort");
  var dSel = document.getElementById("destPort");
  if (!oSel || !dSel) return;
  buildOptions(oSel, ORIGINS);
  buildOptions(dSel, DESTS);
  oSel.addEventListener("change", renderPrices);
  dSel.addEventListener("change", renderPrices);
  renderPrices();
})();

/* --- Mobil menü --- */
var navToggle = document.getElementById("navToggle");
var nav = document.getElementById("nav");
if (navToggle && nav) {
  navToggle.addEventListener("click", function () {
    nav.classList.toggle("open");
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      nav.classList.remove("open");
    });
  });
}

/* --- Scroll reveal --- */
var sections = document.querySelectorAll(".section");
if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  sections.forEach(function (s) { io.observe(s); });
} else {
  sections.forEach(function (s) { s.classList.add("in-view"); });
}

/* --- Yıl --- */
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
