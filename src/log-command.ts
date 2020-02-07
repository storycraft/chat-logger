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
