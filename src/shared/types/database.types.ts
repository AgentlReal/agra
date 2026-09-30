import { RowDataPacket } from "mysql2";

export interface UserRow extends RowDataPacket {
    id: string;
    name: string;
    username: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: "SISWA" | "TIM_KURIKULUM";
    createdAt: Date;
    updatedAt: Date;
}

export interface PresetAvatarRow extends RowDataPacket {
    id: number;
    name: string;
    image_url: string;
    is_active: boolean;
}

export interface MilestoneTierRow extends RowDataPacket {
    id: number;
    tier_number: number;
    title: string;
    min_xp: number;
    max_xp: number | null;
    badge_icon_url: string | null;
    philosophical_meaning: string | null;
}

export interface UserProfileRow extends RowDataPacket {
    id: number;
    user_id: string;
    preset_avatar_id: number | null;
    current_milestone_tier_id: number;
    grade: 7 | 8 | 9;
    total_xp: number;
    is_recall_passed: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface SubjectRow extends RowDataPacket {
    id: number;
    code: "MAT" | "BIN";
    name: string;
    description: string | null;
    is_active: boolean;
}

export interface MaterialRow extends RowDataPacket {
    id: number;
    subject_id: number;
    prerequisite_material_id: number | null;
    title: string;
    order_index: number;
    is_active: boolean;
}

export interface SubMaterialRow extends RowDataPacket {
    id: number;
    material_id: number;
    prerequisite_sub_material_id: number | null;
    code: string;
    title: string;
    order_index: number;
    passing_threshold: number;
    xp_reward: number;
    is_active: boolean;
}

export interface CognitiveLevelRow extends RowDataPacket {
    id: number;
    level_number: number;
    name: string;
    target_questions: number;
    passing_score: number;
    xp_reward: number;
    description: string | null;
}

export interface StimulusRow extends RowDataPacket {
    id: number;
    subject_id: number;
    title: string;
    stimulus_text: string;
    stimulus_image_url: string | null;
    created_at: Date;
}

export interface QuestionBankRow extends RowDataPacket {
    id: number;
    subject_id: number;
    sub_material_id: number | null;
    cognitive_level_id: number | null;
    stimulus_id: number | null;
    bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    question_text: string;
    stimulus_image_url: string | null;
    is_active: boolean;
    created_at: Date;
}

export interface QuestionOptionRow extends RowDataPacket {
    id: number;
    question_id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
    is_correct: boolean;
}

export interface QuestionExplanationRow extends RowDataPacket {
    id: number;
    question_id: number;
    explanation_text: string;
    reasoning_guide: string | null;
    reference_url: string | null;
}

export interface SimulationRow extends RowDataPacket {
    id: number;
    subject_id: number;
    title: string;
    package_code: string;
    duration_minutes: number;
    total_questions: number;
    passing_score: number;
    xp_reward: number;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    is_active: boolean;
    created_at: Date;
}

export interface SimulationQuestionRow extends RowDataPacket {
    id: number;
    simulation_id: number;
    question_id: number;
    question_order: number;
}

export interface LearningSessionRow extends RowDataPacket {
    id: number;
    user_id: string;
    subject_id: number | null;
    session_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    sub_material_id: number | null;
    cognitive_level_id: number | null;
    simulation_id: number | null;
    attempt_number: number;
    is_remedial: boolean;
    status: "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ABANDONED";
    submission_type: "MANUAL" | "TIMEOUT" | null;
    total_questions: number;
    correct_answers: number;
    score: number;
    is_passed: boolean;
    remaining_time_seconds: number | null;
    current_question_order: number;
    start_time: Date;
    resumed_at: Date | null;
    end_time: Date | null;
}

export interface SessionQuestionRow extends RowDataPacket {
    id: number;
    session_id: number;
    question_id: number;
    question_order: number;
}

export interface StudentAnswerRow extends RowDataPacket {
    id: number;
    session_question_id: number;
    is_correct: boolean;
    is_flagged: boolean;
    is_skipped: boolean;
    time_spent_seconds: number;
    answered_at: Date;
}

export interface StudentAnswerOptionRow extends RowDataPacket {
    id: number;
    student_answer_id: number;
    selected_option_id: number;
}

export interface StudentSubMaterialProgressRow extends RowDataPacket {
    id: number;
    user_id: string;
    sub_material_id: number;
    level_1_status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    level_2_status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    level_3_status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    level_1_score: number;
    level_2_score: number;
    level_3_score: number;
    total_cumulative_score: number;
    is_mastered: boolean;
    is_xp_awarded: boolean;
    progress_state: "LOCKED" | "IN_PROGRESS" | "MASTERED";
    mastered_at: Date | null;
    updated_at: Date;
}

export interface XpTransactionRow extends RowDataPacket {
    id: number;
    user_id: string;
    sub_material_id: number | null;
    simulation_id: number | null;
    session_id: number | null;
    milestone_tier_id: number | null;
    transaction_type: "LEVEL_COMPLETION" | "SUB_MATERIAL_MASTERY" | "SIMULATION_COMPLETION";
    xp_amount: number;
    description: string;
    created_at: Date;
}
