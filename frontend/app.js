const API_BASE = 'http://127.0.0.1:5000';

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
        `;
        card.addEventListener('click', (e) => {
            // Only toggle if not clicking inside the form/modal
            if (e.target.closest('form')) return;
            const details = card.querySelector('.card-details');
            details.classList.toggle('open');
        });
        contactsList.appendChild(card);
    });
}

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

// Modal logic
addContactBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
});
closeModal.addEventListener('click', () => {
    modal.classList.add('hidden');
    addContactForm.reset();
});
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
        addContactForm.reset();
    }
});

// Add contact form
addContactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const team_member = addContactForm.teamMember.value.trim();
    const company_name = addContactForm.companyName.value.trim();
    const contact_details = addContactForm.contactDetails.value.trim();
    if (!team_member || !company_name) return;
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
});

// Initial load
loadContacts();
