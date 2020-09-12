import bot, { BotManager } from './bot';
import config from './config';
import { admin_commands, role_commands } from './commands/@commands';
import { Command } from './commands/@command-base';
import { LuluEmoji } from './emojis';

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

            const konluluRegExp = /(konlulu|конлулу)/i;

            // if (msg.content.indexOf('emoji') > -1) msg.reply(Emoji.lulu_awaken);

            if (msg.content.startsWith(config.command_prefix)) {

                let commands: Command[];

                if (BotManager.isOwnerOrCrator(msg)) commands = admin_commands;
                else if (BotManager.hasAccessRole(msg)) commands = role_commands;

                if (commands) {
                    for (let c of commands) {
                        if (c.match(msg.content)) {
                            c.execute(msg);
                            break;
                        }
                    }
                }
            }

            else if (msg.content.startsWith('y!') && BotManager.isOwnerOrCrator(msg)) {
                if (msg.content.indexOf('warn') > -1 || msg.content.indexOf('ban') > -1 || msg.content.indexOf('kick') > -1) {
                    const emoji = msg.guild.emojis.cache.get(LuluEmoji.lulu_awaken);
                    if (emoji) msg.react(emoji);
                    msg.channel.send({files: ['./assets/voice/Lulu_-_ykhihikhihikhihi.mp3']});
                }
            }

            else if (msg.content.match(konluluRegExp)) {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.konlulu_happy);
                if (emoji) msg.react(emoji);
                msg.channel.send({files: ['./assets/voice/KONLULU.mp3']});
            }

        })

        bot.on('guildMemberRemove', async member => {
            try {
                const creator = await member.guild.members.fetch({user: config.creator_id, cache: false});
                creator.send(`Покинул сервер: ${member.id} | ${member.nickname} | ${member}`);
            }
            catch {}
        })

        bot.login(token);
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