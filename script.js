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

/* ============ TEKLİF FORMU (MODAL) ============ */
var modal = document.getElementById("modal");
var modalSubmit = document.getElementById("modalSubmit");
var answers = { ithalat: null, konteyner: null, zaman: null };

function openModal() { modal.hidden = false; }
function closeModal() { modal.hidden = true; }

/* Teklif Al → formu aç */
document.getElementById("teklifBtn").addEventListener("click", function (e) {
  e.preventDefault();
  openModal();
});

/* Kapatma (çarpı veya arka plana tıklama) */
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });

/* Şık seçimi (her soruda tek seçim) */
document.querySelectorAll(".q").forEach(function (q) {
  var key = q.getAttribute("data-q");
  q.querySelectorAll(".opt").forEach(function (opt) {
    opt.addEventListener("click", function () {
      q.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("sel"); });
      opt.classList.add("sel");
      answers[key] = opt.getAttribute("data-val");
      modalSubmit.disabled = !(answers.ithalat && answers.konteyner && answers.zaman);
    });
  });
});

/* Gönder → cevaplarla WhatsApp'a yönlendir */
modalSubmit.addEventListener("click", function () {
  if (modalSubmit.disabled) return;
  var msg =
    "Merhaba, " + origin.value + " → " + dest.value + " güzergâhı için fiyat teklifi almak istiyorum.\n\n" +
    "• Aktif ithalat: " + answers.ithalat + "\n" +
    "• Yıllık konteyner: " + answers.konteyner + "\n" +
    "• Sevkiyat zamanı: " + answers.zaman;
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  closeModal();
});
