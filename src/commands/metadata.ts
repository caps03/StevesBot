import {
  ApplicationCommandType,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { Arguments } from "./index.js";
export let ChatCommandMetadata: {
  [command: string]: RESTPostAPIChatInputApplicationCommandsJSONBody;
} = {
  GetNextGame: {
    type: ApplicationCommandType.ChatInput,
    name: "getnextgame",
    description: "Get the next game for a team",
    dm_permission: true,
    default_member_permissions: undefined,
    options: [
      {
        ...Arguments.GetTeams(),
        required: true,
      },
    ],
  },
  Movie: {
    type: ApplicationCommandType.ChatInput,
    name: "movie",
    description: "Get a movie detail and review",
    dm_permission: true,
    default_member_permissions: undefined,
    options: [
      {
        ...Arguments.GetPopularMovies(),
        required: true,
      },
    ],
  },
};
