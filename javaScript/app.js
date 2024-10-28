let editKey = null; // To track the key being edited

// Set data to the selected storage type
function setData(type) {
    const key = document.getElementById("key").value;
    const value = document.getElementById("value").value;

    if (key && value) {
        if (editKey === null) {
            // If not editing, add new entry
            if (type === 'session') {
                sessionStorage.setItem(key, value);
            } else if (type === 'local') {
                localStorage.setItem(key, value);
            } else if (type === 'cookie') {
                document.cookie = `${key}=${encodeURIComponent(value)};path=/`;
            }
        } else {
            // If editing, update the existing entry
            if (type === 'session') {
                sessionStorage.setItem(editKey, value);
            } else if (type === 'local') {
                localStorage.setItem(editKey, value);
            } else if (type === 'cookie') {
                document.cookie = `${editKey}=${encodeURIComponent(value)};path=/`;
            }
            editKey = null; // Reset the edit key after updating
        }
        document.getElementById("key").value = ""; // Clear form after saving
        document.getElementById("value").value = "";
        updateTable(type);
    }
}

// Update UI for a specific type of storage
function updateTable(type) {
    const tableBody = document.querySelector(`#${type}Table tbody`);
    tableBody.innerHTML = ''; // Clear table

    if (type === 'session') {
        Object.keys(sessionStorage).forEach((key) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${key}</td><td>${sessionStorage.getItem(key)}</td>`;
            row.appendChild(createActionButtons('session', key));
            tableBody.appendChild(row);
        });
    } else if (type === 'local') {
        Object.keys(localStorage).forEach((key) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${key}</td><td>${localStorage.getItem(key)}</td>`;
            row.appendChild(createActionButtons('local', key));
            tableBody.appendChild(row);
        });
    } else if (type === 'cookie') {
        document.cookie.split(";").forEach(cookie => {
            const [key, value] = cookie.split('=');
            if (key && value) {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${key.trim()}</td><td>${decodeURIComponent(value.trim())}</td>`;
                row.appendChild(createActionButtons('cookie', key.trim()));
                tableBody.appendChild(row);
            }
        });
    }
}

// Edit data, populates form with selected key-value
function editData(type, key) {
    let value;
    if (type === 'session') {
        value = sessionStorage.getItem(key);
    } else if (type === 'local') {
        value = localStorage.getItem(key);
    } else if (type === 'cookie') {
        value = getCookie(key);
    }
    document.getElementById("key").value = key;
    document.getElementById("value").value = value;
    editKey = key; // Set editKey so we know which entry to update
}

// Remove data
function removeData(type, key) {
    if (type === 'session') {
        sessionStorage.removeItem(key);
    } else if (type === 'local') {
        localStorage.removeItem(key);
    } else if (type === 'cookie') {
        document.cookie = `${key}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    }
    updateTable(type);
}

// Helper function for editing and deleting rows in the table
function createActionButtons(type, key) {
    const editButton = document.createElement("button");
    editButton.innerText = "Edit";
    editButton.onclick = () => editData(type, key);

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => removeData(type, key);

    const container = document.createElement("span");
    container.appendChild(editButton);
    container.appendChild(deleteButton);

    return container;
}

// Get cookie value
function getCookie(key) {
    const keyValue = key.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
    const cookie = document.cookie;
    const regex = new RegExp(`(?:^|;)\\s?${keyValue}=(.*?)(?:;|$)`, 'i');
    const match = cookie.match(regex);
    return match && decodeURIComponent(match[1]);
}

// Set event listeners for setting data
document.getElementById('setSession').onclick = () => setData('session');
document.getElementById('setLocal').onclick = () => setData('local');
document.getElementById('setCookieBtn').onclick = () => setData('cookie');

// Initialize tables
updateTable('session');
updateTable('local');
updateTable('cookie');
