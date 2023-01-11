import { Message } from "discord.js";
import { EventHandler } from ".";
export class MessageHandler implements EventHandler {
  constructor() {}
  public async process(msg: Message): Promise<void> {
    // Don't respond to system messages or self
    if (msg.system || msg.author.id === msg.client.user?.id) {
      return;
    }
    if(msg.content.toLowerCase().includes("standings as of") &&
    msg.content.toLowerCase().includes("* 🥇") &&
    msg.content.toLowerCase().includes("* 🥈") &&
    msg.content.toLowerCase().includes("* 🥉")) {
      console.log("msg.content", msg.content);
      return;
    }
  }
}
