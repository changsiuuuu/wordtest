let allWordsByDay = {};
let quizWords = [];
let currentIndex = 0;
let currentAnswer = "";
let total = 0;
let correctCount = 0;
let wrongList = [];
let answered = false;


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
  "#daySelect input:checked"
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
  correctCount = 0;
wrongList = [];
nextBtn.textContent = "다음";
nextBtn.onclick = null;

document.getElementById("resultScreen").style.display = "none";


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
  answered = false;


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
  if (answered) return;      
  answered = true;

  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => b.disabled = true);

  const current = quizWords[currentIndex];

  if (selected === currentAnswer) {
    correctCount++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");

    wrongList.push({
      word: current.word,
      meaning: current.meaning,
      picked: selected
    });

    buttons.forEach(b => {
      if (b.textContent === currentAnswer) b.classList.add("correct");
    });
  }

  nextBtn.style.display = "block";
}


/* 다음 버튼 */
nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= total) {
  showResult();
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

function showResult() {
  
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
    wrongBox.innerHTML = wrongList.map((w, i) => `
      <div class="wrong-item">
        <div><strong>${i + 1}. ${w.word}</strong></div>
        <div>정답: ${w.meaning}</div>
        
      </div>
    `).join("");
  }

 
  resultScreen.style.display = "block";

  restartBtn.onclick = () => location.reload();
}








