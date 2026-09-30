/**
 * AGRA Platform - Dummy & Live Registration Controller
 * Compatible with Better Auth:
 * - POST /api/auth/is-username-available
 * - POST /api/auth/sign-up/email
 * Supports standalone demo preview mode when offline.
 */

(function () {
  'use strict';

  // --- Elements ---
  const form = document.getElementById('registerForm');
  const usernameInput = document.getElementById('usernameInput');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const confirmPasswordInput = document.getElementById('confirmPasswordInput');
  const termsCheckbox = document.getElementById('termsCheckbox');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const alertBox = document.getElementById('alertBox');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');
  const quickFillBtn = document.getElementById('quickFillBtn');
  const togglePassBtn = document.getElementById('togglePassBtn');
  const toggleConfirmPassBtn = document.getElementById('toggleConfirmPassBtn');
  const successCard = document.getElementById('successCard');
  const registeredUsername = document.getElementById('registeredUsername');
  const registeredEmail = document.getElementById('registeredEmail');
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

  const ICONS = {
    eye: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    eyeOff: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6 9 17l-5-5"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
    sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  };

  // Mock API Server (Prism OpenAPI Server)
  const MOCK_API_BASE = 'http://127.0.0.1:4010';

  // --- Initial Setup ---
  function init() {
    setupTheme();
    setupPasswordVisibility();
    setupQuickFill();
    setupForm();
    setupInspector();
  }

  // --- Theme ---
  function setupTheme() {
    const savedTheme = localStorage.getItem('agra_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.innerHTML = savedTheme === 'dark' ? ICONS.sun : ICONS.moon;

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('agra_theme', nextTheme);
      themeIcon.innerHTML = nextTheme === 'dark' ? ICONS.sun : ICONS.moon;
    });
  }

  // --- Password Reveal ---
  function setupPasswordVisibility() {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passwordInput.type === 'password';
      passwordInput.type = isPass ? 'text' : 'password';
      togglePassBtn.innerHTML = isPass ? ICONS.eyeOff : ICONS.eye;
    });

    toggleConfirmPassBtn.addEventListener('click', () => {
      const isPass = confirmPasswordInput.type === 'password';
      confirmPasswordInput.type = isPass ? 'text' : 'password';
      toggleConfirmPassBtn.innerHTML = isPass ? ICONS.eyeOff : ICONS.eye;
    });
  }

  // --- Quick Fill Data Contoh Sesuai API.yaml ---
  function setupQuickFill() {
    quickFillBtn.addEventListener('click', () => {
      usernameInput.value = 'user';
      emailInput.value = 'user@example.com';
      passwordInput.value = 'Belajar1!';
      confirmPasswordInput.value = 'Belajar1!';
      termsCheckbox.checked = true;

      showToast('Kredensial contoh OpenAPI otomatis diisi!', 'info');
      clearAlert();
    });
  }

  // --- Form Submit & Registration ---
  function setupForm() {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!username || !email || !password) {
        showAlert('Harap lengkapi semua kolom pendaftaran.', 'error');
        return;
      }

      if (password !== confirmPassword) {
        showAlert('Konfirmasi kata sandi tidak cocok.', 'error');
        confirmPasswordInput.focus();
        return;
      }

      if (!termsCheckbox.checked) {
        showAlert('Anda harus menyetujui Ketentuan Layanan & Privasi.', 'error');
        return;
      }

      await performSignUp({ username, email, password });
    });
  }



  async function performSignUp({ username, email, password }) {
    setLoading(true);
    clearAlert();

    const endpoint = `${MOCK_API_BASE}/api/auth/sign-up/email`;
    const payload = { username, email, password, name: "" };

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
      } catch {
        responseData = { raw: responseText };
      }

      updateInspectorResponse(response.status, responseData);

      if (response.ok) {
        // Data hasil respon Mock API
        const user = responseData.user || { username, email, name: "", role: 'SISWA' };
        onSignUpSuccess(user);
      } else {
        const errorMsg = responseData.message || responseData.error?.message || 'Pendaftaran ditolak oleh server.';
        showAlert(errorMsg, 'error');
        showToast(errorMsg, 'error');
      }
    } catch (networkErr) {
      console.error('Koneksi ke Mock API gagal:', networkErr);
      const errorMsg = 'Gagal terhubung ke Mock API (http://127.0.0.1:4010). Pastikan server mock aktif dengan "npm run dev:mock".';
      showAlert(errorMsg, 'error');
      showToast('Koneksi Mock API gagal', 'error');
      updateInspectorResponse(0, {
        error: 'Network Error',
        message: 'Gagal terhubung ke Mock API Prism di port 4010. Periksa apakah `npm run dev:mock` sedang berjalan.',
        details: String(networkErr),
      });
    } finally {
      setLoading(false);
    }
  }

  function onSignUpSuccess(user) {
    form.style.display = 'none';
    registeredUsername.textContent = '@' + (user.username || usernameInput.value);
    registeredEmail.textContent = user.email || emailInput.value;
    successCard.style.display = 'block';

    showToast(`Akun @${user.username || usernameInput.value} berhasil didaftarkan via Mock API!`, 'success');
  }

  // --- UI Helpers ---
  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.classList.add('loading');
      submitText.textContent = 'Mendaftarkan akun...';
    } else {
      submitBtn.classList.remove('loading');
      submitText.textContent = 'Daftar Akun Baru';
    }
  }

  function showAlert(msg, type) {
    alertBox.className = 'alert-box ' + type;
    alertMessage.textContent = msg;
    alertIcon.innerHTML = type === 'success' ? ICONS.success : ICONS.error;
    alertBox.style.display = 'flex';
  }

  function clearAlert() {
    alertBox.style.display = 'none';
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? ICONS.success : ICONS.error}</span> <span>${escapeHtml(message)}</span>`;
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
    inspectorStatus.textContent = status + (status >= 200 && status < 300 ? ' CREATED/OK' : ' FAIL');
    inspectorStatus.style.color = status >= 200 && status < 300 ? '#10b981' : '#f43f5e';
    inspectorResponse.textContent = JSON.stringify(data, null, 2);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
