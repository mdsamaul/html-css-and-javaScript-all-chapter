import { openDB } from 'https://unpkg.com/idb?module';

(async () => {
    // Open the database and create the data store
    const database = await openDB('ReaderNames', 1, {
        upgrade(db) {
            // Create a store of objects
            const store = db.createObjectStore('reader', {
                keyPath: 'id',
                autoIncrement: true
            });
            // Create new keys in the object store
            store.createIndex('age', 'age', { unique: false });
            store.createIndex('name', 'name', { unique: true });
        }
    });

    async function setData() {
        const name = document.getElementById('name').value;
        const age = parseInt(document.getElementById('age').value, 10);
        await database.add('reader', { name, age });
        document.getElementById('data-form').reset();
        loadData();
    }

    async function loadData() {
        const readers = await database.getAll('reader');
        const dataDisplay = document.getElementById('data-list');
        dataDisplay.innerHTML = ''; // Clear existing data

        readers.forEach(reader => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reader.name}</td>
                <td>${reader.age}</td>
                <td>
                    <button onclick="editData(${reader.id})">Edit</button>
                    <button onclick="deleteData(${reader.id})">Delete</button>
                </td>
            `;
            dataDisplay.appendChild(row);
        });
    }

    // Edit data
    window.editData = async (id) => {
        const reader = await database.get('reader', id);
        if (reader) {
            const name = prompt("Edit Name:", reader.name);
            const age = prompt("Edit Age:", reader.age);
            if (name !== null && age !== null) {
                await database.put('reader', { id, name, age: parseInt(age, 10) });
                loadData();
            }
        }
    };

    // Delete data
    window.deleteData = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this reader?");
        if (confirmDelete) {
            await database.delete('reader', id);
            loadData();
        }
    };

    document.getElementById('set').onclick = setData;
    loadData(); // Load initial data
})();
