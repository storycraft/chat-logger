import { DatabaseEntry, Channel, UserMessage, AttachmentType } from "@akaiv/core";

/*
 * Created on Fri Feb 07 2020
 *
 * Copyright (c) storycraft. Licensed under the MIT Licence.
 */

export class ChatManager {
    
    constructor(private chatDB: DatabaseEntry) {

    }

    get ChatDB() {
        return this.chatDB;
    }

    async getChannelEntry(chan: Channel): Promise<DatabaseEntry> {
        return await this.chatDB.getEntry(chan.IdentityId);
    }

    /*
     * Chatlog structure
     * 
     * {
     *     count: 0,
     *     chats: {
     *         0: { message: "asdf", attachments: [{'type': 'PHOTO', url: 'asdf'}], timestamp: 1, sender: { 'nickname': 'asd', 'identifyId': 0 }, client: 'discord' }
     *     }
     * }
     */

    async getChatCount(chatlogEntry: DatabaseEntry): Promise<number> {
        return await chatlogEntry.get('count') as number || 0;
    }

    async setChatCount(chatlogEntry: DatabaseEntry, count: number): Promise<void> {
        await chatlogEntry.set('count', count);
    }

    async getChatsEntry(chatlogEntry: DatabaseEntry): Promise<DatabaseEntry> {
        return await chatlogEntry.getEntry('chats');
    }

    async getChat(chatlogEntry: DatabaseEntry, index: number): Promise<Chatlog> {
        return await (await this.getChatsEntry(chatlogEntry)).get(index.toString()) as Chatlog;
    }

    async logMessage(message: UserMessage) {
        let logEntry = await this.getChannelEntry(message.Channel);

        let index = await this.getChatCount(logEntry);

        let attachmentList: any = {};

        let i = 0;
        for (i = 0; i < message.AttachmentList.length; i++) {
            let attachment = message.AttachmentList[i];

            attachmentList[i.toString()] = ({
                'type': AttachmentType[attachment.Type].toString(),
                'url': attachment.URL
            })
        }
        attachmentList.count = i;

        (await this.getChatsEntry(logEntry)).set(index + '', {
            'message': message.Text,
            'attachments': attachmentList as ChatAttachmentList,
            'timestamp': message.Timestamp,
            'sender': {
                'identifyId': message.Sender.IdentityId,
                'nickname': message.Sender.Name
            },
            'client': message.Channel.Client.ClientName
        } as Chatlog);

        await this.setChatCount(logEntry, index + 1);
    }

}

export interface Chatlog {
    message: string;
    timestamp: number;
    client: string;
    sender: {
        identifyId: string,
        nickname: string
    };
    attachments: ChatAttachmentList
}

export interface ChatAttachmentList {

    [key: number]: {
        type: string,
        url: string
    };

    count: number;

}