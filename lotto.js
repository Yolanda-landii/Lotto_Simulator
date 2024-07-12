// Data structures
const lottoNumbers = Array.from({ length: 52 }, (_, i) => i + 1);
const ballColors = ["red", "yellow", "green", "blue"];

const ticketPrices = {
  Lotto: 5.00,
  LottoPlus1: 2.50,
  LottoPlus2: 2.50,
};

let ticketData = {
      ticketNumber: 1,
      boards: [],
      numbers: [],
      price: 0,
      purchaseDate: null,
      lottoPlus1: false,
      lottoPlus2: false,
  };

  let drawData = {
      winningNumbers: [],
      date: null,
  };

  // HTML elements
const numberSelection = document.getElementById('numberSelection');
const ticketInfo = document.getElementById('ticketInfo');
const drawResults = document.getElementById('drawResults');
const userSection = document.getElementById('userSection');
const adminSection = document.getElementById('adminSection');
const loginSection = document.getElementById('loginSection');
const loginBtn = document.getElementById('loginBtn');
const generateBoardsBtn = document.getElementById('generateBoardsBtn');
const calculatePriceBtn = document.getElementById('calculatePriceBtn');
const simulateDrawBtn = document.getElementById('simulateDrawBtn');
const lottoPlus1Checkbox = document.getElementById('lottoPlus1');
const lottoPlus2Checkbox = document.getElementById('lottoPlus2');
const boardCountInput = document.getElementById('boardCount');
const drawCountInput = document.getElementById('drawCount');
const nextStepBtn = document.getElementById('nextStepBtn');
const ticketDetailsContainer = document.getElementById('ticketDetailsContainer');
const boardsContainer = document.getElementById('boardsContainer');
const adminSimulateDrawBtn = document.getElementById('adminSimulateDrawBtn');
// const adminDrawResults = document.getElementById('adminDrawResults');
const backToStartBtn = document.getElementById('backToStartBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Event Listeners
loginBtn.addEventListener('click', loginUser);
generateBoardsBtn.addEventListener('click', generateBoards);
calculatePriceBtn.addEventListener('click', calculatePrice);
simulateDrawBtn.addEventListener('click', simulateDraw);
nextStepBtn.addEventListener('click', handleNextStep);
// adminSimulateDrawBtn.addEventListener('click', adminSimulateDraw);
backToStartBtn.addEventListener('click', resetApplicationState);
// logoutBtn.addEventListener('click', logoutUser);

// Functions to handle tickets and boards
function createTicket() {
  return {
    ticketNumber: ticketData.ticketNumber++,
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
    ticketData = [newTicket];
  }
}

function saveTicketData(ticket) {
  const savedTickets = getSavedTickets();
  savedTickets.push(ticket);
  localStorage.setItem('tickets', JSON.stringify(savedTickets));
}

function getSavedTickets() {
  const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
  return tickets;
}

// Set Up the User Interface
function renderNumberSelection(boardIndex) {
  numberSelection.innerHTML = '';
  lottoNumbers.forEach(number => {
    const button = document.createElement('button');
    button.textContent = number;
    button.className = `number-button ${getBallColorClass(number)}`;
    button.addEventListener('click', () => handleBoardNumberSelection(boardIndex, number));
    numberSelection.appendChild(button);
  });
}

function getBallColorClass(number) {
  if (number >= 1 && number <= 13) return 'red';
  if (number >= 14 && number <= 25) return 'yellow';
  if (number >= 26 && number <= 37) return 'green';
  if (number >= 38 && number <= 52) return 'blue';
}

function handleBoardNumberSelection(boardIndex, number) {
  const board = ticketData.boards[boardIndex];
  const index = board.selectedNumbers.indexOf(number);
  if (index === -1) {
    if (board.selectedNumbers.length < 6) {
      board.selectedNumbers.push(number);
    } else {
      alert('You can only select 6 numbers.');
    }
  } else {
    board.selectedNumbers.splice(index, 1);
  }
  updateBoardNumbersDisplay(boardIndex);
}

function updateBoardNumbersDisplay(boardIndex) {
  const boardDiv = document.querySelectorAll('.board')[boardIndex];
  const numbersContainer = boardDiv.querySelector('.numbers-container');
  numbersContainer.innerHTML = ''; // Clear previous numbers

  ticketData.boards[boardIndex].selectedNumbers.forEach(number => {
    const ball = document.createElement('div');
    ball.textContent = number;
    ball.className = `number-button ${getBallColorClass(number)} selected`;
    numbersContainer.appendChild(ball);
  });
}

function updateButtonSelection(selectedNumbers) {
  const buttons = document.querySelectorAll('.number-button');
  buttons.forEach(button => {
    const number = parseInt(button.textContent);
    button.classList.toggle('selected', selectedNumbers.includes(number));
  });
}

function generateBoards() {
  const boardsCount = parseInt(boardCountInput.value, 10);
  if (isNaN(boardsCount) || boardsCount <= 0) {
    alert('Please enter a valid number of boards.');
    return;
  }

  ticketData.boards = Array.from({ length: boardsCount }, () => ({
    selectedNumbers: [],
  }));
  displayBoards();
}

function displayBoards() {
  boardsContainer.innerHTML = ''; // Clear previous boards

  ticketData.boards.forEach((board, index) => {
    const boardDiv = document.createElement('div');
    boardDiv.classList.add('board');

    const boardHeader = document.createElement('h3');
    boardHeader.textContent = `Board ${index + 1}`;
    boardDiv.appendChild(boardHeader);

    const numbersContainer = document.createElement('div');
    numbersContainer.classList.add('numbers-container');
    boardDiv.appendChild(numbersContainer);

    boardsContainer.appendChild(boardDiv);

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select Numbers';
    selectButton.addEventListener('click', () => renderNumberSelection(index));
    boardDiv.appendChild(selectButton);
  });

  boardsContainer.classList.remove('hidden');
  nextStepBtn.classList.remove('hidden');
}

function calculatePrice() {
  const boards = ticketData.boards.length;
  const includesLottoPlus1 = lottoPlus1Checkbox.checked;
  const includesLottoPlus2 = lottoPlus2Checkbox.checked;

  let baseCost = boards * ticketPrices.Lotto;

  if (includesLottoPlus1) baseCost += boards * ticketPrices.LottoPlus1;
  if (includesLottoPlus2) baseCost += boards * ticketPrices.LottoPlus2;

  ticketData.price = baseCost;
  displayTicketInfo();
}

function displayTicketInfo() {
  let boardsInfo = '';
  ticketData.boards.forEach((board, index) => {
    boardsInfo += `<h4>Board ${index + 1}:</h4><p>${board.selectedNumbers.join(', ')}</p>`;
  });

  ticketInfo.innerHTML = `
    <p>Ticket Number: ${ticketData.ticketNumber}</p>
    <p>Boards: ${ticketData.boards.length}</p>
    <p>Price: R${ticketData.price.toFixed(2)}</p>
    ${boardsInfo}
    <button id="confirmTicketBtn">Confirm Ticket</button>
    <button id="backToStartBtn">Back to Start</button>
    <button id="logoutBtn">Logout</button>
  `;

  // Add event listeners for new buttons
  document.getElementById('confirmTicketBtn').addEventListener('click', () => {
    saveTicketData(ticketData);
    resetApplicationState();
  });

  document.getElementById('backToStartBtn').addEventListener('click', () => {
    resetApplicationState();
  });
  document.getElementById('logoutBtn').addEventListener('click', logoutUser);
  const newLogoutBtn = document.getElementById('logoutBtn');
  if (newLogoutBtn) {
    newLogoutBtn.addEventListener('click', logoutUser);
  } else {
    console.error('Logout button not found');
  }
}

function handleNextStep() {
  const boardsCount = ticketData.boards.length;

  if (boardsCount === 0) {
    alert('No boards have been generated.');
    return;
  }
  // Hide previous elements and show board selection
  ticketDetailsContainer.classList.remove('hidden');
  boardsContainer.classList.add('hidden');
  nextStepBtn.classList.add('hidden');
}

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
  drawResults.classList.remove('hidden');
}

