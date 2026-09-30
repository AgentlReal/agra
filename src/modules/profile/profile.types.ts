export interface AvatarDto {
    id: number;
    name: string;
    imageUrl: string;
    description?: string | null;
}

export interface MilestoneDto {
    id: number;
    tierNumber: number;
    title: string;
    minXp: number;
    maxXp: number | null;
    badgeIconUrl: string | null;
    philosophicalMeaning: string | null;
}

export interface MilestoneProgressDto {
    currentXp: number;
    nextMilestoneXp: number | null;
    xpRemaining: number;
    progressPercent: number;
}

export interface StudentProfileDto {
    id: string;
    email: string;
    username: string;
    name: string;
    avatar: AvatarDto;
    totalXp: number;
    milestone: MilestoneDto;
    milestoneProgress: MilestoneProgressDto;
    grade: 7 | 8 | 9;
}

export interface CompleteProfileDto {
    grade: 7 | 8 | 9;
    presetAvatarId?: number;
}

export interface UpdateProfileNameDto {
    name: string;
}

export interface UpdateAvatarDto {
    presetAvatarId: number;
}

export interface AvatarListItemDto {
    id: number;
    name: string;
    imageUrl: string;
    selected: boolean;
}


export interface XpTransactionDto {
    id: number;
    sourceType: "LEVEL_COMPLETION" | "SUB_MATERIAL_MASTERY" | "SIMULATION_COMPLETION";
    sourceLabel: string;
    amount: number;
    recordedAt: Date | string;
}

export interface PaginationDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
}

export interface SubjectProgressDto {
    subjectCode: "MAT" | "BIN";
    subjectName: "Matematika" | "Bahasa Indonesia";
    masteredSubmaterials: number;
    totalSubmaterials: number;
    masteryPercent: number;
    simulationUnlocked: boolean;
}

export interface DashboardStudentSummaryDto {
    name: string;
    avatar: AvatarDto;
    totalXp: number;
    milestone: MilestoneDto;
    milestoneProgress: MilestoneProgressDto;
}

export interface DashboardNextActionDto {
    priority: number;
    type: "RECALL" | "REMEDIAL" | "NEXT_LEVEL" | "NEW_SUBMATERIAL" | "SIMULATION";
    title: string;
    subjectCode: "MAT" | "BIN" | null;
    materialId: number | null;
    submaterialId: number | null;
    levelId: number | null;
    route: string;
}

export interface DashboardCurriculumStatusDto {
    activeSubjectCode: "MAT" | "BIN" | null;
    activeMaterialId: number | null;
    activeSubmaterialId: number | null;
    activeLevelId: number | null;
}

export interface DashboardResponseDto {
    student: DashboardStudentSummaryDto;
    subjects: SubjectProgressDto[];
    nextAction: DashboardNextActionDto;
    curriculumStatus: DashboardCurriculumStatusDto;
}
