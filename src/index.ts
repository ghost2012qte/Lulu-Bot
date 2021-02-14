import bot, { botManager, roleManager } from './bot';
import config from './config';
import { admin_commands, moder_commands, role_commands } from './commands/@commands';
import { Command } from './commands/@command-base';
import { LuluEmoji } from './emojis';
import { MessageEmbed } from 'discord.js';
import { Activity } from './activity';

class Program {

    konluluRegExp = /(konlulu|конлулу)/i;
    patRegExp = /<:.*pat.*>/i;

    main() {
        const token = this.parseToken();

        if (!token) {
            console.log('NO TOKEN WAS PROVIDES! Set token as arg [--token=TOKEN]');
            process.exit(5);
        }
        console.log('Token was found: ' + token);
        Activity.init();        

        bot.on('ready', async () => {
            console.log('Lulu ready!');
            const vbois = await bot.guilds.fetch(config.vbois_guild_id);
            if (vbois) {
                console.log('server was found');
                const role = vbois.roles.cache.get(config.vbois_role_id);
                if (role) {
                    console.log('VIRTUAL BOI role was found');
                    const logFn = (text: string) => {console.log(text)};
                    await botManager.initRoles(vbois, logFn);
                    botManager.initActivity(vbois, logFn);
                    botManager.initHand(vbois, role, logFn);
                }
            }
        })

        bot.on('message', msg => {

            if (!msg || !msg.guild || !msg.member || msg.author.bot) return;

            if (msg.content.startsWith(config.command_prefix)) {

                let commands: Command[] = [];

                if (botManager.isOwnerOrCrator(msg)) {
                    commands = admin_commands;
                }
                else {
                    if (roleManager.hasAccessRole(msg)) {
                        commands = [...commands, ...role_commands];
                    }
                    if (botManager.isModerOrParticipant(msg.member)) {
                        commands = [...commands, ...moder_commands];
                    }
                }

                for (let c of commands) {
                    if (c.match(msg.content)) {
                        c.execute(msg);
                        break;
                    }
                }
            }

            else if (
                msg.content.startsWith('y!')
                && msg.mentions.members.size > 0
                && botManager.isModerOrParticipant(msg.member)
                && (msg.content.startsWith('y!warn') || msg.content.startsWith('y!ban') || msg.content.startsWith('y!kick'))
                && msg.content.indexOf('clear') < 0 )
            {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.lulu_awaken);
                if (emoji) msg.react(emoji);
                msg.channel.send({files: ['./assets/voice/Lulu_-_ykhihikhihikhihi.mp3']});
            }

            else if (msg.content.match(this.konluluRegExp)) {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.konlulu_happy);
                if (emoji) msg.react(emoji);
                msg.channel.send({files: ['./assets/voice/KONLULU.mp3']});
            }

            else if (msg.mentions.members.size > 0 && msg.mentions.members.first().id == bot.user.id && msg.content.match(this.patRegExp)) {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.kanata_pat);
                if (emoji) msg.reply(emoji.toString());
            }

        })

        bot.on('guildMemberRemove', member => {
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .addField('Server Nickname', member.displayName)
                .addField('User Name', member.user.username)
                .setImage(member.user.avatarURL({size: 128}));

            const msg = `${member} has left ${member.guild.name}`;
            
            [config.creator_id, member.guild.ownerID].forEach(id => {
                member.guild.members
                    .fetch({user: id})
                    .then(m => {
                        if (m) m.send(msg, {embed: embed});
                    })
                    .catch(e => {});
            })
        })

        bot.on('error', err =>  console.log(err));

        bot.login(token);
    }

    parseToken() {
        const match = process.argv.find(arg => arg.indexOf('--token') > -1)?.match(/--token=(.*)/);
        return match ? match[1] : null;
    }
}

new Program().main();