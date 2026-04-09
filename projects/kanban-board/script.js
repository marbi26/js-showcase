// State
let board = JSON.parse(localStorage.getItem('kanban')) || {
  todo:       [],
  inprogress: [],
  done:       []
};

let activeColumn = 'todo';
let currentTag   = 'low';
let draggedId    = null;

const columnIds = ['todo', 'inprogress', 'done'];

// Init
renderAll();

// ─── Modal ───────────────────────────────────────────

function openModal(column) {
  activeColumn = column;
  currentTag   = 'low';

  document.getElementById('task-input').value = '';
  document.getElementById('modal-error').classList.add('hidden');
  document.getElementById('modal-title').textContent =
    `Add to ${columnLabel(column)}`;

  updateTagButtons();
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('task-input').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

function setTag(tag) {
  currentTag = tag;
  updateTagButtons();
}

function updateTagButtons() {
  ['low', 'medium', 'high'].forEach(t => {
    document.getElementById(`tag-${t}`).classList.toggle('active', t === currentTag);
  });
}

// Close modal on Enter key
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
  if (e.key === 'Escape') closeModal();
});

// ─── Task CRUD ────────────────────────────────────────

function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();

  if (!text) {
    document.getElementById('modal-error').classList.remove('hidden');
    return;
  }

  const task = {
    id:       Date.now(),
    text,
    priority: currentTag
  };

  board[activeColumn].push(task);
  save();
  renderAll();
  closeModal();
}

function deleteTask(column, id) {
  board[column] = board[column].filter(t => t.id !== id);
  save();
  renderAll();
}

function clearAll() {
  if (confirm('Clear all tasks from the board?')) {
    board = { todo: [], inprogress: [], done: [] };
    save();
    renderAll();
  }
}

// ─── Drag & Drop ──────────────────────────────────────

function onDragStart(event, id) {
  draggedId = id;
  setTimeout(() => event.target.classList.add('dragging'), 0);
}

function onDragEnd(event) {
  event.target.classList.remove('dragging');
  document.querySelectorAll('.column').forEach(c => c.classList.remove('drag-over'));
}

function onDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function onDrop(event, targetColumn) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');

  if (!draggedId) return;

  // Find and remove from source column
  let task = null;
  columnIds.forEach(col => {
    const idx = board[col].findIndex(t => t.id === draggedId);
    if (idx !== -1) {
      task = board[col].splice(idx, 1)[0];
    }
  });

  if (task) {
    board[targetColumn].push(task);
    save();
    renderAll();
  }

  draggedId = null;
}

// ─── Render ───────────────────────────────────────────

function renderAll() {
  columnIds.forEach(col => {
    const list  = document.getElementById(`list-${col}`);
    const badge = document.getElementById(`badge-${col}`);

    list.innerHTML = '';
    badge.textContent = board[col].length;

    board[col].forEach(task => {
      const li = document.createElement('li');
      li.className = 'task-card';
      li.setAttribute('draggable', true);
      li.addEventListener('dragstart', e => onDragStart(e, task.id));
      li.addEventListener('dragend',   e => onDragEnd(e));

      li.innerHTML = `
        <div class="task-top">
          <span class="task-text">${escapeHTML(task.text)}</span>
          <button class="task-delete" onclick="deleteTask('${col}', ${task.id})">✕</button>
        </div>
        <span class="priority-tag priority-${task.priority}">
          ${priorityLabel(task.priority)}
        </span>
      `;

      list.appendChild(li);
    });
  });
}

// ─── Helpers ──────────────────────────────────────────

function save() {
  localStorage.setItem('kanban', JSON.stringify(board));
}

function columnLabel(col) {
  return { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }[col];
}

function priorityLabel(p) {
  return { low: '🟢 Low', medium: '🟡 Medium', high: '🔴 High' }[p];
}

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}