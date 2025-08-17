document.addEventListener('DOMContentLoaded', () => {
    // --- Variáveis e elementos ---
    const searchInput = document.getElementById('searchInput');
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
    const addItemForm = document.getElementById('addItemForm');

    const instrutoresConvidadosInput = document.getElementById('instrutoresConvidados');
    const videoTransmissaoInput = document.getElementById('videoTransmissao');
    const produtoInput = document.getElementById('produto');
    const verticalInput = document.getElementById('vertical');
    const dataInput = document.getElementById('data');
    const linkInput = document.getElementById('link');
    const publicadoEmInput = document.getElementById('publicadoEm');

    const submitButton = addItemForm.querySelector('button[type="submit"]');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    let rowToEdit = null;

    // --- Nova função para formatar a data para DD/MM/YYYY ---
    function formatDateToBrazilian(dateString) {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // --- Funcionalidade de Filtro ---
    searchInput.addEventListener('keyup', (event) => {
        const filter = event.target.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            let rowVisible = false;
            const cells = rows[i].getElementsByTagName('td');
            for (let j = 0; j < cells.length - 1; j++) { 
                const cellText = cells[j].textContent || cells[j].innerText;
                if (cellText.toLowerCase().indexOf(filter) > -1) {
                    rowVisible = true;
                    break;
                }
            }
            if (rowVisible) {
                rows[i].classList.remove('hidden');
            } else {
                rows[i].classList.add('hidden');
            }
        }
    });
    
    // LIMPAR O FILTRO DE PESQUISA
    clearFilterBtn.addEventListener('click', () => {
        searchInput.value = '';
        const rows = tableBody.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            rows[i].classList.remove('hidden');
        }
    });

    // --- Funcionalidade de Adicionar/Editar Itens ---
    addItemForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const instrutoresConvidados = instrutoresConvidadosInput.value;
        const videoTransmissao = videoTransmissaoInput.value;
        const produto = produtoInput.value;
        const vertical = verticalInput.value;
        const data = dataInput.value;
        const link = linkInput.value;
        const publicadoEm = publicadoEmInput.value;
        
        // Formata a data para o formato brasileiro
        const formattedDate = formatDateToBrazilian(data);

        if (rowToEdit) {
            // Modo de edição: atualiza as células da linha
            rowToEdit.cells[0].textContent = instrutoresConvidados;
            rowToEdit.cells[1].textContent = videoTransmissao;
            rowToEdit.cells[2].textContent = produto;
            rowToEdit.cells[3].textContent = vertical;
            // Usa a data formatada
            rowToEdit.cells[4].textContent = formattedDate;
            rowToEdit.cells[5].innerHTML = `<a href="${link}" target="_blank">Link</a>`;
            rowToEdit.cells[6].textContent = publicadoEm;
            
            submitButton.textContent = 'Adicionar';
            rowToEdit = null;

        } else {
            // Modo de adição: cria uma nova linha
            const newRow = document.createElement('tr');
            
            newRow.innerHTML = `
                <td data-label="Instrutores / Convidados">${instrutoresConvidados}</td>
                <td data-label="Vídeo / Transmissão">${videoTransmissao}</td>
                <td data-label="Produto">${produto}</td>
                <td data-label="Vertical">${vertical}</td>
                <td data-label="Data">${formattedDate}</td>
                <td data-label="Link"><a href="${link}" target="_blank">Link</a></td>
                <td data-label="Publicado em">${publicadoEm}</td>
                <td data-label="Ações" class="actions-cell">
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Excluir</button>
                </td>
            `;
            
            tableBody.appendChild(newRow);
        }

        addItemForm.reset();
        instrutoresConvidadosInput.focus();
    });

    // --- Funcionalidade de Excluir e Editar ---
    tableBody.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('delete-btn')) {
            const row = target.closest('tr');
            if (confirm("Tem certeza que deseja excluir este item?")) {
                row.remove();
            }
        } else if (target.classList.contains('edit-btn')) {
            const row = target.closest('tr');
            const cells = row.getElementsByTagName('td');
            
            instrutoresConvidadosInput.value = cells[0].textContent;
            videoTransmissaoInput.value = cells[1].textContent;
            produtoInput.value = cells[2].textContent;
            verticalInput.value = cells[3].textContent;
            // Converte a data de volta para YYYY-MM-DD para que o campo de input a reconheça
            const [day, month, year] = cells[4].textContent.split('/');
            dataInput.value = `${year}-${month}-${day}`;
            
            linkInput.value = cells[5].querySelector('a').href;
            publicadoEmInput.value = cells[6].textContent;

            submitButton.textContent = 'Salvar Alterações';
            rowToEdit = row;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});