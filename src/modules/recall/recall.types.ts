export interface RecallStatusResponse {
    isPassed: boolean;
    lastAttemptId: number | null;
}

export interface StartRecallAttemptResponse {
    attemptId: number;
    subjectId: null;
    totalQuestions: 30;
}

export interface RecallQuestionOption {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
}

export interface RecallQuestion {
    session_question_id: number;
    subject_id: number;
    question_order: number;
    question_type: string;
    question_text: string;
    options: RecallQuestionOption[];
    selected_option_ids: number[];
    is_skipped: boolean;
    stimulus: {
        id: number;
        subject_id: number;
        title: string;
        content_text: string;
        source_citation: string | null;
    } | null;
}

export interface RecallAttemptDetail {
    attemptId: number;
    subjectId: null;
    status: "IN_PROGRESS" | "PAUSED" | "COMPLETED" | "ABANDONED";
    totalQuestions: number;
    answeredCount: number;
    currentQuestionOrder: number;
    questions: RecallQuestion[];
}

export interface SaveRecallAnswerDto {
    selectedOptionIds: number[];
    isSkipped?: boolean;
    currentQuestionOrder?: number;
    isFlagged?: boolean;
    timeSpentSeconds?: number;
}

export interface RecallAnswerSaveResponse {
    attemptId: number;
    questionId: number;
    selectedOptionIds: number[];
    isSkipped: boolean;
    answeredAt: string;
    answeredCount: number;
    currentQuestionOrder: number;
}

export interface RecallResultSubjectResult {
    subjectId: number;
    correctAnswers: number;
    totalQuestions: number;
}

export interface RecallResultResponse {
    totalCorrect: number;
    isPassed: boolean;
    xpEarned: 0;
    subjectResults: RecallResultSubjectResult[];
}

export interface RecallReviewItemOption {
    id: number;
    option_label: "A" | "B" | "C" | "D";
    option_text: string;
    is_correct: boolean;
}

export interface RecallReviewItem {
    session_question_id: number;
    subject_id: number;
    question_order: number;
    question_text: string;
    options: RecallReviewItemOption[];
    selected_option_ids: number[];
    is_correct: boolean;
    explanation_text: string;
    reasoning_guide: string | null;
    reference_url: string | null;
    stimulus?: {
        id: number;
        subject_id: number;
        title: string;
        content_text: string;
        source_citation: string | null;
    } | null;
}

export interface RecallReviewResponse {
    attemptId: number;
    reviews: RecallReviewItem[];
}

