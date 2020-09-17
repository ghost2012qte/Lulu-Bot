import bot, { BotManager } from './bot';
import config from './config';
import { admin_commands, role_commands } from './commands/@commands';
import { Command } from './commands/@command-base';
import { LuluEmoji } from './emojis';

class Program {

    konluluRegExp = /(konlulu|конлулу)/i;

    main() {
        const token = this.parseToken();

        if (!token) {
            console.log('NO TOKEN WAS PROVIDES! Set token as arg [--token=TOKEN]');
            process.exit(5);
        }
        console.log('Token was found: ' + token);

        bot.on('ready', async () => {
            console.log('Lulu ready!');
            const vbois = bot.guilds.cache.find(g => g.id == config.vbois_id);
            if (vbois) {
                console.log('server was found');
                const role = vbois.roles.cache.find(r => r.name.toUpperCase() == 'VIRTUAL BOI');
                if (role) {
                    console.log('VIRTUAL BOI role was found');
                    const logFn = (text: string) => { console.log(text) };
                    await BotManager.initRoles(vbois, logFn);
                    BotManager.initActivity(vbois, logFn);
                    BotManager.initHand(vbois, role, logFn);
                }
            }
        })

        bot.on('message', msg => {

            if (!msg || !msg.guild || !msg.member || msg.author.bot) return;

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

            else if (msg.content.match(this.konluluRegExp)) {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.konlulu_happy);
                if (emoji) msg.react(emoji);
                msg.channel.send({files: ['./assets/voice/KONLULU.mp3']});
            }

        })

        bot.on('guildMemberRemove', member => {
            member.guild.members
                .fetch({user: config.creator_id, cache: false})
                .then(creator => {
                    creator.send(`${member} покинул сервер ${member.guild.name || ''}`);
                })
                .catch(e => {});

            member.guild.members
                .fetch({user: member.guild.ownerID, cache: false})
                .then(valera => {
                    valera.send(`${member} покинул сервер ${member.guild.name || ''}`);
                })
                .catch(e => {});
        })

        bot.login(token);
    }

    parseToken() {
        const match = process.argv.find(arg => arg.indexOf('--token') > -1)?.match(/--token=(.*)/);
        return match ? match[1] : null;
    }
}

new Program().main();