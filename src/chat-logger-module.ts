import { BotModule, DatabaseEntry, BotMessageEvent } from "@akaiv/core";
import { LogCommand, CountCommand } from "./log-command";
import { ChatManager } from "./chat-manager";

/*
 * Created on Sat Oct 26 2019
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class ChatLoggerModule extends BotModule {

    private chatManager: ChatManager;

    constructor({ dbEntry }: {
        dbEntry: DatabaseEntry
    }) {
        super();

        this.chatManager = new ChatManager(dbEntry);

        this.CommandManager.addCommand(new LogCommand(this.chatManager));
        this.CommandManager.addCommand(new CountCommand(this.chatManager));

        this.on('message', this.onChat.bind(this));
    }

    get Name() {
        return 'ChatLogger';
    }

    get Description() {
        return '채팅 기록 데이터베이스';
    }

    get Namespace() {
        return 'chat';
    }

    get ChatManager() {
        return this.chatManager;
    }

    protected async loadModule(): Promise<void> {

    }

    protected async unloadModule(): Promise<void> {

    }

    protected onChat(e: BotMessageEvent) {
        if (e.Cancelled) return;

        this.chatManager.logMessage(e.Message);
    }

}