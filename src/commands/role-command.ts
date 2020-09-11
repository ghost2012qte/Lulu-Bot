import Discord from 'discord.js';
import { Command } from "./@command-base";
import { BotManager } from "../bot";

export class RoleCommand extends Command {

    match(str: string) {
        return str.indexOf('role') > -1
    }

    execute(msg: Discord.Message) {
        if (msg.content.indexOf('activate') > -1) {
            this.createRole(msg);
        }
    }

    private async createRole(msg: Discord.Message) {
        msg.reply('Пытаюсь создать роль..');
        const roleId = BotManager.getCreatedRoleId(msg.guild);
        if (roleId) {
            const role = await msg.guild.roles.fetch(roleId);
            msg.reply(`Роль уже существует ~  ${role.id} | ${role.name}`);
        }
        else {
            try {
                const role = await BotManager.createRole(msg.guild);
                msg.reply(`Роль создана успешно ~  ${role.id} | ${role.name}`);
            }
            catch(e) {
                msg.reply('Упс! Не получилось создать роль ~ ' + e);
            }
        }
    }
}