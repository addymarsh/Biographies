(function () {
  var BS = window.BuddiesStorage;
  var FA = window.FaceAssets;
  if (!BS || !FA) return;

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/"/g, "&quot;");
  }

  function faceStackHtml() {
    return (
      '<div class="face-stack face-stack--thumb" aria-hidden="true">' +
      '<img data-part="cheeks" alt="" hidden>' +
      '<img data-part="eyes" alt="" hidden>' +
      '<img data-part="nose" alt="" hidden>' +
      '<img data-part="mouth" alt="" hidden>' +
      "</div>"
    );
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.getElementById("buddy-grid");
    if (!grid) return;

    var buddies = BS.loadBuddies();
    var frag = document.createDocumentFragment();

    buddies.forEach(function (b) {
      var tile = document.createElement("a");
      tile.className = "buddy-tile";
      tile.href = "new.html?id=" + encodeURIComponent(b.id);

      var thumb = document.createElement("div");
      thumb.className = "buddy-thumb";
      thumb.innerHTML = faceStackHtml();
      FA.applyState(thumb.querySelector(".face-stack"), b.face, false);
      if (!FA.hasAnyFace(b.face)) {
        thumb.querySelector(".face-stack").style.display = "none";
      }

      var label = document.createElement("span");
      label.className = "buddy-name";
      label.textContent = b.name || "Buddy";

      tile.appendChild(thumb);
      tile.appendChild(label);
      frag.appendChild(tile);
    });

    var addWrap = document.createElement("div");
    addWrap.className = "add-wrap";
    addWrap.innerHTML =
      '<div class="add"><a href="new.html?new=1" aria-label="Add buddy">+</a></div>';
    frag.appendChild(addWrap);

    grid.appendChild(frag);
  });
})();