function determineWinners() {
  const winningNumbers = drawData.winningNumbers;
  const tickets = getSavedTickets();

  tickets.forEach(ticket => {
    ticket.boards.forEach(board => {
      const matchedNumbers = board.selectedNumbers.filter(num => winningNumbers.includes(num));
      if (matchedNumbers.length > 0) {
        console.log(`Ticket ${ticket.ticketNumber} - Board ${ticket.boards.indexOf(board) + 1}: ${matchedNumbers.length} match(es).`);
      }
    });
  });
}

function notifyWinners(winningTickets) {
  if (winningTickets.length > 0) {
    const winnerMessage = winningTickets.map(winner =>
      `Ticket Number: ${winner.ticket.ticketNumber}, Boards: ${winner.matchingNumbers.length}`
    ).join('\n');
    alert(`Congratulations to the winners!\n${winnerMessage}`);
  } else {
    alert('No winning tickets this draw.');
  }
}


function adminSimulateDraw() {
  simulateDraw(); // Assuming admin draw works the same as user draw
}


function resetApplicationState() {
  // Clear the current ticket data
  ticketData = {
    ticketNumber: 1,
    boards: [],
    numbers: [],
    price: 0,
    purchaseDate: null,
    lottoPlus1: false,
    lottoPlus2: false,
  };

  drawData = {
    winningNumbers: [],
    date: null,
  };

  numberSelection.innerHTML = '';
  ticketInfo.innerHTML = '';
  drawResults.innerHTML = '';
  boardsContainer.innerHTML = '';
  boardsContainer.classList.add('hidden');
  ticketDetailsContainer.classList.add('hidden');
  nextStepBtn.classList.add('hidden');

  generateBoardsBtn.classList.remove('hidden');
  boardCountInput.value = '';
  lottoPlus1Checkbox.checked = false;
  lottoPlus2Checkbox.checked = false;
  userSection.classList.remove('hidden');
  loginSection.classList.add('hidden');
}
function logoutUser() {
  // Hide user and admin sections and show login
  userSection.style.display = 'none';
  adminSection.style.display = 'none';
  loginSection.style.display = 'block';

  // Reset application state
  resetApplicationState();
}

function loginUser() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'password') {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
  } else if (username === 'user' && password === 'password') {
    loginSection.style.display = 'none';
    userSection.style.display = 'block';
  } else {
    alert('Invalid login credentials');
  }
}

// Initialize the application
function init() {
  loginBtn.addEventListener('click', loginUser);
  generateBoardsBtn.addEventListener('click', generateBoards);
  calculatePriceBtn.addEventListener('click', calculatePrice);
  simulateDrawBtn.addEventListener('click', simulateDraw);
  nextStepBtn.addEventListener('click', handleNextStep);
  // adminSimulateDrawBtn.addEventListener('click', adminSimulateDraw);
  backToStartBtn.addEventListener('click', resetApplicationState);
  logoutBtn.addEventListener('click', logoutUser); // Ensure event listener is attached
}
// Initialize on load
window.onload = init;