import config from "../config";
import { Collection, Guild, GuildChannel, Message, Role, TextChannel, Permissions } from "discord.js";
import { Activity } from "../activity";
import { roleManager } from "../bot";
import { LuluEmoji } from "../emojis";
import { GrabSchedule } from "../grab-schedule";
import { RoleType } from "../interfaces";

export class BotManager {

    private shedules: GrabSchedule[] = [];

    isOwnerOrCrator(msg: Message) {
        return msg.author.id == msg.guild.ownerID || msg.author.id == config.creator_id;
    }

    changeNicknameWithChance(msg: Message) {
        if (Math.random() <= 0.03) {
            msg.member.setNickname('Konlulu').catch(e => {});
            const emoj = msg.guild.emojis.cache.get(LuluEmoji.lulu_awaken);
            if (emoj) msg.channel.send(emoj.toString());
            msg.channel.send(`Лулу обратила на тебя внимание, ${msg.member}`);
        }
    }

    getAvailableChannels(guild: Guild, role: Role) {
        const channelsToExclude = ['753246352686710814'];
        const canView = (ch: GuildChannel) => ch.permissionsFor(role).has(Permissions.FLAGS.VIEW_CHANNEL);
        const canSend = (ch: GuildChannel) => ch.permissionsFor(role).has(Permissions.FLAGS.SEND_MESSAGES);
        return guild.channels.cache
            .filter(ch => ch.type == 'text' && canView(ch) && canSend(ch) && !channelsToExclude.some(id => id == ch.id)) as Collection<string, TextChannel>;
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async initRoles(guild: Guild, logFn: (text: string) => void) {
        logFn('Инициализизация ролей ..');
        try {
            const roles = [RoleType.CommandAccessRole, RoleType.GivenOnceCapturedRole];
            for (let i = 0; i < roles.length; ++i) {
                const roleId = roleManager.getCreatedRoleId(guild, roles[i]);
                if (roleId) {
                    const role = await guild.roles.fetch(roleId, false);
                    logFn(`Роль уже существует ~  ${role}`);
                }
                else {
                    const role = await roleManager.createRole(guild, roles[i]);
                    logFn(`Роль создана успешно ~  ${role}`);
                }
            }
        }
        catch (e) {
            logFn('Упс! Не получилось создать роль ~ ' + e);
        }
    }

    initActivity(guild: Guild, logFn: (text: string) => void) {
        if (Activity.isRunning) {
            logFn('One Running Activity Exists. You Should Stop It First.');
        }
        else {
            Activity.start(guild, 600000);
            logFn('Активити: успешно ~ !!');
        }
    }

    initHand(guild: Guild, role: Role, logFn: (text: string) => void) {
        logFn(`Для роли ${role} доступны следующие каналы ..`);
        if (this.shedules.find(sc => sc.guild.id == guild.id)) {
            logFn('На этом сервере уже установлена рука');
        }
        else {
            this.getAvailableChannels(guild, role).forEach(ch => {logFn(`${ch} (${ch.name})`)});
            this.shedules.push(new GrabSchedule(guild, role));
            logFn('Рука запланирована: Успешно ~ !!');
        }
    }
}