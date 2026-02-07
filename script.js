// script.js

let words = [];
let filteredWords = [];
let currentIndex = 0;

// DOM
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");

const wordEl = document.getElementById("word");
const meaningEl = document.getElementById("meaning");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const progressEl = document.getElementById("progress");

const categoryForm = document.getElementById("categoryForm");

// JSON 불러오기
fetch("words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
  })
  .catch(err => {
    console.error("단어 로딩 실패", err);
  });

// 시작 버튼
categoryForm.addEventListener("submit", e => {
  e.preventDefault();

  const checked = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(cb => cb.value);

  filteredWords = words.filter(w => checked.includes(w.category));

  if (filteredWords.length === 0) {
    alert("단어를 하나 이상 선택해라");
    return;
  }

  shuffleArray(filteredWords);
  
  currentIndex = 0;
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  restartBtn.style.display = "none";

  showWord();
});

// 단어 표시
function showWord() {
  const item = filteredWords[currentIndex];
  wordEl.textContent = item.word;
  meaningEl.textContent = item.meaning;
  updateProgress();
}

// 진행도
function updateProgress() {
  progressEl.textContent = `${currentIndex + 1} / ${filteredWords.length}`;
}

// 다음
nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= filteredWords.length) {
    finishQuiz();
  } else {
    showWord();
  }
});

// 완주 처리
function finishQuiz() {
  wordEl.textContent = "🎉 완주!";
  meaningEl.textContent = "수고했다. 처음부터 다시 할 수 있다.";
  progressEl.textContent = `${filteredWords.length} / ${filteredWords.length}`;

  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
}

// 처음으로
restartBtn.addEventListener("click", () => {
  quizScreen.style.display = "none";
  startScreen.style.display = "block";

  nextBtn.style.display = "inline-block";
  restartBtn.style.display = "none";
});


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
