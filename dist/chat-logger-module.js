"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@akaiv/core");
const log_command_1 = require("./log-command");
const chat_manager_1 = require("./chat-manager");
class ChatLoggerModule extends core_1.BotModule {
    constructor({ dbEntry }) {
        super();
        this.chatManager = new chat_manager_1.ChatManager(dbEntry);
        this.CommandManager.addCommand(new log_command_1.LogCommand(this.chatManager));
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
    async loadModule() {
    }
    async unloadModule() {
    }
    onChat(e) {
        if (e.Cancelled)
            return;
        this.chatManager.logMessage(e.Message);
    }
}
exports.ChatLoggerModule = ChatLoggerModule;
//# sourceMappingURL=chat-logger-module.js.map