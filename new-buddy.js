(function () {
  var BS = window.BuddiesStorage;
  var FA = window.FaceAssets;
  if (!BS || !FA) return;

  var mode = "draft";
  var buddy = null;

  function getTextarea(name) {
    return document.querySelector('textarea[name="' + name + '"]');
  }

  function buddyFromForm() {
    var b = JSON.parse(JSON.stringify(buddy));
    BS.FIELD_NAMES.forEach(function (field) {
      var el = getTextarea(field);
      if (el) b[field] = el.value.trim();
    });
    return b;
  }

  function fillForm(b) {
    BS.FIELD_NAMES.forEach(function (field) {
      var el = getTextarea(field);
      if (el) el.value = b[field] || "";
    });
  }

  function updateCustomizeLink() {
    var a = document.querySelector(".chara-customize-link");
    if (a && buddy) {
      a.href = "customize.html?id=" + encodeURIComponent(buddy.id);
    }
  }

  function renderCharaPreview() {
    var stack = document.querySelector(".chara .face-stack--thumb");
    var hint = document.querySelector(".chara-hint");
    if (!buddy || !stack) return;
    FA.applyState(stack, buddy.face, false);
    var showFace = FA.hasAnyFace(buddy.face);
    if (hint) {
      hint.style.display = showFace ? "none" : "";
    }
    stack.style.display = showFace ? "" : "none";
  }

  function saveBuddy() {
    buddy = buddyFromForm();
    BS.upsertSavedBuddy(buddy);
    if (mode === "draft") {
      BS.clearDraft();
    }
    window.location.href = "index.html";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);

    if (params.get("new") === "1") {
      buddy = BS.startFreshDraft();
      mode = "draft";
      window.history.replaceState({}, "", "new.html");
    } else if (params.get("id")) {
      var id = params.get("id");
      var saved = BS.getBuddyById(id);
      if (!saved) {
        window.location.href = "index.html";
        return;
      }
      buddy = JSON.parse(JSON.stringify(saved));
      mode = "saved";
    } else {
      buddy = BS.ensureDraft();
      mode = "draft";
    }

    fillForm(buddy);
    updateCustomizeLink();
    renderCharaPreview();

    var saveBtn = document.querySelector(".head .save");
    if (saveBtn) {
      saveBtn.addEventListener("click", saveBuddy);
    }
  });
})();
