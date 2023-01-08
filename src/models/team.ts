import axios from "axios";
import { Message, TextChannel } from "discord.js";
import { DateTime } from "luxon";
import nodeHtmlToImage from "node-html-to-image";
import { createRequire } from "node:module";
import { Bot } from "./index.js";
const require = createRequire(import.meta.url);
let Config = require("../../config.json");
export class Team {
  private bot: Bot;
  private channels: Array<TextChannel> = new Array<TextChannel>();
  public Name: string;
  private league: string;
  private id: string;
  public Sport: string;
  private parts: number = 1;
  public NextEvent: {
    isToday: boolean;
    inProgress: boolean;
    isComplete: boolean;
    id: string;
    date: Date;
    name: string;
    shortName: string;
    homeTeam: string;
    homeTeamAbbreviation: string;
    homeTeamLogo: string;
    awayTeam: string;
    awayTeamAbbreviation: string;
    awayTeamLogo: string;
  };
  private lastMessages: Array<Message> = new Array<Message>();
  constructor(
    name: string,
    league: string,
    id: string,
    sport: string,
    bot: Bot
  ) {
    this.bot = bot;
    this.Name = name;
    this.league = league;
    this.id = id;
    this.Sport = sport;
    this.NextEvent = {
      isToday: false,
      inProgress: false,
      isComplete: false,
      id: "",
      date: new Date(),
      name: "",
      shortName: "",
      homeTeam: "",
      homeTeamAbbreviation: "",
      homeTeamLogo: "",
      awayTeam: "",
      awayTeamAbbreviation: "",
      awayTeamLogo: "",
    };
    switch (this.Sport) {
      case "baseball":
        this.parts = 9;
        break;
      case "basketball":
        this.parts = 4;
        break;
      case "football":
        this.parts = 4;
        break;
      case "hockey":
        this.parts = 3;
        break;
      case "soccer":
        this.parts = 2;
        break;
    }
    this.getChannels();
    this.getNextEvent();
  }
  private async getChannels(): Promise<void> {
    Config.Client.Channels.forEach(async (channel) => {
      if (Config.TestMode && channel.Type == "development") {
        this.channels.push(
          (await this.bot.client.channels.fetch(channel.Id)) as TextChannel
        );
      } else if (!Config.TestMode && channel.Type == "production") {
        this.channels.push(
          (await this.bot.client.channels.fetch(channel.Id)) as TextChannel
        );
      }
    });
  }
  private async getNextEvent(): Promise<void> {
    let data = await axios.get<any>(
      Config.APIKeys.ESPN.Url +
        "v2/sports/" +
        this.Sport +
        "/" +
        this.league +
        "/teams/" +
        this.id,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (data.data.team.nextEvent.length > 0) {
      this.NextEvent.id = data.data.team.nextEvent[0].id;
      let dateString = data.data.team.nextEvent[0].date;
      let yearString = dateString.substring(0, 4);
      let monthString = dateString.substring(5, 7);
      let dayString = dateString.substring(8, 10);
      let hourString = dateString.substring(11, 13);
      let minuteString = dateString.substring(14, 16);
      this.NextEvent.date = new Date(
        Date.UTC(
          yearString,
          monthString - 1,
          dayString,
          hourString,
          minuteString
        )
      );
      this.NextEvent.name = data.data.team.nextEvent[0].name;
      this.NextEvent.shortName = data.data.team.nextEvent[0].shortName;
      this.NextEvent.homeTeam =
        data.data.team.nextEvent[0].competitions[0].competitors[0].team.displayName;
      this.NextEvent.homeTeamAbbreviation =
        data.data.team.nextEvent[0].competitions[0].competitors[0].team.abbreviation;
      this.NextEvent.homeTeamLogo =
        data.data.team.nextEvent[0].competitions[0].competitors[0].team.logos[0].href;
      this.NextEvent.awayTeam =
        data.data.team.nextEvent[0].competitions[0].competitors[1].team.displayName;
      this.NextEvent.awayTeamAbbreviation =
        data.data.team.nextEvent[0].competitions[0].competitors[1].team.abbreviation;
      this.NextEvent.awayTeamLogo =
        data.data.team.nextEvent[0].competitions[0].competitors[1].team.logos[0].href;
      let today = DateTime.local();
      if (today.day == this.NextEvent.date.getDate()) {
        this.NextEvent.isToday = true;
      }
      if (
        this.NextEvent.isToday &&
        today.hour >= this.NextEvent.date.getHours()
      ) {
        this.NextEvent.inProgress = true;
      }
    }
  }
  public async getScore(): Promise<void> {
    if (this.NextEvent.id != "") {
      let data = await axios.get<any>(
        "http://site.api.espn.com/apis/site/v2/sports/" +
          this.Sport +
          "/" +
          this.league +
          "/scoreboard/" +
          this.NextEvent.id,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      if (
        data.data.competitions[0].competitors[0].linescores?.length > this.parts
      ) {
        this.parts = data.data.competitions[0].competitors[0].linescores.length;
      }
      let status = data.data.status.type.detail;
      if (!this.NextEvent.inProgress && status == "Final") {
        this.NextEvent.isComplete = true;
      } else {
        if (status == "Final") {
          this.NextEvent.isComplete = true;
          this.NextEvent.inProgress = false;
        }
        let html = `<div id="ContainerDiv" style="display: flex; width: 100%; margin: 20px; padding: 20px;">`;
        html += `<div style="display: flex; padding: 10px; width: 100%">`;
        html += `<div style="align-self: center; padding: 10px; width: 100%">`;
        html += `<span style="font-size: large; width: 100%">${this.NextEvent.awayTeam}</span>`;
        html += `</div>`;
        html += `<div style="padding: 10px; width: 100%">`;
        html += `<img src="${this.NextEvent.awayTeamLogo}" style="width: 100px;">`;
        html += `</div>`;
        html += `<div style="align-self: center; padding: 10px; width: 100%">`;
        html += `<span style="font-weight: bold; font-size: xxx-large; width: 100%">${data.data.competitions[0].competitors[1].score}</span>`;
        html += `</div>`;
        html += `</div>`;
        html += `<div style="padding: 10px; width: 100%">`;
        html += `<div style="text-align: center; width: 100%">`;
        html += `<span>${status}</span>`;
        html += `</div>`;
        html += `<div style="padding: 10px;min-width: 200px; width: 100%">`;
        html += `<table style="width: 100%;border-collapse: collapse;border-spacing: 0;">`;
        html += `<thead style="width: 100%;">`;
        html += `<tr style="width: 100%; border-bottom: 1px solid #dcdddf;">`;
        html += `<th> </th>`;
        for (let a = 1; a <= this.parts; a++) {
          html += `<th style="text-align: center; width: 30px;">` + a + `</th>`;
        }
        html += `<th style="text-align: center; width: 30px;">T</th>`;
        html += `</tr>`;
        html += `</thead>`;
        html += `<tbody>`;
        html += `<tr>`;
        html += `<td>${this.NextEvent.awayTeamAbbreviation}</td>`;
        for (let b: number = 0; b < this.parts; b++) {
          let value = "-";
          if (data.data.competitions[0].competitors[1].linescores?.length > b) {
            value =
              data.data.competitions[0].competitors[1].linescores[b].value;
          }
          html += `<td style="text-align: center; width: 30px;">${value}</td>`;
        }
        html += `<td style="text-align: center; width: 30px; font-weight: bold;">${data.data.competitions[0].competitors[1].score}</td>`;
        html += `</tr>`;
        html += `<tr>`;
        html += `<tr>`;
        html += `<td>${this.NextEvent.homeTeamAbbreviation}</td>`;
        for (let c = 0; c < this.parts; c++) {
          let value = "-";
          if (data.data.competitions[0].competitors[0].linescores?.length > c) {
            value =
              data.data.competitions[0].competitors[0].linescores[c].value;
          }
          html += `<td style="text-align: center; width: 30px;">${value}</td>`;
        }
        html += `<td style="text-align: center; width: 30px; font-weight: bold;">${data.data.competitions[0].competitors[0].score}</td>`;
        html += `</tr>`;
        html += `</tbody>`;
        html += `</table>`;
        html += `</div>`;
        html += `</div>`;
        html += `<div style="display: flex; padding: 10px; width: 100%">`;
        html += `<div style="align-self: center; padding: 10px; width: 100%">`;
        html += `<span style="font-weight: bold; font-size: xxx-large; width: 100%">${data.data.competitions[0].competitors[0].score}</span>`;
        html += `</div>`;
        html += `<div style="padding: 10px; width: 100%">`;
        html += `<img src="${this.NextEvent.homeTeamLogo}" style="width: 100px;">`;
        html += `</div>`;
        html += `<div style="align-self: center; padding: 10px; width: 100%">`;
        html += `<span style="font-size: large; width: 100%">${this.NextEvent.homeTeam}</span>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div>`;
        let image = await nodeHtmlToImage({
          html: html,
          selector: "#ContainerDiv",
        });
        if (this.lastMessages.length == 0) {
          this.channels.forEach(async (channel) => {
            let message: Message = await channel.send({
              files: [
                {
                  attachment: image as any,
                  name:
                    this.NextEvent.awayTeam +
                    "_VS_" +
                    this.NextEvent.homeTeam +
                    ".png",
                },
              ],
            });
            this.lastMessages.push(message);
          });
        } else {
          this.lastMessages.forEach(async (message) => {
            message.edit({
              files: [
                {
                  attachment: image as any,
                  name:
                    this.NextEvent.awayTeam +
                    "_VS_" +
                    this.NextEvent.homeTeam +
                    ".png",
                },
              ],
            });
          });
        }
      }
      if (this.NextEvent.isComplete) {
        this.lastMessages = new Array<Message>();
        let today = DateTime.local();
        if (today.day > this.NextEvent.date.getDate()) {
          this.getNextEvent();
        }
      }
    }
  }
}