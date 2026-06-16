/* ============================================================
   KLÜP Lojistik - script.js (mobil uygulama arayüzü)
   Tek ayar: aşağıdaki WHATSAPP_NUMBER.
   ============================================================ */

// Uluslararası format, + veya 00 OLMADAN. Örn: 905326534005
const WHATSAPP_NUMBER = "905326534005";

/* --- WhatsApp linkleri --- */
function openWhatsApp(msg) {
  var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg || "Merhaba, bilgi almak istiyorum.");
  window.open(url, "_blank", "noopener");
}
document.querySelectorAll(".js-whatsapp").forEach(function (el) {
  el.addEventListener("click", function (e) {
    e.preventDefault();
    openWhatsApp(el.getAttribute("data-msg"));
  });
});

/* ============================================================
   LİMANA GÖRE FİYAT HESAPLAYICI
   ============================================================ */
var BASE = {
  fcl: { price: 1250, min: 25, max: 30 },
  lcl: { price: 760,  min: 28, max: 32 },
  air: { price: 4350, min: 5,  max: 7  }
};
var ORIGINS = [
  { id: "shanghai",  name: "Shanghai", f: 1.00, d: 0 },
  { id: "ningbo",    name: "Ningbo",   f: 1.01, d: 0 },
  { id: "shenzhen",  name: "Shenzhen", f: 1.03, d: 1 },
  { id: "guangzhou", name: "Guangzhou",f: 1.04, d: 1 },
  { id: "qingdao",   name: "Qingdao",  f: 1.06, d: 2 },
  { id: "xiamen",    name: "Xiamen",   f: 1.05, d: 1 },
  { id: "tianjin",   name: "Tianjin",  f: 1.08, d: 3 },
  { id: "dalian",    name: "Dalian",   f: 1.09, d: 3 },
  { id: "hongkong",  name: "Hong Kong",f: 1.02, d: 1 },
  { id: "yiwu",      name: "Yiwu",     f: 1.12, d: 2 }
];
var DESTS = [
  { id: "ambarli",    name: "İstanbul (Ambarlı)",     f: 1.00, d: 0 },
  { id: "haydarpasa", name: "İstanbul (Haydarpaşa)",  f: 1.01, d: 0 },
  { id: "kocaeli",    name: "Kocaeli (Evyap)",        f: 1.02, d: 1 },
  { id: "gemlik",     name: "Gemlik (Bursa)",         f: 1.03, d: 1 },
  { id: "tekirdag",   name: "Tekirdağ",               f: 1.03, d: 1 },
  { id: "izmir",      name: "İzmir (Alsancak)",       f: 1.05, d: 2 },
  { id: "mersin",     name: "Mersin",                 f: 1.08, d: 3 },
  { id: "iskenderun", name: "İskenderun",             f: 1.10, d: 3 },
  { id: "antalya",    name: "Antalya",                f: 1.09, d: 3 },
  { id: "samsun",     name: "Samsun",                 f: 1.12, d: 4 }
];

