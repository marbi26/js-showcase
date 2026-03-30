// Load from localStorage or start empty
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentType = 'income';

// On page load
renderAll();
updateToggleStyle();

function setType(type) {
  currentType = type;
  updateToggleStyle();
}

function updateToggleStyle() {
  const incomeBtn = document.getElementById('btn-income');
  const expenseBtn = document.getElementById('btn-expense');

  incomeBtn.className = 'toggle-btn';
  expenseBtn.className = 'toggle-btn';

  if (currentType === 'income') {
    incomeBtn.classList.add('active', 'income-active');
  } else {
    expenseBtn.classList.add('active', 'expense-active');
  }
}

function addTransaction() {
  const desc = document.getElementById('desc').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const error = document.getElementById('error');

  if (!desc) { error.textContent = 'Please enter a description.'; return; }
  if (!amount || amount <= 0) { error.textContent = 'Please enter a valid amount.'; return; }

  error.textContent = '';

  const transaction = {
    id: Date.now(),
    desc,
    amount,
    type: currentType,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  transactions.unshift(transaction); // newest first
  save();
  renderAll();

  // Clear inputs
  document.getElementById('desc').value = '';
  document.getElementById('amount').value = '';
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  renderAll();
}

function clearAll() {
  if (transactions.length === 0) return;
  if (confirm('Clear all transactions?')) {
    transactions = [];
    save();
    renderAll();
  }
}

function save() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function renderAll() {
  renderSummary();
  renderList();
}

function renderSummary() {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  const balanceEl = document.getElementById('balance');
  balanceEl.textContent = formatAmount(balance);
  balanceEl.style.color = balance >= 0 ? '#4caf50' : '#f44336';

  document.getElementById('total-income').textContent = formatAmount(income);
  document.getElementById('total-expense').textContent = formatAmount(expense);
}

function renderList() {
  const list = document.getElementById('transaction-list');
  const emptyMsg = document.getElementById('empty-msg');

  list.innerHTML = '';

  if (transactions.length === 0) {
    emptyMsg.style.display = 'block';
    return;
  }

  emptyMsg.style.display = 'none';

  transactions.forEach(t => {
    const li = document.createElement('li');
    li.className = `transaction-item ${t.type}`;
    li.innerHTML = `
      <div class="info">
        <span>${t.desc}</span>
        <small>${t.date}</small>
      </div>
      <div class="right">
        <span class="amount">${t.type === 'income' ? '+' : '-'}${formatAmount(t.amount)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">✕</button>
      </div>
    `;
    list.appendChild(li);
  });
}

function formatAmount(amount) {
  return '₹' + Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}