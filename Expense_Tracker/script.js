const amountInput = document.getElementById('amount');
const descriptionInput = document.getElementById('description');
const categorySelect = document.getElementById('category');
const addExpenseButton = document.getElementById('add-expense-btn');
const expenseTableBody = document.querySelector('#expense-table tbody');
const categorySummary = document.getElementById('category-summary');
const expenseChart = document.getElementById('expense-chart');

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

addExpenseButton.addEventListener('click', () => {
  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value.trim();
  const category = categorySelect.value;

  if (!amount || !description) {
    alert('Please fill in all fields');
    return;
  }

  const expense = { amount, description, category };
  expenses.push(expense);
  saveExpenses();
  renderExpenses();
  renderSummary();
  renderChart();

  amountInput.value = '';
  descriptionInput.value = '';
});

function renderExpenses() {
  expenseTableBody.innerHTML = '';
  expenses.forEach((expense, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.amount.toFixed(2)}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td><button onclick="deleteExpense(${index})">Delete</button></td>
    `;
    expenseTableBody.appendChild(row);
  });
}

function renderSummary() {
  categorySummary.innerHTML = '';
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  for (const [category, total] of Object.entries(categoryTotals)) {
    const listItem = document.createElement('li');
    listItem.textContent = `${category}: $${total.toFixed(2)}`;
    categorySummary.appendChild(listItem);
  }
}

function renderChart() {
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  const labels = Object.keys(categoryTotals);
  const data = Object.values(categoryTotals);

  new Chart(expenseChart, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#007bff', '#ffc107', '#28a745', '#dc3545'],
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  renderExpenses();
  renderSummary();
  renderChart();
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}

renderExpenses();
renderSummary();
renderChart();
