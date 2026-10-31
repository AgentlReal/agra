'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/layout/AdminNav';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  Users,
  UserPlus,
  Shield,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Filter,
  X,
  Search,
} from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user: currentUser, role: currentRole, isLoading: authLoading, isAuthenticated } = useAuth();

  const isSuperAdmin = currentRole === 'SUPERADMIN' || currentUser?.role === 'SUPERADMIN';

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    name: string;
    email: string;
    username: string;
    role: 'TIM_KURIKULUM' | 'SUPERADMIN';
  }>({
    name: '',
    email: '',
    username: '',
    role: 'TIM_KURIKULUM',
  });
  const [creating, setCreating] = useState(false);

  const [editUser, setEditUser] = useState<any | null>(null);
  const [editRole, setEditRole] = useState<string>('TIM_KURIKULUM');
  const [editName, setEditName] = useState<string>('');
  const [updating, setUpdating] = useState(false);

  const [deleteConfirmUser, setDeleteConfirmUser] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // SuperAdmin auth guard
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isSuperAdmin)) {
      router.replace('/admin/dashboard');
    }
  }, [authLoading, isAuthenticated, isSuperAdmin, router]);

  const fetchUsers = () => {
    setLoading(true);
    setErrorMsg('');
    const params = roleFilter !== 'ALL' ? { role: roleFilter } : undefined;
    api.admin
      .getUsers(params)
      .then((res: any) => {
        const list = res?.data || res || [];
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch((err: any) => {
        console.error('Failed to load users:', err);
        setErrorMsg(err.message || 'Gagal memuat daftar pengguna.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
    }
  }, [roleFilter, isSuperAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name.trim() || !createForm.email.trim()) {
      setErrorMsg('Nama dan email wajib diisi.');
      return;
    }
    setCreating(true);
    setErrorMsg('');
    try {
      await api.admin.createUser(createForm);
      setSuccessMsg(`Akun ${createForm.name} (${createForm.role}) berhasil ditambahkan.`);
      setCreateModalOpen(false);
      setCreateForm({ name: '', email: '', username: '', role: 'TIM_KURIKULUM' });
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal membuat pengguna baru.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setUpdating(true);
    setErrorMsg('');
    try {
      await api.admin.updateUser(editUser.id, {
        name: editName,
        role: editRole,
      });
      setSuccessMsg('Data pengguna berhasil diperbarui.');
      setEditUser(null);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal memperbarui pengguna.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    setDeleting(true);
    setErrorMsg('');
    try {
      await api.admin.deleteUser(deleteConfirmUser.id);
      setSuccessMsg(`Pengguna ${deleteConfirmUser.name || deleteConfirmUser.email} berhasil dihapus.`);
      setDeleteConfirmUser(null);
      fetchUsers();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menghapus pengguna.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <AdminNav />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-purple-700 font-bold mb-1">
              <Shield className="h-4 w-4" />
              <span>Otoritas SuperAdmin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Manajemen Pengguna Platform
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Kelola penugasan peran (Role) untuk Siswa, Tim Kurikulum, dan Administrator Platform.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCreateModalOpen(true);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xs transition cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Tambah Pengguna Tim</span>
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-amber-600 hover:text-amber-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pengguna berdasarkan nama, username, atau email..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-xs text-slate-800 placeholder-slate-400 focus:border-purple-600 focus:outline-none shadow-2xs"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Peran</option>
                <option value="SISWA">Siswa</option>
                <option value="TIM_KURIKULUM">Tim Kurikulum</option>
                <option value="SUPERADMIN">SuperAdmin</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-500 text-xs">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">Tidak ada pengguna yang sesuai.</p>
              <p className="text-xs text-slate-400 mt-1">Gunakan kata kunci atau filter lain.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Lengkap & Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4 w-36">Peran (Role)</th>
                    <th className="py-3 px-4 w-32">Terdaftar</th>
                    <th className="py-3 px-4 w-28 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isSelf = u.id === currentUser?.id;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-slate-900 flex items-center gap-1.5">
                              {u.name || 'Pengguna'}
                              {isSelf && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">@{u.username || '-'}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                          {u.email}
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {u.role === 'SUPERADMIN' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold text-violet-700 border border-violet-200">
                              <Shield className="w-3 h-3" /> SuperAdmin
                            </span>
                          ) : u.role === 'TIM_KURIKULUM' ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200">
                              Tim Kurikulum
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700 border border-blue-200">
                              Siswa
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditUser(u);
                                setEditName(u.name || '');
                                setEditRole(u.role || 'TIM_KURIKULUM');
                              }}
                              className="p-1.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                              title="Edit Pengguna"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {!isSelf && (
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmUser(u)}
                                className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition"
                                title="Hapus Pengguna"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Tambah Pengguna */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-purple-600" />
                  <span>Tambah Pengguna Tim</span>
                </h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Nama Lengkap</label>
                  <input
                    type="text"
                    value={createForm.name}
                    onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                    placeholder="Nama Pengguna"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Email Resmi</label>
                  <input
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="nama@kemendikdasmen.go.id"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Username</label>
                  <input
                    type="text"
                    value={createForm.username}
                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                    placeholder="username (opsional)"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Peran Akun</label>
                  <select
                    value={createForm.role}
                    onChange={(e) =>
                      setCreateForm({
                        ...createForm,
                        role: e.target.value as 'TIM_KURIKULUM' | 'SUPERADMIN',
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="TIM_KURIKULUM">Tim Kurikulum (Penulis & Editor Bank Soal)</option>
                    <option value="SUPERADMIN">SuperAdmin (Tata Kelola Platform)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
                  >
                    {creating ? 'Menyimpan...' : 'Tambah Pengguna'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Pengguna */}
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Perbarui Otoritas Pengguna</h3>
                <button
                  onClick={() => setEditUser(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateUser} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Nama</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Email</label>
                  <input
                    type="text"
                    value={editUser.email}
                    disabled
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Peran (Role)</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-purple-600 focus:outline-none"
                  >
                    <option value="SISWA">Siswa</option>
                    <option value="TIM_KURIKULUM">Tim Kurikulum</option>
                    <option value="SUPERADMIN">SuperAdmin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl disabled:opacity-50"
                  >
                    {updating ? 'Menyimpan...' : 'Perbarui Peran'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Hapus Pengguna */}
        {deleteConfirmUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-white rounded-3xl border border-amber-200 p-6 shadow-2xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Pengguna</h3>
                <p className="text-xs text-slate-600">
                  Apakah Anda yakin ingin menghapus pengguna{' '}
                  <strong className="text-slate-800">{deleteConfirmUser.name || deleteConfirmUser.email}</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex justify-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteUser}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl disabled:opacity-50"
                >
                  {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

