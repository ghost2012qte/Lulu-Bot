import { Client, Intents } from 'discord.js';
import { LocalStorage } from "node-localstorage";
import { RoleManager } from './managers/role-manager';
import { BotManager } from './managers/bot-manager';

const bot = new Client();

export default bot;

export const botStorage = new LocalStorage('./storage');
export const roleManager = new RoleManager();
export const botManager = new BotManager();