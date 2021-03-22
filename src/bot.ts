import { Client, Intents } from 'discord.js';
import { LocalStorage } from "node-localstorage";
import { BotManager } from './managers/bot-manager';

const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_PRESENCES",
    "GUILD_MEMBERS" // lets you request guild members (i.e. fixes the issue)
])
const bot = new Client({ws: {intents}});

export default bot;

export const botStorage = new LocalStorage('./storage');
export const botManager = new BotManager();