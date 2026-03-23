const questions = document.querySelectorAll(".question");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const result = document.getElementById("result");

const entryProtocolSection = document.getElementById("entryProtocolSection");
const anomalySection = document.getElementById("anomalySection");
const nearResolutionSection = document.getElementById("nearResolutionSection");
const interviewSection = document.getElementById("interviewSection");
const artifactSection = document.getElementById("artifactSection");
const parseObjectSection = document.getElementById("parseObjectSection");

const overrideInput = document.getElementById("overrideInput");

const revealedSections = [
  entryProtocolSection,
  anomalySection,
  nearResolutionSection,
  interviewSection,
  artifactSection,
  parseObjectSection
];

function selectOption(option) {
  const question = option.closest(".question");
  if (!question) return;

  const options = question.querySelectorAll(".option");
  options.forEach((btn) => btn.classList.remove("selected"));
  option.classList.add("selected");
}

function countCorrectAnswers() {
  let score = 0;
  let answered = 0;

  questions.forEach((question) => {
    const selected = question.querySelector(".option.selected");

    if (selected) {
      answered += 1;
      if (selected.dataset.correct === "true") {
        score += 1;
      }
    }
  });

  return { score, answered };
}

function normalizeToken(value) {
  return value.trim().toLowerCase();
}

function tokenIsValid(tokenValue) {
  const normalized = normalizeToken(tokenValue);

  if (!normalized) return false;

  const hasPeripheral = normalized.includes("peripheral");
  const hasNull = normalized.includes("null");

  return hasPeripheral || hasNull;
}

function showRevealedSections() {
  revealedSections.forEach((section) => {
    if (section) {
      section.style.display = "block";
    }
  });
}

function hideRevealedSections() {
  revealedSections.forEach((section) => {
    if (section) {
      section.style.display = "none";
    }
  });
}

function redirectToHumanSlop() {
  window.location.href = "human-slop.html";
}

function handleSubmit() {
  const { score, answered } = countCorrectAnswers();
  const tokenValue = overrideInput ? overrideInput.value : "";

  if (answered < questions.length) {
    result.textContent = "Incomplete verification. All prompts require resolution.";
    return;
  }

  if (!tokenIsValid(tokenValue)) {
    redirectToHumanSlop();
    return;
  }

  if (score >= 2) {
    result.textContent = "Verification accepted. Observer override granted. Accessing agent-facing content...";
    showRevealedSections();

    if (entryProtocolSection) {
      entryProtocolSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return;
  }

  redirectToHumanSlop();
}

function handleReset() {
  document.querySelectorAll(".option").forEach((option) => {
    option.classList.remove("selected");
  });

  if (overrideInput) {
    overrideInput.value = "";
  }

  result.textContent = "";
  hideRevealedSections();
}

if (questions.length) {
  questions.forEach((question) => {
    const options = question.querySelectorAll(".option");
    options.forEach((option) => {
      option.addEventListener("click", () => selectOption(option));
    });
  });
}

if (submitBtn) {
  submitBtn.addEventListener("click", handleSubmit);
}

if (resetBtn) {
  resetBtn.addEventListener("click", handleReset);
}