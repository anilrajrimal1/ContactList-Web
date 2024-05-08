document.addEventListener('DOMContentLoaded', fetchContacts);

function fetchContacts() {
    fetch('/api/contacts')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch contacts. Please try again later.');
        }
        return response.json();
    })
    .then(data => {
        const contactsList = document.getElementById("contactsList");
        contactsList.innerHTML = "";
        data.forEach(contact => {
            const contactElement = document.createElement("div");
            contactElement.classList.add("contact");
            contactElement.innerHTML = `
                <strong>${contact.name}</strong>: ${contact.phoneNumber}
                <button onclick="openUpdateModal('${contact.id}', '${contact.name}', '${contact.phoneNumber}')">Update</button>
                <button onclick="deleteContact('${contact.id}')" class="red-button">Delete</button>
            `;
            contactsList.appendChild(contactElement);
        });
    })
    .catch(error => {
        console.error('Error fetching contacts:', error.message);
    });
}

function addContact() {
    const name = document.getElementById("nameInput").value.trim();
    const phoneNumber = document.getElementById("phoneNumberInput").value.trim();

    if (name === "" || phoneNumber === "") {
        alert("Please enter both name and phone number.");
        return;
    }

    fetch('/api/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            phoneNumber: phoneNumber
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add contact. Please try again later.');
        }
        console.log('Contact added successfully.');
        fetchContacts();
        clearForm(); // Clear the form after adding contact
    })
    .catch(error => {
        console.error('Error adding contact:', error.message);
    });
}

function clearForm() {
    document.getElementById("nameInput").value = "";
    document.getElementById("phoneNumberInput").value = "";
}

function openUpdateModal(id, name, phoneNumber) {
    document.getElementById("updateIdInput").value = id;
    document.getElementById("updateNameInput").value = name;
    document.getElementById("updatePhoneNumberInput").value = phoneNumber;
    document.getElementById("updateModal").style.display = "block";
}

function closeUpdateModal() {
    document.getElementById("updateModal").style.display = "none";
}

function updateContact() {
    const id = document.getElementById("updateIdInput").value;
    const name = document.getElementById("updateNameInput").value.trim();
    const phoneNumber = document.getElementById("updatePhoneNumberInput").value.trim();

    if (name === "" || phoneNumber === "") {
        alert("Please enter both name and phone number.");
        return;
    }

    fetch(`/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            phoneNumber: phoneNumber
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update contact. Please try again later.');
        }
        console.log('Contact updated successfully.');
        fetchContacts();
        closeUpdateModal();
    })
    .catch(error => {
        console.error('Error updating contact:', error.message);
    });
}

function deleteContact(id) {
    if (!confirm('Are you sure you want to delete this contact?')) {
        return;
    }

    fetch(`/api/contacts/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete contact. Please try again later.');
        }
        console.log('Contact deleted successfully.');
        fetchContacts();
    })
    .catch(error => {
        console.error('Error deleting contact:', error.message);
    });
}
