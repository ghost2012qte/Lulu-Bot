import { Guild, Role, Emoji } from "discord.js";
import { LuluGrab } from "./lulu-grab";
import { BotManager } from "./bot";
import { LuluEmoji } from "./emojis";

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
            const luluGrab = new LuluGrab(4000);
            luluGrab
                .do(BotManager.getAvailableChannels(this.guild, this.role).random())
                .then(e => {
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
                })
                .finally(luluGrab.destroy);
        }
    }

    private generateGrabTime() {        
        const hours = Math.round(Math.random() * 23);
        const mins = Math.round(Math.random() * 59);

        const next = new Date();
        next.setDate(next.getDate() + 1);
        next.setHours(hours);
        next.setMinutes(mins);

        return next;
    }

    destroy() {
        if (this.timerId) clearInterval(this.timerId);
    }
}