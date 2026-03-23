(function () {
  var FA = window.FaceAssets;
  var BS = window.BuddiesStorage;
  if (!FA || !BS) return;

  var OPTIONS = FA.OPTIONS;
  var layerOrder = FA.layerOrder;

  var state = { eyes: 0, nose: 0, mouth: 0, cheeks: 0 };
  var buddyId = null;
  var ctx = null;

  function updateLayer(layer) {
    var opts = OPTIONS[layer];
    var idx = state[layer];
    var choice = opts[idx];
    var img = document.getElementById("part-" + layer);
    var readout = document.getElementById("readout-" + layer);
    if (!img || !readout) return;

    readout.textContent = choice.label;

    if (choice.src) {
      img.src = choice.src;
      img.alt = choice.label;
      img.hidden = false;
    } else {
      img.removeAttribute("src");
      img.alt = "";
      img.hidden = true;
    }
  }

  function cycle(layer, delta) {
    var opts = OPTIONS[layer];
    state[layer] = (state[layer] + delta + opts.length) % opts.length;
    updateLayer(layer);
  }

  function bindRow(layer, leftSel, rightSel) {
    var left = document.querySelector(leftSel);
    var right = document.querySelector(rightSel);
    if (left) {
      left.addEventListener("click", function () {
        cycle(layer, -1);
      });
    }
    if (right) {
      right.addEventListener("click", function () {
        cycle(layer, 1);
      });
    }
  }

  function persistFaceAndLeave() {
    if (!buddyId || !ctx) {
      window.location.href = "new.html";
      return;
    }
    var face = {
      eyes: state.eyes,
      nose: state.nose,
      mouth: state.mouth,
      cheeks: state.cheeks,
    };
    if (ctx.kind === "draft") {
      ctx.buddy.face = face;
      BS.saveDraft(ctx.buddy);
      window.location.href = "new.html";
    } else {
      ctx.buddy.face = face;
      BS.upsertSavedBuddy(ctx.buddy);
      window.location.href = "new.html?id=" + encodeURIComponent(buddyId);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var params = new URLSearchParams(window.location.search);
    buddyId = params.get("id");
    if (!buddyId) {
      window.location.href = "index.html";
      return;
    }

    ctx = BS.getBuddyOrDraft(buddyId);
    if (!ctx) {
      window.location.href = "index.html";
      return;
    }

    Object.assign(state, ctx.buddy.face || BS.emptyFace());

    var back = document.getElementById("customize-back");
    if (back) {
      if (ctx.kind === "draft") {
        back.href = "new.html";
      } else {
        back.href = "new.html?id=" + encodeURIComponent(buddyId);
      }
    }

    bindRow("eyes", ".lr-one", ".rr-one");
    bindRow("nose", ".lr-two", ".rr-two");
    bindRow("mouth", ".lr-three", ".rr-three");
    bindRow("cheeks", ".lr-four", ".rr-four");

    for (var i = 0; i < layerOrder.length; i++) {
      updateLayer(layerOrder[i]);
    }

    var saveBtn = document.querySelector(".save");
    if (saveBtn) {
      saveBtn.addEventListener("click", persistFaceAndLeave);
    }
  });
})();
