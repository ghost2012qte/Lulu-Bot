import Discord from 'discord.js';
import { LocalStorage } from "node-localstorage";

const bot = new Discord.Client();
export default bot;
export const botStorage = new LocalStorage('./storage');