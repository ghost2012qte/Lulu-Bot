import Discord from 'discord.js';
import { LocalStorage } from "node-localstorage";

const bot = new Discord.Client();
export default bot;
export const botStorage = new LocalStorage('./storage');

export class BotManager {

    static async createRole(guild: Discord.Guild) {
        const role = await guild.roles.create({
            data: {
                name: 'Konlulu Cultist',
                color: 'PURPLE'
            },
            reason: 'We Ready To Serve Our Elder Goddess Konlulu~!'
        })
        botStorage.setItem(`${guild.id}.role`, role.id);
        return role;
    }

    static getCreatedRoleId(guild: Discord.Guild) {
        return botStorage.getItem(`${guild.id}.role`);
    }
}