import { DatabaseEntry, Channel, UserMessage } from "@akaiv/core";
export declare class ChatManager {
    private chatDB;
    constructor(chatDB: DatabaseEntry);
    get ChatDB(): DatabaseEntry<string, import("@akaiv/core").DatabaseValue>;
    getChannelEntry(chan: Channel): Promise<DatabaseEntry>;
    getChatCount(chatlogEntry: DatabaseEntry): Promise<number>;
    setChatCount(chatlogEntry: DatabaseEntry, count: number): Promise<void>;
    getChatsEntry(chatlogEntry: DatabaseEntry): Promise<DatabaseEntry>;
    getChat(chatlogEntry: DatabaseEntry, index: number): Promise<Chatlog>;
    logMessage(message: UserMessage): Promise<void>;
}
export interface Chatlog {
    message: string;
    timestamp: number;
    client: string;
    sender: {
        identifyId: string;
        nickname: string;
    };
    attachments: ChatAttachmentList;
}
export interface ChatAttachmentList {
    [key: number]: {
        type: string;
        url: string;
    };
    count: number;
}
