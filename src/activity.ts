import bot, { botManager, botStorage } from "./bot";
import { Guild } from "discord.js";
import { activityType } from "./interfaces";

export class Activity {

    static timerId: NodeJS.Timeout;
    static guild: Guild;
    static delay: number;

    static get isRunning() {
        return Boolean(this.timerId);
    }

    static init() {
        if (!botStorage.getItem(Activity.buildKey('PLAYING'))) {
            botStorage.setItem(
                Activity.buildKey('PLAYING'),
                JSON.stringify(['Rhythm Heaven с @@', 'Fall Guys с @@', 'Uncharted', 'Dark Souls', 'Bloodborne', 'MapleStory', 'Ring Fit Adventure', 'Sekiro', 'Приготовление абихайта', 'Сёги с @@'])
            )
        }
        if (!botStorage.getItem(Activity.buildKey('LISTENING'))) {
            botStorage.setItem(
                Activity.buildKey('LISTENING'),
                JSON.stringify(['шёпот в тенях', 'голоса предков', 'мысли @@', 'крики абаасов', 'отголоски гностиков', 'молитвы культистов', 'архонтов', 'Газманова'])
            )
        }
        if (!botStorage.getItem(Activity.buildKey('WATCHING'))) {
            botStorage.setItem(
                Activity.buildKey('WATCHING'),
                JSON.stringify(['Хроники Акаши', 'за порядком', 'в окно @@', 'в логи сервера', 'на Абраксаса', 'на поведение @@'])
            )
        }
    }

    static start(guild: Guild, delay: number) {
        if (!this.isRunning) {
            this.guild = guild;
            this.delay = delay;
            this.setActivity();
            this.timerId = setInterval(() => {this.setActivity()}, this.delay);
        }
    }

    static stop() {
        if (this.isRunning) {
            clearInterval(this.timerId);
            this.guild = null;
            this.delay = 0;
            bot.user.setActivity(null);
        }
    }

    static getActivityOptions(type: activityType): string[] {
        const options = botStorage.getItem(this.buildKey(type));
        return options ? JSON.parse(options) : [];
    }

    static addActivity(type: activityType, value: string) {
        const options = this.getActivityOptions(type);
        if (options.indexOf(value) < 0) {
            options.push(value);
            botStorage.setItem(this.buildKey(type), JSON.stringify(options));
            console.log(`Activity "${value}" has been added in type ${type}`);
            return value;
        }
        return null;
    }

    static deleteActivity(type: activityType, value: string) {
        const options = this.getActivityOptions(type);        
        if (options.indexOf(value) > -1) {
            botStorage.setItem(this.buildKey(type), JSON.stringify(options.filter(o => o != value)));
            console.log(`Activity "${value}" has been deleted from type ${type}`);
            return value;
        }
        return null;
    }

    private static buildKey(type: activityType) {
        return `activity.${type}`;
    }

    private static async setActivity() {
        const type = ["PLAYING", "LISTENING", "WATCHING"][botManager.getRandomInt(0,2)] as activityType;
        const options = Activity.getActivityOptions(type);

        if (options.length) {
            let name = options[botManager.getRandomInt(0, options.length - 1)];

            if (name.indexOf('@@') > -1) {
                const randMemberName = await this.getRandomName(type == 'PLAYING');
                name = name.replace('@@', randMemberName);
            }

            bot.user.setActivity({type: type, name: name});
            console.log(`Activity Changed: ${type} ${name}`);
        }
    }

    private static async getRandomName (withLize: boolean) {
        if (withLize && Math.random() <= 0.25) return 'Лизе';
        const member = (await this.guild.members.fetch()).filter(m => m.presence.status !== 'offline' && !m.user.bot).random();
        return member?.displayName || '';
    }

}