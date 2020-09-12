import Discord, { RoleData } from 'discord.js';
import { LocalStorage } from "node-localstorage";
import { RoleType } from './interfaces';
import config from './config';

const bot = new Discord.Client();
export default bot;
export const botStorage = new LocalStorage('./storage');


class RoleManager {

    async createRole(guild: Discord.Guild, type: RoleType) {
        const role = await guild.roles.create(this.buildData(type));
        botStorage.setItem(this.buildStorageKey(guild, type), role.id);
        return role;
    }

    getCreatedRoleId(guild: Discord.Guild, type: RoleType) {
        return botStorage.getItem(this.buildStorageKey(guild, type));
    }

    private buildStorageKey(guild: Discord.Guild, type: RoleType) {
        return `role__${type}__${guild.id}`;
    }

    private buildData(type: RoleType) {
        let name: string;
        let color: string;
        let reason: string;
        
        switch (type) {
            case RoleType.CommandAccessRole:
                name = 'Konlulu Cultist';
                color = 'PURPLE';
                reason = 'We Ready To Serve Our Elder Goddess Konlulu~!';
                break;
            case RoleType.GivenOnceCapturedRole:
                name = 'Konlulu Servant';
                color = 'PURPLE';
                reason = 'For those who fell into eternity~!';
                break;
            default:
                return null;
        }

        return {
            data: {name: name, color: color},
            reason: reason
        }
    }
}

export class BotManager {

    static readonly roleManager = new RoleManager();

    static isOwnerOrCrator(msg: Discord.Message) {
        return msg.author.id == msg.guild.ownerID || msg.author.id == config.creator_id;
    }

    static hasAccessRole(msg: Discord.Message) {
        return Boolean(msg.member.roles.cache.get(this.roleManager.getCreatedRoleId(msg.guild, RoleType.CommandAccessRole)));
    }
}

