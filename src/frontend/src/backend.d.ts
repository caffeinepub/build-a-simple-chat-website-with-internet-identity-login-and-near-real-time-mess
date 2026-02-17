import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type QuestionContent = string;
export type AnswerContent = string;
export type Timestamp = bigint;
export type QuestionId = bigint;
export interface Question {
    id: QuestionId;
    created: Timestamp;
    modified?: Timestamp;
    content: QuestionContent;
    displayName?: DisplayName;
    answer?: AnswerContent;
    author: Principal;
}
export interface UserProfile {
    name: string;
}
export type DisplayName = string;
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    answerQuestion(questionId: QuestionId, answer: AnswerContent): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createQuestion(displayName: DisplayName | null, content: QuestionContent): Promise<QuestionId>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getQuestions(limit: bigint, offset: bigint): Promise<Array<Question>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
