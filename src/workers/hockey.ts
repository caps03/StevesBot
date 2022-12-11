import { Worker, parentPort, workerData } from 'worker_threads';
import { Bot } from '../models/index.js';
export class Hockey {
    private bot: Bot;
    constructor(bot: Bot) {
        this.bot = bot;
    }
    public async start(): Promise<void> {
        while(true) {

        }
    }
}
const h = new Hockey(workerData.bot);