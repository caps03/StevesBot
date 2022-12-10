import { Message } from 'discord.js';
import { EventHandler, TriggerHandler } from './';
export class MessageHandler implements EventHandler {
    private triggerHandler: TriggerHandler;
    constructor(triggerHandler: TriggerHandler) {
        this.triggerHandler = triggerHandler;
    }
    public async process(msg: Message): Promise<void> {
        // Don't respond to system messages or self
        if (msg.system || msg.author.id === msg.client.user?.id) {
            return;
        }
        // Process trigger
        await this.triggerHandler.process(msg);
    }
}