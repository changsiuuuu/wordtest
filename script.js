let allWordsByDay = {};
let quizWords = [];
let currentIndex = 0;
let currentAnswer = "";
let total = 0;

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const wordEl = document.getElementById("word");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const errorMsg = document.getElementById("errorMsg");

errorMsg.style.display = "none";

/* 데이터 불러오기 */
fetch("words.json")
  .then(res => res.json())
  .then(data => {
    allWordsByDay = data;
  });


const daySelect = document.getElementById("daySelect");

fetch("words.json")
  .then(res => res.json())
  .then(data => {
    allWordsByDay = data;
    renderDayCheckboxes(data);
  });

function renderDayCheckboxes(data) {
  daySelect.innerHTML = "";

  Object.keys(data).forEach(day => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${day}">
      ${day.toUpperCase()}
    `;
    daySelect.appendChild(label);
  });
}

function renderDayCheckboxes(data) {
  daySelect.innerHTML = "";

  Object.keys(data).forEach(day => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.value = day;

    checkbox.addEventListener("change", limitSelection);

    label.appendChild(checkbox);
    label.append(` ${day.toUpperCase()}`);
    daySelect.appendChild(label);
  });
}

function limitSelection() {
  const checked = document.querySelectorAll(
    ".day-container input:checked"
  );

  if (checked.length > 4) {
    this.checked = false;
    errorMsg.style.display = "block";
  } else {
    errorMsg.style.display = "none";
  }
}


/* 시작 버튼 */
startBtn.addEventListener("click", () => {
  const checked = document.querySelectorAll(
    ".day-select input[type='checkbox']:checked"
  );

  if (checked.length === 0) {
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.style.display = "none";

  quizWords = [];
  checked.forEach(cb => {
    quizWords = quizWords.concat(allWordsByDay[cb.value]);
  });

  shuffle(quizWords);

  total = quizWords.length;
  currentIndex = 0;

  startScreen.style.display = "none";
  quizScreen.style.display = "block";

  showQuestion();
});

/* 문제 출력 */
function showQuestion() {
  const current = quizWords[currentIndex];
  currentAnswer = current.meaning;

  progressEl.textContent = `${currentIndex + 1} / ${total}`;
  wordEl.textContent = current.word;

  choicesEl.innerHTML = "";
  nextBtn.style.display = "none";

  let options = [current.meaning];

  while (options.length < 4) {
    const rand = quizWords[Math.floor(Math.random() * quizWords.length)].meaning;
    if (!options.includes(rand)) options.push(rand);
  }

  shuffle(options);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(btn, opt);
    choicesEl.appendChild(btn);
  });
}

/* 정답 체크 */
function checkAnswer(btn, selected) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => b.disabled = true);

  if (selected === currentAnswer) {
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    buttons.forEach(b => {
      if (b.textContent === currentAnswer) {
        b.classList.add("correct");
      }
    });
  }

  nextBtn.style.display = "block";
}

/* 다음 버튼 */
nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= total) {
    wordEl.textContent = "완주!";
    choicesEl.innerHTML = "";
    nextBtn.textContent = "처음으로";
    nextBtn.onclick = () => location.reload();
    nextBtn.style.display = "block";
    progressEl.textContent = "";
    return;
  }

  showQuestion();
});

/* 셔플 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}


const darkToggle = document.getElementById("darkToggle");

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});




