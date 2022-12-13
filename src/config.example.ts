import { IntentsBitField, Partials } from "discord.js";
export const Config = {
    Developers: [""],
    Client: {
        Token: "",
        Channels: [
            {
                Id: "",
                Type: "production",
            },
            {
                Id: "",
                Type: "development",
            }
        ],
        ClientOptions: {
            closeTime: 5000,
            shardCount: 1,
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.GuildScheduledEvent,
                Partials.ThreadMember,
            ],
            failIfNotExists: true,
            presence: {},
            intents: [
                IntentsBitField.Flags.Guilds,
                //IntentsBitField.Flags.GuildMembers,
                //IntentsBitField.Flags.GuildBans,
                //IntentsBitField.Flags.GuildEmojisAndStickers,
                //IntentsBitField.Flags.GuildIntegrations,
                //IntentsBitField.Flags.GuildWebhooks,
                //IntentsBitField.Flags.GuildInvites,
                //IntentsBitField.Flags.GuildVoiceStates,
                //IntentsBitField.Flags.GuildPresences,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                //IntentsBitField.Flags.GuildMessageTyping,
                IntentsBitField.Flags.DirectMessages,
                IntentsBitField.Flags.DirectMessageReactions,
                //IntentsBitField.Flags.DirectMessageTyping,
                //IntentsBitField.Flags.MessageContent,
                //IntentsBitField.Flags.GuildScheduledEvents,
                //IntentsBitField.Flags.AutoModerationConfiguration,
                //IntentsBitField.Flags.AutoModerationExecution,
            ],
            waitGuildTimeout: 15000,
            sweepers: {}
        }
    },
    RateLimiting: {
        Commands: {
            Amount: 10,
            Interval: 30
        },
        Buttons: {
            Amount: 10,
            Interval: 30
        },
        Triggers: {
            Amount: 10,
            Interval: 30
        },
        Reactions: {
            Amount: 10,
            Interval: 30
        }
    },
    Teams: [
        {
            Team: "Chicago Blackhawks",
            League: "nhl",
            Id: "4",
            Sport: "hockey",
        },
        {
            Team: "Chicago Bears",
            League: "nfl",
            Id: "3",
            Sport: "football"
        },
        {
            Team: "Chicago Bulls",
            League: "nba",
            Id: "4",
            Sport: "basketball"
        },
        {
            Team: "Chicago Sky",
            League: "wnba",
            Id: "19",
            Sport: "basketball"
        },
        {
            Team: "Chicago Cubs",
            League: "mlb",
            Id: "16",
            Sport: "baseball"
        },
        {
            Team: "Chicago White Sox",
            League: "mlb",
            Id: "4",
            Sport: "baseball"
        },
        /*{
            Team: "Chicago Fire FC",
            League: "usa.1",
            Id: "182",
            Sport: "soccer"
        },
        {
            Team: "Chicago Red Stars",
            League: "usa.nwsl",
            Id: "15360",
            Sport: "soccer"
        }*/
    ],
    TestMode: false,
    Timeout: 1000 * 60 * 15 // 15 minutes
}