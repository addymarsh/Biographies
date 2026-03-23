(function () {
  var STORAGE_BUDDIES = "biographies_buddies_v1";
  var STORAGE_DRAFT = "biographies_draft_v1";

  function emptyFace() {
    return { eyes: 0, nose: 0, mouth: 0, cheeks: 0 };
  }

  function emptyBuddy(id) {
    return {
      id: id,
      name: "",
      age: "",
      height: "",
      hometown: "",
      birthday: "",
      met: "",
      phone: "",
      address: "",
      occupation: "",
      description: "",
      color: "",
      food: "",
      hobbies: "",
      book: "",
      movie: "",
      show: "",
      music: "",
      goals: "",
      fears: "",
      notes: "",
      face: emptyFace(),
    };
  }

  var FIELD_NAMES = [
    "name",
    "age",
    "height",
    "hometown",
    "birthday",
    "met",
    "phone",
    "address",
    "occupation",
    "description",
    "color",
    "food",
    "hobbies",
    "book",
    "movie",
    "show",
    "music",
    "goals",
    "fears",
    "notes",
  ];

  function loadBuddies() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_BUDDIES) || "[]");
    } catch (e) {
      return [];
    }
  }

  function saveBuddies(list) {
    localStorage.setItem(STORAGE_BUDDIES, JSON.stringify(list));
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(STORAGE_DRAFT);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function saveDraft(buddy) {
    localStorage.setItem(STORAGE_DRAFT, JSON.stringify(buddy));
  }

  function clearDraft() {
    localStorage.removeItem(STORAGE_DRAFT);
  }

  function newId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return "b_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  }

  function getBuddyById(id) {
    return loadBuddies().filter(function (b) {
      return b.id === id;
    })[0];
  }

  function getBuddyOrDraft(id) {
    if (!id) return null;
    var saved = getBuddyById(id);
    if (saved) return { kind: "saved", buddy: saved };
    var draft = loadDraft();
    if (draft && draft.id === id) return { kind: "draft", buddy: draft };
    return null;
  }

  function upsertSavedBuddy(buddy) {
    var list = loadBuddies();
    var i = -1;
    for (var j = 0; j < list.length; j++) {
      if (list[j].id === buddy.id) {
        i = j;
        break;
      }
    }
    if (i >= 0) list[i] = buddy;
    else list.push(buddy);
    saveBuddies(list);
  }

  function ensureDraft() {
    var d = loadDraft();
    if (d && d.id) return d;
    d = emptyBuddy(newId());
    saveDraft(d);
    return d;
  }

  function startFreshDraft() {
    var d = emptyBuddy(newId());
    saveDraft(d);
    return d;
  }

  window.BuddiesStorage = {
    FIELD_NAMES: FIELD_NAMES,
    emptyBuddy: emptyBuddy,
    emptyFace: emptyFace,
    loadBuddies: loadBuddies,
    saveBuddies: saveBuddies,
    loadDraft: loadDraft,
    saveDraft: saveDraft,
    clearDraft: clearDraft,
    newId: newId,
    getBuddyById: getBuddyById,
    getBuddyOrDraft: getBuddyOrDraft,
    upsertSavedBuddy: upsertSavedBuddy,
    ensureDraft: ensureDraft,
    startFreshDraft: startFreshDraft,
  };
})();
