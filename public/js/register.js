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
  const nameInput = document.getElementById('nameInput');
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
  const usernameBadge = document.getElementById('usernameBadge');
  const meterBar1 = document.getElementById('meterBar1');
  const meterBar2 = document.getElementById('meterBar2');
  const meterBar3 = document.getElementById('meterBar3');
  const meterScoreText = document.getElementById('meterScoreText');
  const quickFillBtn = document.getElementById('quickFillBtn');
  const togglePassBtn = document.getElementById('togglePassBtn');
  const toggleConfirmPassBtn = document.getElementById('toggleConfirmPassBtn');
  const successCard = document.getElementById('successCard');
  const registeredName = document.getElementById('registeredName');
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

  let usernameDebounceTimer = null;
  let isUsernameAvailable = null;

  // --- Initial Setup ---
  function init() {
    setupTheme();
    setupPasswordVisibility();
    setupPasswordMeter();
    setupUsernameChecker();
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

  // --- Password Strength Meter ---
  function setupPasswordMeter() {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      const score = calculateStrength(val);

      // Reset bars
      meterBar1.className = 'meter-bar';
      meterBar2.className = 'meter-bar';
      meterBar3.className = 'meter-bar';

      if (!val) {
        meterScoreText.textContent = 'Gunakan minimal 8 karakter dengan kombinasi angka & simbol';
        return;
      }

      if (score === 1) {
        meterBar1.classList.add('weak');
        meterScoreText.textContent = 'Kekuatan: Lemah';
        meterScoreText.style.color = '#f43f5e';
      } else if (score === 2) {
        meterBar1.classList.add('medium');
        meterBar2.classList.add('medium');
        meterScoreText.textContent = 'Kekuatan: Cukup Baik';
        meterScoreText.style.color = '#f59e0b';
      } else if (score >= 3) {
        meterBar1.classList.add('strong');
        meterBar2.classList.add('strong');
        meterBar3.classList.add('strong');
        meterScoreText.textContent = 'Kekuatan: Sangat Kuat';
        meterScoreText.style.color = '#10b981';
      }
    });
  }

  function calculateStrength(pwd) {
    if (!pwd || pwd.length < 6) return 1;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score >= 3 ? 3 : score >= 2 ? 2 : 1;
  }

  // --- Username Availability Checker ---
  function setupUsernameChecker() {
    usernameInput.addEventListener('input', () => {
      clearTimeout(usernameDebounceTimer);
      const username = usernameInput.value.trim();

      if (!username || username.length < 3) {
        usernameBadge.style.display = 'none';
        isUsernameAvailable = null;
        return;
      }

      usernameBadge.className = 'username-status-badge checking';
      usernameBadge.textContent = 'Mengecek...';
      usernameBadge.style.display = 'flex';

      usernameDebounceTimer = setTimeout(async () => {
        await checkUsername(username);
      }, 450);
    });
  }

  async function checkUsername(username) {
    updateInspector({
      method: 'POST',
      endpoint: '/api/auth/is-username-available',
      requestBody: { username },
    });

    try {
      const res = await fetch('/api/auth/is-username-available', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await res.json().catch(() => ({}));
      updateInspectorResponse(res.status, data);

      if (res.ok && data.available !== false) {
        setUsernameStatus(true, '✓ Tersedia');
      } else {
        setUsernameStatus(false, '✗ Terpakai');
      }
    } catch (err) {
      // Offline mock fallback
      const takenUsernames = ['ahmad_siswa', 'admin', 'guru_kurikulum', 'kurikulum'];
      const available = !takenUsernames.includes(username.toLowerCase());
      updateInspectorResponse(200, { available, mock: true });
      if (available) {
        setUsernameStatus(true, '✓ Tersedia');
      } else {
        setUsernameStatus(false, '✗ Terpakai');
      }
    }
  }

  function setUsernameStatus(available, text) {
    isUsernameAvailable = available;
    usernameBadge.className = 'username-status-badge ' + (available ? 'available' : 'unavailable');
    usernameBadge.textContent = text;
    usernameBadge.style.display = 'flex';
  }

  // --- Quick Fill Dummy Demo ---
  function setupQuickFill() {
    quickFillBtn.addEventListener('click', () => {
      const randomSuffix = Math.floor(Math.random() * 899 + 100);
      nameInput.value = 'Rian Hidayat';
      usernameInput.value = `rian_siswa${randomSuffix}`;
      emailInput.value = `rian${randomSuffix}@sekolah.sch.id`;
      passwordInput.value = 'Password123!';
      confirmPasswordInput.value = 'Password123!';
      termsCheckbox.checked = true;

      // Trigger events
      passwordInput.dispatchEvent(new Event('input'));
      usernameInput.dispatchEvent(new Event('input'));

      showToast('Kredensial percobaan otomatis diisi!', 'info');
      clearAlert();
    });
  }

  // --- Form Submit & Registration ---
  function setupForm() {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!name || !username || !email || !password) {
        showAlert('Harap lengkapi semua kolom pendaftaran.', 'error');
        return;
      }

      if (username.length < 3) {
        showAlert('Username minimal harus 3 karakter.', 'error');
        usernameInput.focus();
        return;
      }

      if (isUsernameAvailable === false) {
        showAlert('Username sudah terpakai. Pilih username lain.', 'error');
        usernameInput.focus();
        return;
      }

      if (password.length < 8) {
        showAlert('Kata sandi minimal 8 karakter.', 'error');
        passwordInput.focus();
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

      await performSignUp({ name, username, email, password });
    });
  }

  async function performSignUp({ name, username, email, password }) {
    setLoading(true);
    clearAlert();

    const endpoint = '/api/auth/sign-up/email';
    const payload = { name, username, email, password };

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
        credentials: 'include',
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
        onSignUpSuccess({ name, username, email });
      } else {
        const errorMsg = responseData.message || responseData.error?.message || 'Pendaftaran gagal. Silakan coba lagi.';
        showAlert(errorMsg, 'error');
        showToast(errorMsg, 'error');
      }
    } catch (networkErr) {
      // Backend offline fallback mode
      console.warn('Backend offline, running in mock preview mode:', networkErr);
      const mockResponse = {
        success: true,
        message: 'Registrasi berhasil (Demo Mode)',
        user: { name, username, email, role: 'SISWA' },
      };
      updateInspectorResponse(201, mockResponse);
      onSignUpSuccess({ name, username, email });
    } finally {
      setLoading(false);
    }
  }

  function onSignUpSuccess({ name, username, email }) {
    form.style.display = 'none';
    registeredName.textContent = name;
    registeredUsername.textContent = '@' + username;
    registeredEmail.textContent = email;
    successCard.style.display = 'block';

    showToast(`Akun ${username} berhasil didaftarkan!`, 'success');
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
