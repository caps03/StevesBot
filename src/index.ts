import { Client } from 'discord.js';
import { MessageHandler } from './events/index.js';
import { Bot, Sport } from './models/index.js';
import { Config } from './config.js';
export class Main {
  private messageHandler: MessageHandler = new MessageHandler();
  private client: Client = new Client(Config.Client.ClientOptions);
  private bot: Bot = new Bot(Config.Client.Token, this.client, this.messageHandler);
  private sport: Sport;
  constructor(){}
  public async start(): Promise<void> {
    await this.bot.start();
    this.sport = new Sport(this.bot);
    setTimeout(() => {
      this.Update();
    }, Config.TestModeTimeout);
  }
  public async Update(): Promise<void> {
    await this.sport.UpdateGame();
    let timeout = Config.Timeout;
    if(Config.TestMode) {
      timeout = Config.TestModeTimeout;
    }
    setTimeout(() => {
      this.Update();
    }, timeout);
  }
}
export let main = new Main();
main.start().catch(error => {
    console.error(error);
});