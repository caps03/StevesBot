import { REST } from '@discordjs/rest';
import { APIApplicationCommand, ApplicationCommandOptionChoiceData, AutocompleteFocusedOption, AutocompleteInteraction, CommandInteraction, PermissionsString, RESTGetAPIApplicationCommandsResult, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
export interface Command {
    name: string;
    deferType: CommandDeferType;
    requireClientPerms: PermissionsString[];
    autocomplete?(
        intr: AutocompleteInteraction,
        option: AutocompleteFocusedOption
    ): Promise<ApplicationCommandOptionChoiceData[]>;
    execute(intr: CommandInteraction): Promise<void>;
}
export enum CommandDeferType {
    PUBLIC = 'PUBLIC',
    HIDDEN = 'HIDDEN',
    NONE = 'NONE',
}
export class CommandRegistrationService {
    private rest: REST
    constructor(rest: REST) {
        this.rest = rest;
    }
    public async process(
        localCmds: RESTPostAPIApplicationCommandsJSONBody[],
        argument: string
    ): Promise<void> {
        let remoteCmds = (await this.rest.get(
            Routes.applicationCommands(Config.Client.ClientId)
        )) as RESTGetAPIApplicationCommandsResult;
        let localCmdsOnRemote = localCmds.filter(localCmd =>
            remoteCmds.some(remoteCmd => remoteCmd.name === localCmd.name)
        );
        let localCmdsOnly = localCmds.filter(
            localCmd => !remoteCmds.some(remoteCmd => remoteCmd.name === localCmd.name)
        );
        let remoteCmdsOnly = remoteCmds.filter(
            remoteCmd => !localCmds.some(localCmd => localCmd.name === remoteCmd.name)
        );
        switch (argument) {
            case 'view': {
                return;
            }
            case 'register': {
                if (localCmdsOnly.length > 0) {
                    for (let localCmd of localCmdsOnly) {
                        await this.rest.post(Routes.applicationCommands(Config.Client.ClientId), {
                            body: localCmd,
                        });
                    }
                }
                if (localCmdsOnRemote.length > 0) {
                    for (let localCmd of localCmdsOnRemote) {
                        await this.rest.post(Routes.applicationCommands(Config.Client.ClientId), {
                            body: localCmd,
                        });
                    }
                }
                return;
            }
            case 'rename': {
                return;
            }
            case 'delete': {
                return;
            }
            case 'clear': {
                return;
            }
        }
    }
    private formatCommandList(
        cmds: RESTPostAPIApplicationCommandsJSONBody[] | APIApplicationCommand[]
    ): string {
        return cmds.length > 0
            ? cmds.map((cmd: { name: string }) => `'${cmd.name}'`).join(', ')
            : 'N/A';
    }
}