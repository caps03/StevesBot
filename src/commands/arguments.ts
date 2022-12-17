import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord.js';
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
export class Arguments {
    public static GetSports(): APIApplicationCommandBasicOption {
        let choices: Array<{
            name: string,
            value: string
        }> = new Array();
        Config.Teams.forEach((team) => {
            if ((team.Active || Config.TestMode) && choices.filter(choice => choice.name === team.Sport).length == 0) {
                choices.push({
                    name: team.Sport,
                    value: team.Sport
                });
            }
        });
        let apiApplicationCommandBasicOption: APIApplicationCommandBasicOption = {
            name: "sport",
            description: "Sport",
            type: ApplicationCommandOptionType.String,
            choices: choices,
        };
        return apiApplicationCommandBasicOption;
    }
    public static GetTeams(): APIApplicationCommandBasicOption {
        let choices: Array<{
            name: string,
            value: string
        }> = new Array();
        Config.Teams.forEach((team) => {
            if ((team.Active || Config.TestMode) && choices.filter(choice => choice.name === team.Team).length == 0) {
                choices.push({
                    name: team.Team,
                    value: team.Team
                });
            }
        });
        let apiApplicationCommandBasicOption: APIApplicationCommandBasicOption = {
            name: "team",
            description: "Team",
            type: ApplicationCommandOptionType.String,
            choices: choices,
        };
        return apiApplicationCommandBasicOption;
    }
    public static GetTeamsBySport(sport: string): APIApplicationCommandBasicOption {
        let choices: Array<{
            name: string,
            value: string
        }> = new Array();
        Config.Teams.forEach((team) => {
            if (team.Sport == sport && (team.Active || Config.TestMode) && choices.filter(choice => choice.name === team.Team).length == 0) {
                choices.push({
                    name: team.Team,
                    value: team.Team
                });
            }
        });
        let apiApplicationCommandBasicOption: APIApplicationCommandBasicOption = {
            name: "team",
            description: "Team",
            type: ApplicationCommandOptionType.String,
            choices: choices,
        };
        return apiApplicationCommandBasicOption;
    }
}