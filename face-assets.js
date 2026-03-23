(function () {
  const numberWords = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];

  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function buildOptions(folder, filePrefix, words) {
    const opts = [{ key: "none", label: "None", src: null }];
    for (const w of words) {
      opts.push({
        key: `${filePrefix}-${w}`,
        label: capitalize(w),
        src: `${folder}/${filePrefix}-${w}.png`,
      });
    }
    return opts;
  }

  const OPTIONS = {
    eyes: buildOptions("eyes", "eyes", numberWords),
    nose: buildOptions("nose", "nose", numberWords),
    mouth: buildOptions("mouth", "mouth", numberWords.slice(0, 7)),
    cheeks: buildOptions("cheeks", "cheeks", numberWords.slice(0, 2)),
  };

  const layerOrder = ["cheeks", "eyes", "nose", "mouth"];

  function getChoice(layer, index) {
    const opts = OPTIONS[layer];
    const idx = Math.max(0, Math.min(index | 0, opts.length - 1));
    return opts[idx];
  }

  /**
   * Apply face indices to imgs inside stackEl (data-part="cheeks"|"eyes"|"nose"|"mouth")
   * or to customize page ids part-* when stackEl is null and useIds true.
   */
  function applyState(stackEl, faceState, useIds) {
    const state = Object.assign(
      { eyes: 0, nose: 0, mouth: 0, cheeks: 0 },
      faceState || {}
    );
    for (const layer of layerOrder) {
      const choice = getChoice(layer, state[layer]);
      let img;
      if (useIds) {
        img = document.getElementById(`part-${layer}`);
      } else if (stackEl) {
        img = stackEl.querySelector(`[data-part="${layer}"]`);
      }
      if (!img) continue;
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
  }

  function hasAnyFace(faceState) {
    if (!faceState) return false;
    return layerOrder.some((layer) => (faceState[layer] | 0) > 0);
  }

  window.FaceAssets = {
    OPTIONS,
    layerOrder,
    getChoice,
    applyState,
    hasAnyFace,
  };
})();
