import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type MessageContent = string;
export type Timestamp = bigint;
export interface ChatMessage {
    content: MessageContent;
    displayName?: DisplayName;
    author: Principal;
    timestamp: Timestamp;
}
export type DisplayName = string;
export interface backendInterface {
    getMessages(limit: bigint, offset: bigint): Promise<Array<ChatMessage>>;
    sendMessage(displayName: DisplayName | null, content: MessageContent): Promise<void>;
}
