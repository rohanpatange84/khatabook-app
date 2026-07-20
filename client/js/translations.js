/**
 * translations.js — Dictionary and language switcher helper for English & Marathi (मराठी)
 */

const translations = {
  en: {
    // Navigation & Common
    appTitle: "KhataBook",
    tagline: "Digital Ledger for Everyone",
    signOut: "Sign Out",
    cancel: "Cancel",
    delete: "Delete",
    save: "Save",
    today: "Today",
    yesterday: "Yesterday",

    // Index (Login)
    heroTitle: "Manage your business money smarter",
    heroDesc: "Track credit and debit with customers, friends & family. Free, secure and always available.",
    feat1: "Track who owes you and whom you owe",
    feat2: "Secured with your personal 4-digit PIN",
    feat3: "Instant sync across all your devices",
    googleLogin: "Continue with Google",
    termsNotice: "By continuing, you agree to our Terms of Service and Privacy Policy.",

    // Setup PIN
    setupPinTitle: "Set Your Secret PIN",
    setupPinDesc: "Create a 4-digit PIN to secure your KhataBook. You'll need this every time you log in.",
    confirmPinLabel: "Confirm your PIN",
    submitPinBtn: "Set PIN & Continue →",
    pinEncryptedNote: "🔒 Your PIN is encrypted with bcrypt and never stored in plain text.",

    // PIN Verification
    welcomeBack: "Welcome back!",
    enterPinDesc: "Enter your 4-digit PIN to continue",
    notYouLogout: "Not you? Sign out",
    pinSecuredNote: "🔒 Secured with end-to-end encryption",
    wrongPin: "Incorrect PIN. Please try again.",

    // Dashboard
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    financialOverview: "Here's your financial overview",
    netBalance: "Net Balance",
    profitLabel: "You are in profit 🎉",
    lossLabel: "You owe money 📉",
    settledLabel: "All settled up ✓",
    youWillGet: "You'll Get",
    youWillGive: "You'll Give",
    searchPlaceholder: "Search contacts...",
    contactsHeader: "Contacts",
    noContactsTitle: "No contacts yet",
    noContactsDesc: "Tap the + button to add your first contact",
    addContactTitle: "Add New Contact",
    nameLabel: "Name *",
    phoneLabel: "Phone (optional)",
    namePlaceholder: "Enter contact name",
    phonePlaceholder: "+91 99999 99999",
    addContactBtn: "Add Contact",

    // Contact Details
    balanceLabel: "Balance",
    owesYou: "owes you",
    youOwe: "You owe",
    allSettled: "All settled up ✓",
    youGave: "💸 You Gave",
    youGot: "💰 You Got",
    transactionsHeader: "Transactions",
    noTxnTitle: "No transactions yet",
    noTxnDesc: "Tap the + button to record a transaction",
    addTxnTitle: "Add Transaction",
    amountLabel: "Amount (₹) *",
    noteLabel: "Note (optional)",
    notePlaceholder: "e.g. Rent, groceries, loan...",
    dateLabel: "Date",
    addEntryBtn: "Add Entry",
    deleteContactTitle: "Delete Contact?",
    deleteContactConfirm: "This will permanently delete this contact and all their transactions.",
    gaveSub: "gave",
    gotSub: "got",
    entriesCount: "entries",
    entryCount: "entry",
  },
  mr: {
    // Navigation & Common
    appTitle: "खातेपुस्तक",
    tagline: "सर्वांसाठी डिजिटल खातेपुस्तक",
    signOut: "बाहेर पडा (Sign Out)",
    cancel: "रद्द करा",
    delete: "हटवा (Delete)",
    save: "जतन करा",
    today: "आज",
    yesterday: "काल",

    // Index (Login)
    heroTitle: "तुमच्या व्यवसायाचे पैसे सहज व्यवस्थापित करा",
    heroDesc: "ग्राहक, मित्र आणि कुटुंबासोबत जमा-उधारचा हिशोब ठेवा. मोफत, सुरक्षित आणि सोपे.",
    feat1: "कोणाकडून किती पैसे यायचे आणि कोणाला द्यायचे ते पहा",
    feat2: "तुमच्या ४ अंकी पिनने (PIN) पूर्णपणे सुरक्षित",
    feat3: "सर्व मोबाईल/संगणकावर झटपट अपडेट (Sync)",
    googleLogin: "गूगल सोबत सुरू करा (Continue with Google)",
    termsNotice: "पुढे चालू ठेवून तुम्ही आमच्या सेवा अटी आणि गोपनीयता धोरणास सहमती देता.",

    // Setup PIN
    setupPinTitle: "तुमचा गुपित पिन (PIN) तयार करा",
    setupPinDesc: "तुमचे खातेपुस्तक सुरक्षित ठेवण्यासाठी ४ अंकी पिन तयार करा. दरवेळी लॉग इन करताना हा पिन लागेल.",
    confirmPinLabel: "तुमचा पिन पुन्हा टाका",
    submitPinBtn: "पिन सेट करा आणि पुढे जा →",
    pinEncryptedNote: "🔒 तुमचा पिन पूर्णपणे एनक्रिप्टेड आणि सुरक्षित आहे.",

    // PIN Verification
    welcomeBack: "पुन्हा स्वागत आहे!",
    enterPinDesc: "पुढे जाण्यासाठी तुमचा ४ अंकी पिन टाका",
    notYouLogout: "तुम्ही नाही आहात? बाहेर पडा",
    pinSecuredNote: "🔒 पूर्णपणे सुरक्षित हिशोब",
    wrongPin: "चुकीचा पिन. कृपया पुन्हा प्रयत्न करा.",

    // Dashboard
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दुपार",
    goodEvening: "शुभ संध्याकाळ",
    financialOverview: "हे आहे तुमचे एकूण आर्थिक विवरण",
    netBalance: "एकूण शिल्लक (Net Balance)",
    profitLabel: "तुम्हाला एकूण पैसे यायचे आहेत 🎉",
    lossLabel: "तुम्हाला एकूण पैसे द्यायचे आहेत 📉",
    settledLabel: "सर्व हिशोब पूर्ण झाला ✓",
    youWillGet: "तुम्हाला मिळतील",
    youWillGive: "तुम्हाला द्यायचे आहेत",
    searchPlaceholder: "नाव किंवा नंबर शोधा...",
    contactsHeader: "ग्राहक / संपर्क",
    noContactsTitle: "अजून कोणतेही संपर्क नाहीत",
    noContactsDesc: "+ बटणावर दाबून पहिला संपर्क जोडा",
    addContactTitle: "नवीन संपर्क जोडा",
    nameLabel: "नाव *",
    phoneLabel: "फोन नंबर (पर्यायी)",
    namePlaceholder: "ग्राहकाचे नाव टाका",
    phonePlaceholder: "+91 99999 99999",
    addContactBtn: "संपर्क जोडा",

    // Contact Details
    balanceLabel: "हिशोब शिल्लक",
    owesYou: "कडून मिळायचे आहेत",
    youOwe: "ला द्यायचे आहेत",
    allSettled: "हिशोब पूर्ण झाला ✓",
    youGave: "💸 तुम्ही दिले (You Gave)",
    youGot: "💰 तुम्हाला मिळाले (You Got)",
    transactionsHeader: "लेन-देन इतिहास",
    noTxnTitle: "अजून कोणतेही लेन-देन झाले नाही",
    noTxnDesc: "+ बटण दाबून पैशांची नोंद करा",
    addTxnTitle: "लेन-देन नोंदवा",
    amountLabel: "रक्कम (₹) *",
    noteLabel: "टीप / तपशील (पर्यायी)",
    notePlaceholder: "उदा. किराणा, भाडे, उसने...",
    dateLabel: "तारीख",
    addEntryBtn: "नोंद जतन करा",
    deleteContactTitle: "संपर्क हटवायचा आहे का?",
    deleteContactConfirm: "यामुळे हा संपर्क आणि त्यांचे सर्व लेन-देन कायमचे हटवले जातील.",
    gaveSub: "दिले",
    gotSub: "मिळाले",
    entriesCount: "नोंदी",
    entryCount: "नोंद",
  }
};

