/* ============================================================
   KLÜP Dış Ticaret - Hızlı Teklif Al
   Tek ayar: WHATSAPP_NUMBER (+ / 00 olmadan, örn: 905326534005)
   ============================================================ */
const WHATSAPP_NUMBER = "905326534005";

var CN = ["Shanghai","Shenzhen","Ningbo","Qingdao","Guangzhou","Hong Kong","Xiamen","Tianjin","Dalian","Yiwu"];
var TR = ["İstanbul","İzmir","Mersin","Kocaeli","Gemlik","Tekirdağ","Antalya","İskenderun","Samsun"];

var origin = document.getElementById("origin");
var dest = document.getElementById("dest");

function fill(select, list) {
  select.innerHTML = "";
  list.forEach(function (name) {
    var o = document.createElement("option");
    o.value = name; o.textContent = name;
    select.appendChild(o);
  });
}
fill(origin, CN); origin.value = "Shanghai";
fill(dest, TR);   dest.value = "İstanbul";

/* ---- Yük tipi (konteyner) ---- */
var cargo = "40'";
document.querySelectorAll("#cargo button").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll("#cargo button").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    cargo = btn.getAttribute("data-cargo");
  });
});

/* ============ TEKLİF FORMU (KOŞULLU AKIŞ) ============ */
var modal = document.getElementById("modal");
var dotsWrap = document.getElementById("dots");
var stepsTop = document.querySelector(".steps-top");
var stepBack = document.getElementById("stepBack");

/* slaytları data-step ile eşle */
var STEP = {};
document.querySelectorAll(".slide").forEach(function (s) { STEP[s.getAttribute("data-step")] = s; });

/* soru adımlarının ilerleme noktası indeksi (final/disq hariç) */
var DOT_INDEX = { yuk: 0, zaman: 1, karar: 2, konteyner: 2 };
var DOT_COUNT = 3;
for (var i = 0; i < DOT_COUNT; i++) {
  var d = document.createElement("span"); d.className = "dot"; dotsWrap.appendChild(d);
}
var dots = dotsWrap.querySelectorAll(".dot");

var current = "yuk";
var histStack = [];
var answers = { yuk: null, zaman: null, karar: null, konteyner: null };

function render(id) {
  Object.keys(STEP).forEach(function (k) { STEP[k].classList.remove("active"); });
  STEP[id].classList.add("active");
  current = id;
  var isQ = DOT_INDEX.hasOwnProperty(id);
  stepsTop.style.display = isQ ? "" : "none";
  stepBack.hidden = (histStack.length === 0);
  if (isQ) dots.forEach(function (dot, idx) { dot.classList.toggle("active", idx === DOT_INDEX[id]); });
}
function go(id) { histStack.push(current); render(id); }

function openModal() {
  histStack = [];
  answers = { yuk: null, zaman: null, karar: null, konteyner: null };
  document.querySelectorAll(".opt.sel").forEach(function (o) { o.classList.remove("sel"); });
  modal.hidden = false;
  render("yuk");
}
function closeModal() { modal.hidden = true; }

document.getElementById("teklifBtn").addEventListener("click", function (e) {
  e.preventDefault(); openModal();
});
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
document.getElementById("closeDisq").addEventListener("click", closeModal);
stepBack.addEventListener("click", function () {
  if (histStack.length) render(histStack.pop());
});

/* sonraki adımı belirle (koşullu) */
function nextStep(stepId, val) {
  if (stepId === "yuk")  return (val === "Sadece fiyat öğreniyorum") ? "disq" : "zaman";
  if (stepId === "zaman") return "karar";
  if (stepId === "karar") return (val === "Sadece bilgi topluyorum") ? "final" : "konteyner";
  if (stepId === "konteyner") return "final";
  return "final";
}

document.querySelectorAll(".q").forEach(function (q) {
  var key = q.getAttribute("data-q");
  q.querySelectorAll(".opt").forEach(function (opt) {
    opt.addEventListener("click", function () {
      q.querySelectorAll(".opt").forEach(function (o) { o.classList.remove("sel"); });
      opt.classList.add("sel");
      var val = opt.getAttribute("data-val");
      answers[key] = val;
      setTimeout(function () { go(nextStep(key, val)); }, 260);
    });
  });
});

document.getElementById("modalSubmit").addEventListener("click", function () {
  var msg =
    "Merhaba, " + origin.value + " → " + dest.value + " güzergâhı için fiyat teklifi almak istiyorum.\n\n" +
    "• Yük tipi: " + cargo + "\n" +
    "• Yük durumu: " + (answers.yuk || "-") + "\n" +
    "• Sevkiyat zamanı: " + (answers.zaman || "-") + "\n" +
    "• Karar verici: " + (answers.karar || "-") +
    (answers.konteyner ? "\n• Yıllık konteyner: " + answers.konteyner : "");
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
  closeModal();
});
