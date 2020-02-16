import { CommandInfo, BotCommandEvent, ModuleLogger } from "@akaiv/core";
import { ChatManager } from "./chat-manager";
export declare class LogCommand implements CommandInfo {
    private chatManager;
    constructor(chatManager: ChatManager);
    get CommandList(): string[];
    get Usage(): string;
    get Description(): string;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
export declare class CountCommand implements CommandInfo {
    private chatManager;
    constructor(chatManager: ChatManager);
    get CommandList(): string[];
    get Usage(): string;
    get Description(): string;
    onCommand(e: BotCommandEvent, logger: ModuleLogger): Promise<void>;
}
