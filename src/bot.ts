import Discord from 'discord.js';
import { LocalStorage } from "node-localstorage";

const bot = new Discord.Client();

export const botStorage = new LocalStorage('./storage');

export default bot;