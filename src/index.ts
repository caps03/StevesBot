import { Client } from 'discord.js';
import { MessageHandler, TriggerHandler } from './events/index.js';
import { Bot, Sport } from './models/index.js';
import { EventDataService } from './services/index.js';
import { Trigger } from './triggers/index.js';
import { Config } from './config.js';
export class Main {
  private eventDataService: EventDataService = new EventDataService();
  private triggers: Array<Trigger> = new Array<Trigger>();
  private triggerHandler: TriggerHandler = new TriggerHandler(this.triggers, this.eventDataService);
  private messageHandler: MessageHandler = new MessageHandler(this.triggerHandler);
  private client: Client = new Client(Config.Client.ClientOptions);
  private bot: Bot = new Bot(Config.Client.Token, this.client, this.messageHandler);
  private sport: Sport;
  constructor(){}
  public async start(): Promise<void> {
    await this.bot.start();
    this.sport = new Sport(this.bot);
    setTimeout(() => {
      this.Update();
    }, 5000);
  }
  public async Update(): Promise<void> {
    await this.sport.UpdateGame();
    setTimeout(() => {
      this.Update();
    }, Config.Timeout);
  }
}
export let main = new Main();
main.start().catch(error => {
    console.error(error);
});