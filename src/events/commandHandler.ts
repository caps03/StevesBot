import { AutocompleteInteraction, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { Command, CommandDeferType } from '../commands/index.js';
import { DiscordLimits } from '../constants/index.js';
import { CommandUtils, InteractionUtils } from '../utils/index.js';
import { EventHandler } from './index.js';
export class CommandHandler implements EventHandler {
    constructor(public commands: Command[]) {}
    public async process(intr: CommandInteraction | AutocompleteInteraction): Promise<void> {
        // Don't respond to self, or other bots
        if (intr.user.id === intr.client.user?.id || intr.user.bot) {
            return;
        }
        let commandParts =
            intr instanceof ChatInputCommandInteraction || intr instanceof AutocompleteInteraction
                ? [
                      intr.commandName,
                      intr.options.getSubcommandGroup(false),
                      intr.options.getSubcommand(false),
                  ].filter(Boolean)
                : [intr.commandName];
        let commandName = commandParts.join(' ');
        // Try to find the command the user wants
        let command = CommandUtils.findCommand(this.commands, commandParts);
        if (!command) {
            return;
        }
        if (intr instanceof AutocompleteInteraction) {
            if (!command.autocomplete) {
                return;
            }
            try {
                let option = intr.options.getFocused(true);
                let choices = await command.autocomplete(intr, option);
                await InteractionUtils.respond(
                    intr,
                    choices?.slice(0, DiscordLimits.CHOICES_PER_AUTOCOMPLETE)
                );
            } catch (error) {
                console.error(error);
            }
            return;
        }
        // Defer interaction
        // NOTE: Anything after this point we should be responding to the interaction
        switch (command.deferType) {
            case CommandDeferType.PUBLIC: {
                await InteractionUtils.deferReply(intr, false);
                break;
            }
            case CommandDeferType.HIDDEN: {
                await InteractionUtils.deferReply(intr, true);
                break;
            }
        }
        // Return if defer was unsuccessful
        if (command.deferType !== CommandDeferType.NONE && !intr.deferred) {
            return;
        }
        try {
            // Check if interaction passes command checks
            let passesChecks = await CommandUtils.runChecks(command, intr);
            if (passesChecks) {
                // Execute the command
                await command.execute(intr);
            }
        } catch (error) {
            await this.sendError(intr);
            console.error(error);
        }
    }
    private async sendError(intr: CommandInteraction): Promise<void> {
        try {
            await InteractionUtils.send(intr, "Error Code: " + intr.id);
        } catch {
            // Ignore
        }
    }
}