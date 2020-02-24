"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@akaiv/core");
class ChatManager {
    constructor(chatDB) {
        this.chatDB = chatDB;
    }
    get ChatDB() {
        return this.chatDB;
    }
    async getChannelEntry(chan) {
        return await this.chatDB.getEntry(chan.IdentityId);
    }
    async getChatCount(chatlogEntry) {
        return await chatlogEntry.get('count') || 0;
    }
    async setChatCount(chatlogEntry, count) {
        await chatlogEntry.set('count', count);
    }
    async getChatsEntry(chatlogEntry) {
        return await chatlogEntry.getEntry('chats');
    }
    async getChat(chatlogEntry, index) {
        return await (await this.getChatsEntry(chatlogEntry)).get(index.toString());
    }
    async logMessage(message) {
        let logEntry = await this.getChannelEntry(message.Channel);
        let index = await this.getChatCount(logEntry);
        await this.setChatCount(logEntry, index + 1);
        let attachmentList = {};
        let i = 0;
        for (i = 0; i < message.AttachmentList.length; i++) {
            let attachment = message.AttachmentList[i];
            attachmentList[i.toString()] = ({
                'type': core_1.AttachmentType[attachment.Type].toString(),
                'url': attachment.URL
            });
        }
        attachmentList.count = i;
        (await this.getChatsEntry(logEntry)).set(index + '', {
            'message': message.Text,
            'attachments': attachmentList,
            'timestamp': message.Timestamp,
            'sender': {
                'identifyId': message.Sender.IdentityId,
                'nickname': message.Sender.Name
            },
            'client': message.Channel.Client.ClientName
        });
    }
}
exports.ChatManager = ChatManager;
//# sourceMappingURL=chat-manager.js.map