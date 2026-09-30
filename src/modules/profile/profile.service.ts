import { ProfileRepository } from "./profile.repository";
import {
    StudentProfileDto,
    CompleteProfileDto,
    UpdateProfileNameDto,
    AvatarListItemDto,
    XpTransactionDto,
    DashboardResponseDto,
} from "./profile.types";
import { BadRequestError, ConflictError } from "@/shared/errors/app-error";

export class ProfileService {
    constructor(private readonly repo = new ProfileRepository()) {}

    async getProfile(userId: string): Promise<StudentProfileDto> {
        const row = await this.repo.findProfileByUserId(userId);
        if (!row) {
            throw new ConflictError(
                "Lengkapi profil siswa dengan memilih kelas terlebih dahulu.",
                "PROFILE_INCOMPLETE"
            );
        }

        const currentXp = Number(row.total_xp);
        const nextMilestoneXp = row.tier_max_xp !== null ? row.tier_max_xp + 1 : null;
        const xpRemaining = nextMilestoneXp !== null ? Math.max(0, nextMilestoneXp - currentXp) : 0;
        
        let progressPercent = 100;
        if (nextMilestoneXp !== null) {
            const range = nextMilestoneXp - row.tier_min_xp;
            const progress = currentXp - row.tier_min_xp;
            progressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100 * 10) / 10));
        }

        return {
            id: row.user_id,
            email: row.email,
            username: row.username,
            name: row.name,
            avatar: {
                id: row.avatar_id || 1,
                name: row.avatar_name || "Ksatria Buku",
                imageUrl: row.avatar_image_url || "/assets/avatars/ksatria_buku.svg",
            },
            totalXp: currentXp,
            milestone: {
                id: row.tier_id,
                tierNumber: row.tier_number,
                title: row.tier_title,
                minXp: row.tier_min_xp,
                maxXp: row.tier_max_xp,
                badgeIconUrl: row.tier_badge_url,
                philosophicalMeaning: null,
            },
            milestoneProgress: {
                currentXp,
                nextMilestoneXp,
                xpRemaining,
                progressPercent,
            },
            grade: row.grade as 7 | 8 | 9,
        };
    }

    async completeProfile(userId: string, dto: CompleteProfileDto): Promise<StudentProfileDto> {
        const existing = await this.repo.findRawProfile(userId);
        if (existing) {
            throw new ConflictError("Profil siswa sudah pernah dilengkapi", "PROFILE_ALREADY_EXISTS");
        }

        if (![7, 8, 9].includes(dto.grade)) {
            throw new BadRequestError("Kelas harus 7, 8, atau 9 SMP", "INVALID_GRADE");
        }

        const avatarId = dto.presetAvatarId || 1;
        const avatar = await this.repo.getAvatarById(avatarId);
        if (!avatar || !avatar.is_active) {
            throw new BadRequestError("Avatar preset yang dipilih tidak valid atau tidak aktif");
        }

        await this.repo.createProfile(userId, dto.grade, avatarId);
        return this.getProfile(userId);
    }

    async updateProfileName(userId: string, dto: UpdateProfileNameDto): Promise<StudentProfileDto> {
        const profile = await this.repo.findRawProfile(userId);
        if (!profile) {
            throw new ConflictError(
                "Lengkapi profil siswa dengan memilih kelas terlebih dahulu.",
                "PROFILE_INCOMPLETE"
            );
        }

        await this.repo.updateProfileName(userId, dto.name);
        return this.getProfile(userId);
    }

    async getAvatars(userId?: string): Promise<{ items: AvatarListItemDto[]; total: number }> {
        const [rows, profile] = await Promise.all([
            this.repo.getActiveAvatars(),
            userId ? this.repo.findRawProfile(userId) : null,
        ]);
        const items = rows.map((r) => ({
            id: r.id,
            name: r.name,
            imageUrl: r.image_url,
            selected: profile ? profile.preset_avatar_id === r.id : false,
        }));
        return {
            items,
            total: items.length,
        };
    }

    async changeAvatar(userId: string, avatarId: number): Promise<{ id: number; name: string; imageUrl: string }> {
        const avatar = await this.repo.getAvatarById(avatarId);
        if (!avatar || !avatar.is_active) {
            throw new BadRequestError("Avatar tidak ditemukan atau tidak aktif");
        }

        const profile = await this.repo.findRawProfile(userId);
        if (!profile) {
            throw new ConflictError(
                "Lengkapi profil siswa dengan memilih kelas terlebih dahulu.",
                "PROFILE_INCOMPLETE"
            );
        }

        await this.repo.updateAvatar(userId, avatarId);
        return {
            id: avatar.id,
            name: avatar.name,
            imageUrl: avatar.image_url,
        };
    }

    async getXpTransactions(
        userId: string,
        page = 1,
        limit = 20
    ): Promise<{ items: XpTransactionDto[]; pagination: { page: number; limit: number; totalItems: number; totalPages: number } }> {
        const offset = (page - 1) * limit;
        const [rows, total] = await Promise.all([
            this.repo.getXpTransactions(userId, limit, offset),
            this.repo.countXpTransactions(userId),
        ]);

        const items: XpTransactionDto[] = rows.map((r) => ({
            id: r.id,
            sourceType: r.transaction_type,
            sourceLabel: r.description,
            amount: r.xp_amount,
            recordedAt: r.created_at,
        }));

        return {
            items,
            pagination: {
                page,
                limit,
                totalItems: total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        };
    }

    async getDashboard(userId: string): Promise<DashboardResponseDto> {
        const profile = await this.getProfile(userId);
        const subjects = await this.repo.getSubjectsMasteryProgress(userId);

        const subjectsProgress = subjects.map((s) => {
            const total = Number(s.total_sub_materials) || (s.code === "MAT" ? 10 : 6);
            const mastered = Number(s.mastered_sub_materials) || 0;
            const masteryPercent = total > 0 ? Math.round((mastered / total) * 100 * 10) / 10 : 0;
            return {
                subjectCode: s.code as "MAT" | "BIN",
                subjectName: s.name as "Matematika" | "Bahasa Indonesia",
                masteredSubmaterials: mastered,
                totalSubmaterials: total,
                masteryPercent,
                simulationUnlocked: mastered === total && total > 0,
            };
        });

        // Tentukan nextAction berdasarkan capaian siswa
        const isRecallPassed = await this.repo.findRawProfile(userId).then(p => Boolean(p?.is_recall_passed));

        return {
            student: {
                name: profile.name,
                avatar: profile.avatar,
                totalXp: profile.totalXp,
                milestone: profile.milestone,
                milestoneProgress: profile.milestoneProgress,
            },
            subjects: subjectsProgress,
            nextAction: !isRecallPassed
                ? {
                      priority: 1,
                      type: "RECALL",
                      title: "Mulai Asesmen Diagnostik",
                      subjectCode: null,
                      materialId: null,
                      submaterialId: null,
                      levelId: null,
                      route: "/recall.html",
                  }
                : {
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
        };
    }
}
