import config from "../config";
import { Collection, Guild, GuildChannel, Message, Role, TextChannel, Permissions, GuildMember } from "discord.js";
import { Activity } from "../activity";
import { LuluEmoji } from "../emojis";
import { GrabSchedule } from "../grab-schedule";

export class BotManager {

    private shedules: GrabSchedule[] = [];

    isOwnerOrCrator(msg: Message) {
        return msg.author.id == msg.guild.ownerID || msg.author.id == config.creator_id;
    }

    isModerOrParticipant(member: GuildMember) {
        return member.roles.cache.has('701496352412008467') || member.roles.cache.has('738180902651428894');
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