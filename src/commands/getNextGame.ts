import { ChatInputCommandInteraction, PermissionsString } from "discord.js";
import { main } from "../index.js";
import { Team } from "../models/index.js";
import { InteractionUtils } from "../utils/index.js";
import { CommandDeferType } from "./index.js";
import { Command } from "./index.js";
export class GetNextGame implements Command {
  public name: string = "getnextgame";
  public deferType = CommandDeferType.PUBLIC;
  public requireClientPerms: PermissionsString[] = [];
  public async execute(intr: ChatInputCommandInteraction): Promise<void> {
    let sport = intr.options.getString("sport");
    let teamName = intr.options.getString("team");
    let team: Team;
    if (sport != null && sport != undefined) {
      if (
        main.Sport.Teams.filter((t) => t.Sport == sport && t.Name == teamName)
          .length > 0
      ) {
        team = main.Sport.Teams.filter(
          (t) => t.Sport == sport && t.Name == teamName
        )[0];
      }
    } else {
      if (main.Sport.Teams.filter((t) => t.Name == teamName).length > 0) {
        team = main.Sport.Teams.filter((t) => t.Name == teamName)[0];
      }
    }
    if (team != null && team != undefined) {
      if (team.NextEvent.id != "") {
        await InteractionUtils.send(
          intr,
          team.Name + "'s next game is " + team.NextEvent.date
        );
      } else {
        await InteractionUtils.send(intr, "Next event not found for team " + team.Name + "!");
      }
    } else {
      await InteractionUtils.send(intr, "Team " + teamName + " not found!");
    }
  }
}
