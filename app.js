/**
 * Future Leadership Program - Stacko Facilitator Tool
 * Designed according to PRD.md and Antislop Craftsmanship Rules
 */

(() => {
  "use strict";

  const STORAGE_KEY = "stacko_flp_facilitator_session_v2";

  // Application State
  const state = {
    openedRegular: new Set(),
    usedSpecial: new Set(),
    actionHistory: [],
    soundEnabled: true,
    activeModal: null,
    previousFocusedElement: null
  };

  // Timer State
  let timerInterval = null;
  let timerSeconds = 60;
  let isTimerRunning = false;

  // DOM Elements
  const appContainerEl = document.getElementById("appContainer");
  const cardsGridEl = document.getElementById("cardsGrid");
  const specialChipsListEl = document.getElementById("specialChipsList");
  const regularCountEl = document.getElementById("regularCount");
  const specialCountEl = document.getElementById("specialCount");
  const progressTextEl = document.getElementById("progressText");
  const progressFillEl = document.getElementById("progressFill");
  const progressTrackEl = document.getElementById("progressTrack");
  const recapListEl = document.getElementById("recapList");
  const recapEmptyEl = document.getElementById("recapEmpty");
  const recapCountEl = document.getElementById("recapCount");
  
  // Header Actions
  const btnTowerFalls = document.getElementById("btnTowerFalls");
  const btnUndo = document.getElementById("btnUndo");
  const btnSoundToggle = document.getElementById("btnSoundToggle");
  const soundIconOn = document.getElementById("soundIconOn");
  const soundIconOff = document.getElementById("soundIconOff");
  const soundBtnText = document.getElementById("soundBtnText");
  const btnReset = document.getElementById("btnReset");

  // Question Modal Elements
  const questionModalEl = document.getElementById("questionModal");
  const modalDialogEl = document.getElementById("modalDialog");
  const flipCardInnerEl = document.getElementById("flipCardInner");
  const flipFrontNumberEl = document.getElementById("flipFrontNumber");
  const flipFrontTitleEl = document.getElementById("flipFrontTitle");
  const flipFrontHintEl = document.getElementById("flipFrontHint");
  const cardBadgeEl = document.getElementById("cardBadge");
  const questionTextEl = document.getElementById("questionText");
  const mascotImgEl = document.getElementById("mascotImg");
  const audienceNoteEl = document.getElementById("audienceNote");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalDoneBtn = document.getElementById("modalDoneBtn");

  // Timer Elements
  const timerDigitsEl = document.getElementById("timerDigits");
  const btnTimerToggle = document.getElementById("btnTimerToggle");
  const btnTimerAdd = document.getElementById("btnTimerAdd");
  const btnTimerReset = document.getElementById("btnTimerReset");

  // Confirmation Modal Elements
  const confirmModalEl = document.getElementById("confirmModal");
  const confirmTitleEl = document.getElementById("confirmTitle");
  const confirmMsgEl = document.getElementById("confirmMsg");
  const confirmCancelBtn = document.getElementById("confirmCancelBtn");
  const confirmActionBtn = document.getElementById("confirmActionBtn");

  // Toast
  const toastNoticeEl = document.getElementById("toastNotice");
  const toastMessageEl = document.getElementById("toastMessage");
  let toastTimer = null;

  /* ==========================================================================
     Audio Synthesizer (Web Audio API - 100% Offline, Zero External MP3s)
     ========================================================================== */
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSoundTowerFall() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Synthesize tumbling impact with low frequency rumble and descending sweeps
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc2.type = "triangle";

      // Descending pitch sweep
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(35, now + 0.45);

      osc2.frequency.setValueAtTime(180, now);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.45);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio feedback disabled or unavailable:", e);
    }
  }

  function playSoundFlip() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // Audio fallback silent
    }
  }

  function playSoundTimerChime() {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      // Audio fallback silent
    }
  }

  /* ==========================================================================
     Session State & Persistence (localStorage)
     ========================================================================== */
  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.openedRegular)) {
          state.openedRegular = new Set(parsed.openedRegular);
        }
        if (Array.isArray(parsed.usedSpecial)) {
          state.usedSpecial = new Set(parsed.usedSpecial);
        }
        if (Array.isArray(parsed.actionHistory)) {
          state.actionHistory = parsed.actionHistory;
        }
        if (typeof parsed.soundEnabled === "boolean") {
          state.soundEnabled = parsed.soundEnabled;
        }
      }
    } catch (err) {
      console.warn("Unable to load session from localStorage:", err);
    }
    updateSoundUI();
  }

  function saveSession() {
    try {
      const payload = {
        openedRegular: Array.from(state.openedRegular),
        usedSpecial: Array.from(state.usedSpecial),
        actionHistory: state.actionHistory,
        soundEnabled: state.soundEnabled
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Unable to save session to localStorage:", err);
    }
    updateDashboardStats();
    updateUndoUI();
    renderSpecialChips();
  }

  function showToast(message) {
    if (toastTimer) clearTimeout(toastTimer);
    toastMessageEl.textContent = message;
    toastNoticeEl.classList.add("show");
    toastTimer = setTimeout(() => {
      toastNoticeEl.classList.remove("show");
    }, 2500);
  }

  /* ==========================================================================
     Dashboard & Controls UI
     ========================================================================== */
  function updateDashboardStats() {
    const totalRegular = window.QUESTIONS_DATA.regular.length;
    const availableRegular = totalRegular - state.openedRegular.size;
    regularCountEl.textContent = `${availableRegular} / ${totalRegular} Left`;

    const totalSpecial = window.QUESTIONS_DATA.special.length;
    const availableSpecial = totalSpecial - state.usedSpecial.size;
    specialCountEl.textContent = `${availableSpecial} / ${totalSpecial} Left`;

    // Session progress bar (regular deck)
    const openedCount = state.openedRegular.size;
    if (progressTextEl) {
      progressTextEl.textContent = `${openedCount} of ${totalRegular} blocks opened`;
    }
    if (progressFillEl) {
      const pct = totalRegular > 0 ? (openedCount / totalRegular) * 100 : 0;
      progressFillEl.style.width = `${pct}%`;
    }
    if (progressTrackEl) {
      progressTrackEl.setAttribute("aria-valuenow", String(openedCount));
      progressTrackEl.setAttribute("aria-valuemax", String(totalRegular));
    }

    renderRecap();
  }

  /* ==========================================================================
     Session Recap (drawn questions, in order)
     ========================================================================== */
  function renderRecap() {
    if (!recapListEl) return;
    recapListEl.innerHTML = "";

    state.actionHistory.forEach((action, idx) => {
      const li = document.createElement("li");
      li.className = "recap-item";

      const step = document.createElement("span");
      step.className = "recap-step";
      step.textContent = `#${idx + 1}`;

      const tag = document.createElement("span");
      const question = document.createElement("span");
      question.className = "recap-question";

      if (action.type === "regular") {
        const q = window.QUESTIONS_DATA.regular.find((x) => x.number === action.number);
        tag.className = "recap-tag";
        tag.textContent = `Block ${action.number}`;
        question.textContent = q ? q.question : "";
      } else {
        const q = window.QUESTIONS_DATA.special.find((x) => x.id === action.id);
        tag.className = "recap-tag special";
        tag.textContent = action.code || `S${action.id}`;
        question.textContent = q ? q.question : "";
      }

      li.appendChild(step);
      li.appendChild(tag);
      li.appendChild(question);
      recapListEl.appendChild(li);
    });

    const total = state.actionHistory.length;
    if (recapEmptyEl) {
      recapEmptyEl.style.display = total === 0 ? "block" : "none";
    }
    if (recapCountEl) {
      recapCountEl.textContent = `${total} question${total === 1 ? "" : "s"} drawn`;
    }
  }

  function updateUndoUI() {
    const hasHistory = state.actionHistory.length > 0;
    btnUndo.disabled = !hasHistory;
    btnUndo.setAttribute("aria-disabled", hasHistory ? "false" : "true");
  }

  function updateSoundUI() {
    if (state.soundEnabled) {
      soundIconOn.style.display = "block";
      soundIconOff.style.display = "none";
      soundBtnText.textContent = "Sound On";
      btnSoundToggle.classList.add("active");
    } else {
      soundIconOn.style.display = "none";
      soundIconOff.style.display = "block";
      soundBtnText.textContent = "Sound Off";
      btnSoundToggle.classList.remove("active");
    }
  }

  /* ==========================================================================
     Special Questions (S1-S8) Chips Bar
     ========================================================================== */
  function renderSpecialChips() {
    specialChipsListEl.innerHTML = "";
    const specialPool = window.QUESTIONS_DATA.special;

    specialPool.forEach((item) => {
      const isUsed = state.usedSpecial.has(item.id);
      const chipBtn = document.createElement("button");
      chipBtn.type = "button";
      chipBtn.className = `special-chip-btn ${isUsed ? "is-used" : ""}`;
      chipBtn.dataset.specialId = item.id;
      chipBtn.textContent = item.code || `S${item.id}`;
      chipBtn.setAttribute(
        "aria-label",
        `Special Question ${item.code || item.id}, ${isUsed ? "Used (click to view question)" : "Available in pool"}`
      );

      chipBtn.addEventListener("click", () => {
        openQuestionModal({
          isSpecial: true,
          title: "Special Question",
          numberDisplay: item.code || `S${item.id}`,
          badgeText: `Special Question (${item.code || `S${item.id}`})`,
          questionText: item.question,
          audienceText: "Everyone in the room answers this question!"
        });
      });

      specialChipsListEl.appendChild(chipBtn);
    });
  }

  /* ==========================================================================
     Render 45 Regular Cards Grid
     ========================================================================== */
  function renderGrid() {
    cardsGridEl.innerHTML = "";
    const regularQuestions = window.QUESTIONS_DATA.regular;

    regularQuestions.forEach((item) => {
      const isOpened = state.openedRegular.has(item.number);
      const cardBtn = document.createElement("button");
      cardBtn.type = "button";
      cardBtn.className = `card-item ${isOpened ? "is-opened" : ""}`;
      cardBtn.dataset.number = item.number;
      cardBtn.setAttribute(
        "aria-label",
        `Block ${item.number}, ${isOpened ? "Opened (click to view question again)" : "Available (click to draw question)"}`
      );

      cardBtn.innerHTML = `
        <span class="card-number">${item.number}</span>
        <span class="card-subtext">${isOpened ? "Opened" : "Block"}</span>
      `;

      cardBtn.addEventListener("click", () => handleRegularCardClick(item.number));
      cardsGridEl.appendChild(cardBtn);
    });

    updateDashboardStats();
    updateUndoUI();
    renderSpecialChips();
  }

  /* ==========================================================================
     Regular Card Click Handling
     ========================================================================== */
  function handleRegularCardClick(blockNumber) {
    const questionObj = window.QUESTIONS_DATA.regular.find((q) => q.number === blockNumber);
    if (!questionObj) return;

    const wasAlreadyOpened = state.openedRegular.has(blockNumber);

    if (!wasAlreadyOpened) {
      state.openedRegular.add(blockNumber);
      state.actionHistory.push({ type: "regular", number: blockNumber });
      saveSession();

      // Update card element in grid
      const cardEl = cardsGridEl.querySelector(`[data-number="${blockNumber}"]`);
      if (cardEl) {
        cardEl.classList.add("is-opened");
        cardEl.setAttribute("aria-label", `Block ${blockNumber}, Opened (click to view question again)`);
        const subtext = cardEl.querySelector(".card-subtext");
        if (subtext) subtext.textContent = "Opened";
      }
    }

    playSoundFlip();

    openQuestionModal({
      isSpecial: false,
      title: "Block Number",
      numberDisplay: blockNumber,
      badgeText: `Question #${blockNumber}`,
      questionText: questionObj.question,
      audienceText: ""
    });
  }

  /* ==========================================================================
     Tower Falls Handling (Special Question Mode)
     ========================================================================== */
  function handleTowerFallsClick() {
    const specialPool = window.QUESTIONS_DATA.special;
    const remaining = specialPool.filter((item) => !state.usedSpecial.has(item.id));

    if (remaining.length === 0) {
      openExhaustedPoolPrompt();
      return;
    }

    // Pick random question from remaining pool
    const randomIndex = Math.floor(Math.random() * remaining.length);
    const selected = remaining[randomIndex];

    state.usedSpecial.add(selected.id);
    state.actionHistory.push({ type: "special", id: selected.id, code: selected.code });
    saveSession();

    // Trigger visual rumble and audio drama
    triggerTowerFallDrama();

    openQuestionModal({
      isSpecial: true,
      title: "Tower Collapsed!",
      numberDisplay: selected.code || "S",
      badgeText: `Special Penalty (${selected.code || "S"})`,
      questionText: selected.question,
      audienceText: "Everyone in the room answers this question!"
    });
  }

  function triggerTowerFallDrama() {
    playSoundTowerFall();
    appContainerEl.classList.remove("rumble-effect");
    void appContainerEl.offsetWidth; // Force reflow
    appContainerEl.classList.add("rumble-effect");
    setTimeout(() => {
      appContainerEl.classList.remove("rumble-effect");
    }, 500);
  }

  /* ==========================================================================
     Undo Last Action
     ========================================================================== */
  function handleUndoClick() {
    if (state.actionHistory.length === 0) return;

    const lastAction = state.actionHistory.pop();

    if (lastAction.type === "regular") {
      state.openedRegular.delete(lastAction.number);
      saveSession();

      const cardEl = cardsGridEl.querySelector(`[data-number="${lastAction.number}"]`);
      if (cardEl) {
        cardEl.classList.remove("is-opened");
        cardEl.setAttribute("aria-label", `Block ${lastAction.number}, Available (click to draw question)`);
        const subtext = cardEl.querySelector(".card-subtext");
        if (subtext) subtext.textContent = "Block";
      }

      showToast(`Reverted Block #${lastAction.number} back to Available`);
    } else if (lastAction.type === "special") {
      state.usedSpecial.delete(lastAction.id);
      saveSession();
      showToast(`Reverted Special Question ${lastAction.code || lastAction.id} back to Pool`);
    }
  }

  /* ==========================================================================
     Optional Answer Timer (60s)
     ========================================================================== */
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    timerDigitsEl.textContent = formatTime(timerSeconds);

    if (timerSeconds <= 10 && timerSeconds > 0) {
      timerDigitsEl.className = "timer-digits critical";
    } else if (timerSeconds <= 20) {
      timerDigitsEl.className = "timer-digits warning";
    } else {
      timerDigitsEl.className = "timer-digits";
    }
  }

  function toggleTimer() {
    if (isTimerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    if (timerSeconds <= 0) {
      timerSeconds = 60;
    }
    isTimerRunning = true;
    btnTimerToggle.textContent = "Pause";
    btnTimerToggle.classList.add("active");
    updateTimerDisplay();

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (timerSeconds > 0) {
        timerSeconds--;
        updateTimerDisplay();
        if (timerSeconds === 0) {
          pauseTimer();
          playSoundTimerChime();
          showToast("Time is up!");
        }
      } else {
        pauseTimer();
      }
    }, 1000);
  }

  function pauseTimer() {
    isTimerRunning = false;
    btnTimerToggle.textContent = timerSeconds === 0 ? "Restart" : "Resume";
    btnTimerToggle.classList.remove("active");
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetTimer() {
    pauseTimer();
    timerSeconds = 60;
    btnTimerToggle.textContent = "Start 60s Timer";
    updateTimerDisplay();
  }

  function addTimerTime(secondsToAdd) {
    timerSeconds += secondsToAdd;
    updateTimerDisplay();
  }

  /* ==========================================================================
     Mascot Rotation (random character + pose per question)
     ========================================================================== */
  const MASCOT_POSITIONS = ["mascot-pos-br", "mascot-pos-bl"];

  function pickRandomMascot() {
    if (!window.MASCOT_SETS || !mascotImgEl) return;
    const sets = Object.values(window.MASCOT_SETS).filter((s) => s.poses && s.poses.length > 0);
    if (sets.length === 0) return;
    const set = sets[Math.floor(Math.random() * sets.length)];
    const pose = set.poses[Math.floor(Math.random() * set.poses.length)];
    mascotImgEl.src = pose;
    const position = MASCOT_POSITIONS[Math.floor(Math.random() * MASCOT_POSITIONS.length)];
    mascotImgEl.classList.remove("mascot-pos-br", "mascot-pos-bl", "mascot-pos-tr", "mascot-pos-tl");
    mascotImgEl.classList.add(position);
  }

  /* ==========================================================================
     Question Reveal Modal
     ========================================================================== */
  function openQuestionModal(options) {
    pickRandomMascot();
    state.previousFocusedElement = document.activeElement;

    if (options.isSpecial) {
      modalDialogEl.classList.add("special-theme");
      flipCardInnerEl.querySelector(".flip-card-front").classList.add("special-front");
      flipCardInnerEl.querySelector(".flip-card-back").classList.add("special-back");
    } else {
      modalDialogEl.classList.remove("special-theme");
      flipCardInnerEl.querySelector(".flip-card-front").classList.remove("special-front");
      flipCardInnerEl.querySelector(".flip-card-back").classList.remove("special-back");
    }

    flipFrontTitleEl.textContent = options.title;
    flipFrontNumberEl.textContent = options.numberDisplay;
    flipFrontHintEl.textContent = options.isSpecial ? "Special Penalty" : "Stacko Block";
    cardBadgeEl.textContent = options.badgeText;
    questionTextEl.textContent = options.questionText;

    if (options.audienceText) {
      audienceNoteEl.textContent = options.audienceText;
      audienceNoteEl.style.display = "inline-block";
    } else {
      audienceNoteEl.style.display = "none";
    }

    // Reset Timer on each new card reveal
    resetTimer();

    // Reset Flip State before opening
    flipCardInnerEl.classList.remove("flipped");

    questionModalEl.classList.add("is-open");
    questionModalEl.setAttribute("aria-hidden", "false");
    state.activeModal = questionModalEl;

    setTimeout(() => {
      flipCardInnerEl.classList.add("flipped");
    }, 280);

    setTimeout(() => {
      modalDoneBtn.focus();
    }, 320);
  }

  function closeQuestionModal() {
    resetTimer();
    questionModalEl.classList.remove("is-open");
    questionModalEl.setAttribute("aria-hidden", "true");
    flipCardInnerEl.classList.remove("flipped");
    state.activeModal = null;

    if (state.previousFocusedElement) {
      state.previousFocusedElement.focus();
    }
  }

  /* ==========================================================================
     Confirmation Dialog & Pool Exhaustion
     ========================================================================== */
  let pendingConfirmAction = null;

  function openConfirmDialog(options) {
    state.previousFocusedElement = document.activeElement;

    confirmTitleEl.textContent = options.title;
    confirmMsgEl.textContent = options.message;
    confirmActionBtn.textContent = options.actionLabel || "Confirm";
    pendingConfirmAction = options.onConfirm || null;

    confirmModalEl.classList.add("is-open");
    confirmModalEl.setAttribute("aria-hidden", "false");
    state.activeModal = confirmModalEl;

    setTimeout(() => {
      confirmCancelBtn.focus();
    }, 100);
  }

  function closeConfirmDialog() {
    confirmModalEl.classList.remove("is-open");
    confirmModalEl.setAttribute("aria-hidden", "true");
    pendingConfirmAction = null;
    state.activeModal = null;

    if (state.previousFocusedElement) {
      state.previousFocusedElement.focus();
    }
  }

  function openExhaustedPoolPrompt() {
    openConfirmDialog({
      title: "All Special Questions Used",
      message: "All 8 special questions have been drawn in this session. Would you like to reshuffle the special question pool so all 8 are available again?",
      actionLabel: "Reshuffle Pool",
      onConfirm: () => {
        state.usedSpecial.clear();
        saveSession();
        showToast("Special pool reshuffled!");
        handleTowerFallsClick();
      }
    });
  }

  function handleResetClick() {
    openConfirmDialog({
      title: "Reset Session Progress?",
      message: "This will clear all opened card markings, restore all 8 special questions, and clear action history. Are you sure you want to reset the session?",
      actionLabel: "Yes, Reset Session",
      onConfirm: () => {
        state.openedRegular.clear();
        state.usedSpecial.clear();
        state.actionHistory = [];
        saveSession();
        renderGrid();
        showToast("Session reset to fresh state");
      }
    });
  }

  /* ==========================================================================
     Initialize Events
     ========================================================================== */
  function initEvents() {
    // Header actions
    btnTowerFalls.addEventListener("click", handleTowerFallsClick);
    btnUndo.addEventListener("click", handleUndoClick);
    btnReset.addEventListener("click", handleResetClick);

    // Sound toggle
    btnSoundToggle.addEventListener("click", () => {
      state.soundEnabled = !state.soundEnabled;
      updateSoundUI();
      saveSession();
      if (state.soundEnabled) {
        playSoundFlip();
        showToast("Sound effects enabled");
      } else {
        showToast("Sound effects muted");
      }
    });

    // Timer controls
    btnTimerToggle.addEventListener("click", toggleTimer);
    btnTimerAdd.addEventListener("click", () => addTimerTime(15));
    btnTimerReset.addEventListener("click", resetTimer);

    // Question Modal
    modalCloseBtn.addEventListener("click", closeQuestionModal);
    modalDoneBtn.addEventListener("click", closeQuestionModal);

    questionModalEl.addEventListener("click", (e) => {
      if (e.target === questionModalEl) {
        closeQuestionModal();
      }
    });

    // Confirmation Modal
    confirmCancelBtn.addEventListener("click", closeConfirmDialog);
    confirmActionBtn.addEventListener("click", () => {
      if (typeof pendingConfirmAction === "function") {
        pendingConfirmAction();
      }
      closeConfirmDialog();
    });

    confirmModalEl.addEventListener("click", (e) => {
      if (e.target === confirmModalEl) {
        closeConfirmDialog();
      }
    });

    // Keyboard Navigation: Focus Trapping in Open Modals
    function trapFocusInModal(e, modalEl) {
      if (e.key !== "Tab") return;
      const focusableSelectors = 'button:not([disabled]), [tabindex]:not([tabindex="-1"])';
      const focusables = Array.from(modalEl.querySelectorAll(focusableSelectors)).filter(
        (el) => el.offsetParent !== null && window.getComputedStyle(el).display !== "none"
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first || !modalEl.contains(document.activeElement)) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last || !modalEl.contains(document.activeElement)) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    // Global Keyboard Navigation (Escape to dismiss, Tab trapped in modal)
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (confirmModalEl.classList.contains("is-open")) {
          closeConfirmDialog();
        } else if (questionModalEl.classList.contains("is-open")) {
          closeQuestionModal();
        }
      } else if (e.key === "Tab" && state.activeModal) {
        trapFocusInModal(e, state.activeModal);
      }
    });
  }

  /* ==========================================================================
     Bootstrap Application
     ========================================================================== */
  function init() {
    if (!window.QUESTIONS_DATA || !window.QUESTIONS_DATA.regular) {
      console.error("Questions dataset could not be loaded.");
      return;
    }

    loadSession();
    renderGrid();
    initEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
