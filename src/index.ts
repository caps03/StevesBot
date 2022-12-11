import { Client, ClientOptions } from 'discord.js';
import { MessageHandler, TriggerHandler } from './events/index.js';
import { Bot } from './models/index.js';
import { EventDataService } from './services/index.js';
import { Trigger } from './triggers/index.js';
import { Config } from './config.js';
async function start(): Promise<void> {
    let eventDataService = new EventDataService();
    let triggers: Trigger[] = [];
    let triggerHandler = new TriggerHandler(triggers, eventDataService);
    let messageHandler = new MessageHandler(triggerHandler);
    let client: Client = new Client(Config.Client.ClientOptions);
    let bot: Bot = new Bot(Config.Client.Token, client, messageHandler);
    await bot.start();
    let hockeyWorker = new Worker('./workers/hockey.js', {
        workerData: {
          bot: bot,
          path: './workers/hockey.ts'
        });
}
start().catch(error => {
    console.error(error);
});