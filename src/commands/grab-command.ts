import { Message, TextChannel } from 'discord.js';
import { Command } from "./@command-base";
import { LuluGrab } from "../lulu-grab";

export class GrabCommand extends Command {

    match(str: string) {
        return str.indexOf('grab')  > -1;
    }

    execute(msg: Message) {
        const luluGrab = new LuluGrab();
        luluGrab
            .do(msg.guild, msg.channel as TextChannel)
            .then(e => {
                if (e.captured.length) {
                    let answer = 'Попались!\n';
                    for (let msg of e.captured) {
                        answer += `${msg.author} ${msg.author.username}\n`;
                    }
                    e.channel.send(answer);
                }
                else {
                    e.channel.send('В этот раз никто не попался, хихи!');
                }
            })
            .catch(err => {
                msg.channel.send(err);
            })
            .finally(() => {
                luluGrab.destroy();
            })
    }
}