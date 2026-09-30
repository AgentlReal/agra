export interface QuestionStimulus {
    id: number;
    subject_id: number;
    title: string;
    stimulus_text: string;
    stimulus_image_url?: string | null;
}

export interface M05_SimulationTiming {
    server_time: string;
    duration_minutes: number;
    deadline_at: string;
    remaining_seconds: number;
}

export interface M05_UnmasteredSubMaterial {
    sub_material_id: number;
    material_title: string;
    sub_material_title: string;
}

export interface M05_SimulationEligibilityResponse {
    subject_id: number;
    subject_name: string;
    is_eligible: boolean;
    total_sub_materials: number;
    mastered_sub_materials: number;
    completion_percentage: number;
    unmastered_sub_materials: M05_UnmasteredSubMaterial[];
}

export interface M05_StartSimulationResponse {
    attempt_id: number;
    package_id: number;
    package_title: string;
    attempt_number: number;
    total_questions: 30;
    timing: M05_SimulationTiming;
}

export interface M05_QuestionOptionItem {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
}

export interface M05_SavedAnswerItem {
    selected_option_ids: number[];
    is_doubtful: boolean;
    is_skipped: boolean;
    time_spent_seconds: number;
}

export interface M05_SimulationQuestionItem {
    session_question_id: number;
    question_id: number;
    question_order: number;
    question_type: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    question_text: string;
    stimulus_image_url: string | null;
    options: M05_QuestionOptionItem[];
    saved_answer: M05_SavedAnswerItem | null;
    stimulus: QuestionStimulus | null;
}

export interface M05_SimulationAttemptDetail {
    attempt_id: number;
    package_id: number;
    package_title: string;
    attempt_number: number;
    status: "IN_PROGRESS" | "COMPLETED";
    total_questions: 30;
    answered_count: number;
    doubtful_count: number;
    current_question_order: number;
    timing: M05_SimulationTiming;
    questions: M05_SimulationQuestionItem[];
}

export interface M05_SaveSimulationAnswerResponse {
    session_question_id: number;
    answered_at: string;
    is_doubtful: boolean;
    remaining_seconds: number;
    current_question_order: number;
}

export interface M05_SimulationResultResponse {
    attempt_id: number;
    package_id: number;
    package_title: string;
    score: number;
    correct_answers: number;
    total_questions: 30;
    is_passed: boolean;
    xp_earned: number;
    total_xp: number;
    completed_at: string;
    submission_type: "MANUAL" | "TIMEOUT";
    can_retake: boolean;
}

export interface M05_SimulationQuestionReviewOption {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
}

export interface M05_SimulationQuestionReviewItem {
    session_question_id: number;
    question_order: number;
    question_text: string;
    stimulus_image_url: string | null;
    options: M05_SimulationQuestionReviewOption[];
    selected_option_ids: number[];
    correct_option_ids: number[];
    is_correct: boolean;
    time_spent_seconds: number;
    explanation_text: string;
    reasoning_guide: string;
    reference_url: string | null;
    stimulus?: QuestionStimulus | null;
}

export interface M05_SimulationReviewResponse {
    attempt_id: number;
    package_title: string;
    total_questions: 30;
    correct_answers: number;
    reviews: M05_SimulationQuestionReviewItem[];
}
