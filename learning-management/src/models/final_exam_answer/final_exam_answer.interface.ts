/**
 * Language variable type declaration.
 *
 * @interface
 */
export interface IFinalExamAnswer {
    id: string;
    answer: string;
    correct: boolean;

    question_id: string;

    created_at: Date;
    updated_at: Date;
}
