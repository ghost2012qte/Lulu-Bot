import { Message } from 'discord.js';
import { Command } from "./@command-base";
import { BotManager } from "../bot";
import { RoleType } from '../interfaces';
import { Activity } from '../activity';
import { GrabSchedule } from '../grab-schedule';

export class InitCommand extends Command {

    shedules: GrabSchedule[] = [];

    match(str: string) {
        return str.indexOf('init') > -1;
    }

    execute(msg: Message) {
        if (msg.content.indexOf('roles') > -1) {
            this.initRoles(msg);
        }
        else if (msg.content.indexOf('activity') > -1) {
            this.initActivity(msg);
        }
        else if (msg.content.indexOf('hand')  > -1) {
            this.initHand(msg);
        }
    }

    private async initRoles(msg: Message) {
        msg.reply('Инициализизация ролей ..');
        try {
            const roles = [RoleType.CommandAccessRole, RoleType.GivenOnceCapturedRole];
            for (let i = 0; i < roles.length; ++i) {
                const roleId = BotManager.roleManager.getCreatedRoleId(msg.guild, roles[i]);
                if (roleId) {
                    const role = await msg.guild.roles.fetch(roleId, false);
                    msg.reply(`Роль уже существует ~  ${role}`);
                }
                else {
                    const role = await BotManager.roleManager.createRole(msg.guild, roles[i]);
                    msg.reply(`Роль создана успешно ~  ${role}`);
                }
            }
            msg.reply('Инициализация ролей: успешно ~ !!');
        }
        catch (e) {
            msg.reply('Упс! Не получилось создать роль ~ ' + e);
        }
    }

    private initActivity(msg: Message) {
        new Activity(msg.guild, 600000).start();
        msg.reply('Активити: успешно ~ !!');
    }

    private initHand(msg: Message) {
        const role = msg.mentions.roles.first();
        if (role) {
            msg.reply(`Для роли ${role} доступны следующие каналы ..`);
            if (this.shedules.find(sc => sc.guild.id == msg.guild.id)) {
                msg.channel.send('На этом сервере уже установлена рука');
            }
            else {
                BotManager.getAvailableChannels(msg.guild, role).forEach(ch => {msg.channel.send(ch.toString())});
                this.shedules.push(new GrabSchedule(msg.guild, role));
                msg.channel.send('Рука запланирована: Успешно ~ !!');
            }
        }
        else {
            msg.reply('Роль с таким именем не найдена.');
        }
    }

}