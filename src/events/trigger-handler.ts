import { Message } from 'discord.js';
import { RateLimiter } from 'discord.js-rate-limiter';
import { createRequire } from 'node:module';
import { EventDataService } from '../services/index.js';
import { Trigger } from '../triggers/index.js';
const require = createRequire(import.meta.url);
import { Config } from '../config.js';
export class TriggerHandler {
    private rateLimiter = new RateLimiter(
        Config.RateLimiting.Triggers.Amount,
        Config.RateLimiting.Triggers.Interval * 1000
    );
    private triggers: Trigger[];
    private eventDataService: EventDataService;
    constructor(triggers: Trigger[], eventDataService: EventDataService) {
        this.triggers = triggers;
        this.eventDataService = eventDataService;
    }
    public async process(msg: Message): Promise<void> {
        // Check if user is rate limited
        let limited = this.rateLimiter.take(msg.author.id);
        if (limited) {
            return;
        }
        // Find triggers caused by this message
        let triggers = this.triggers.filter(trigger => {
            if (trigger.requireGuild && !msg.guild) {
                return false;
            }
            if (!trigger.triggered(msg)) {
                return false;
            }
            return true;
        });
        // If this message causes no triggers then return
        if (triggers.length === 0) {
            return;
        }
        // Get data from database
        let data = await this.eventDataService.create({
            user: msg.author,
            channel: msg.channel,
            guild: msg.guild,
        });
        // Execute triggers
        for (let trigger of triggers) {
            await trigger.execute(msg, data);
        }
    }
}