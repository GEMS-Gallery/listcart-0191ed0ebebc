import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    const shoppingList = document.getElementById('shopping-list');
    const addItemForm = document.getElementById('add-item-form');
    const newItemInput = document.getElementById('new-item');

    // Function to render the shopping list
    async function renderShoppingList() {
        const items = await backend.getItems();
        shoppingList.innerHTML = '';
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = `shopping-item ${item.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <span>${item.description}</span>
                <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            `;
            li.addEventListener('click', () => toggleItem(item.id));
            shoppingList.appendChild(li);
        });
    }

    // Function to add a new item
    async function addItem(description) {
        await backend.addItem(description);
        newItemInput.value = '';
        await renderShoppingList();
    }

    // Function to toggle item completion
    async function toggleItem(id) {
        await backend.toggleCompleted(id);
        await renderShoppingList();
    }

    // Function to delete an item
    async function deleteItem(id) {
        await backend.deleteItem(id);
        await renderShoppingList();
    }

    // Event listener for form submission
    addItemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const description = newItemInput.value.trim();
        if (description) {
            await addItem(description);
        }
    });

    // Event delegation for delete buttons
    shoppingList.addEventListener('click', async (e) => {
        if (e.target.closest('.delete-btn')) {
            e.stopPropagation();
            const id = parseInt(e.target.closest('.delete-btn').dataset.id);
            await deleteItem(id);
        }
    });

    // Initial render
    await renderShoppingList();
});