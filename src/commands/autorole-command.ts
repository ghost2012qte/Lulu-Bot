import { GuildMember, Message, Role } from "discord.js";
import { Command } from "./@command-base";
import bot, { botStorage } from "../bot";
import config from "../config";


export class AutoroleCommand implements Command {

    role: Role;

    constructor() {
        this.deserialize();
    }

    match(str: string): boolean {
        return str.indexOf('autorole') > -1;
    }

    execute(msg: Message): void {
        const role = msg.mentions.roles.first();
        if (role) {
            this.role = role;
            this.setCacheRoleId(role.id);
            msg.channel.send(`Role ${role} assigned successfully`);
        }
        if (msg.content.indexOf('enable') >- 1) {
            this.executeEnable(msg);
        }
        else if (msg.content.indexOf('disable') >- 1) {
            this.executeDisable(msg);
        }
    }

    executeEnable(msg: Message) {
        if (this.role) {
            this.setCacheRoleActive(true);
            bot.on('guildMemberAdd', this.onGuildMemberAdd);
            msg.channel.send(`Autorole ${this.role} enabled successfully`);
        }
        else {
            msg.channel.send('Role wasn\'t assigned. Consider using "!lulu autorole <@role>" command first');
        }
    }

    executeDisable(msg: Message) {
        this.setCacheRoleActive(false);
        bot.off('guildMemberAdd', this.onGuildMemberAdd);
        msg.channel.send(`Autorole disabled successfully`);
    }

    async deserialize() {
        const roleId = this.getCacheRoleId();
        if (roleId) {
            const vbois = await bot.guilds.fetch(config.vbois.guild_id);
            const role = await vbois.roles.fetch(roleId);
            this.role = role;
            console.log(`Autorole (${this.role}) was restored`);
        }
        if (this.getCacheRoleActive()) {
            bot.on('guildMemberAdd', this.onGuildMemberAdd);
        }
    }

    getCacheRoleId() {
        return botStorage.getItem('autorole_id');
    }

    setCacheRoleId(value: string) {
        botStorage.setItem('autorole_id', value);
    }

    getCacheRoleActive() {
        return botStorage.getItem('autorole_active') == '1';
    }

    setCacheRoleActive(value: boolean) {
        botStorage.setItem('autorole_active', value ? '1' : '0');
    }

    onGuildMemberAdd = (member: GuildMember) => {
        if (member.guild.id == config.vbois.guild_id) {
            try {
                member.roles.add(this.role);
            }
            catch(e) {
                console.log(e);
            }
        }
    }
    
}