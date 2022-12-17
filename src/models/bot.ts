import { AutocompleteInteraction, ButtonInteraction, Client, CommandInteraction, Events, Interaction, Message } from "discord.js";
import { GetNextGame } from "../commands/getNextGame.js";
import { Command } from "../commands/index.js";
import { ButtonHandler, CommandHandler, MessageHandler } from "../events/index.js";
import { PartialUtils } from "../utils/index.js";
export class Bot {
  private ready = false;
  private token: string;
  public client: Client;
  private messageHandler: MessageHandler;
  private userId: string;
  private commandHandler: CommandHandler;
  private buttonHandler: ButtonHandler;
  constructor(token: string, client: Client, messageHandler: MessageHandler) {
    this.token = token;
    this.client = client;
    this.messageHandler = messageHandler;
    let commands: Command[] = [
        new GetNextGame()
    ];
    this.commandHandler = new CommandHandler(commands);
  }
  public async start(): Promise<void> {
    this.registerListeners();
    await this.login(this.token);
  }
  private registerListeners(): void {
    this.client.on(Events.ClientReady, () => this.onReady());
    this.client.on(Events.MessageCreate, (msg: Message) => this.onMessage(msg));
    this.client.on(Events.InteractionCreate, (intr: Interaction) => this.onInteraction(intr));
  }
  private async login(token: string): Promise<void> {
    try {
      await this.client.login(token);
    } catch (error) {
      console.error(error);
      return;
    }
  }
  private async onReady(): Promise<void> {
    this.userId = this.client.user?.tag;
    this.ready = true;
    console.log("Bot " + this.userId + " is ready!");
  }
  private async onMessage(msg: Message): Promise<void> {
    if (!this.ready) {
      return;
    }
    msg = await PartialUtils.fillMessage(msg);
    if (!msg) {
      return;
    }
    try {
      await this.messageHandler.process(msg);
    } catch (error) {
      console.error(error);
    }
  }
  private async onInteraction(interaction: Interaction): Promise<void> {
    if (!this.ready) {
        return;
    }
    //if (!interaction.isChatInputCommand()) return;
    if (interaction instanceof CommandInteraction || interaction instanceof AutocompleteInteraction) {
        try {
            await this.commandHandler.process(interaction);
        } catch (error) {
          console.log(error);
        }
    } else if (interaction instanceof ButtonInteraction) {
        try {
            await this.buttonHandler.process(interaction);
        } catch (error) {
            console.log(error);
        }
    }
}
}
