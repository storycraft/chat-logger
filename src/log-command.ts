import { CommandInfo, BotCommandEvent, ModuleLogger } from "@akaiv/core";
import { ChatManager } from "./chat-manager";

/*
 * Created on Thu Jan 23 2020
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class LogCommand implements CommandInfo {

    constructor(private chatManager: ChatManager) {

    }

    get CommandList() {
        return [ 'logs' ];
    }

    get Usage() {
        return 'chat/logs [메세지 수 (기본, 최대 = 100)]';
    }

    get Description() {
        return '해당 채널의 채팅 로그를 가져옵니다';
    }

    async onCommand(e: BotCommandEvent, logger: ModuleLogger) {
        let count = 100;

        if (e.RawArgument) {
            count = Math.max(Math.min(Number.parseInt(e.RawArgument), 100), 1);
        }

        if (isNaN(count)) {
            count = 100;
        }

        let entry = await this.chatManager.getChannelEntry(e.Channel);

        let reqList: Promise<any>[] = [];

        let chatCount = await this.chatManager.getChatCount(entry);

        for (let chatIndex = Math.max(chatCount - count, 0); chatIndex < chatCount; chatIndex++) {
            reqList.push(this.chatManager.getChat(entry, chatIndex));
        }

        let chatList = await Promise.all(reqList);

        let logMessage = `${e.Channel.Name} (${e.Channel.IdentityId}) 의 채팅 기록\n\n`;

        for (let chat of chatList) {
            if (!chat) {
                continue;
            }

            try {
                logMessage += `[ ${new Date(chat['timestamp']).toISOString()} ] ${chat['sender']['nickname'] || '??'}: ${chat['message']}\n`;

                if (chat['attachments']['count'] > 0) {
                    let count: number = chat['attachments']['count'];

                    for (count--; count >= 0; count--) {
                        let attachment = chat['attachments'][count.toString()];

                        logMessage += ` - (${attachment['type']}) ${attachment['url']}\n`;
                    }
                }
            } catch (err) {
                e.Channel.sendText(`채팅 목록을 가져오는중 오류가 발생했습니다. ${err}`);
                return;
            }
        }

        if (logMessage.length <= 1000) {
            e.Channel.sendText(logMessage);
        } else {
            for (let i = 0; i * 1000 < logMessage.length; i++) {
                await e.Channel.sendText(logMessage.substring(i * 1000, (i + 1) * 1000));
                await new Promise((resolve, reject) => setTimeout(resolve, 500));
            }
        }
    }

}

export class CountCommand implements CommandInfo {

    constructor(private chatManager: ChatManager) {

    }

    get CommandList() {
        return [ 'count' ];
    }

    get Usage() {
        return 'chat/count';
    }

    get Description() {
        return '해당 채널의 채팅 로그 갯수를 가져옵니다';
    }

    async onCommand(e: BotCommandEvent, logger: ModuleLogger) {
        let entry = await this.chatManager.getChannelEntry(e.Channel);

        let chatCount = await this.chatManager.getChatCount(entry);

        let message = `현재 기록된 채널 [${e.Channel.Client.ClientName}] - ${e.Channel.Name} (${e.Channel.IdentityId}) 의 채팅 수는\n${chatCount}(개) 입니다.`;

        if (chatCount > 0) {
            let firstChat = await this.chatManager.getChat(entry, 0);
            message += `\n최초 기록된 채팅은 ${new Date(firstChat.timestamp).toLocaleString()} 에 [${firstChat.client}] - ${firstChat.sender.nickname} (${firstChat.sender.identifyId})이 보낸\n - ${firstChat.message}\n 입니다.`;
        }

        e.Channel.sendText(message);
    }

}

export class GetCommand implements CommandInfo {

    constructor(private chatManager: ChatManager) {

    }

    get CommandList() {
        return [ 'get' ];
    }

    get Usage() {
        return 'chat/get <번호>';
    }

    get Description() {
        return '해당 채널의 n번째 채팅을 가져옵니다';
    }

    async onCommand(e: BotCommandEvent, logger: ModuleLogger) {
        let rawNumber = Number.parseInt(e.RawArgument);
        if (isNaN(rawNumber) || !isFinite(rawNumber)) {
            e.Channel.sendText(`사용법: ${this.Usage}`);
            return;
        }

        let entry = await this.chatManager.getChannelEntry(e.Channel);

        let chatCount = await this.chatManager.getChatCount(entry);

        let index = Math.min(Math.max(Math.floor(rawNumber), 1), chatCount);

        if (chatCount < 1) {
            e.Channel.sendText(`채널 [${e.Channel.Client.ClientName}] - ${e.Channel.Name} (${e.Channel.IdentityId}) 에 기록된 채팅이 없습니다`);
            return;
        }

        let chat = await this.chatManager.getChat(entry, index);

        let text = `[${e.Channel.Client.ClientName}] - ${e.Channel.Name} (${e.Channel.IdentityId}) ${index} 번째 채팅\n(UTC) ${new Date(chat.timestamp).toLocaleString()} - [${chat.client}] - ${chat.sender.nickname} (${chat.sender.identifyId}): ${chat.message}\n`;

        if (chat.attachments.count > 0) {
            text += `\n 추가 파일 ${chat.attachments.count} 개\n\n`;
        }

        for (let i = 0; i < chat.attachments.count; i++) {
            let attachment = chat.attachments[i];
            
            text += ` - (${attachment.type}) ${attachment.url}\n`;
        }

        e.Channel.sendText(text);
    }

}