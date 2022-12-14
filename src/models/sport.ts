import axios from 'axios';
import { Message, TextChannel } from 'discord.js';
import { DateTime } from 'luxon';
import nodeHtmlToImage from 'node-html-to-image';
import { Config } from '../config.js';
import { Bot } from './bot.js';
class Team{
    public bot: Bot;
    public channels: Array<TextChannel> = new Array<TextChannel>();
    public name: string;
    public league: string;
    public id: string;
    public sport: string;
    public parts: number = 1;
    public nextEvent: {
        isToday: boolean,
        inProgress: boolean,
        isComplete: boolean,
        id: string,
        date: Date,
        name: string,
        shortName: string,
        homeTeam: string,
        homeTeamAbbreviation: string,
        homeTeamLogo: string,
        awayTeam: string,
        awayTeamAbbreviation: string,
        awayTeamLogo: string,
    };
    public lastMessages: Array<Message> = new Array<Message>();
    constructor(name: string, league: string, id: string, sport: string, bot: Bot) {
        this.bot = bot;
        this.name = name;
        this.league = league;
        this.id = id;
        this.sport = sport;
        this.nextEvent = {
            isToday: false,
            inProgress: false,
            isComplete: false,
            id: '',
            date: new Date(),
            name: '',
            shortName: '',
            homeTeam: '',
            homeTeamAbbreviation: '',
            homeTeamLogo: '',
            awayTeam: '',
            awayTeamAbbreviation: '',
            awayTeamLogo: '',
        };
        switch(this.sport) {
            case 'baseball':
                this.parts = 9;
                break;
            case 'basketball':
                this.parts = 4;
                break;
            case 'football':
                this.parts = 4;
                break;
            case 'hockey':
                this.parts = 3;
                break;
            case 'soccer':
                this.parts = 2;
                break;
        }
        this.getChannels();
        this.getNextEvent();
    }
    private async getChannels(): Promise<void> {
        Config.Client.Channels.forEach(async (channel) => {
            if(Config.TestMode && channel.Type == "development") {
                this.channels.push(await this.bot.client.channels.fetch(channel.Id) as TextChannel);
            } else if(!Config.TestMode && channel.Type == "production") {
                this.channels.push(await this.bot.client.channels.fetch(channel.Id) as TextChannel);
            }
            
        });
    }
    private async getNextEvent(): Promise<void> {
        let data = await axios.get<any>(
            'https://site.api.espn.com/apis/site/v2/sports/' + this.sport + '/' + this.league + '/teams/' + this.id,
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );
        if(data.data.team.nextEvent.length > 0) {
            this.nextEvent.id = data.data.team.nextEvent[0].id;
            let dateString = data.data.team.nextEvent[0].date;
            let yearString = dateString.substring(0,4);
            let monthString = dateString.substring(5,7);
            let dayString = dateString.substring(8,10);
            let hourString = dateString.substring(11,13);
            let minuteString = dateString.substring(14,16);
            this.nextEvent.date = new Date(Date.UTC(yearString, (monthString - 1), dayString, hourString, minuteString));
            this.nextEvent.name = data.data.team.nextEvent[0].name;
            this.nextEvent.shortName = data.data.team.nextEvent[0].shortName;
            this.nextEvent.homeTeam = data.data.team.nextEvent[0].competitions[0].competitors[0].team.displayName;
            this.nextEvent.homeTeamAbbreviation = data.data.team.nextEvent[0].competitions[0].competitors[0].team.abbreviation;
            this.nextEvent.homeTeamLogo = data.data.team.nextEvent[0].competitions[0].competitors[0].team.logos[0].href;
            this.nextEvent.awayTeam = data.data.team.nextEvent[0].competitions[0].competitors[1].team.displayName;
            this.nextEvent.awayTeamAbbreviation = data.data.team.nextEvent[0].competitions[0].competitors[1].team.abbreviation;
            this.nextEvent.awayTeamLogo = data.data.team.nextEvent[0].competitions[0].competitors[1].team.logos[0].href;
            let today = DateTime.local();
            if(today.day == this.nextEvent.date.getDate()) {
                this.nextEvent.isToday = true;
            }
            if(this.nextEvent.isToday && today.hour >= this.nextEvent.date.getHours()) {
                this.nextEvent.inProgress = true;
            }
        }
    }
    public async getScore(): Promise<void> {
        if(this.nextEvent.id != '') {
            let data = await axios.get<any>(
                'http://site.api.espn.com/apis/site/v2/sports/' + this.sport + '/' + this.league + '/scoreboard/' + this.nextEvent.id,
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            );
            if(data.data.competitions[0].competitors[0].linescores?.length > this.parts) {
                this.parts = data.data.competitions[0].competitors[0].linescores.length;
            }
            let status = data.data.status.type.detail;
            if(status == "Final") {
                this.nextEvent.isComplete = true;
                this.nextEvent.inProgress = false;
            }
            let html = `<div id="ContainerDiv" style="display: flex; width: 100%; margin: 20px; padding: 20px;">`;
            html += `<div style="display: flex; padding: 10px; width: 100%">`;
            html += `<div style="align-self: center; padding: 10px; width: 100%">`;
            html += `<span style="font-size: large; width: 100%">${this.nextEvent.awayTeam}</span>`;
            html += `</div>`;
            html += `<div style="padding: 10px; width: 100%">`;
            html += `<img src="${this.nextEvent.awayTeamLogo}" style="width: 100px;">`;
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
            for(let a = 1; a <= this.parts; a++) {
                html += `<th style="text-align: center; width: 30px;">` + a + `</th>`;
            }
            html += `<th style="text-align: center; width: 30px;">T</th>`;
            html += `</tr>`;
            html += `</thead>`;
            html += `<tbody>`;
            html += `<tr>`;
            html += `<td>${this.nextEvent.awayTeamAbbreviation}</td>`;
            for(let b: number = 0; b < this.parts; b++) {
                let value = '-';
                if(data.data.competitions[0].competitors[1].linescores?.length > b) {
                    value = data.data.competitions[0].competitors[1].linescores[b].value;
                }
                html += `<td style="text-align: center; width: 30px;">${value}</td>`;
            }
            html += `<td style="text-align: center; width: 30px; font-weight: bold;">${data.data.competitions[0].competitors[1].score}</td>`;
            html += `</tr>`;
            html += `<tr>`;
            html += `<tr>`;
            html += `<td>${this.nextEvent.homeTeamAbbreviation}</td>`;
            for(let c = 0; c < this.parts; c++) {
                let value = '-';
                if(data.data.competitions[0].competitors[0].linescores?.length > c) {
                    value = data.data.competitions[0].competitors[0].linescores[c].value;
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
            html += `<img src="${this.nextEvent.homeTeamLogo}" style="width: 100px;">`;
            html += `</div>`;
            html += `<div style="align-self: center; padding: 10px; width: 100%">`;
            html += `<span style="font-size: large; width: 100%">${this.nextEvent.homeTeam}</span>`;
            html += `</div>`;
            html += `</div>`;
            html += `</div>`;
            let image = await nodeHtmlToImage({
                html: html,
                selector: '#ContainerDiv'
            });
            if(this.lastMessages.length == 0) {
                this.channels.forEach(async (channel) => {
                    let message: Message = await channel.send({
                        files: [{
                            attachment: image as any,
                            name: this.sport + '_' + this.name +'.png'
                        }]
                    });
                    this.lastMessages.push(message);
                });
            } else {
                this.lastMessages.forEach(async (message) => {
                    message.edit({
                        files: [{
                            attachment: image as any,
                            name: this.sport + '_' + this.name +'.png'
                        }]
                    });
                });
            }
            if(this.nextEvent.isComplete) {
                this.lastMessages = new Array<Message>();
            }
        }
    }
}
export class Sport {
    private teams: Array<Team> = new Array<Team>();
    private bot: Bot;
    constructor(bot: Bot) {
        this.bot = bot;
        Config.Teams.forEach(team => {
            let teamObj = new Team(team.Team, team.League, team.Id, team.Sport, this.bot);
            this.teams.push(teamObj);
        });
    }
    public UpdateGame(): void {
        console.log("UpdateGame");
        this.teams.forEach(team => {
            if(team.nextEvent.isToday || Config.TestMode) {
                console.log(team.name + " have a game today");
                if(!team.nextEvent.isComplete && !team.nextEvent.inProgress) {
                    let today = DateTime.local();
                    if(today.hour >= team.nextEvent.date.getHours()) {
                        team.nextEvent.inProgress = true;
                    }
                }
                if(team.nextEvent.inProgress || Config.TestMode) {
                    console.log(team.name + " have a game in progress");
                    team.getScore();
                }
            }
        });
    }
}