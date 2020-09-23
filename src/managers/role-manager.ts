import { Guild, GuildMember, Message } from "discord.js";
import { botStorage } from "../bot";
import { RoleType } from "../interfaces";

export class RoleManager {

    async createRole(guild: Guild, type: RoleType) {
        const role = await guild.roles.create(this.buildData(type));
        botStorage.setItem(this.buildStorageKey(guild, type), role.id);
        return role;
    }

    getCreatedRoleId(guild: Guild, type: RoleType) {
        return botStorage.getItem(this.buildStorageKey(guild, type));
    }

    hasAccessRole(msg: Message) {
        return this.hasRole(msg.member, this.getCreatedRoleId(msg.guild, RoleType.CommandAccessRole));
    }

    hasRole(member: GuildMember, roleId: string) {
        return Boolean(member?.roles.cache.get(roleId));
    }

    private buildStorageKey(guild: Guild, type: RoleType) {
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