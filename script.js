const QUIZ_TIME_LIMIT_MS = 4000;

let allWordsByDay = {};
let quizWords = [];
let currentIndex = 0;
let currentAnswer = "";
let total = 0;
let correctCount = 0;
let wrongList = [];
let answered = false;
let timerId = null;

const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const wordEl = document.getElementById("word");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");
const errorMsg = document.getElementById("errorMsg");
const daySelect = document.getElementById("daySelect");
const darkToggle = document.getElementById("darkToggle");
const timerFill = document.getElementById("timerFill");

errorMsg.style.display = "none";

loadWords();

function loadWords() {
  fetch("words.json")
    .then((res) => res.json())
    .then((data) => {
      allWordsByDay = data;
      renderDayCheckboxes(data);
    });
}

function renderDayCheckboxes(data) {
  daySelect.innerHTML = "";

  Object.keys(data).forEach((day) => {
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
  const checked = document.querySelectorAll(".day-container input:checked");

  if (checked.length > 4) {
    this.checked = false;
    errorMsg.style.display = "block";
  } else {
    errorMsg.style.display = "none";
  }
}

startBtn.addEventListener("click", () => {
  const checked = document.querySelectorAll("#daySelect input:checked");

  if (checked.length === 0) {
    errorMsg.style.display = "block";
    return;
  }

  errorMsg.style.display = "none";

  quizWords = [];
  checked.forEach((cb) => {
    quizWords = quizWords.concat(allWordsByDay[cb.value]);
  });

  shuffle(quizWords);

  total = quizWords.length;
  currentIndex = 0;
  correctCount = 0;
  wrongList = [];
  nextBtn.textContent = "다음";

  document.getElementById("resultScreen").style.display = "none";
  progressEl.style.display = "block";
  wordEl.style.display = "block";
  choicesEl.style.display = "flex";
  quizScreen.classList.remove("resultMode");

  startScreen.style.display = "none";
  quizScreen.style.display = "block";

  showQuestion();
});

function showQuestion() {
  clearTimer();

  const current = quizWords[currentIndex];
  currentAnswer = current.meaning;

  progressEl.textContent = `${currentIndex + 1} / ${total}`;
  wordEl.textContent = current.word;

  choicesEl.innerHTML = "";
  nextBtn.style.display = "none";
  answered = false;

  const options = buildOptions(current.meaning);

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(btn, opt);
    choicesEl.appendChild(btn);
  });

  startTimer();
}

function buildOptions(answer) {
  const options = [answer];

  while (options.length < 4) {
    const randMeaning =
      quizWords[Math.floor(Math.random() * quizWords.length)].meaning;
    if (!options.includes(randMeaning)) {
      options.push(randMeaning);
    }
  }

  shuffle(options);
  return options;
}

function startTimer() {
  timerFill.classList.remove("animating");
  void timerFill.offsetWidth;
  timerFill.classList.add("animating");

  timerId = setTimeout(() => {
    handleTimeOut();
  }, QUIZ_TIME_LIMIT_MS);
}

function clearTimer() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }

  timerFill.classList.remove("animating");
  timerFill.style.width = "100%";
}

function handleTimeOut() {
  if (answered) return;

  const current = quizWords[currentIndex];

  wrongList.push({
    word: current.word,
    meaning: current.meaning,
    picked: "시간 초과",
  });

  answered = true;
  revealAnswer("시간 초과");
}

function checkAnswer(btn, selected) {
  if (answered) return;

  answered = true;
  clearTimer();

  const current = quizWords[currentIndex];

  if (selected === currentAnswer) {
    correctCount++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    wrongList.push({
      word: current.word,
      meaning: current.meaning,
      picked: selected,
    });
  }

  revealAnswer();
}

function revealAnswer(timeOutLabel) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach((b) => {
    b.disabled = true;
    if (b.textContent === currentAnswer) {
      b.classList.add("correct");
    }
  });

  if (timeOutLabel) {
    nextBtn.textContent = `${timeOutLabel} · 다음`;
  } else {
    nextBtn.textContent = "다음";
  }

  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= total) {
    showResult();
    return;
  }

  showQuestion();
});

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.textContent = document.body.classList.contains("dark")
    ? "☀️"
    : "🌙";
});

function showResult() {
  clearTimer();

  progressEl.style.display = "none";
  wordEl.style.display = "none";
  choicesEl.style.display = "none";
  nextBtn.style.display = "none";

  const resultScreen = document.getElementById("resultScreen");
  const resultSummary = document.getElementById("resultSummary");
  const wrongBox = document.getElementById("wrongBox");
  const restartBtn = document.getElementById("restartBtn");
  quizScreen.classList.add("resultMode");

  const percent = Math.round((correctCount / total) * 100);
  resultSummary.textContent = `정답: ${correctCount} / ${total} (${percent}%)`;

  if (wrongList.length === 0) {
    wrongBox.innerHTML = `
      <div class="wrong-item" style="text-align:center;">
        틀린 단어 없음 🎉
      </div>
    `;
  } else {
    wrongBox.innerHTML = wrongList
      .map(
        (w, i) => `
        <div class="wrong-item">
          <div><strong>${i + 1}. ${w.word}</strong></div>
          <div>정답: ${w.meaning}</div>
          <div>내 답: ${w.picked}</div>
        </div>
      `,
      )
      .join("");
  }

  resultScreen.style.display = "block";

  restartBtn.onclick = () => location.reload();
}

