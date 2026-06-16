/* ============================================================
   KLÜP Dış Ticaret - tek ekran teklif aracı
   Tek ayar: WHATSAPP_NUMBER (+ / 00 olmadan, örn: 905326534005)
   ============================================================ */
const WHATSAPP_NUMBER = "905326534005";

/* Temel tarife (Shanghai ↔ İstanbul referans) */
var BASE = {
  fcl: { label: "🚢 Denizyolu (FCL)", price: 1250, min: 25, max: 30 },
  lcl: { label: "🚢 Denizyolu (LCL)", price: 760,  min: 28, max: 32 },
  air: { label: "✈️ Havayolu",        price: 4350, min: 5,  max: 7  }
};

/* Çin limanları */
var CN = [
  { name: "Shanghai", f: 1.00, d: 0 },
  { name: "Ningbo",   f: 1.01, d: 0 },
  { name: "Shenzhen", f: 1.03, d: 1 },
  { name: "Guangzhou",f: 1.04, d: 1 },
  { name: "Qingdao",  f: 1.06, d: 2 },
  { name: "Xiamen",   f: 1.05, d: 1 },
  { name: "Tianjin",  f: 1.08, d: 3 },
  { name: "Dalian",   f: 1.09, d: 3 },
  { name: "Hong Kong",f: 1.02, d: 1 },
  { name: "Yiwu",     f: 1.12, d: 2 }
];
/* Türkiye limanları */
var TR = [
  { name: "İstanbul (Ambarlı)",    f: 1.00, d: 0 },
  { name: "İstanbul (Haydarpaşa)", f: 1.01, d: 0 },
  { name: "Kocaeli (Evyap)",       f: 1.02, d: 1 },
  { name: "Gemlik (Bursa)",        f: 1.03, d: 1 },
  { name: "Tekirdağ",              f: 1.03, d: 1 },
  { name: "İzmir (Alsancak)",      f: 1.05, d: 2 },
  { name: "Mersin",                f: 1.08, d: 3 },
  { name: "İskenderun",            f: 1.10, d: 3 },
  { name: "Antalya",               f: 1.09, d: 3 },
  { name: "Samsun",                f: 1.12, d: 4 }
];

var origin = document.getElementById("origin");
var dest = document.getElementById("dest");
var originLabel = document.getElementById("originLabel");
var destLabel = document.getElementById("destLabel");
var results = document.getElementById("results");
var routeLine = document.getElementById("routeLine");
var priceList = document.getElementById("priceList");
var direction = "cn-tr"; // cn-tr | tr-cn

function fill(select, list) {
  select.innerHTML = "";
  list.forEach(function (p) {
    var o = document.createElement("option");
    o.value = p.name; o.textContent = p.name;
    select.appendChild(o);
  });
}
function fmt(n) {
  return "$" + String(Math.round(n / 5) * 5).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function find(list, name) {
  return list.find(function (x) { return x.name === name; }) || list[0];
}

function applyDirection() {
  if (direction === "cn-tr") {
    fill(origin, CN); fill(dest, TR);
    originLabel.textContent = "Çıkış (Çin)";
    destLabel.textContent = "Varış (Türkiye)";
  } else {
    fill(origin, TR); fill(dest, CN);
    originLabel.textContent = "Çıkış (Türkiye)";
    destLabel.textContent = "Varış (Çin)";
  }
  results.hidden = true; // yön değişince sonucu gizle
}

/* yön butonları */
document.querySelectorAll(".seg-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".seg-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    direction = btn.getAttribute("data-dir");
    applyDirection();
  });
});

/* fiyat al */
function currentLists() {
  return direction === "cn-tr" ? { o: CN, d: TR } : { o: TR, d: CN };
}
document.getElementById("priceBtn").addEventListener("click", function () {
  var lists = currentLists();
  var o = find(lists.o, origin.value);
  var d = find(lists.d, dest.value);

  routeLine.innerHTML = "<b>" + o.name + "</b> → <b>" + d.name + "</b>";
  priceList.innerHTML = "";
  ["fcl", "lcl", "air"].forEach(function (k) {
    var b = BASE[k];
    var price = b.price * o.f * d.f;
    var add = (k === "air") ? Math.round((o.d + d.d) / 3) : (o.d + d.d);
    var item = document.createElement("div");
    item.className = "price-item";
    item.innerHTML =
      '<div class="pi-left"><span class="pi-method">' + b.label + '</span>' +
      '<span class="pi-time">' + (b.min + add) + "-" + (b.max + add) + ' gün • kapıdan kapıya</span></div>' +
      '<span class="pi-price">' + fmt(price) + '</span>';
    priceList.appendChild(item);
  });
  results.hidden = false;
});

/* whatsapp */
document.getElementById("waBtn").addEventListener("click", function (e) {
  e.preventDefault();
  var lists = currentLists();
  var o = find(lists.o, origin.value).name;
  var d = find(lists.d, dest.value).name;
  var msg = "Merhaba, " + o + " → " + d + " güzergâhı için en uygun nakliye teklifini almak istiyorum.";
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});

/* başlat */
applyDirection();
