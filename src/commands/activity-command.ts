import { Message, MessageEmbed } from "discord.js";
import { Activity } from "../activity";
import { botManager } from "../bot";
import { activityType } from "../interfaces";
import { BotManager } from "../managers/bot-manager";
import { Command } from "./@command-base"

export class ActivityCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('activity') > -1;
    }

    execute(msg: Message): void {
        if (msg.content.indexOf('init') > -1) {
            this.init(msg);
        }
        else if (msg.content.indexOf('print') > -1) {
            this.print(msg);
        }
        else if (msg.content.indexOf('add') > -1) {
            this.add(msg);
        }
        else if (msg.content.indexOf('delete') > -1) {
            this.delete(msg);
        }
    }

    private init(msg: Message) {
        botManager.initActivity(msg.guild, text => msg.channel.send(text));
    }

    private print(msg: Message) {
        ['LISTENING', 'PLAYING', 'WATCHING'].forEach(type => {
            let desc = '';
            Activity.getActivityOptions(type as activityType).forEach(o => {
                desc += o + '\n';
            })
            msg.channel.send({
                embed: new MessageEmbed().setColor('#0099ff').setTitle(type).setDescription(desc)
            })
        })
    }

    private add(msg: Message) {
        const matchType = msg.content.match(/\s(LISTENING|PLAYING|WATCHING)\s/i);
        if (matchType) {
            const matchValue = msg.content.match(/"(.+)"/);
            if (matchValue) {
                const added = Activity.addActivity(matchType[1].toUpperCase() as activityType, matchValue[1]);
                if (added) msg.channel.send(`${added} was added to type ${matchType[1].toUpperCase()}`);
                else msg.channel.send(`${added} Already Exists In Type ${matchType[1].toUpperCase()}`);
            }
            else {
                msg.channel.send('Value TO Add Was Not Found In Given Line');
            }
        }
        else {
            msg.channel.send('Type must be LISTENING or PLAYING or WATCHING');
        }
    }

    private delete(msg: Message) {
        const matchType = msg.content.match(/\s(LISTENING|PLAYING|WATCHING)\s/i);
        if (matchType) {
            const matchValue = msg.content.match(/"(.+)"/);
            if (matchValue) {
                const deleted = Activity.deleteActivity(matchType[1].toUpperCase() as activityType, matchValue[1]);
                if (deleted) msg.channel.send(`${deleted} was Deleted From Type ${matchType[1].toUpperCase()}`);
                else msg.channel.send(`${deleted} Was Not Found In Type ${matchType[1].toUpperCase()}`);
            }
            else {
                msg.channel.send('Value TO Delete Was Not Found In Given Line');
            }
        }
        else {
            msg.channel.send('Type must be LISTENING or PLAYING or WATCHING');
        }
    }


}