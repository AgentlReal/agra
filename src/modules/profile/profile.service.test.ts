import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProfileService } from "./profile.service";
import { ProfileRepository } from "./profile.repository";
import { ConflictError, BadRequestError } from "@/shared/errors/app-error";

describe("ProfileService Unit Tests", () => {
    let mockRepo: Partial<Record<keyof ProfileRepository, ReturnType<typeof vi.fn>>>;
    let service: ProfileService;

    beforeEach(() => {
        mockRepo = {
            findProfileByUserId: vi.fn(),
            findRawProfile: vi.fn(),
            createProfile: vi.fn(),
            getAvatarById: vi.fn(),
            updateProfileName: vi.fn(),
            getActiveAvatars: vi.fn(),
            updateAvatar: vi.fn(),
            getXpTransactions: vi.fn(),
            countXpTransactions: vi.fn(),
            getSubjectsMasteryProgress: vi.fn(),
        };
        service = new ProfileService(mockRepo as unknown as ProfileRepository);
    });

    describe("getProfile", () => {
        it("harus otomatis mencoba membuat profil default jika profil belum ada dan melempar BadRequestError jika tetap null", async () => {
            mockRepo.findProfileByUserId!.mockResolvedValue(null);

            await expect(service.getProfile("user-123")).rejects.toMatchObject({
                statusCode: 400,
            });
            expect(mockRepo.createProfile).toHaveBeenCalledWith("user-123", 1);
        });

        it("harus berhasil mengembalikan profil lengkap dan kalkulasi progres milestone dengan benar", async () => {
            mockRepo.findProfileByUserId!.mockResolvedValue({
                user_id: "user-123",
                email: "siswa@example.com",
                username: "siswa_rajin",
                name: "Budi Santoso",
                preset_avatar_id: 1,
                total_xp: 350,
                is_recall_passed: 1,
                avatar_id: 1,
                avatar_name: "Ksatria Buku",
                avatar_image_url: "/assets/avatars/ksatria_buku.svg",
                tier_id: 2,
                tier_number: 2,
                tier_title: "Penjelajah Ilmu",
                tier_min_xp: 200,
                tier_max_xp: 500,
                tier_badge_url: "/assets/badges/tier2.svg",
            });

            const result = await service.getProfile("user-123");

            expect(result.id).toBe("user-123");
            expect(result.totalXp).toBe(350);
            expect(result.milestone.title).toBe("Penjelajah Ilmu");
            expect(result.milestoneProgress.currentXp).toBe(350);
            expect(result.milestoneProgress.nextMilestoneXp).toBe(501);
            expect(result.milestoneProgress.xpRemaining).toBe(151);
            expect(result.milestoneProgress.progressPercent).toBeGreaterThan(45);
        });

        it("harus menangani profil yang sudah mencapai tier tertinggi (tier_max_xp null)", async () => {
            mockRepo.findProfileByUserId!.mockResolvedValue({
                user_id: "user-top",
                email: "top@example.com",
                username: "top_tier",
                name: "Siswa Legenda",
                preset_avatar_id: 1,
                total_xp: 5000,
                is_recall_passed: 1,
                avatar_id: 1,
                avatar_name: "Ksatria Buku",
                avatar_image_url: "/assets/avatars/ksatria_buku.svg",
                tier_id: 5,
                tier_number: 5,
                tier_title: "Legenda Pengetahuan",
                tier_min_xp: 4000,
                tier_max_xp: null,
                tier_badge_url: "/assets/badges/tier5.svg",
            });

            const result = await service.getProfile("user-top");

            expect(result.milestoneProgress.nextMilestoneXp).toBeNull();
            expect(result.milestoneProgress.xpRemaining).toBe(0);
            expect(result.milestoneProgress.progressPercent).toBe(100);
        });
    });

    describe("completeProfile", () => {
        it("harus memperbarui avatar jika profil sudah ada", async () => {
            mockRepo.findRawProfile!.mockResolvedValue({ user_id: "user-123" } as any);
            mockRepo.getAvatarById!.mockResolvedValue({ id: 2, is_active: 1 });
            mockRepo.updateAvatar!.mockResolvedValue(undefined);
            const getProfileSpy = vi.spyOn(service, "getProfile").mockResolvedValueOnce({
                id: "user-123",
            } as any);

            const res = await service.completeProfile("user-123", { presetAvatarId: 2 });
            expect(mockRepo.updateAvatar).toHaveBeenCalledWith("user-123", 2);
            expect(getProfileSpy).toHaveBeenCalledWith("user-123");
            expect(res.id).toBe("user-123");
        });

        it("harus melempar BadRequestError jika avatar yang dipilih tidak valid atau tidak aktif", async () => {
            mockRepo.findRawProfile!.mockResolvedValue(null);
            mockRepo.getAvatarById!.mockResolvedValue(null);

            await expect(
                service.completeProfile("user-123", { presetAvatarId: 999 })
            ).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil membuat profil dan mengembalikan profil baru", async () => {
            mockRepo.findRawProfile!.mockResolvedValue(null);
            mockRepo.getAvatarById!.mockResolvedValue({ id: 2, is_active: 1 });
            mockRepo.createProfile!.mockResolvedValue(undefined);

            const getProfileSpy = vi.spyOn(service, "getProfile").mockResolvedValueOnce({
                id: "user-123",
            } as any);

            const res = await service.completeProfile("user-123", { presetAvatarId: 2 });

            expect(mockRepo.createProfile).toHaveBeenCalledWith("user-123", 2);
            expect(getProfileSpy).toHaveBeenCalledWith("user-123");
            expect(res.id).toBe("user-123");
        });
    });

    describe("updateProfileName", () => {
        it("harus otomatis membuat profil jika profil belum ada saat perbarui nama", async () => {
            mockRepo.findRawProfile!.mockResolvedValue(null);
            mockRepo.updateProfileName!.mockResolvedValue(undefined);
            vi.spyOn(service, "getProfile").mockResolvedValueOnce({
                id: "user-123",
                name: "Nama Baru",
            } as any);

            const res = await service.updateProfileName("user-123", { name: "Nama Baru" });
            expect(mockRepo.createProfile).toHaveBeenCalledWith("user-123", 1);
            expect(res.name).toBe("Nama Baru");
        });

        it("harus berhasil memperbarui nama profil", async () => {
            mockRepo.findRawProfile!.mockResolvedValue({ user_id: "user-123" } as any);
            mockRepo.updateProfileName!.mockResolvedValue(undefined);
            vi.spyOn(service, "getProfile").mockResolvedValueOnce({
                id: "user-123",
                name: "Nama Baru",
            } as any);

            const res = await service.updateProfileName("user-123", { name: "Nama Baru" });

            expect(mockRepo.updateProfileName).toHaveBeenCalledWith("user-123", "Nama Baru");
            expect(res.name).toBe("Nama Baru");
        });
    });

    describe("getAvatars & changeAvatar", () => {
        it("harus mengembalikan daftar avatar aktif dengan indikator avatar terpilih", async () => {
            mockRepo.getActiveAvatars!.mockResolvedValue([
                { id: 1, name: "Ksatria", image_url: "/1.svg" },
                { id: 2, name: "Penyihir", image_url: "/2.svg" },
            ]);
            mockRepo.findRawProfile!.mockResolvedValue({ preset_avatar_id: 1 } as any);

            const res = await service.getAvatars("user-123");

            expect(res.total).toBe(2);
            expect(res.items[0].selected).toBe(true);
            expect(res.items[1].selected).toBe(false);
        });

        it("harus melempar BadRequestError jika avatar tujuan tidak ditemukan atau tidak aktif", async () => {
            mockRepo.getAvatarById!.mockResolvedValue(null);

            await expect(service.changeAvatar("user-123", 999)).rejects.toThrow(BadRequestError);
        });

        it("harus berhasil memperbarui avatar siswa", async () => {
            mockRepo.getAvatarById!.mockResolvedValue({ id: 2, name: "Penyihir", image_url: "/2.svg", is_active: 1 });
            mockRepo.findRawProfile!.mockResolvedValue({ user_id: "user-123" } as any);
            mockRepo.updateAvatar!.mockResolvedValue(undefined);

            const res = await service.changeAvatar("user-123", 2);

            expect(mockRepo.updateAvatar).toHaveBeenCalledWith("user-123", 2);
            expect(res.id).toBe(2);
            expect(res.name).toBe("Penyihir");
        });
    });

    describe("getXpTransactions", () => {
        it("harus mengembalikan daftar transaksi XP dengan metadata pagination", async () => {
            mockRepo.getXpTransactions!.mockResolvedValue([
                { id: 1, transaction_type: "LEVEL_COMPLETION", description: "Selesai Level 1", xp_amount: 50, created_at: "2026-09-30" },
            ]);
            mockRepo.countXpTransactions!.mockResolvedValue(1);

            const res = await service.getXpTransactions("user-123", 1, 10);

            expect(res.items).toHaveLength(1);
            expect(res.items[0].amount).toBe(50);
            expect(res.pagination.totalItems).toBe(1);
            expect(res.pagination.totalPages).toBe(1);
        });
    });

    describe("getDashboard", () => {
        it("harus mengarahkan nextAction ke RECALL jika siswa belum lulus Recall Kemampuanmu", async () => {
            vi.spyOn(service, "getProfile").mockResolvedValueOnce({
                id: "user-1",
                name: "Siswa",
                avatar: {} as any,
                totalXp: 0,
                milestone: {} as any,
                milestoneProgress: {} as any,
            } as any);

            mockRepo.getSubjectsMasteryProgress!.mockResolvedValue([
                { code: "MAT", name: "Matematika", total_sub_materials: 10, mastered_sub_materials: 0 },
            ]);
            mockRepo.findRawProfile!.mockResolvedValue({ is_recall_passed: 0 } as any);

            const res = await service.getDashboard("user-1");

            expect(res.nextAction.type).toBe("RECALL");
            expect(res.nextAction.route).toBe("/recall.html");
            expect(res.subjects[0].masteryPercent).toBe(0);
            expect(res.subjects[0].simulationUnlocked).toBe(false);
        });

        it("harus mengarahkan nextAction ke NEXT_LEVEL jika siswa sudah lulus Recall", async () => {
            vi.spyOn(service, "getProfile").mockResolvedValueOnce({
                id: "user-1",
                name: "Siswa",
                avatar: {} as any,
                totalXp: 100,
                milestone: {} as any,
                milestoneProgress: {} as any,
            } as any);

            mockRepo.getSubjectsMasteryProgress!.mockResolvedValue([
                { code: "MAT", name: "Matematika", total_sub_materials: 10, mastered_sub_materials: 10 },
            ]);
            mockRepo.findRawProfile!.mockResolvedValue({ is_recall_passed: 1 } as any);

            const res = await service.getDashboard("user-1");

            expect(res.nextAction.type).toBe("NEXT_LEVEL");
            expect(res.subjects[0].simulationUnlocked).toBe(true);
            expect(res.subjects[0].masteryPercent).toBe(100);
        });
    });
});
