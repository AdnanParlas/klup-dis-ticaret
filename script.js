/* ============================================================
   KLÜP Dış Ticaret - liman değiştir + WhatsApp Teklif Al
   Tek ayar: WHATSAPP_NUMBER (+ / 00 olmadan, örn: 905326534005)
   ============================================================ */
const WHATSAPP_NUMBER = "905326534005";

var TR = ["İstanbul","İzmir","Mersin","Kocaeli","Gemlik","Tekirdağ","Antalya","İskenderun","Samsun"];
var CN = ["Shanghai","Shenzhen","Ningbo","Qingdao","Guangzhou","Hong Kong","Yiwu"];

var route = document.getElementById("route");

function addGroup(label, builder) {
  var g = document.createElement("optgroup");
  g.label = label;
  builder(g);
  route.appendChild(g);
}
addGroup("Çin → Türkiye", function (g) {
  TR.forEach(function (city) {
    var o = document.createElement("option");
    o.value = "Çin → " + city;
    o.textContent = "Çin → " + city;
    g.appendChild(o);
  });
});
addGroup("Türkiye → Çin", function (g) {
  CN.forEach(function (city) {
    var o = document.createElement("option");
    o.value = "Türkiye → " + city;
    o.textContent = "Türkiye → " + city;
    g.appendChild(o);
  });
});

document.getElementById("teklifBtn").addEventListener("click", function (e) {
  e.preventDefault();
  var msg = "Merhaba, " + route.value + " güzergâhı için en uygun nakliye teklifini almak istiyorum.";
  window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(msg), "_blank", "noopener");
});
