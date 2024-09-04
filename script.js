// Seleciona os elementos do DOM
const stepInput = document.getElementById('stepInput');
const addStepButton = document.getElementById('addStepButton');
const stepList = document.getElementById('stepList');
const exportPDFButton = document.getElementById('exportPDFButton');
const exportFileButton = document.getElementById('exportFileButton');
const importFileInput = document.getElementById('importFileInput');
const importFileButton = document.getElementById('importFileButton');

// Função para adicionar um novo passo
function addStep(text, editable = false) {
    const stepText = text || stepInput.value.trim();
    
    if (stepText !== '') {
        const li = document.createElement('li');
        li.textContent = stepText;

        // Botão para editar o passo
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit-button');
        editButton.onclick = () => editStep(li, stepText);

        // Botão para remover o passo
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.classList.add('remove-button');
        removeButton.onclick = () => stepList.removeChild(li);

        li.appendChild(editButton);
        li.appendChild(removeButton);
        stepList.appendChild(li);

        if (!editable) {
            stepInput.value = '';
        }
    }
}

// Função para editar um passo
function editStep(li, oldText) {
    const newText = prompt('Edite o passo:', oldText);
    if (newText !== null && newText.trim() !== '') {
        li.firstChild.textContent = newText.trim();
    }
}

// Exportar lista de passos para PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const date = new Date();
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();

    // Adiciona título e data/hora ao PDF
    doc.setFontSize(18);
    doc.text('Step by Step', 10, 10);
    doc.setFontSize(12);
    doc.text(`Exportado em: ${dateString} às ${timeString}`, 10, 20);

    // Adiciona cada passo ao PDF
    const steps = Array.from(stepList.getElementsByTagName('li')).map(li => li.textContent.replace(/(Editar|Remover)/g, '').trim());

    steps.forEach((step, index) => {
        doc.text(`${index + 1}. ${step}`, 10, 30 + (index * 10));
    });

    doc.save('steps.pdf');
}

// Exportar lista de passos para um arquivo JSON
function exportToFile() {
    const steps = Array.from(stepList.getElementsByTagName('li')).map(li => li.textContent.replace(/(Editar|Remover)/g, '').trim());
    const blob = new Blob([JSON.stringify(steps, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'steps.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Importar lista de passos de um arquivo JSON
function importFromFile(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const steps = JSON.parse(e.target.result);
            stepList.innerHTML = ''; // Limpa a lista atual
            steps.forEach(step => addStep(step, true)); // Adiciona os passos importados
        };
        reader.readAsText(file);
    }
}

// Adiciona evento ao botão de adicionar passo
addStepButton.addEventListener('click', () => addStep());

// Permite adicionar o passo ao pressionar "Enter"
stepInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addStep();
    }
});

// Eventos para exportar e importar
exportPDFButton.addEventListener('click', exportToPDF);
exportFileButton.addEventListener('click', exportToFile);
importFileButton.addEventListener('click', () => importFileInput.click());
importFileInput.addEventListener('change', importFromFile);