/**
 * Get current selected language ('en' or 'mr')
 */
function getCurrentLang() {
  return localStorage.getItem('khatabook_lang') || 'en';
}

/**
 * Change language and reload page elements
 */
function setLanguage(lang) {
  localStorage.setItem('khatabook_lang', lang);
  updatePageTranslations();
}

/**
 * Translate key
 */
function t(key) {
  const lang = getCurrentLang();
  return (translations[lang] && translations[lang][key]) || translations['en'][key] || key;
}

/**
 * Auto-update elements with `data-i18n` attribute or render language switcher
 */
function updatePageTranslations() {
  const lang = getCurrentLang();

  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Update placeholder attributes with data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key];
    }
  });

  // Update language selector UI if exists
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = lang;
  }
}

/**
 * Render language toggle button inside container element
 */
function renderLangSelector(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentLang = getCurrentLang();
  container.innerHTML = `
    <div style="display:inline-flex; align-items:center; background:rgba(255,255,255,0.06); border:1px solid var(--border-color); border-radius:var(--radius-full); padding:3px 6px; font-size:0.8125rem;">
      <span style="margin-right:6px; font-size:0.9rem;">🌐</span>
      <select id="langSelect" onchange="setLanguage(this.value)" style="background:transparent; border:none; color:var(--text-primary); font-family:inherit; font-weight:600; font-size:0.8125rem; outline:none; cursor:pointer;">
        <option value="en" ${currentLang === 'en' ? 'selected' : ''} style="background:var(--bg-secondary); color:#fff;">English</option>
        <option value="mr" ${currentLang === 'mr' ? 'selected' : ''} style="background:var(--bg-secondary); color:#fff;">मराठी</option>
      </select>
    </div>
  `;
}

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updatePageTranslations();
});
