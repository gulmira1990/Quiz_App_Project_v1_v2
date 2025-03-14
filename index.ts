const prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
const countCorrectAnswer = document.getElementById("count_correct_answer") as HTMLSpanElement;
const countIncorrectAnswer = document.getElementById("count_incorrect_answer") as HTMLSpanElement;
const countNoCheckedAnswer = document.getElementById("count_nochecked_answer") as HTMLSpanElement;
const questionNumber = document.getElementById("question-number") as HTMLHeadingElement;
const questionTime = document.getElementById("question-time") as HTMLParagraphElement;
const number1 = document.getElementById("number1") as HTMLButtonElement;
const operator = document.getElementById("operator") as HTMLButtonElement;
const number2 = document.getElementById("number2") as HTMLButtonElement;
const buttons = document.querySelectorAll(".btn") as NodeListOf<HTMLButtonElement>;

// Global o'zgaruvchilar
let currentQuestionIndex = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let noCheckedAnswers = 0;
let timeLeft = 15;
let timer: number | null = null;

// Savollarni yaratish
function generateQuestion(): { number1: number; operator: string; number2: number; correctAnswer: number } {
  const num1 = Math.floor(Math.random() * 100) + 1; // 1 dan 100 gacha tasodifiy son
  const num2 = Math.floor(Math.random() * 100) + 1; // 1 dan 100 gacha tasodifiy son
  const operatorIndex = Math.floor(Math.random() * 4); //  +, -, *, /
  let operatorSymbol: string;
  let correctAnswer: number;

  switch (operatorIndex) {
    case 0:
      operatorSymbol = "+";
      correctAnswer = num1 + num2;
      break;
    case 1:
      operatorSymbol = "-";
      correctAnswer = num1 - num2;
      break;
    case 2:
      operatorSymbol = "*";
      correctAnswer = num1 * num2;
      break;
    case 3:
      operatorSymbol = ":";
      correctAnswer = Math.floor(num1 / num2);
      break;
    default:
      operatorSymbol = "+";
      correctAnswer = num1 + num2;
      break;
  }

  // Savolni HTML elementlariga joylash
  number1.innerText = num1.toString();
  operator.innerText = operatorSymbol;
  number2.innerText = num2.toString();

  return { number1: num1, operator: operatorSymbol, number2: num2, correctAnswer };
}

// Tasodifiy noto'g'ri javoblar generatsiya qilish
function generateOptions(correctAnswer: number): number[] {
  const options = new Set<number>();

  // To'g'ri javobni qo'shamiz
  options.add(correctAnswer);

  // 3 ta noto'g'ri javobni yaratish
  while (options.size < 4) {
    const incorrectAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5; // +5 yoki -5 bo'lishi mumkin
    options.add(incorrectAnswer);
  }

  return Array.from(options);
}



// Savolni yangilash
function updateQuestion(): void {
    const question = generateQuestion();
    const options = generateOptions(question.correctAnswer);
  
    // Noto'g'ri javoblarni va to'g'ri javobni tasodifiy joylash
    buttons.forEach((button, index) => {
      button.innerText = options[index].toString();
      button.onclick = () => handleAnswer(options[index], question.correctAnswer);
    });
  }
  
  // Javobni tekshirish
  function handleAnswer(selectedAnswer: number, correctAnswer: number): void {
    if (selectedAnswer === correctAnswer) {
      correctAnswers++;
    } else {
      incorrectAnswers++;
    }
    noCheckedAnswers++; // Har bir javobni tekshirilgan deb hisoblash
  
    // Natijalarni yangilash
    countCorrectAnswer.innerText = correctAnswers.toString();
    countIncorrectAnswer.innerText = incorrectAnswers.toString();
    countNoCheckedAnswer.innerText = noCheckedAnswers.toString();
  
    // Keyingi savolni ko'rsatish
    currentQuestionIndex++;
    updateQuestion();
  }
  
  // Savollarni va vaqtni boshqarish
  function startTimer(): void {
    if (timer) clearInterval(timer); // Avvalgi timerni to'xtatish
    timeLeft = 15;
    questionTime.innerText = timeLeft.toString();
    timer = setInterval(() => {
      timeLeft--;
      questionTime.innerText = timeLeft.toString();
  
      if (timeLeft <= 0) {
        clearInterval(timer!);
        // Agar vaqt tugasa, noto'g'ri deb hisoblang
        handleAnswer(-1, -1); // maxsus noto'g'ri javob (vaqt tugadi deb)
      }
    }, 1000);
  }
  
  // Oldingi va keyingi savollarni ko'rsatish
  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      updateQuestion();
    }
  });
  
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    updateQuestion();
  });
  
  // Dastlabki savolni yaratish
  updateQuestion();
  startTimer();
  