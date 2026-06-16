/* ============================================================
   KLÜP Dış Ticaret - liman seç + Teklif Al (WhatsApp)
   Tek ayar: WHATSAPP_NUMBER (+ / 00 olmadan, örn: 905326534005)
   ============================================================ */
const WHATSAPP_NUMBER = "905326534005";

var CN = ["Shanghai","Ningbo","Shenzhen","Guangzhou","Qingdao","Xiamen","Tianjin","Dalian","Hong Kong","Yiwu"];
var TR = ["İstanbul (Ambarlı)","İstanbul (Haydarpaşa)","Kocaeli (Evyap)","Gemlik (Bursa)","Tekirdağ","İzmir (Alsancak)","Mersin","İskenderun","Antalya","Samsun"];

var origin = document.getElementById("origin");
var dest = document.getElementById("dest");
var direction = "cn-tr"; // cn-tr | tr-cn

function fill(select, list) {
  select.innerHTML = "";
  list.forEach(function (name) {
    var o = document.createElement("option");
    o.value = name; o.textContent = name;
    select.appendChild(o);
  });
}
function applyDirection() {
  if (direction === "cn-tr") { fill(origin, CN); fill(dest, TR); }
  else { fill(origin, TR); fill(dest, CN); }
}

document.querySelectorAll(".seg-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".seg-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    direction = btn.getAttribute("data-dir");
    applyDirection();
  });
});

document.getElementById("teklifBtn").addEventListener("click", function (e) {
  e.preventDefault();
  var msg = "Merhaba, " + origin.value + " → " + dest.value + " güzergâhı için en uygun nakliye teklifini almak istiyorum.";
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});

applyDirection();
