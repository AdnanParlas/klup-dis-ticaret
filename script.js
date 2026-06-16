/* ============================================================
   KLÜP Dış Ticaret - liman seç (Çin+Türkiye, yer değiştirilebilir) + WhatsApp
   Tek ayar: WHATSAPP_NUMBER (+ / 00 olmadan, örn: 905326534005)
   ============================================================ */
const WHATSAPP_NUMBER = "905326534005";

var CN = ["Shanghai","Shenzhen","Ningbo","Qingdao","Guangzhou","Hong Kong","Xiamen","Tianjin","Dalian","Yiwu"];
var TR = ["İstanbul","İzmir","Mersin","Kocaeli","Gemlik","Tekirdağ","Antalya","İskenderun","Samsun"];

var origin = document.getElementById("origin");
var dest = document.getElementById("dest");

/* Her iki seçiciye de Çin + Türkiye limanlarını ekle */
function fillAll(select) {
  select.innerHTML = "";
  [["🇨🇳 Çin", CN], ["🇹🇷 Türkiye", TR]].forEach(function (grp) {
    var g = document.createElement("optgroup");
    g.label = grp[0];
    grp[1].forEach(function (city) {
      var o = document.createElement("option");
      o.value = city; o.textContent = city;
      g.appendChild(o);
    });
    select.appendChild(g);
  });
}
fillAll(origin);
fillAll(dest);

/* Varsayılan: Shanghai → İstanbul */
origin.value = "Shanghai";
dest.value = "İstanbul";

/* Limanların yerini değiştir (swap) */
document.getElementById("swap").addEventListener("click", function () {
  var t = origin.value;
  origin.value = dest.value;
  dest.value = t;
});

/* ============ TEKLİF FORMU (ADIMLI SLIDER) ============ */
var modal = document.getElementById("modal");
var track = document.getElementById("track");
var dotsWrap = document.getElementById("dots");
var stepBack = document.getElementById("stepBack");
var slides = track.querySelectorAll(".slide");
var QUESTION_COUNT = 3;          // soru sayısı (son slayt: özet/gönder)
var TOTAL = slides.length;       // 4
var step = 0;
var answers = { ithalat: null, konteyner: null, zaman: null };

/* ilerleme noktaları (soru sayısı kadar) */
for (var i = 0; i < QUESTION_COUNT; i++) {
  var d = document.createElement("span");
  d.className = "dot";
  dotsWrap.appendChild(d);
}
var dots = dotsWrap.querySelectorAll(".dot");

function goTo(i) {
  step = Math.max(0, Math.min(TOTAL - 1, i));
  track.style.transform = "translateX(" + (-step * 100) + "%)";
  stepBack.hidden = (step === 0);
  dots.forEach(function (dot, idx) { dot.classList.toggle("active", idx === Math.min(step, QUESTION_COUNT - 1)); });
}

function openModal() { modal.hidden = false; goTo(0); }
function closeModal() { modal.hidden = true; }

document.getElementById("teklifBtn").addEventListener("click", function (e) {
  e.preventDefault();
  openModal();
});
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
stepBack.addEventListener("click", function () { goTo(step - 1); });

/* şık seçimi → cevabı kaydet ve sonraki adıma kay */
document.querySelectorAll(".q").forEach(function (q) {
  var key = q.getAttribute("data-q");
  var slideIndex = Array.prototype.indexOf.call(slides, q.closest(".slide"));
  q.querySelectorAll(".opt").forEach(function (opt) {
    opt.addEventListener("click", function () {
      q.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("sel"); });
      opt.classList.add("sel");
      answers[key] = opt.getAttribute("data-val");
      setTimeout(function () { goTo(slideIndex + 1); }, 260);
    });
  });
});

/* gönder → cevaplarla WhatsApp'a yönlendir */
document.getElementById("modalSubmit").addEventListener("click", function () {
  var msg =
    "Merhaba, " + origin.value + " → " + dest.value + " güzergâhı için fiyat teklifi almak istiyorum.\n\n" +
    "• Aktif ithalat: " + (answers.ithalat || "-") + "\n" +
    "• Yıllık konteyner: " + (answers.konteyner || "-") + "\n" +
    "• Sevkiyat zamanı: " + (answers.zaman || "-");
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  closeModal();
});
