const API_BASE = 'https://enigma-crm-backend.onrender.com';

const contactsList = document.getElementById('contactsList');
const searchBar = document.getElementById('searchBar');
const addContactBtn = document.getElementById('addContactBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const addContactForm = document.getElementById('addContactForm');

let contacts = [];

// Fetch and display contacts
async function loadContacts() {
    const res = await fetch(`${API_BASE}/contacts`);
    contacts = await res.json();
    renderContacts(contacts);
}

function renderContacts(list) {
    contactsList.innerHTML = '';
    if (list.length === 0) {
        contactsList.innerHTML = '<p>No contacts found.</p>';
        return;
    }
    list.forEach(contact => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        card.innerHTML = `
            <div class="card-header">${contact.company_name}</div>
            <div class="card-meta">Contacted by: ${contact.team_member}</div>
            <div class="card-details" id="details-${contact.id}">${contact.contact_details ? contact.contact_details.replace(/\n/g, '<br>') : '<em>No details</em>'}</div>
            <button class="edit-btn" data-id="${contact.id}" style="position:absolute;top:18px;right:18px;background:#fff;color:#1976d2;border:1.5px solid #1976d2;border-radius:6px;padding:4px 12px;font-size:0.98em;cursor:pointer;transition:background 0.2s;">Edit</button>
        `;
        card.addEventListener('click', (e) => {
            if (e.target.closest('form') || e.target.classList.contains('edit-btn')) return;
            const details = card.querySelector('.card-details');
            details.classList.toggle('open');
        });
        card.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openEditModal(contact);
        });
        contactsList.appendChild(card);
    });
}

// Track if editing and which contact
let editingContactId = null;

function openEditModal(contact) {
    editingContactId = contact.id;
    addContactForm.teamMember.value = contact.team_member;
    addContactForm.companyName.value = contact.company_name;
    addContactForm.contactDetails.value = contact.contact_details || '';
    modal.classList.remove('hidden');
}

addContactBtn.addEventListener('click', () => {
    editingContactId = null;
    modal.classList.remove('hidden');
});
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    addContactForm.reset();
    editingContactId = null;
});
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        addContactForm.reset();
        editingContactId = null;
    }
});

addContactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const team_member = addContactForm.teamMember.value.trim();
    const company_name = addContactForm.companyName.value.trim();
    const contact_details = addContactForm.contactDetails.value.trim();
    if (!team_member || !company_name) return;
    if (editingContactId) {
        // Edit mode
        const res = await fetch(`${API_BASE}/contacts/${editingContactId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ team_member, company_name, contact_details })
        });
        if (res.ok) {
            modal.classList.add('hidden');
            addContactForm.reset();
            editingContactId = null;
            loadContacts();
        } else {
            alert('Failed to update contact.');
        }
    } else {
        // Add mode
        const res = await fetch(`${API_BASE}/contacts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ team_member, company_name, contact_details })
        });
        if (res.ok) {
            modal.classList.add('hidden');
            addContactForm.reset();
            loadContacts();
        } else {
            alert('Failed to add contact.');
        }
    }
});

// Search functionality
searchBar.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = contacts.filter(c =>
        c.company_name.toLowerCase().includes(q) ||
        c.team_member.toLowerCase().includes(q) ||
        (c.contact_details && c.contact_details.toLowerCase().includes(q))
    );
    renderContacts(filtered);
});

// Initial load
loadContacts();
