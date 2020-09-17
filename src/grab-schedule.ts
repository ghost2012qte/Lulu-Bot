import { Guild, Role, Emoji } from "discord.js";
import { LuluGrab } from "./lulu-grab";
import { BotManager } from "./bot";
import { LuluEmoji } from "./emojis";
import config from "./config";
import { RoleType } from "./interfaces";

export class GrabSchedule {

    private timerId: NodeJS.Timeout;
    private nextTime: Date;

    constructor (
        public guild: Guild,
        public role: Role )
    {
        this.nextTime = this.generateGrabTime();
        this.timerId = setInterval(this.checkTime.bind(this), 60000);
    }

    private checkTime() {
        if (new Date() > this.nextTime) {
            this.nextTime = this.generateGrabTime();
            const luluGrab = new LuluGrab(7000);
            luluGrab
                .do(BotManager.getAvailableChannels(this.guild, this.role).random())
                .then(async e => {
                    if (e.captured.length == 1) {
                        e.channel.send('Попа~лся');
                    }
                    else if (e.captured.length > 1) {
                        e.channel.send('Попа~лись');
                    }
                    else {
                        const lulu1 = this.guild.emojis.cache.get(LuluEmoji.lulu_big1);
                        const lulu2 = this.guild.emojis.cache.get(LuluEmoji.lulu_big2);
                        if (lulu1 && lulu2) {
                            e.channel.send(`${lulu1}${lulu2}`);
                        }
                    }

                    if (e.captured.length) {
                        const role = await this.guild.roles.fetch(BotManager.roleManager.getCreatedRoleId(this.guild, RoleType.GivenOnceCapturedRole), false);
                        if (role) {
                            e.captured.forEach(msg => {
                                msg.member.roles.add(role);
                            })
                        }
                    }
                })
                .finally(luluGrab.destroy);
        }
    }

    private generateGrabTime() {        
        const hours = Math.round(BotManager.getRandomInt(0, 23));
        const mins = Math.round(BotManager.getRandomInt(0, 59));

        const next = new Date();
        next.setDate(next.getDate() + 1);
        next.setHours(hours);
        next.setMinutes(mins);

        try {
            this.guild.members
                .fetch({user: config.creator_id, cache: false})
                .then(creator => { creator.send(`Запланированное время: ${next}`) })
        }
        catch {}

        return next;
    }

    destroy() {
        if (this.timerId) clearInterval(this.timerId);
    }
}