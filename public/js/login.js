/**
 * AGRA Platform - Dummy & Live Login Controller
 * Supports:
 * - Direct integration with Better Auth (/api/auth/sign-in/*)
 * - Standalone Mock/Demo mode with instant test credentials
 * - Active session detection & logout
 * - Live Developer Request/Response Inspector
 */

(function () {
  'use strict';

  // Mock API Server (Prism OpenAPI Server)
  const MOCK_API_BASE = 'http://127.0.0.1:4010';

  // --- State & Elements ---
  const state = {
    loginType: 'username', // 'username' | 'email'
    isLoading: false,
    backendOnline: false,
    sessionUser: null,
  };

  // DOM Elements
  const form = document.getElementById('loginForm');
  const tabUsername = document.getElementById('tabUsername');
  const tabEmail = document.getElementById('tabEmail');
  const identifierLabel = document.getElementById('identifierLabel');
  const identifierInput = document.getElementById('identifierInput');
  const identifierIcon = document.getElementById('identifierIcon');
  const passwordInput = document.getElementById('passwordInput');
  const togglePasswordBtn = document.getElementById('togglePasswordBtn');
  const rememberCheckbox = document.getElementById('rememberMe');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');
  const serverStatusChip = document.getElementById('serverStatusChip');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const toastContainer = document.getElementById('toastContainer');

  // Inspector Elements
  const inspectorToggle = document.getElementById('inspectorToggle');
  const inspectorPanel = document.getElementById('inspectorPanel');
  const inspectorMethod = document.getElementById('inspectorMethod');
  const inspectorEndpoint = document.getElementById('inspectorEndpoint');
  const inspectorStatus = document.getElementById('inspectorStatus');
  const inspectorRequest = document.getElementById('inspectorRequest');
  const inspectorResponse = document.getElementById('inspectorResponse');

  // Modal Elements
  const forgotModal = document.getElementById('forgotModal');
  const forgotLink = document.getElementById('forgotLink');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseBtnBottom = document.getElementById('modalCloseBtnBottom');

  // --- SVG Icons ---
  const ICONS = {
    user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7"/></svg>`,
    eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  };

  // --- Initial Setup ---
  function init() {
    setupTheme();
    setupTabs();
    setupPasswordToggle();
    setupForm();
    setupInspector();
    setupModal();
    checkServerConnectivity();
  }

  // --- Theme Management ---
  function setupTheme() {
    const savedTheme = localStorage.getItem('agra_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('agra_theme', nextTheme);
      updateThemeIcon(nextTheme);
    });
  }

  function updateThemeIcon(theme) {
    themeIcon.innerHTML = theme === 'dark' ? ICONS.sun : ICONS.moon;
  }

  // --- Tab Switcher ---
  function setupTabs() {
    tabUsername.addEventListener('click', () => setLoginType('username'));
    tabEmail.addEventListener('click', () => setLoginType('email'));
  }

  function setLoginType(type) {
    state.loginType = type;
    if (type === 'username') {
      tabUsername.classList.add('active');
      tabEmail.classList.remove('active');
      identifierLabel.textContent = 'Username Siswa / Tim';
      identifierInput.placeholder = 'e.g. ahmad_siswa';
      identifierInput.type = 'text';
      identifierInput.autocomplete = 'username';
      identifierIcon.innerHTML = ICONS.user;
    } else {
      tabEmail.classList.add('active');
      tabUsername.classList.remove('active');
      identifierLabel.textContent = 'Email Terdaftar';
      identifierInput.placeholder = 'e.g. siswa@sekolah.sch.id';
      identifierInput.type = 'email';
      identifierInput.autocomplete = 'email';
      identifierIcon.innerHTML = ICONS.mail;
    }
    clearAlert();
  }

  // --- Password Toggle ---
  function setupPasswordToggle() {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      togglePasswordBtn.innerHTML = isPassword ? ICONS.eyeOff : ICONS.eye;
    });
  }

  // --- Form Handling ---
  function setupForm() {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = identifierInput.value.trim();
      const password = passwordInput.value;

      if (!identifier) {
        showAlert('Mohon isi ' + (state.loginType === 'username' ? 'username' : 'email'), 'error');
        identifierInput.focus();
        return;
      }

      if (!password) {
        showAlert('Mohon masukkan password akun Anda', 'error');
        passwordInput.focus();
        return;
      }

      // Handle remember me
      if (rememberCheckbox.checked) {
        localStorage.setItem('agra_remember_user', identifier);
        localStorage.setItem('agra_remember_type', state.loginType);
      } else {
        localStorage.removeItem('agra_remember_user');
        localStorage.removeItem('agra_remember_type');
      }

      await performLogin(identifier, password);
    });
  }

  // --- Authentication Execution ---
  async function performLogin(identifier, password) {
    setLoading(true);
    clearAlert();

    const isUsername = state.loginType === 'username';
    const path = isUsername ? '/api/auth/sign-in/username' : '/api/auth/sign-in/email';
    const endpoint = `${MOCK_API_BASE}${path}`;
    const payload = isUsername
      ? { username: identifier, password: password }
      : { email: identifier, password: password };

    updateInspector({
      method: 'POST',
      endpoint: endpoint,
      requestBody: payload,
    });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData = {};
      try {
        responseData = JSON.parse(responseText);
      } catch (err) {
        responseData = { raw: responseText };
      }

      updateInspectorResponse(response.status, responseData);

      if (response.ok) {
        // Successful login via Prism Mock API
        updateServerStatus(true, 'Mock API (4010) Terhubung');
        const user = responseData.user || responseData.data?.user || { name: identifier, username: identifier, role: 'SISWA' };
        onLoginSuccess(user);
      } else {
        // Mock server returned an error response
        updateServerStatus(true, 'Mock API (4010) Terhubung');
        const errorMsg = responseData.message || responseData.error?.message || 'Login gagal. Cek kembali kredensial Anda.';
        showAlert(errorMsg, 'error');
        showToast(errorMsg, 'error');
      }
    } catch (networkErr) {
      console.error('Koneksi ke Mock API gagal:', networkErr);
      updateServerStatus(false, 'Mock API (4010) Offline');
      const errorMsg = 'Gagal terhubung ke Mock API (http://127.0.0.1:4010). Pastikan server mock aktif dengan "npm run dev:mock".';
      showAlert(errorMsg, 'error');
      showToast('Koneksi Mock API gagal', 'error');
      updateInspectorResponse(0, {
        error: 'Network Error',
        message: 'Gagal terhubung ke Mock API Prism di port 4010. Periksa apakah `npm run dev:mock` sedang berjalan di terminal.',
        details: String(networkErr),
      });
    } finally {
      setLoading(false);
    }
  }

  function onLoginSuccess(user) {
    state.sessionUser = user;
    const displayName = user.name || user.username || 'Pengguna';
    showAlert(`Selamat datang kembali, ${displayName}! Login berhasil via Mock API.`, 'success');
    showToast(`Login berhasil sebagai ${displayName}`, 'success');
  }

  // --- Check Server Connectivity ---
  async function checkServerConnectivity() {
    try {
      const res = await fetch(`${MOCK_API_BASE}/api/auth/get-session`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        updateServerStatus(true, 'Mock API (4010) Terhubung');
      } else {
        updateServerStatus(true, 'Mock API (4010) Terhubung');
      }
    } catch (err) {
      updateServerStatus(false, 'Mock API (4010) Offline');
    }
  }

  // --- UI Helpers ---
  function setLoading(loading) {
    state.isLoading = loading;
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.classList.add('loading');
      submitText.textContent = 'Memverifikasi...';
    } else {
      submitBtn.classList.remove('loading');
      submitText.textContent = 'Masuk ke Platform';
    }
  }

  function showAlert(msg, type) {
    alertBox.className = 'alert-box ' + type;
    alertMessage.textContent = msg;
    if (type === 'success') alertIcon.innerHTML = ICONS.success;
    else if (type === 'error') alertIcon.innerHTML = ICONS.error;
    else alertIcon.innerHTML = ICONS.warning;
    alertBox.style.display = 'flex';
  }

  function clearAlert() {
    alertBox.style.display = 'none';
  }

  function updateServerStatus(isLive, label) {
    state.backendOnline = isLive;
    statusText.textContent = label;
    if (isLive) {
      statusDot.classList.remove('offline');
      serverStatusChip.title = 'Terhubung dengan Next.js /api/auth/ Better Auth';
    } else {
      statusDot.classList.add('offline');
      serverStatusChip.title = 'Backend offline. Berjalan dalam mock preview mode.';
    }
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    let icon = ICONS.user;
    if (type === 'success') icon = ICONS.success;
    if (type === 'error') icon = ICONS.error;

    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
  }

  // --- Developer Inspector ---
  function setupInspector() {
    inspectorToggle.addEventListener('click', () => {
      const isOpen = inspectorPanel.classList.toggle('open');
      inspectorToggle.querySelector('.inspector-arrow').textContent = isOpen ? '▲ Sembunyikan' : '▼ Tampilkan';
    });
  }

  function updateInspector({ method, endpoint, requestBody }) {
    inspectorMethod.textContent = method;
    inspectorEndpoint.textContent = endpoint;
    inspectorStatus.textContent = 'Sending...';
    inspectorStatus.style.color = '#38bdf8';
    inspectorRequest.textContent = JSON.stringify(requestBody, null, 2);
    inspectorResponse.textContent = '// Menunggu respons server...';
  }

  function updateInspectorResponse(status, data) {
    inspectorStatus.textContent = status + (status >= 200 && status < 300 ? ' OK' : ' FAIL');
    inspectorStatus.style.color = status >= 200 && status < 300 ? '#10b981' : '#f43f5e';
    inspectorResponse.textContent = JSON.stringify(data, null, 2);
  }

  // --- Modal Reset Password ---
  function setupModal() {
    forgotLink.addEventListener('click', (e) => {
      e.preventDefault();
      forgotModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => forgotModal.classList.remove('open'));
    modalCloseBtnBottom.addEventListener('click', () => forgotModal.classList.remove('open'));
    forgotModal.addEventListener('click', (e) => {
      if (e.target === forgotModal) forgotModal.classList.remove('open');
    });
  }

  // Run initial setup
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
