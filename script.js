const balance = document.getElementById('Balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById("form");
const text = document.getElementById('text');
const incomeText = document.getElementById('income-text');
const expenseText = document.getElementById('expense-text');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let financeChart;

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function addTransaction(e) {
  e.preventDefault();

  const name = text.value;
  const income = incomeText.value.trim() !== '' ? +incomeText.value : 0;
  const expense = expenseText.value.trim() !== '' ? -expenseText.value : 0;

  if (income === 0 && expense === 0) {
    alert('Please enter a valid amount.');
    return;
  }

  if (income !== 0) {
    const transaction = { id: generateID(), text: name, amount: income };
    transactions.push(transaction);
    addTransactionDOM(transaction);
  }

  if (expense !== 0) {
    const transaction = { id: generateID(), text: name, amount: expense };
    transactions.push(transaction);
    addTransactionDOM(transaction);
  }

  updateValues();
  updateLocalStorage();

  text.value = '';
  incomeText.value = '';
  expenseText.value = '';
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');

  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">×</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${Math.abs(expense)}`;

  updateChart(income, Math.abs(expense));
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

function updateChart(income, expense) {
  const ctx = document.getElementById('financeChart').getContext('2d');

  if (financeChart) financeChart.destroy();

  financeChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        data: [income, expense],
        backgroundColor: ['#10b981', '#ef4444'],
        borderColor: ['#059669', '#dc2626'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

form.addEventListener('submit', addTransaction);
init();
