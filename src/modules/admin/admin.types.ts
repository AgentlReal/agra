import { QuestionStimulus } from "../simulation/simulation.types";

export interface K09_AdminProfile {
    id: string;
    email: string;
    username: string;
    name: string;
    role: "TIM_KURIKULUM";
}

export interface K10_QuestionBankStock {
    bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    subject_id: number;
    sub_material_id: number | null;
    cognitive_level_id: number | null;
    active_question_count: number;
}

export interface K10_QuestionSummary {
    id: number;
    subject_id: number;
    sub_material_id: number | null;
    cognitive_level_id: number | null;
    bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    question_text: string;
    is_active: boolean;
    created_at: string;
}

export interface K10_QuestionOption {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
    is_correct: boolean;
}

export interface K10_QuestionExplanation {
    explanation_text: string;
    reasoning_guide?: string | null;
    reference_url?: string | null;
}

export interface K10_Question {
    id: number;
    subject_id: number;
    sub_material_id: number | null;
    cognitive_level_id: number | null;
    bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    question_text: string;
    is_active: boolean;
    created_at: string;
    stimulus_id: number | null;
    stimulus_image_url: string | null;
    question_image_url?: string | null;
    stimulus?: QuestionStimulus | null;
    options: K10_QuestionOption[];
    explanation: K10_QuestionExplanation;
}

export interface K10_QuestionInputOption {
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
    is_correct: boolean;
}

export interface K10_QuestionInput {
    subject_id: number;
    sub_material_id?: number | null;
    cognitive_level_id?: number | null;
    stimulus_id?: number | null;
    bank_type: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    question_format: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    question_text: string;
    stimulus_image_url?: string | null;
    question_image_url?: string | null;
    options: K10_QuestionInputOption[];
    explanation: {
        explanation_text: string;
        reasoning_guide?: string | null;
        reference_url?: string | null;
    };
    stimulus?: {
        title: string;
        stimulus_text: string;
        stimulus_image_url?: string | null;
    } | null;
}

export interface K10_QuestionUpdateInput {
    subject_id?: number;
    sub_material_id?: number | null;
    cognitive_level_id?: number | null;
    stimulus_id?: number | null;
    bank_type?: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    question_format?: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    question_text?: string;
    stimulus_image_url?: string | null;
    question_image_url?: string | null;
    options?: K10_QuestionInputOption[];
    explanation?: {
        explanation_text: string;
        reasoning_guide?: string | null;
        reference_url?: string | null;
    };
    stimulus?: {
        title: string;
        stimulus_text: string;
        stimulus_image_url?: string | null;
    } | null;
}

export interface K10_QuestionImage {
    image_url: string;
    imageUrl?: string;
    url?: string;
}

export interface K10_QuestionFilter {
    bank?: "RECALL" | "LEVEL_EXERCISE" | "SIMULATION";
    subject?: number;
    material?: number;
    submaterial?: number;
    level?: number;
    type?: "SINGLE_CHOICE" | "COMPLEX_CHOICE";
    is_active?: boolean;
    page?: number;
    limit?: number;
}

export interface K10_Pagination {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
}

export interface K11_SimulationPackageSummary {
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
    created_at: string;
}

export interface K11_SimulationPackageQuestionItem {
    question_id: number;
    question_order: number;
}

export interface K11_SimulationPackageBlueprintItem {
    material: string;
    level: string;
    count: number;
}

export interface K11_SimulationPackage {
    id: number;
    subject_id: number;
    subject_name?: string;
    subjectName?: string;
    title: string;
    package_code: string;
    duration_minutes: number;
    total_questions: number;
    passing_score: number;
    xp_reward: number;
    status: "DRAFT" | "ACTIVE" | "ARCHIVED";
    is_active: boolean;
    created_at: string;
    questions: K11_SimulationPackageQuestionItem[];
    blueprint?: K11_SimulationPackageBlueprintItem[];
}

export interface K11_SimulationPackageInput {
    subject_id: number;
    title: string;
    package_code?: string;
    questions?: K11_SimulationPackageQuestionItem[];
    status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
}

export interface K11_SimulationPackageUpdateInput {
    subject_id?: number;
    title?: string;
    package_code?: string;
    status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
    is_active?: boolean;
    questions?: K11_SimulationPackageQuestionItem[];
}

export interface K11_SimulationPackageStats {
    package_id: number;
    participant_count: number;
    average_score: number;
    totalParticipants?: number;
    averageScore?: number;
    highestScore?: number;
    passRate?: number;
}
