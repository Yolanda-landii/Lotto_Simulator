// Step 2: Define the data structures
const lottoNumbers = [];
for (let i = 1; i <= 52; i++) {
  lottoNumbers.push(i);
}
const ballColors = ["red", "yellow", "green", "blue"];

const ticketPrices = {
  Lotto: 5.00,
  LottoPlus1: 2.50,
  LottoPlus2: 2.50,
};

let ticketData = {
  ticketNumber: null,
  boards: [],
  numbers: [],
  price: 0
};

let drawData = {
  winningNumbers: [],
  date: null
};

// HTML elements
const numberSelection = document.getElementById('numberSelection');
const ticketInfo = document.getElementById('ticketInfo');
const drawResults = document.getElementById('drawResults');
const modeSwitch = document.getElementById('modeSwitch');
const userSection = document.getElementById('userSection');
const adminSection = document.getElementById('adminSection');

// Event listeners
modeSwitch.addEventListener('change', () => {
  if (modeSwitch.checked) {
    userSection.style.display = 'none';
    adminSection.style.display = 'block';
  } else {
    userSection.style.display = 'block';
    adminSection.style.display = 'none';
  }
});

document.getElementById('generateBoardsBtn').addEventListener('click', selectNumbers);
document.getElementById('simulateDrawBtn').addEventListener('click', simulateDraw);

// Step 3: Set Up the User Interface
function renderNumberSelection() {
  lottoNumbers.forEach(number => {
    const button = document.createElement('button');
    button.textContent = number;
    button.className = getBallColorClass(number);
    button.addEventListener('click', () => handleNumberSelection(number));
    numberSelection.appendChild(button);
  });
}

function getBallColorClass(number) {
  if (number >= 1 && number <= 13) return 'red';
  if (number >= 14 && number <= 25) return 'yellow';
  if (number >= 26 && number <= 37) return 'green';
  if (number >= 38 && number <= 52) return 'blue';
}

function handleNumberSelection(number) {
  const index = ticketData.numbers.indexOf(number);
  if (index === -1) {
    if (ticketData.numbers.length < 6) {
      ticketData.numbers.push(number);
    } else {
      alert('You can only select 6 numbers.');
    }
  } else {
    ticketData.numbers.splice(index, 1);
  }
  updateSelectedNumbersDisplay();
}

function updateSelectedNumbersDisplay() {
  const selectedNumbersDiv = document.getElementById('selectedNumbers');
  if (selectedNumbersDiv) {
    selectedNumbersDiv.textContent = `Selected Numbers: ${ticketData.numbers.join(', ')}`;
  } else {
    const div = document.createElement('div');
    div.id = 'selectedNumbers';
    div.textContent = `Selected Numbers: ${ticketData.numbers.join(', ')}`;
    userSection.appendChild(div);
  }
}

function selectNumbers() {
  if (ticketData.numbers.length !== 6) {
    alert('Please select 6 numbers.');
    return;
  }
  const boards = prompt('How many boards do you want to generate?');
  ticketData.boards = Array.from({ length: Number(boards) }, () => [...ticketData.numbers]);
  ticketData.price = calculatePrice(Number(boards), true, true); // Example: always include LottoPlus1 and LottoPlus2
  displayTicketInfo();
}


// Step 5: Implement Draw Simulation and Winning Logic
function simulateDraw() {
  drawData.winningNumbers = generateRandomNumbers(6, 1, 52);
  drawData.date = new Date().toLocaleString();
  displayDrawResults();
  determineWinners();
}

function generateRandomNumbers(count, min, max) {
  const numbers = [];
  while (numbers.length < count) {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numbers.includes(randomNumber)) numbers.push(randomNumber);
  }
  return numbers;
}

// Step 8: Implement the Main Logic
function initApp() {
  renderNumberSelection();
  loadSavedData();
  setUpEventListeners();
}


// Initialize the app
initApp();
