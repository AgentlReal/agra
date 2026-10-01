import { describe, it, expect, vi } from "vitest";
import { GET as getProfile, PATCH as updateProfile } from "./route";
import { POST as completeProfile } from "./complete/route";
import { GET as getAvatars } from "../avatars/route";
import { PUT as updateAvatar } from "./avatar/route";
import { GET as getDashboard } from "../dashboard/route";
import { profileController } from "@/modules/profile/profile.controller";
import {
    createTestRequest,
    parseApiResponse,
    clearMockSession,
    setMockSessionUser,
    defaultMockStudent,
} from "@/shared/testing/test-utils";

describe("Profile & Dashboard API Endpoints", () => {
    describe("GET /api/v1/profile", () => {
        it("harus mengembalikan 401 Unauthorized jika pengguna belum login", async () => {
            clearMockSession();
            const res = await getProfile();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(401);
            expect(body.error).toBeDefined();
        });

        it("harus mengembalikan 200 OK dengan data profil saat terautentikasi", async () => {
            setMockSessionUser(defaultMockStudent);
            vi.spyOn(profileController["service"], "getProfile").mockResolvedValueOnce({
                id: "student-uuid-1",
                email: "siswa@example.com",
                username: "siswa_uji",
                name: "Siswa Penguji",
                avatar: { id: 1, name: "Ksatria Buku", imageUrl: "/avatar1.svg" },
                totalXp: 100,
                milestone: {
                    id: 1,
                    tierNumber: 1,
                    title: "Pemula",
                    minXp: 0,
                    maxXp: 199,
                    badgeIconUrl: "/badge1.svg",
                    philosophicalMeaning: null,
                },
                milestoneProgress: {
                    currentXp: 100,
                    nextMilestoneXp: 200,
                    xpRemaining: 100,
                    progressPercent: 50,
                },
            });

            const res = await getProfile();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.data.id).toBe("student-uuid-1");
        });
    });

    describe("POST /api/v1/profile/complete", () => {
        it("harus mengembalikan 400 Bad Request jika presetAvatarId tidak valid (misal negatif)", async () => {
            setMockSessionUser(defaultMockStudent);
            const req = createTestRequest("/api/v1/profile/complete", {
                method: "POST",
                body: { presetAvatarId: -1 },
            });

            const res = await completeProfile(req);
            const { status } = await parseApiResponse(res);

            expect(status).toBe(400);
        });

        it("harus berhasil 201 Created jika payload valid", async () => {
            setMockSessionUser(defaultMockStudent);
            vi.spyOn(profileController["service"], "completeProfile").mockResolvedValueOnce({
                id: "student-uuid-1",
                email: "siswa@example.com",
                username: "siswa_uji",
                name: "Siswa Penguji",
                avatar: { id: 2, name: "Penjelajah", imageUrl: "/avatar2.svg" },
                totalXp: 0,
                milestone: {
                    id: 1,
                    tierNumber: 1,
                    title: "Pemula",
                    minXp: 0,
                    maxXp: 199,
                    badgeIconUrl: "/badge1.svg",
                    philosophicalMeaning: null,
                },
                milestoneProgress: {
                    currentXp: 0,
                    nextMilestoneXp: 200,
                    xpRemaining: 200,
                    progressPercent: 0,
                },
            });

            const req = createTestRequest("/api/v1/profile/complete", {
                method: "POST",
                body: { presetAvatarId: 2 },
            });

            const res = await completeProfile(req);
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(201);
            expect(body.data.id).toBe("student-uuid-1");
        });
    });

    describe("GET /api/v1/avatars", () => {
        it("harus mengembalikan daftar avatar preset aktif", async () => {
            vi.spyOn(profileController["service"], "getAvatars").mockResolvedValueOnce({
                items: [
                    { id: 1, name: "Ksatria Buku", imageUrl: "/avatar1.svg", selected: true },
                    { id: 2, name: "Penjelajah", imageUrl: "/avatar2.svg", selected: false },
                ],
                total: 2,
            });

            const res = await getAvatars();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.data.items).toHaveLength(2);
            expect(body.data.total).toBe(2);
        });
    });

    describe("GET /api/v1/dashboard", () => {
        it("harus mengembalikan progres mata pelajaran dan nextAction belajar", async () => {
            setMockSessionUser(defaultMockStudent);
            vi.spyOn(profileController["service"], "getDashboard").mockResolvedValueOnce({
                student: {
                    name: "Siswa Penguji",
                    avatar: { id: 1, name: "Ksatria Buku", imageUrl: "/avatar1.svg" },
                    totalXp: 150,
                    milestone: {} as any,
                    milestoneProgress: {} as any,
                },
                subjects: [
                    {
                        subjectCode: "MAT",
                        subjectName: "Matematika",
                        masteredSubmaterials: 2,
                        totalSubmaterials: 10,
                        masteryPercent: 20,
                        simulationUnlocked: false,
                    },
                ],
                nextAction: {
                    priority: 1,
                    type: "NEXT_LEVEL",
                    title: "Lanjutkan Latihan Submateri",
                    subjectCode: "MAT",
                    materialId: 1,
                    submaterialId: 1,
                    levelId: 1,
                    route: "/submateri.html?id=1",
                },
                curriculumStatus: {
                    activeSubjectCode: "MAT",
                    activeMaterialId: 1,
                    activeSubmaterialId: 1,
                    activeLevelId: 1,
                },
            });

            const res = await getDashboard();
            const { status, body } = await parseApiResponse(res);

            expect(status).toBe(200);
            expect(body.data.student.name).toBe("Siswa Penguji");
            expect(body.data.subjects[0].subjectCode).toBe("MAT");
            expect(body.data.nextAction.type).toBe("NEXT_LEVEL");
        });
    });
});
