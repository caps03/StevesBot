import { REST } from "@discordjs/rest";
import { Client } from "discord.js";
import { createRequire } from "node:module";
import {
  ChatCommandMetadata,
  CommandRegistrationService,
} from "./commands/index.js";
import { MessageHandler } from "./events/index.js";
import { Bot, CustomClient, Sport } from "./models/index.js";
const require = createRequire(import.meta.url);
let Config = require("../config.json");
export class Main {
  private messageHandler: MessageHandler = new MessageHandler();
  private client: Client = new CustomClient(Config.Client.ClientOptions);
  private bot: Bot = new Bot(
    Config.Client.Token,
    this.client,
    this.messageHandler
  );
  public Sport: Sport;
  constructor() {}
  public async start(): Promise<void> {
    await this.bot.start();
    try {
      let rest = new REST({ version: "10" }).setToken(Config.Client.Token);
      let commandRegistrationService = new CommandRegistrationService(rest);
      let localCmds = [
        ...Object.values(ChatCommandMetadata).sort((a, b) =>
          a.name > b.name ? 1 : -1
        ),
      ];
      await commandRegistrationService.process(localCmds, "register");
    } catch (error) {
      console.error(error);
    }
    this.Sport = new Sport(this.bot);
    setTimeout(() => {
      this.Update();
    }, Config.TestModeTimeout);
  }
  public async Update(): Promise<void> {
    //await this.Sport.UpdateGame();
    let timeout = Config.Timeout;
    if (Config.TestMode) {
      //timeout = Config.TestModeTimeout;
    }
    setTimeout(() => {
      this.Update();
    }, timeout);
  }
}
export let main = new Main();
main.start().catch((error) => {
  console.error(error);
});
