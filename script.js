// ===== DOM =====


const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const startBtn = document.getElementById("startBtn");
const wordEl = document.getElementById("word");
const choicesEl = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");
const progressEl = document.getElementById("progress");

// ===== 상태 =====
let words = [];
let currentIndex = 0;
let correctMeaning = "";

// ===== 유틸 =====
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===== JSON 로드 =====
fetch("words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
    shuffleArray(words);
  })
  .catch(err => {
    alert("words.json 불러오기 실패");
    console.error(err);
  });

// ===== 시작 =====
startBtn.addEventListener("click", () => {
  if (words.length === 0) {
    alert("단어 로딩 중이다. 잠깐만 기다려라");
    return;
  }

  currentIndex = 0;
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  nextBtn.style.display = "none";

  showWord();
});

// ===== 문제 표시 =====
function showWord() {
  if (currentIndex >= words.length) {
    showComplete();
    return;
  }

  const current = words[currentIndex];
  wordEl.textContent = current.word;
  correctMeaning = current.meaning;

  progressEl.textContent =
    `진행도: ${currentIndex + 1} / ${words.length}`;

  choicesEl.innerHTML = "";
  nextBtn.style.display = "none";

  const meanings = words
    .map(w => w.meaning)
    .filter(m => m !== correctMeaning);

  shuffleArray(meanings);

  const options = meanings.slice(0, 3);
  options.push(correctMeaning);
  shuffleArray(options);

  options.forEach(text => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;

    btn.addEventListener("click", () => selectAnswer(btn, text));
    choicesEl.appendChild(btn);
  });
}

// ===== 정답 처리 =====
function selectAnswer(btn, selected) {
  const buttons = document.querySelectorAll(".choice");
  buttons.forEach(b => b.disabled = true);

  buttons.forEach(b => {
    if (b.textContent === correctMeaning) {
      b.style.border = "2px solid green";
    }
  });

  if (selected !== correctMeaning) {
    btn.style.border = "2px solid red";
  }

  nextBtn.style.display = "block";
}

// ===== 다음 =====
nextBtn.addEventListener("click", () => {
  currentIndex++;
  showWord();
});

// ===== 완주 =====
function showComplete() {
  wordEl.textContent = "완주!";
  progressEl.textContent = "";
  choicesEl.innerHTML = "";

  nextBtn.textContent = "처음으로";
  nextBtn.style.display = "block";

  nextBtn.onclick = () => location.reload();
}




