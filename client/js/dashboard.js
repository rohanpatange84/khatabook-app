/**
 * dashboard.js — Dashboard page logic
 */

let allContacts = [];
let currentUser = null;

// ---- Init ----
(async () => {
  currentUser = await getAuthUser();
  if (!currentUser) { window.location.replace('/index.html'); return; }
  if (!currentUser.pinSet) { window.location.replace('/setup-pin.html'); return; }
  if (!currentUser.pinVerified) { window.location.replace('/pin.html'); return; }

  // Set up user info in navbar
  const avatar = document.getElementById('userAvatar');
  avatar.src = currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0D8ABC&color=fff`;
  avatar.onerror = () => {
    avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=0D8ABC&color=fff`;
  };
  document.getElementById('dropdownName').textContent = currentUser.name;
  document.getElementById('dropdownEmail').textContent = currentUser.email;
  document.getElementById('timeOfDay').textContent = getTimeOfDay();

  await loadDashboard();
})();

// Re-fetch fresh data if page is restored from browser back/forward cache
window.addEventListener('pageshow', (event) => {
  if (event.persisted && currentUser) {
    loadDashboard();
  }
});

async function loadDashboard() {
  try {
    const [contactsRes, summaryRes] = await Promise.all([
      fetch('/api/contacts', { credentials: 'include' }),
      fetch('/api/transactions/summary/all', { credentials: 'include' }),
    ]);

    const contactsData = await contactsRes.json();
    const summaryData = await summaryRes.json();

    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';

    if (contactsData.success) {
      allContacts = contactsData.contacts;
      renderContacts(allContacts);
    }

    if (summaryData.success) {
      const { totalGave, totalGot, netBalance } = summaryData.summary;
      document.getElementById('totalGet').textContent = formatCurrency(totalGave);
      document.getElementById('totalGive').textContent = formatCurrency(totalGot);

      const netEl = document.getElementById('netBalanceAmount');
      const labelEl = document.getElementById('netBalanceLabel');

      netEl.textContent = `₹${formatCurrency(netBalance)}`;
      if (netBalance > 0) {
        netEl.style.color = 'var(--accent-green)';
        labelEl.textContent = t('profitLabel');
        labelEl.style.color = 'var(--accent-green)';
      } else if (netBalance < 0) {
        netEl.style.color = 'var(--accent-red)';
        labelEl.textContent = t('lossLabel');
        labelEl.style.color = 'var(--accent-red)';
      } else {
        netEl.style.color = 'var(--text-secondary)';
        labelEl.textContent = t('settledLabel');
      }
    }
  } catch (e) {
    console.error('Dashboard load error:', e);
    document.getElementById('loadingState').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <div class="empty-title">Failed to load data</div>
        <div class="empty-desc">Please check your connection and refresh the page.</div>
      </div>
    `;
  }
}

function renderContacts(contacts) {
  const list = document.getElementById('contactList');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('contactCount');

  countEl.textContent = contacts.length;

  if (contacts.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = contacts.map(contact => {
    const balance = contact.totalBalance || 0;
    const isPositive = balance >= 0;
    const balanceColor = isPositive ? 'var(--accent-green)' : 'var(--accent-red)';
    const balanceLabel = isPositive
      ? (balance === 0 ? t('settledLabel') : t('youWillGet'))
      : t('youWillGive');

    const avatarUrl = contact.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random&color=fff&size=128`;

    return `
      <a class="contact-item" href="/contact.html?id=${contact._id}" id="contact-${contact._id}">
        <div class="contact-avatar-wrapper">
          <img src="${avatarUrl}" alt="${contact.name}" class="avatar" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=0D8ABC&color=fff'" />
        </div>
        <div class="contact-info">
          <div class="contact-name">${escapeHtml(contact.name)}</div>
          ${contact.phone ? `<div class="contact-phone">${escapeHtml(contact.phone)}</div>` : ''}
        </div>
        <div class="contact-balance">
          <div class="contact-balance-amount" style="color: ${balanceColor}">
            ₹${formatCurrency(balance)}
          </div>
          <div class="contact-balance-label" style="color: ${balanceColor}">${balanceLabel}</div>
        </div>
      </a>
    `;
  }).join('');
}

// ---- Search ----
function filterContacts() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    renderContacts(allContacts);
    return;
  }
  const filtered = allContacts.filter(c =>
    c.name.toLowerCase().includes(query) ||
    (c.phone && c.phone.includes(query))
  );
  renderContacts(filtered);
}

// ---- Add Contact Modal ----
function openAddContact() {
  document.getElementById('addContactModal').classList.add('open');
  document.getElementById('contactName').focus();
  document.getElementById('addContactError').style.display = 'none';
  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';
}

function closeAddContact() {
  document.getElementById('addContactModal').classList.remove('open');
}

// Close modal when clicking backdrop
document.getElementById('addContactModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('addContactModal')) closeAddContact();
});

// Enter key to submit
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (document.getElementById('addContactModal').classList.contains('open')) {
      addContact();
    }
  }
  if (e.key === 'Escape') {
    closeAddContact();
  }
});

async function addContact() {
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const errEl = document.getElementById('addContactError');
  const errMsg = document.getElementById('addContactErrorMsg');

  errEl.style.display = 'none';

  if (!name) {
    errMsg.textContent = 'Contact name is required.';
    errEl.style.display = 'flex';
    setTimeout(() => errEl.classList.add('show'), 10);
    document.getElementById('contactName').focus();
    return;
  }

  try {
    const res = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, phone }),
    });
    const data = await res.json();

    if (data.success) {
      closeAddContact();
      // Prepend new contact to the list
      allContacts.unshift(data.contact);
      renderContacts(allContacts);
      // Reload full dashboard data for updated balances
      await loadDashboard();
    } else {
      errMsg.textContent = data.message || 'Failed to add contact.';
      errEl.style.display = 'flex';
      setTimeout(() => errEl.classList.add('show'), 10);
    }
  } catch (e) {
    errMsg.textContent = 'Network error. Please try again.';
    errEl.style.display = 'flex';
    setTimeout(() => errEl.classList.add('show'), 10);
  }
}

// ---- Dropdown ----
function toggleDropdown() {
  document.getElementById('dropdown').classList.toggle('open');
}
document.addEventListener('click', (e) => {
  if (!document.getElementById('userMenu').contains(e.target)) {
    document.getElementById('dropdown').classList.remove('open');
  }
});

// ---- Logout ----
async function logout() {
  sessionStorage.removeItem('khatabook_pin_verified');
  await fetch('/api/auth/logout', { credentials: 'include' });
  window.location.replace('/index.html');
}

// ---- Utility ----
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
