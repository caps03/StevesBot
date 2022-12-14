import { Client, Events, Message } from 'discord.js';
import { MessageHandler } from '../events/index.js';
import { PartialUtils } from '../utils/index.js';
export class Bot {
    private ready = false;
    private token: string;
    public client: Client;
    private messageHandler: MessageHandler;
    private userId: string;
    constructor(token: string, client: Client, messageHandler: MessageHandler) {
        this.token = token;
        this.client = client;
        this.messageHandler = messageHandler;
    }
    public async start(): Promise<void> {
        this.registerListeners();
        await this.login(this.token);
    }
    private registerListeners(): void {
        this.client.on(Events.ClientReady, () => this.onReady());
        this.client.on(Events.MessageCreate, (msg: Message) => this.onMessage(msg));
    }
    private async login(token: string): Promise<void> {
        try {
            await this.client.login(token);
        } catch (error) {
            console.error(error);
            return;
        }
    }
    private async onReady(): Promise<void> {
        this.userId = this.client.user?.tag;
        this.ready = true;
        console.log("Bot " + this.userId + " is ready!");
    }
    private async onMessage(msg: Message): Promise<void> {
        if (!this.ready) {
            return;
        }
        msg = await PartialUtils.fillMessage(msg);
        if (!msg) {
            return;
        }
        try {
            await this.messageHandler.process(msg);
        } catch (error) {
            console.error(error);
        }
    }
}