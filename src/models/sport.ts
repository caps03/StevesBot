import { DateTime } from "luxon";
import { createRequire } from "node:module";
import { Bot } from "./index";
import { Team } from "./index.js";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
export class Sport {
  public Teams: Array<Team> = new Array<Team>();
  private bot: Bot;
  constructor(bot: Bot) {
    this.bot = bot;
    Config.Teams.forEach((team) => {
      if (team.Active || Config.TestMode) {
        let teamObj = new Team(
          team.Team,
          team.League,
          team.Id,
          team.Sport,
          this.bot
        );
        this.Teams.push(teamObj);
      }
    });
  }
  public UpdateGame(): void {
    this.Teams.forEach((team) => {
      if (team.NextEvent.isToday || Config.TestMode) {
        if (!team.NextEvent.isComplete && !team.NextEvent.inProgress) {
          let today = DateTime.local();
          if (today.hour >= team.NextEvent.date.getHours()) {
            team.NextEvent.inProgress = true;
          }
        }
        if (team.NextEvent.inProgress || Config.TestMode) {
          team.getScore();
        }
      }
    });
  }
}