function fmtPrice(n) {
  var s = String(Math.round(n / 5) * 5);
  return "$" + s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function buildOptions(select, list) {
  list.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p.id; o.textContent = p.name;
    select.appendChild(o);
  });
}
function calcRow(base, o, d, isAir) {
  var price = base.price * o.f * d.f;
  var add = isAir ? Math.round((o.d + d.d) / 3) : (o.d + d.d);
  return { price: price, min: base.min + add, max: base.max + add };
}
function renderPrices() {
  var oSel = document.getElementById("originPort");
  var dSel = document.getElementById("destPort");
  var body = document.getElementById("priceBody");
  var summary = document.getElementById("routeSummary");
  if (!oSel || !dSel || !body) return;

  var o = ORIGINS.find(function (x){ return x.id === oSel.value; }) || ORIGINS[0];
  var d = DESTS.find(function (x){ return x.id === dSel.value; }) || DESTS[0];

  var rows = [
    { key: "fcl", label: "🚢 Denizyolu (FCL)",  air: false },
    { key: "lcl", label: "🚢 Denizyolu (LCL)",  air: false },
    { key: "air", label: "✈️ Havayolu",         air: true }
  ];

  body.innerHTML = "";
  rows.forEach(function (r) {
    var c = calcRow(BASE[r.key], o, d, r.air);
    var msg = "Merhaba, " + o.name + " → " + d.name + " güzergâhı için " + r.label.replace(/^\S+\s/, "") + " teklifi almak istiyorum.";
    var row = document.createElement("div");
    row.className = "price-row";
    row.innerHTML =
      '<div><div class="pr-method">' + r.label + '</div><div class="pr-time">' + c.min + '-' + c.max + ' gün • kapıdan kapıya</div></div>' +
      '<div class="pr-price">' + fmtPrice(c.price) + '</div>' +
      '<button class="pr-btn">Teklif Al</button>';
    row.querySelector(".pr-btn").addEventListener("click", function(){ openWhatsApp(msg); });
    body.appendChild(row);
  });

  if (summary) summary.innerHTML = "<b>" + o.name + "</b> <span>→</span> <b>" + d.name + "</b>";
}
(function initPricing(){
  var oSel = document.getElementById("originPort");
  var dSel = document.getElementById("destPort");
  if (!oSel || !dSel) return;
  buildOptions(oSel, ORIGINS);
  buildOptions(dSel, DESTS);
  oSel.addEventListener("change", renderPrices);
  dSel.addEventListener("change", renderPrices);
  renderPrices();
})();

/* --- Beğeni (kalp) --- */
var likeBtn = document.querySelector(".js-like");
var likeCount = document.getElementById("likeCount");
if (likeBtn) {
  likeBtn.addEventListener("click", function(){
    var liked = likeBtn.classList.toggle("liked");
    if (likeCount) likeCount.textContent = liked ? 129 : 128;
  });
}
var fav2 = document.querySelector(".js-like-2");
if (fav2) fav2.addEventListener("click", function(){ fav2.classList.toggle("liked"); });

/* --- Mute (görsel) --- */
var muteBtn = document.getElementById("muteBtn");
if (muteBtn) muteBtn.addEventListener("click", function(){ muteBtn.style.opacity = muteBtn.style.opacity === "0.5" ? "1" : "0.5"; });

/* --- Play / More → teklif --- */
var playBtn = document.getElementById("playBtn");
if (playBtn) playBtn.addEventListener("click", function(){ openWhatsApp("Merhaba, Shanghai → İstanbul LCL hattı hakkında bilgi ve teklif almak istiyorum."); });
var moreBtn = document.getElementById("moreBtn");
if (moreBtn) moreBtn.addEventListener("click", function(){ document.getElementById("fiyatlar").scrollIntoView(); });

/* --- Alt menü aktiflik (scroll'a göre) --- */
var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab[data-tab]"));
var targets = tabs.map(function(t){ return document.querySelector(t.getAttribute("href")); });
function setActiveTab() {
  var y = window.scrollY + 160;
  var idx = 0;
  targets.forEach(function(sec, i){ if (sec && sec.offsetTop <= y) idx = i; });
  tabs.forEach(function(t, i){ t.classList.toggle("active", i === idx); });
}
window.addEventListener("scroll", setActiveTab, { passive: true });
setActiveTab();

/* --- Arama → odak teklif (basit) --- */
var searchInput = document.getElementById("searchInput");
var filterBtn = document.getElementById("filterBtn");
if (filterBtn) filterBtn.addEventListener("click", function(){ document.getElementById("fiyatlar").scrollIntoView(); });
if (searchInput) searchInput.addEventListener("keydown", function(e){
  if (e.key === "Enter") openWhatsApp('Merhaba, "' + searchInput.value + '" için nakliye teklifi almak istiyorum.');
});

/* --- Status bar saati --- */
var sbTime = document.getElementById("sbTime");
function tick() {
  if (!sbTime) return;
  var n = new Date();
  sbTime.textContent = n.getHours() + ":" + String(n.getMinutes()).padStart(2, "0");
}
tick(); setInterval(tick, 30000);

/* --- Yıl --- */
var yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
