export interface ApiSubjectItem {
    subjectId: number;
    name: string;
    totalMaterials: number;
    code: "MAT" | "BIN";
    description: string | null;
}

export interface ApiCurriculumLevelItem {
    id: number;
    levelNumber: 1 | 2 | 3;
    name: string;
    status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    targetQuestions: number;
    passingScore: number;
    xpReward: number;
}

export interface ApiCurriculumSubMaterialItem {
    submaterialId: number;
    title: string;
    status: "LOCKED" | "IN_PROGRESS" | "MASTERED";
    code: string;
    orderIndex: number;
    prerequisiteSubmaterialId: number | null;
    passingThreshold: number;
    xpReward: number;
    levels: ApiCurriculumLevelItem[];
}

export interface ApiCurriculumMaterialItem {
    materialId: number;
    title: string;
    status: "LOCKED" | "IN_PROGRESS" | "MASTERED";
    submaterials: ApiCurriculumSubMaterialItem[];
}

export interface ApiSubmaterialLevelProgress {
    level: 1 | 2 | 3;
    status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    score: number | null;
}

export interface ApiSubmaterialProgressResponse {
    isMastered: boolean;
    levels: ApiSubmaterialLevelProgress[];
    totalCumulativeScore: number | null;
    masteredAt: string | null;
    progressState: "LOCKED" | "IN_PROGRESS" | "MASTERED";
}

