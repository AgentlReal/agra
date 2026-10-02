import { CurriculumRepository } from "./curriculum.repository";
import {
    ApiSubjectItem,
    ApiCurriculumMaterialItem,
    ApiCurriculumSubMaterialItem,
    ApiCurriculumLevelItem,
    ApiSubmaterialProgressResponse,
} from "./curriculum.types";
import { NotFoundError } from "@/shared/errors/app-error";

export class CurriculumService {
    constructor(private readonly repo = new CurriculumRepository()) {}

    async listSubjects(): Promise<ApiSubjectItem[]> {
        const rows = await this.repo.getActiveSubjects();
        return rows.map((s) => ({
            subjectId: s.id,
            name: s.name,
            totalMaterials: Number(s.total_materials) || 0,
            code: s.code as "MAT" | "BIN",
            description: s.description,
        }));
    }

    async getSubjectCurriculum(subjectId: number, userId: string): Promise<ApiCurriculumMaterialItem[]> {
        const subject = await this.repo.getSubjectById(subjectId);
        if (!subject) {
            throw new NotFoundError("Mata pelajaran tidak ditemukan");
        }

        const isRecallPassed = await this.repo.isRecallPassed(userId);
        const materials = await this.repo.getMaterialsBySubject(subjectId);
        const subMaterials = await this.repo.getSubMaterialsBySubject(subjectId);
        const cognitiveLevels = await this.repo.getCognitiveLevels();

        const progressRows = await this.repo.getUserProgressForSubMaterials(
            userId,
            subMaterials.map((sm) => sm.id)
        );

        const progressMap = new Map(progressRows.map((p) => [p.sub_material_id, p]));

        const materialsResult: ApiCurriculumMaterialItem[] = [];

        for (const mat of materials) {
            let isMaterialLocked = !isRecallPassed;
            if (mat.prerequisite_material_id && isRecallPassed) {
                const prereqSubMaterials = subMaterials.filter(
                    (sm) => sm.material_id === mat.prerequisite_material_id
                );
                const allPrereqMastered = prereqSubMaterials.length > 0 && prereqSubMaterials.every((sm) => {
                    const prog = progressMap.get(sm.id);
                    return Boolean(prog?.is_mastered);
                });
                if (!allPrereqMastered) {
                    isMaterialLocked = true;
                }
            }

            const currentSubMaterials = subMaterials.filter((sm) => sm.material_id === mat.id);
            const subMaterialsResult: ApiCurriculumSubMaterialItem[] = [];

            for (const sm of currentSubMaterials) {
                const prog = progressMap.get(sm.id);
                let isSmLocked = isMaterialLocked;

                if (!isSmLocked && sm.prerequisite_sub_material_id) {
                    const prereqProg = progressMap.get(sm.prerequisite_sub_material_id);
                    if (!prereqProg || !Boolean(prereqProg.is_mastered)) {
                        isSmLocked = true;
                    }
                }

                const smStatus: "LOCKED" | "IN_PROGRESS" | "MASTERED" = isSmLocked
                    ? "LOCKED"
                    : Boolean(prog?.is_mastered)
                    ? "MASTERED"
                    : "IN_PROGRESS";

                const levelsResult: ApiCurriculumLevelItem[] = cognitiveLevels.map((cl) => {
                    let levelStatus: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL" = "LOCKED";
                    if (isSmLocked) {
                        levelStatus = "LOCKED";
                    } else if (prog) {
                        if (cl.level_number === 1) levelStatus = (prog.level_1_status as typeof levelStatus) || "LOCKED";
                        else if (cl.level_number === 2) levelStatus = (prog.level_2_status as typeof levelStatus) || "LOCKED";
                        else if (cl.level_number === 3) levelStatus = (prog.level_3_status as typeof levelStatus) || "LOCKED";
                    } else {
                        if (cl.level_number === 1) levelStatus = "AVAILABLE";
                        else levelStatus = "LOCKED";
                    }

                    const customName =
                        cl.level_number === 1
                            ? sm.level_1_name
                            : cl.level_number === 2
                            ? sm.level_2_name
                            : sm.level_3_name;

                    return {
                        id: cl.id,
                        levelNumber: cl.level_number as 1 | 2 | 3,
                        name: customName || cl.name,
                        status: levelStatus,
                        targetQuestions: cl.target_questions,
                        passingScore: cl.passing_score,
                        xpReward: cl.xp_reward,
                    };
                });

                subMaterialsResult.push({
                    submaterialId: sm.id,
                    title: sm.title,
                    status: smStatus,
                    code: sm.code,
                    orderIndex: sm.order_index,
                    prerequisiteSubmaterialId: sm.prerequisite_sub_material_id,
                    passingThreshold: Number(sm.passing_threshold),
                    xpReward: sm.xp_reward,
                    levels: levelsResult,
                });
            }

            const allSmMastered =
                subMaterialsResult.length > 0 &&
                subMaterialsResult.every((sm) => sm.status === "MASTERED");
            const matStatus: "LOCKED" | "IN_PROGRESS" | "MASTERED" = isMaterialLocked
                ? "LOCKED"
                : allSmMastered
                ? "MASTERED"
                : "IN_PROGRESS";

            materialsResult.push({
                materialId: mat.id,
                title: mat.title,
                status: matStatus,
                submaterials: subMaterialsResult,
            });
        }

        return materialsResult;
    }

    async getSubMaterialProgress(
        subMaterialId: number,
        userId: string
    ): Promise<ApiSubmaterialProgressResponse> {
        const sm = await this.repo.getSubMaterialById(subMaterialId);
        if (!sm) {
            throw new NotFoundError("Submateri tidak ditemukan");
        }

        const isRecallPassed = await this.repo.isRecallPassed(userId);
        const prog = await this.repo.getSingleSubMaterialProgress(userId, subMaterialId);
        const defaultLevel1Status = isRecallPassed ? "AVAILABLE" : "LOCKED";

        return {
            isMastered: Boolean(prog?.is_mastered),
            levels: [
                {
                    level: 1,
                    status: (prog?.level_1_status as "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL") || defaultLevel1Status,
                    score:
                        prog?.level_1_score !== null && prog?.level_1_score !== undefined
                            ? Number(prog.level_1_score)
                            : null,
                },
                {
                    level: 2,
                    status: (prog?.level_2_status as "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL") || "LOCKED",
                    score:
                        prog?.level_2_score !== null && prog?.level_2_score !== undefined
                            ? Number(prog.level_2_score)
                            : null,
                },
                {
                    level: 3,
                    status: (prog?.level_3_status as "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL") || "LOCKED",
                    score:
                        prog?.level_3_score !== null && prog?.level_3_score !== undefined
                            ? Number(prog.level_3_score)
                            : null,
                },
            ],
            totalCumulativeScore:
                prog?.total_cumulative_score !== null && prog?.total_cumulative_score !== undefined
                    ? Number(prog.total_cumulative_score)
                    : null,
            masteredAt: prog?.mastered_at ? new Date(prog.mastered_at).toISOString() : null,
            progressState: (prog?.progress_state as "LOCKED" | "IN_PROGRESS" | "MASTERED") || "LOCKED",
        };
    }
}

