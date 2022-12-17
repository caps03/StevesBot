import {
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody
} from 'discord.js';
import { Arguments } from './index.js';
export let ChatCommandMetadata: {
    [command: string]: RESTPostAPIChatInputApplicationCommandsJSONBody;
} = {
    GetNextGame: {
        type: ApplicationCommandType.ChatInput,
        name: "getnextgame",
        description: "GetNextGame",
        dm_permission: true,
        default_member_permissions: undefined,
        options: [
            {
                ...Arguments.GetTeams(),
                required: true,
            }
        ],
    }
};