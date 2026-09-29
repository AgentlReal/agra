# Panduan Autentikasi & API (Untuk Tim Frontend)

Proyek ini menggunakan **Better Auth** untuk seluruh kebutuhan autentikasi (Registrasi, Login, Session, Username, dan Logout).

Endpoint autentikasi berjalan secara otomatis melalui Route Handler Next.js di `/api/auth/*`.

---

## 🚀 1. Menggunakan Auth Client (Direkomendasikan)

Tim Frontend sudah disediakan file client di [`@/lib/auth-client`](../src/lib/auth-client.ts). Client ini secara otomatis mengelola cookie session, refresh token, dan tipe data TypeScript.

### Import Helper
```typescript
import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth-client";
```

### A. Registrasi Akun Baru (Sign Up)
Mendukung input `email`, `password`, `name`, dan `username`:
```typescript
const { data, error } = await signUp.email({
  email: "siswa@sekolah.sch.id",
  password: "Password123!",
  name: "Ahmad Dahlan",
  username: "ahmad_siswa", // Otomatis divalidasi oleh plugin username
});

if (error) {
  console.error("Gagal daftar:", error.message);
} else {
  console.log("Berhasil mendaftar:", data.user);
}
```

### B. Login Menggunakan Username (Sign In Username)
```typescript
const { data, error } = await signIn.username({
  username: "ahmad_siswa",
  password: "Password123!",
});

if (error) {
  console.error("Login gagal:", error.message);
} else {
  console.log("Login berhasil:", data.user);
}
```

### C. Login Menggunakan Email (Sign In Email)
```typescript
const { data, error } = await signIn.email({
  email: "siswa@sekolah.sch.id",
  password: "Password123!",
});
```

### D. Mengambil Sesi Pengguna yang Sedang Login (Session)

**Di React Component (Hook):**
```tsx
"use client";
import { useSession } from "@/lib/auth-client";

export default function ProfileWidget() {
  const { data: session, isPending, error } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (!session) return <div>Belum login</div>;

  return (
    <div>
      <p>Nama: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
    </div>
  );
}
```

**Di Fungsi Biasa (Async / Await):**
```typescript
import { getSession } from "@/lib/auth-client";

const session = await getSession();
console.log("User aktif:", session?.data?.user);
```

### E. Logout (Sign Out)
```typescript
await signOut({
  fetchOptions: {
    onSuccess: () => {
      window.location.href = "/login";
    },
  },
});
```

### F. Cek Ketersediaan Username
```typescript
const res = await authClient.isUsernameAvailable({
  username: "ahmad_siswa",
});

if (res.data?.available) {
  console.log("Username bisa digunakan!");
} else {
  console.log("Username sudah terpakai.");
}
```

---

## 📡 2. Memanggil via Raw HTTP (Fetch / Axios)

Jika frontend ingin menembak endpoint HTTP secara manual:

| Method | Endpoint | Keterangan | Body JSON |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/sign-up/email` | Registrasi akun baru | `{"email": "...", "password": "...", "name": "...", "username": "..."}` |
| **POST** | `/api/auth/sign-in/username` | Login via username | `{"username": "...", "password": "..."}` |
| **POST** | `/api/auth/sign-in/email` | Login via email | `{"email": "...", "password": "..."}` |
| **POST** | `/api/auth/sign-out` | Logout pengguna | `{}` |
| **GET** | `/api/auth/get-session` | Mengambil data user yang aktif | *(Tanpa body, membaca cookie session)* |
| **POST** | `/api/auth/is-username-available` | Cek ketersediaan username | `{"username": "..."}` |
