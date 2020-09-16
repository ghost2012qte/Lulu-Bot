import Discord, { Message, Guild, Collection, TextChannel, Role, Permissions, GuildChannel } from 'discord.js';
import config from './config';
import { LocalStorage } from "node-localstorage";
import { RoleType } from './interfaces';
import { LuluEmoji } from './emojis';

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

    static changeNicknameWithChance(msg: Message) {
        if (Math.random() <= 0.03) {
            msg.member.setNickname('Konlulu').catch(e => {});
            const emoj = msg.guild.emojis.cache.get(LuluEmoji.mikuded);
            if (emoj) msg.channel.send(emoj.toString());
            msg.channel.send(`Лулу обратила на тебя внимание, ${msg.member}`);
        }
    }

    static getAvailableChannels(guild: Guild, role: Role) {
        const canView = (ch: GuildChannel) => ch.permissionsFor(role).has(Permissions.FLAGS.VIEW_CHANNEL);
        const canSend = (ch: GuildChannel) => ch.permissionsFor(role).has(Permissions.FLAGS.SEND_MESSAGES);
        return guild.channels.cache.filter(ch => ch.type == 'text' && canView(ch) && canSend(ch)) as Collection<string, TextChannel>;
    }

    static getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}