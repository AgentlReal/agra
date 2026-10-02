import { QuestionStimulus } from "../simulation/simulation.types";

export interface M04_QuestionOptionItem {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
}

export interface M04_SessionQuestionItem {
    session_question_id: number;
    question_order: number;
    question_type: string;
    question_text: string;
    stimulus_image_url?: string | null;
    question_image_url?: string | null;
    options: M04_QuestionOptionItem[];
    selected_option_ids: number[];
    is_skipped: boolean;
    time_spent_seconds?: number;
    stimulus: {
        id: number;
        subject_id: number;
        title: string;
        content_text: string;
        source_citation: string | null;
        image_url?: string | null;
    } | null;
}

export interface M04_LevelSessionDetail {
    attempt_id: number;
    sub_material_id: number;
    sub_material_title: string;
    cognitive_level_id: number;
    level_number: 1 | 2 | 3;
    level_name: string;
    attempt_number: number;
    is_remedial: boolean;
    status: "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ABANDONED";
    total_questions: 10;
    answered_count: number;
    current_question_order: number;
    questions: M04_SessionQuestionItem[];
}

export interface M04_SaveAnswerRequestDto {
    selected_option_ids: number[];
    is_skipped: boolean;
    time_spent_seconds: number;
    current_question_order?: number;
}

export interface M04_SaveAnswerResponse {
    session_question_id: number;
    answered_at: string;
    answered_count: number;
    remaining_unanswered_count: number;
    current_question_order: number;
}

export interface M04_SubMaterialMasteryProgress {
    sub_material_id: number;
    level_1_status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    level_2_status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    level_3_status: "LOCKED" | "AVAILABLE" | "COMPLETED" | "NEEDS_REMEDIAL";
    level_1_score: number | null;
    level_2_score: number | null;
    level_3_score: number | null;
    total_cumulative_score: number;
    is_mastered: boolean;
    mastered_at: string | null;
}

export interface M04_LevelResultResponse {
    attempt_id: number;
    level_id: number;
    level_number: 1 | 2 | 3;
    level_name: string;
    score: number;
    correct_answers: number;
    total_questions: 10;
    is_passed: boolean;
    xp_earned: number;
    total_xp: number;
    next_action: "NEXT_LEVEL" | "LEVEL_REMEDIAL" | "SUB_MATERIAL_MASTERED" | "NEXT_SUB_MATERIAL";
    sub_material_progress: M04_SubMaterialMasteryProgress;
}

export interface M04_QuestionReviewItemOption {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
    is_correct: boolean;
}

export interface M04_QuestionReviewItem {
    session_question_id: number;
    question_order: number;
    question_text: string;
    stimulus_image_url: string | null;
    question_image_url?: string | null;
    options: M04_QuestionReviewItemOption[];
    selected_option_ids: number[];
    correct_option_ids: number[];
    is_correct: boolean;
    time_spent_seconds: number;
    explanation_text: string;
    reasoning_guide: string;
    reference_url: string | null;
    stimulus?: QuestionStimulus | null;
}

export interface M04_LevelReviewResponse {
    attempt_id: number;
    level_number: 1 | 2 | 3;
    level_name: string;
    total_questions: 10;
    correct_answers: number;
    reviews: M04_QuestionReviewItem[];
}

