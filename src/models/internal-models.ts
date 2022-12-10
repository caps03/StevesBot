import { Locale } from 'discord.js';
// This class is used to store and pass data along in events
export class EventData {
    public lang: Locale;
    public langGuild: Locale;
    constructor(lang: Locale, langGuild: Locale) {
        this.lang = lang;
        this.langGuild = langGuild;
    }
}