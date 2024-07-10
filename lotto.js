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
const loginSection = document.getElementById('loginSection');
const userBtn = document.getElementById('userBtn');
const adminBtn = document.getElementById('adminBtn');
const loginBtn = document.getElementById('loginBtn');
// Event listeners
userBtn.addEventListener('click', () => {
    loginSection.style.display = 'none';
    adminSection.style.display = 'none';
    userSection.style.display = 'block';
  });
  
adminBtn.addEventListener('click', () => {
    loginSection.style.display = 'none';
    userSection.style.display = 'none';
    adminSection.style.display = 'block';

    });

document.getElementById('generateBoardsBtn').addEventListener('click', selectNumbers);
document.getElementById('simulateDrawBtn').addEventListener('click', simulateDraw);


// Functions to handle tickets and boards
function createTicket() {
  return {
    ticketNumber: tickets.length + 1,
    purchaseDate: new Date().toLocaleDateString(),
    boards: [],
  };
}
function addBoardToTicket(ticket, board) {
    if (ticket.boards.length < 10) {
      ticket.boards.push(board);
    } else {
      const newTicket = createTicket();
      newTicket.boards.push(board);
      ticket.push(newTicket);
    }
  }

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
  
    const boardsCount = prompt('How many boards do you want to generate?');
    ticketData.boards = Array.from({ length: Number(boardsCount) }, () => ({
      selectedNumbers: [],
    }));
  
    ticketData.price = calculatePrice(Number(boardsCount), true, true); // Example: always include LottoPlus1 and LottoPlus2
    displayTicketInfo();
    displayBoards();
  }
  
  function displayBoards() {
    const boardsContainer = document.getElementById('boardsContainer');
    boardsContainer.innerHTML = ''; // Clear previous boards
  
    ticketData.boards.forEach((board, index) => {
      const boardDiv = document.createElement('div');
      boardDiv.classList.add('board');
  
      const boardHeader = document.createElement('h3');
      boardHeader.textContent = `Board ${index + 1}`;
      boardDiv.appendChild(boardHeader);
  
      const numbersContainer = document.createElement('div');
      numbersContainer.classList.add('numbers-container');
  
      // Render balls for each number in the board
      lottoNumbers.forEach(number => {
        const button = document.createElement('button');
        button.textContent = number;
        button.className = getBallColorClass(number);
        button.addEventListener('click', () => handleBoardNumberSelection(index, number));
        numbersContainer.appendChild(button);
      });
  
      boardDiv.appendChild(numbersContainer);
      boardsContainer.appendChild(boardDiv);
    });
  }
  
  function handleBoardNumberSelection(boardIndex, number) {
    const board = ticketData.boards[boardIndex];
    if (board.selectedNumbers.length < 6) {
      board.selectedNumbers.push(number);
      updateBoardNumbersDisplay(boardIndex);
    } else {
      alert('You can only select 6 numbers per board.');
    }
  }
  
  function updateBoardNumbersDisplay(boardIndex) {
    const boardDiv = document.querySelectorAll('.board')[boardIndex];
    const numbersContainer = boardDiv.querySelector('.numbers-container');
    numbersContainer.innerHTML = ''; // Clear previous numbers
  
    ticketData.boards[boardIndex].selectedNumbers.forEach(number => {
      const button = document.createElement('button');
      button.textContent = number;
      button.className = getBallColorClass(number);
      button.addEventListener('click', () => handleBoardNumberSelection(boardIndex, number));
      numbersContainer.appendChild(button);
    });
  }
function calculatePrice(boards, includeLottoPlus1, includeLottoPlus2) {
    let baseCost = boards * ticketPrices.Lotto;
  
    // Add LottoPlus1 and LottoPlus2 only once if included
    // if (includeLottoPlus1) baseCost += ticketPrices.LottoPlus1;
    // if (includeLottoPlus2) baseCost += ticketPrices.LottoPlus2;
  
    return baseCost;
  }

function displayTicketInfo() {
  ticketInfo.innerHTML = `
    <p>Ticket Number: ${ticketData.ticketNumber || 'N/A'}</p>
    <p>Boards: ${ticketData.boards.length}</p>
    <p>Numbers: ${ticketData.numbers.join(', ')}</p>
    <p>Price: R${ticketData.price.toFixed(2)}</p>
  `;
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


function displayDrawResults() {
  drawResults.innerHTML = `
    <p>Winning Numbers: ${drawData.winningNumbers.join(', ')}</p>
    <p>Date: ${drawData.date}</p>
  `;
}

function determineWinners() {
  const savedTickets = getSavedTickets();
  const winningTickets = [];
  savedTickets.forEach(ticket => {
    const matchingNumbers = ticket.boards.filter(board => 
      board.filter(number => drawData.winningNumbers.includes(number)).length >= 3
    );
    if (matchingNumbers.length > 0) winningTickets.push(ticket);
  });
  saveWinningTickets(winningTickets);
  displayNotification(winningTickets);
  alertAdmin(winningTickets);
}

// Step 8: Implement the Main Logic
function initApp() {
  renderNumberSelection();
  loadSavedData();
  setUpEventListeners();
}


// Initialize the app
initApp();

// Login Functionality
const users = [
    { username: 'user', password: 'user123', role: 'user' },
    { username: 'admin', password: 'admin123', role: 'admin' }
  ];
  function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const user = users.find(u => u.username === username && u.password === password);
  
    if (user) {
      if (user.role === 'user') {
        loginAsUser();
      } else if (user.role === 'admin') {
        loginAsAdmin();
      }
    } else {
      alert('Invalid username or password.');
    }
  }
  
  function loginAsUser() {
    loginSection.style.display = 'none';
    adminSection.style.display = 'none';
    userSection.style.display = 'block';
  }
  
  function loginAsAdmin() {
    loginSection.style.display = 'none';
    userSection.style.display = 'none';
    adminSection.style.display = 'block';
  }
  