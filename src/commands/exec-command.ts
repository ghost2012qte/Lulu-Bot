import { Message } from "discord.js";
import { Command } from "./@command-base";
import config from "../config";
import MODEL from '../models/@model';

export class ExecCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('exec') > -1;
    }

    async execute(msg: Message) {
        const members = await msg.guild.members.fetch({limit: 350, withPresences: false});
        const servants = members.filter(m => m.roles.cache.has(config.vbois.lulu_servant_role_id));

        const replyText = servants.reduce((sum, item) => sum + item.displayName + '\n', '');

        msg.channel.send(replyText);

        return;


        try {
            const members = await msg.guild.members.fetch({limit: 350});
            const servants = members.filter(m => m.roles.cache.has(config.vbois.lulu_servant_role_id));
            const proms = servants.map(servant => {
                return MODEL.Cultist.updateOne(
                    {discord_user_id: servant.id},
                    {$inc: {'catch_count': 1}},
                    {upsert: true, new: true, setDefaultsOnInsert: true}
                )
            })
            await Promise.all(proms);
            console.log('Servants catch_count was incremented');
        }
        catch (e) {
            console.log('Servants catch_count increment failed dude why :c');
        }
    }
}