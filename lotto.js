// let lottoNumbers = [];
// for(i=0; i<= 52; i++){
//     lottoNumbers.push(i);
// }

// let tickets = {
//     ticketNumber : 1234,
//     boards: 2,
//     number:[[1,2,20,17,11],[4,5,6,37,7]],
//     prices: 10
// };

// let Draw = {

// }

 // UI Elements
 const userModeBtn = document.getElementById('userModeBtn');
 const adminModeBtn = document.getElementById('adminModeBtn');
 const userMode = document.getElementById('userMode');
 const adminMode = document.getElementById('adminMode');
 const boardsSelect = document.getElementById('boardsSelect');
 const numberButtons = document.querySelectorAll('.number-selection button');
 const lottoPlus1Input = document.getElementById('lottoPlus1');
 const lottoPlus2Input = document.getElementById('lottoPlus2');
 const generateTicketsBtn = document.getElementById('generateTickets');
 const simulateDrawBtn = document.getElementById('simulateDraw');
 const ticketInfo = document.getElementById('ticketInfo');
 const simulationResults = document.getElementById('simulationResults');

 // Event listeners
 userModeBtn.addEventListener('click', switchToUserMode);
 adminModeBtn.addEventListener('click', switchToAdminMode);
//  generateTicketsBtn.addEventListener('click', generateTickets);
//  simulateDrawBtn.addEventListener('click', simulateDraw);
 numberButtons.forEach(button => button.addEventListener('click', toggleNumberSelection));

 // Function to switch to User Mode
 function switchToUserMode() {
    userMode.style.display = 'block';
    adminMode.style.display = 'none';
    }

//Function to switch to Admin Mode
function switchToAdminMode() {
    adminMode.style.display = 'block';
    userMode.style.display = 'none';
}

//Function to toggle number selection
function toggleNumberSelection() {
    this.classList.toggle('selected');
}
