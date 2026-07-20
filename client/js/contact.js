/**
 * contact.js — Contact detail page logic
 */

let contactId = null;
let contactData = null;
let transactions = [];
let selectedType = 'gave';

// ---- Init ----
(async () => {
  const user = await getAuthUser();
  if (!user) { window.location.replace('/index.html'); return; }
  if (!user.pinSet) { window.location.replace('/setup-pin.html'); return; }
  if (!user.pinVerified) { window.location.replace('/pin.html'); return; }

  // Get contact ID from URL
  const params = new URLSearchParams(window.location.search);
  contactId = params.get('id');
  if (!contactId) { window.location.replace('/dashboard.html'); return; }

  // Set today as default date
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('dateInput').value = today;

  await loadContact();
})();

async function loadContact() {
  try {
    const [contactRes, txnRes] = await Promise.all([
      fetch(`/api/contacts/${contactId}`, { credentials: 'include' }),
      fetch(`/api/transactions/${contactId}`, { credentials: 'include' }),
    ]);

    const contactResult = await contactRes.json();
    const txnResult = await txnRes.json();

    if (!contactResult.success) {
      window.location.replace('/dashboard.html');
      return;
    }

    contactData = contactResult.contact;
    transactions = txnResult.success ? txnResult.transactions : [];

    renderContactHeader();
    renderBalance(contactData.totalBalance || 0);
    renderTransactions(transactions);

    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('transactionsContent').style.display = 'block';
    document.getElementById('stickyBalance').style.display = 'flex';

  } catch (e) {
    console.error('Load contact error:', e);
    document.getElementById('loadingState').innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <div class="empty-title">Failed to load</div>
        <div class="empty-desc">Please go back and try again.</div>
      </div>
    `;
  }
}

function renderContactHeader() {
  const avatarUrl = contactData.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(contactData.name)}&background=0D8ABC&color=fff&size=128`;

  document.getElementById('contactHeaderSpinner').style.display = 'none';

  const header = document.getElementById('contactHeader');
  // Keep the back button, add contact info
  const infoDiv = document.createElement('div');
  infoDiv.style.cssText = 'display:flex;align-items:center;gap:12px;flex:1;';
  infoDiv.innerHTML = `
    <img src="${avatarUrl}" alt="${escapeHtml(contactData.name)}" class="avatar avatar-sm"
      onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(contactData.name)}&background=0D8ABC&color=fff'" />
    <div class="contact-header-info">
      <div class="contact-header-name">${escapeHtml(contactData.name)}</div>
      ${contactData.phone ? `<div class="contact-header-phone">${escapeHtml(contactData.phone)}</div>` : ''}
    </div>
  `;
  header.appendChild(infoDiv);

  // Update page title
  document.title = `${contactData.name} — KhataBook`;
}

function renderBalance(balance) {
  const display = document.getElementById('contactBalanceDisplay');
  const label = document.getElementById('balanceLabel');

  display.textContent = `₹${formatCurrency(balance)}`;

  if (balance > 0) {
    display.style.color = 'var(--accent-green)';
    label.textContent = `${contactData.name} ${t('owesYou')}`;
    label.style.color = 'var(--accent-green)';
  } else if (balance < 0) {
    display.style.color = 'var(--accent-red)';
    label.textContent = `${t('youOwe')} ${contactData.name}`;
    label.style.color = 'var(--accent-red)';
  } else {
    display.style.color = 'var(--text-secondary)';
    label.textContent = t('allSettled');
    label.style.color = 'var(--text-secondary)';
  }
}

function renderTransactions(txns) {
  const list = document.getElementById('transactionList');
  const empty = document.getElementById('emptyState');
  const countEl = document.getElementById('txnCount');

  countEl.textContent = `${txns.length} ${txns.length === 1 ? t('entryCount') : t('entriesCount')}`;

  if (txns.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  list.innerHTML = txns.map(txn => {
    const isGave = txn.type === 'gave';
    const icon = isGave ? '💸' : '💰';
    const amountColor = isGave ? 'gave' : 'got';
    const prefix = isGave ? '+' : '-';
    const subLabel = isGave ? t('gaveSub') : t('gotSub');

    return `
      <div class="transaction-item" id="txn-${txn._id}">
        <div class="txn-icon ${txn.type}">
          ${icon}
        </div>
        <div class="txn-info">
          <div class="txn-note">${txn.note ? escapeHtml(txn.note) : (isGave ? t('youGave') : t('youGot'))}</div>
          <div class="txn-date">${formatDate(txn.date)}</div>
        </div>
        <div>
          <div class="txn-amount ${amountColor}">${prefix}₹${formatCurrency(txn.amount)}</div>
          <div style="font-size:0.7rem;color:var(--text-muted);text-align:right;margin-top:2px;">${subLabel}</div>
        </div>
        <button class="txn-delete" onclick="deleteTransaction('${txn._id}')" title="Delete transaction">✕</button>
      </div>
    `;
  }).join('');
}

// ---- Add Transaction ----
function openAddTransaction() {
  document.getElementById('addTxnModal').classList.add('open');
  document.getElementById('amountInput').value = '';
  document.getElementById('noteInput').value = '';
  document.getElementById('txnError').style.display = 'none';
  document.getElementById('addTxnBtn').disabled = false;
  document.getElementById('addTxnBtn').textContent = 'Add Entry';
  selectType('gave');
  setTimeout(() => document.getElementById('amountInput').focus(), 200);
}

function closeAddTransaction() {
  document.getElementById('addTxnModal').classList.remove('open');
}

document.getElementById('addTxnModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('addTxnModal')) closeAddTransaction();
});

function selectType(type) {
  selectedType = type;
  document.getElementById('btnGave').classList.toggle('active', type === 'gave');
  document.getElementById('btnGot').classList.toggle('active', type === 'got');
}

async function addTransaction() {
  const amount = parseFloat(document.getElementById('amountInput').value);
  const note = document.getElementById('noteInput').value.trim();
  const date = document.getElementById('dateInput').value;
  const errEl = document.getElementById('txnError');
  const errMsg = document.getElementById('txnErrorMsg');

  errEl.style.display = 'none';
  errEl.classList.remove('show');

  if (!amount || isNaN(amount) || amount <= 0) {
    errMsg.textContent = 'Please enter a valid amount greater than 0.';
    errEl.style.display = 'flex';
    setTimeout(() => errEl.classList.add('show'), 10);
    document.getElementById('amountInput').focus();
    return;
  }

  const btn = document.getElementById('addTxnBtn');
  btn.disabled = true;
  btn.textContent = 'Adding...';

  try {
    const res = await fetch(`/api/transactions/${contactId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ type: selectedType, amount, note, date }),
    });
    const data = await res.json();

    if (data.success) {
      closeAddTransaction();
      // Add to top of list
      transactions.unshift(data.transaction);
      contactData.totalBalance = data.newBalance;
      renderBalance(data.newBalance);
      renderTransactions(transactions);
    } else {
      errMsg.textContent = data.message || 'Failed to add transaction.';
      errEl.style.display = 'flex';
      setTimeout(() => errEl.classList.add('show'), 10);
      btn.disabled = false;
      btn.textContent = 'Add Entry';
    }
  } catch (e) {
    errMsg.textContent = 'Network error. Please try again.';
    errEl.style.display = 'flex';
    setTimeout(() => errEl.classList.add('show'), 10);
    btn.disabled = false;
    btn.textContent = 'Add Entry';
  }
}

// ---- Delete Transaction ----
async function deleteTransaction(txnId) {
  if (!confirm('Delete this transaction?')) return;

  try {
    const res = await fetch(`/api/transactions/${contactId}/${txnId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();

    if (data.success) {
      transactions = transactions.filter(t => t._id !== txnId);
      contactData.totalBalance = data.newBalance;
      renderBalance(data.newBalance);
      renderTransactions(transactions);
    } else {
      alert(data.message || 'Failed to delete transaction.');
    }
  } catch (e) {
    alert('Network error. Please try again.');
  }
}

// ---- Delete Contact ----
function confirmDeleteContact() {
  document.getElementById('deleteContactName').textContent =
    `Deleting "${contactData.name}" will permanently remove all their ${transactions.length} transaction(s). This cannot be undone.`;
  document.getElementById('deleteModal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('deleteModal').classList.remove('open');
}

document.getElementById('deleteModal').addEventListener('click', (e) => {
  if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
});

async function deleteContact() {
  try {
    const res = await fetch(`/api/contacts/${contactId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await res.json();

    if (data.success) {
      window.location.replace('/dashboard.html');
    } else {
      alert(data.message || 'Failed to delete contact.');
      closeDeleteModal();
    }
  } catch (e) {
    alert('Network error. Please try again.');
    closeDeleteModal();
  }
}

// ---- Keyboard shortcut: Escape closes modals ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAddTransaction();
    closeDeleteModal();
  }
});

// ---- Utility ----
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
