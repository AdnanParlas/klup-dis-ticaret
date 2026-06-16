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

/* WhatsApp teklif */
document.getElementById("teklifBtn").addEventListener("click", function (e) {
  e.preventDefault();
  var msg = "Merhaba, " + origin.value + " → " + dest.value + " güzergâhı için en uygun nakliye teklifini almak istiyorum.";
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});
