// 1. 단어 데이터
let words = [];

fetch("words.json")
  .then(res => res.json())
  .then(data => {
    words = data;
    showWord();
  });


// 2. 상태 변수
let currentIndex = 0;
let answered = false;

// 3. DOM 요소 가져오기
const wordDiv = document.getElementById("word");
const choicesDiv = document.getElementById("choices");
const nextBtn = document.getElementById("nextBtn");

// 4. 화면에 문제 표시
function showWord() {
  answered = false;
  choicesDiv.innerHTML = "";

  const currentWord = words[currentIndex];
  const correctMeaning = currentWord.meaning;

  wordDiv.textContent = currentWord.word;

  // 오답 후보 만들기
  const wrongMeanings = words
    .filter((_, idx) => idx !== currentIndex)
    .map(w => w.meaning);

  shuffleArray(wrongMeanings);

  const choices = [
    correctMeaning,
    wrongMeanings[0],
    wrongMeanings[1],
    wrongMeanings[2]
  ];

  shuffleArray(choices);

  // 보기 생성
  choices.forEach(choice => {
    const div = document.createElement("div");
    div.textContent = choice;
    div.className = "choice";

    div.addEventListener("click", () => {
      if (answered) return;
      answered = true;

      if (choice === correctMeaning) {
        div.classList.add("correct");
      } else {
        div.classList.add("wrong");
        highlightCorrect(correctMeaning);
      }
    });

    choicesDiv.appendChild(div);
  });
}

// 5. 다음 버튼
nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= words.length) {
    alert("완주!");
    currentIndex = 0;
  }

  showWord();
});

// 6. 배열 섞기 함수
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// 7. 정답 강조
function highlightCorrect(correctMeaning) {
  const choiceEls = document.querySelectorAll(".choice");
  choiceEls.forEach(el => {
    if (el.textContent === correctMeaning) {
      el.classList.add("correct");
    }
  });
}

// 8. 최초 실행
showWord();
