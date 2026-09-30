// API Client connected directly to Next.js App Router Backend API (/api/...)

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  token?: string;
}

export class ApiError extends Error {
  code?: string;
  status: number;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = BASE_URL ? `${BASE_URL}${endpoint}` : endpoint;
  const token = typeof window !== 'undefined' ? localStorage.getItem('agra_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Automatically transmit Better Auth session cookies
    });

    if (!res.ok) {
      let errData: any = {};
      try {
        errData = await res.json();
      } catch {
        // non-json response
      }
      throw new ApiError(
        errData?.error?.message || errData?.message || `Permintaan gagal dengan status ${res.status}`,
        res.status,
        errData?.error?.code || 'UNKNOWN_ERROR',
        errData?.error?.details
      );
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    // Network or other error
    throw new ApiError(
      err.message || 'Tidak dapat terhubung ke server API',
      500,
      'NETWORK_ERROR'
    );
  }
}

export const api = {
  // Auth
  auth: {
    signInUsername: (username: string, password: string) =>
      request<any>('/api/auth/sign-in/username', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    signInEmail: (email: string, password: string) =>
      request<any>('/api/auth/sign-in/email', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    signUpEmail: (data: { name: string; username: string; email: string; password: string }) =>
      request<any>('/api/auth/sign-up/email', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    signOut: () =>
      request<any>('/api/auth/sign-out', {
        method: 'POST',
      }),
    getSession: () => request<any>('/api/auth/get-session'),
    requestPasswordReset: (email: string) =>
      request<any>('/api/auth/request-password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    resetPassword: (token: string, newPassword: string) =>
      request<any>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),
    changePassword: (currentPassword: string, newPassword: string) =>
      request<any>('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),
  },

  // Profile
  profile: {
    get: () => request<any>('/api/v1/profile'),
    update: (name: string) =>
      request<any>('/api/v1/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      }),
    complete: (data: { grade: number; avatarId: number }) =>
      request<any>('/api/v1/profile/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getAvatars: () => request<any[]>('/api/v1/avatars'),
    updateAvatar: (avatarId: number) =>
      request<any>('/api/v1/profile/avatar', {
        method: 'PUT',
        body: JSON.stringify({ avatarId }),
      }),
    getXpTransactions: () => request<any[]>('/api/v1/profile/xp-transactions'),
  },

  // Dashboard
  dashboard: {
    get: () => request<any>('/api/v1/dashboard'),
  },

  // Recall
  recall: {
    getStatus: () => request<any>('/api/v1/recall/status'),
    startAttempt: () =>
      request<any>('/api/v1/recall/attempts', {
        method: 'POST',
      }),
    getAttempt: (attemptId: string | number) =>
      request<any>(`/api/v1/recall/attempts/${attemptId}`),
    saveAnswer: (
      attemptId: string | number,
      questionId: string | number,
      data: { answer: string | string[]; isDoubtful?: boolean }
    ) =>
      request<any>(`/api/v1/recall/attempts/${attemptId}/answers/${questionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    submit: (attemptId: string | number) =>
      request<any>(`/api/v1/recall/attempts/${attemptId}/submit`, {
        method: 'POST',
      }),
    getResult: (attemptId: string | number) =>
      request<any>(`/api/v1/recall/attempts/${attemptId}/result`),
    getReview: (attemptId: string | number) =>
      request<any>(`/api/v1/recall/attempts/${attemptId}/review`),
  },

  // Curriculum & Learning
  curriculum: {
    getSubjects: () => request<any[]>('/api/v1/subjects'),
    getSubjectCurriculum: (subjectId: string | number) =>
      request<any>(`/api/v1/subjects/${subjectId}/curriculum`),
    getSubmaterialProgress: (submaterialId: string | number) =>
      request<any>(`/api/v1/submaterials/${submaterialId}/progress`),
  },

  // Learning
  learning: {
    startAttempt: (levelId: string | number, subMaterialId?: string | number) =>
      request<any>(`/api/v1/learning/levels/${levelId}/attempts`, {
        method: 'POST',
        body: JSON.stringify({ sub_material_id: Number(subMaterialId || 1) }),
      }),
    getAttempt: (attemptId: string | number) =>
      request<any>(`/api/v1/learning/attempts/${attemptId}`),
    saveAnswer: (
      attemptId: string | number,
      sessionQuestionId: string | number,
      data: { answer: string | string[] }
    ) =>
      request<any>(`/api/v1/learning/attempts/${attemptId}/answers/${sessionQuestionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    submit: (attemptId: string | number) =>
      request<any>(`/api/v1/learning/attempts/${attemptId}/submit`, {
        method: 'POST',
      }),
    getResult: (attemptId: string | number) =>
      request<any>(`/api/v1/learning/attempts/${attemptId}/result`),
    getReview: (attemptId: string | number) =>
      request<any>(`/api/v1/learning/attempts/${attemptId}/review`),
  },

  // Simulation
  simulation: {
    getEligibility: (subjectId: string | number) =>
      request<any>(`/api/v1/simulations/${subjectId}/eligibility`),
    startAttempt: (subjectId: string | number) =>
      request<any>(`/api/v1/simulations/${subjectId}/attempts`, {
        method: 'POST',
      }),
    getAttempt: (attemptId: string | number) =>
      request<any>(`/api/v1/simulation-attempts/${attemptId}`),
    saveAnswer: (
      attemptId: string | number,
      sessionQuestionId: string | number,
      data: { answer: string | string[]; isDoubtful?: boolean }
    ) =>
      request<any>(`/api/v1/simulation-attempts/${attemptId}/answers/${sessionQuestionId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    submit: (attemptId: string | number) =>
      request<any>(`/api/v1/simulation-attempts/${attemptId}/submit`, {
        method: 'POST',
      }),
    getResult: (attemptId: string | number) =>
      request<any>(`/api/v1/simulation-attempts/${attemptId}/result`),
    getReview: (attemptId: string | number) =>
      request<any>(`/api/v1/simulation-attempts/${attemptId}/review`),
  },

  // Admin / Tim Kurikulum
  admin: {
    getProfile: () => request<any>('/api/v1/admin/profile'),
    updateProfile: (name: string) =>
      request<any>('/api/v1/admin/profile', {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      }),
    getQuestionBanks: () => request<any[]>('/api/v1/admin/question-banks'),
    getQuestionBanksStock: () => request<any>('/api/v1/admin/question-banks/stock'),
    getQuestions: (params?: Record<string, string | number>) => {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return request<any>(`/api/v1/admin/questions${qs}`);
    },
    getQuestion: (questionId: string | number) =>
      request<any>(`/api/v1/admin/questions/${questionId}`),
    createQuestion: (data: any) =>
      request<any>('/api/v1/admin/questions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    updateQuestion: (questionId: string | number, data: any) =>
      request<any>(`/api/v1/admin/questions/${questionId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    updateQuestionStatus: (questionId: string | number, isActive: boolean) =>
      request<any>(`/api/v1/admin/questions/${questionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      }),
    uploadImage: (formData: FormData) => {
      const url = BASE_URL ? `${BASE_URL}/api/v1/admin/question-images` : '/api/v1/admin/question-images';
      const token = typeof window !== 'undefined' ? localStorage.getItem('agra_token') : null;
      return fetch(url, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
        body: formData,
      }).then((r) => r.json());
    },
    getSimulationPackages: (params?: Record<string, string | number>) => {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
      return request<any>(`/api/v1/admin/simulation-packages${qs}`);
    },
    createSimulationPackage: (data: any) =>
      request<any>('/api/v1/admin/simulation-packages', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    getSimulationPackage: (packageId: string | number) =>
      request<any>(`/api/v1/admin/simulation-packages/${packageId}`),
    updateSimulationPackage: (packageId: string | number, data: any) =>
      request<any>(`/api/v1/admin/simulation-packages/${packageId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    updateSimulationPackageStatus: (packageId: string | number, status: string) =>
      request<any>(`/api/v1/admin/simulation-packages/${packageId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    getSimulationPackageStats: (packageId: string | number) =>
      request<any>(`/api/v1/admin/simulation-packages/${packageId}/stats`),
  },
};
