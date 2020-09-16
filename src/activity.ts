import bot from "./bot";
import { Guild } from "discord.js";

export class Activity {

    timerId: number;

    constructor(private guild: Guild, private delay: number) { }

    start() {
        this.setActivity();
        setInterval(() => {this.setActivity()}, this.delay);
    }

    stop() {
        clearInterval(this.timerId);
        bot.user.setActivity(null);
    }

    private setActivity = async () => {
        const type = ["PLAYING", "LISTENING", "WATCHING"][Math.round(Math.random() * 2)] as "PLAYING"|"LISTENING"|"WATCHING";
        let options: string[];

        if (type == "PLAYING") {
            options = ['Rhythm Heaven с @@', 'Fall Guys с @@', 'Uncharted', 'Dark Souls', 'Bloodborne', 'MapleStory', 'Ring Fit Adventure', 'Sekiro', 'Приготовление абихайта', 'Сёги с @@'];
        }
        else if (type == "LISTENING") {
            options = ['шёпот в тенях', 'голоса предков', 'мысли @@', 'крики абаасов', 'отголоски гностиков', 'молитвы культистов', 'архонтов', 'Газманова'];
        }
        else if (type == 'WATCHING') {
            options = ['Хроники Акаши', 'за порядком', 'в окно @@', 'в логи сервера', 'на Абраксаса', 'на поведение @@'];
        }

        let name = options[Math.round(Math.random() * (options.length - 1))];

        if (name.indexOf('@@') > -1) {
            const randMemberName = await this.getRandomName(type == 'PLAYING');
            name = name.replace('@@', randMemberName || '');
        }

        bot.user.setActivity({type: type, name: name});
    }

    private getRandomName = async (withLize: boolean) => {
        if (withLize && Math.random() <= 0.25) return 'Лизе';
        const member = (await this.guild.members.fetch()).random();
        return member.displayName;
    }

}