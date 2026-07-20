/**
 * auth.js — Shared authentication utilities
 * Used by: setup-pin.html, pin.html, dashboard.html, contact.html
 */

/**
 * Fetch current authenticated user from the API.
 * Returns user object or null if not authenticated.
 */
async function getAuthUser() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.user) {
      if (data.user.pinSet && data.user.pinVerified && sessionStorage.getItem('khatabook_pin_verified') !== 'true') {
        // Tab session expired or tab was closed/reopened — lock PIN
        await fetch('/api/auth/lock-pin', { method: 'POST', credentials: 'include' });
        data.user.pinVerified = false;
      }
      return data.user;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Sets up PIN input boxes with auto-advance and backspace navigation.
 * @param {HTMLInputElement[]} inputs - Array of 4 PIN input elements
 * @param {Function} onComplete - Callback when all 4 digits are filled
 */
function setupPinInputs(inputs, onComplete) {
  inputs.forEach((input, index) => {
    // Only allow digit input
    input.addEventListener('keydown', (e) => {
      // Allow backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (input.value) {
          input.value = '';
          input.classList.remove('filled');
        } else if (index > 0) {
          inputs[index - 1].focus();
          inputs[index - 1].value = '';
          inputs[index - 1].classList.remove('filled');
        }
        return;
      }

      // Allow arrow navigation
      if (e.key === 'ArrowLeft' && index > 0) { inputs[index - 1].focus(); return; }
      if (e.key === 'ArrowRight' && index < inputs.length - 1) { inputs[index + 1].focus(); return; }

      // Allow only digits
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        return;
      }
    });

    input.addEventListener('input', (e) => {
      // Keep only last digit
      const val = input.value.replace(/\D/g, '');
      input.value = val ? val[val.length - 1] : '';

      if (input.value) {
        input.classList.add('filled');
        // Move to next
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        } else {
          // All filled — trigger callback
          const allFilled = inputs.every(i => i.value.length === 1);
          if (allFilled && onComplete) {
            setTimeout(onComplete, 100);
          }
        }
      } else {
        input.classList.remove('filled');
      }
    });

    // Handle paste (e.g., autofill)
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
      if (pasted.length === 4) {
        inputs.forEach((inp, i) => {
          inp.value = pasted[i] || '';
          inp.classList.toggle('filled', !!inp.value);
        });
        inputs[3].focus();
        setTimeout(onComplete, 100);
      }
    });
  });

  // Focus first input on load
  setTimeout(() => inputs[0] && inputs[0].focus(), 200);
}

/**
 * Format a number as Indian Rupee
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));
}

/**
 * Format date for display
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return typeof t === 'function' ? t('today') : 'Today';
  if (diffDays === 1) return typeof t === 'function' ? t('yesterday') : 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Get time of day greeting
 */
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}
