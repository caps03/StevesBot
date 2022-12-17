import { CommandInteraction, GuildChannel, ThreadChannel } from "discord.js";
import { Command } from "../commands/index.js";
import { InteractionUtils } from "./index.js";
export class CommandUtils {
  public static findCommand(
    commands: Command[],
    commandParts: string[]
  ): Command | null {
    let returnCommand: Command | null = null;
    let found = [...commands];
    for (let [index, commandPart] of commandParts.entries()) {
      found = found.filter((command) => command.name === commandPart);
      if (found.length === 1) {
        returnCommand = found[0];
      }
    }
    return returnCommand;
  }
  public static async runChecks(
    command: Command,
    intr: CommandInteraction
  ): Promise<boolean> {
    if (
      (intr.channel instanceof GuildChannel ||
        intr.channel instanceof ThreadChannel) &&
      !intr.channel
        .permissionsFor(intr.client.user)
        .has(command.requireClientPerms)
    ) {
      await InteractionUtils.send(
        intr,
        "Required permissions: " + command.requireClientPerms
      );
      return false;
    }
    return true;
  }
}
