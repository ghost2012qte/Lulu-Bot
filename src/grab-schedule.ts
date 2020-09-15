import { Guild, Role } from "discord.js";
import { LuluGrab } from "./lulu-grab";
import { BotManager } from "./bot";

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
            const luluGrab = new LuluGrab(5000);
            luluGrab
                .do(BotManager.getAvailableChannels(this.guild, this.role).random())
                .then(e => {
                    // a
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

    dispose() {
        if (this.timerId) clearInterval(this.timerId);
    }
}