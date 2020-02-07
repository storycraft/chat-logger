import { BotModule, DatabaseEntry, BotMessageEvent } from "@akaiv/core";
import { ChatManager } from "./chat-manager";
export declare class ChatLoggerModule extends BotModule {
    private chatManager;
    constructor({ dbEntry }: {
        dbEntry: DatabaseEntry;
    });
    get Name(): string;
    get Description(): string;
    get Namespace(): string;
    get ChatManager(): ChatManager;
    protected loadModule(): Promise<void>;
    protected unloadModule(): Promise<void>;
    protected onChat(e: BotMessageEvent): void;
}
