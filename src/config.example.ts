import { IntentsBitField, Partials } from "discord.js";
export const Config = {
    Developers: [""],
    Client: {
        Id: "",
        Token: "",
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
}