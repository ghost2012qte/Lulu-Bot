import bot from './bot';
import Discord from 'discord.js';
import config from './config';
import Commands from './commands/@commands';
import { Emoji } from './emojis';

class Program {

    main() {

        const token = this.parseToken();

        if (!token) {
            console.log('NO TOKEN WAS PROVIDES! Set token as arg [--token=TOKEN]');
            process.exit(5);
        }
        console.log('Token was found: ' + token);

        bot.on('ready', () => {
            console.log('Lulu ready!');
            bot.user.setActivity({type: 'WATCHING', name: 'в душу'});
        })

        bot.on('message', msg => {

            if (msg.content.indexOf('emoji') > -1) msg.reply(Emoji.lulu_awaken);

            if (msg.content.startsWith(config.command_prefix) && this.isOwnerOrCrator(msg)) {
                for (let c of Commands) {
                    if (c.match(msg.content)) {
                        c.execute(msg);
                        break;
                    }
                }
            }
        })

        bot.login(token);
    }

    isOwnerOrCrator(msg: Discord.Message) {
        return msg.author.id == msg.guild.ownerID || msg.author.id == config.creator_id;
    }

    generateGrabTime() {        
        const hours = Math.round(Math.random() * 23);
        const mins = Math.round(Math.random() * 59);

        const next = new Date();
        next.setDate(next.getDate() + 1);
        next.setHours(hours);
        next.setMinutes(mins);

        return next;
    }

    parseToken() {
        const match = process.argv.find(arg => arg.indexOf('--token') > -1)?.match(/--token=(.*)/);
        return match ? match[1] : null;
    }
}

new Program().main();