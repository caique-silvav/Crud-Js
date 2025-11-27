// =============================================
// CRUD de Tarefas com Validação Robusta
// Autor: Caique
// =============================================

// Armazenamento em memória (você pode substituir por localStorage depois)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingId = null;

// Elementos do DOM
const taskForm = document.getElementById('taskForm');
const inputTask = document.getElementById('inputTask');
const btnSave = document.getElementById('btnSave');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');

// Função para renderizar a lista de tarefas
function renderTasks() {
    // Limpa a lista
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
        tasks.forEach(task => {
            const li = document.createElement('li');

            // Cria o texto da tarefa
            const span = document.createElement('span');
            span.textContent = task.text;

            // Cria os botões de ação
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = '✏️ Editar';
            editBtn.onclick = () => editTask(task.id);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = '🗑️ Excluir';
            deleteBtn.onclick = () => deleteTask(task.id);

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            // Monta o item da lista
            li.appendChild(span);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    }

    // Salva no localStorage para persistência
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Função para validar a entrada
function validateInput(text) {
    if (!text || text.trim() === '') {
        alert('❌ A tarefa não pode estar vazia.');
        return false;
    }

    if (text.trim().length > 100) {
        alert('❌ A tarefa não pode ter mais de 100 caracteres.');
        return false;
    }

    // Verifica duplicatas (ignorando maiúsculas/minúsculas e espaços extras)
    const normalizedInput = text.trim().toLowerCase();
    const isDuplicate = tasks.some(
        task => task.text.trim().toLowerCase() === normalizedInput
    );

    if (isDuplicate && editingId === null) {
        alert('⚠️ Esta tarefa já existe na lista.');
        return false;
    }

    if (isDuplicate && editingId !== null) {
        // Se estiver editando, permite manter o mesmo texto (não é duplicata real)
        const currentTask = tasks.find(t => t.id === editingId);
        if (currentTask && currentTask.text.trim().toLowerCase() === normalizedInput) {
            return true; // é a mesma tarefa, ok
        } else {
            alert('⚠️ Já existe outra tarefa igual na lista.');
            return false;
        }
    }

    return true;
}

// Manipulador do formulário (Create + Update)
taskForm.addEventListener('submit', function (e) {
    e.preventDefault(); // Evita recarregar a página

    const text = inputTask.value;

    // Validação robusta
    if (!validateInput(text)) {
        inputTask.focus();
        return;
    }

    const normalizedText = text.trim();

    if (editingId !== null) {
        // Modo de atualização (Update)
        const taskIndex = tasks.findIndex(t => t.id === editingId);
        if (taskIndex !== -1) {
            tasks[taskIndex].text = normalizedText;
        }
        editingId = null;
        btnSave.textContent = 'Adicionar';
    } else {
        // Modo de criação (Create)
        tasks.push({
            id: Date.now(), // ID simples baseado em timestamp
            text: normalizedText
        });
    }

    // Limpa o campo e renderiza
    inputTask.value = '';
    inputTask.focus();
    renderTasks();
});

// Função para iniciar edição
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        inputTask.value = task.text;
        editingId = id;
        btnSave.textContent = 'Atualizar';
        inputTask.focus();
    }
}

// Função para excluir tarefa
function deleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(t => t.id !== id);
        // Se a tarefa excluída era a que estava sendo editada, cancela edição
        if (editingId === id) {
            editingId = null;
            btnSave.textContent = 'Adicionar';
            inputTask.value = '';
        }
        renderTasks();
    }
}

// Inicializa a aplicação
renderTasks();
inputTask.focus();