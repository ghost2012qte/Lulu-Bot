import bot, { botManager } from './bot';
import { GuildMember, Message, MessageEmbed, PartialGuildMember } from 'discord.js';
import mongoose from 'mongoose';
import MODEL from './models/@model';
import config from './config';
import { admin_commands, moder_commands, role_commands } from './commands/@commands';
import { Command } from './commands/@command-base';
import { LuluEmoji } from './emojis';
import { Activity } from './activity';

start();

class Program {

    konluluRegExp = /(konlulu|конлулу)/i;
    patRegExp = /<:.*pat.*>/i;

    main(token: string, DBPassword: string) {
        Activity.init();
        this.connectToMongo(DBPassword);
        bot.on('ready', this.onReady.bind(this));
        bot.on('message', this.onMessage.bind(this));
        bot.on('guildMemberRemove', this.onGuildMemberRemove.bind(this));
        bot.on('error', err => console.log(err));
        bot.login(token);
    }

    async connectToMongo(DBPassword: string) {
        try {
            const db = await mongoose.connect(`mongodb+srv://admin:${DBPassword}@lulufans.2fykj.mongodb.net/luluDB?retryWrites=true&w=majority`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            })
            console.log('luluDB connected');
            return db;
        }
        catch (e) {
            console.error('mongoDB connection failed', e);
            throw e;
        }
    }

    async onReady() {
        console.log('Lulu ready!');
        const vbois = await bot.guilds.fetch(config.vbois.guild_id);
        if (vbois) {
            console.log('VBOIS server was found');
            const role = vbois.roles.cache.get(config.vbois.vboi_role_id);
            if (role) {
                console.log('VIRTUAL BOI role was found');
                const logFn = (text: string) => {console.log(text)};
                botManager.initActivity(vbois, logFn);
                botManager.initHand(vbois, role, logFn);
            }
        }
    }

    async onMessage(msg: Message) {
        // Guard line
        if (msg && msg.guild && msg.member && !msg.author.bot) {

            // Execute command
            if (msg.content.startsWith(config.command_prefix)) {
                let commands: Command[] = [];
                if (botManager.isOwnerOrCrator(msg)) {
                    commands = admin_commands;
                }
                else {
                    if (msg.member.roles?.cache.get(config.vbois.lulu_cultist_role_id)) {
                        commands = [...commands, ...role_commands];
                    }
                    if (botManager.isModerOrParticipant(msg.member)) {
                        commands = [...commands, ...moder_commands];
                    }
                }
                const matchedCommand = commands.find(c => c.match(msg.content));
                if (matchedCommand) matchedCommand.execute(msg);
            }

            // Kick/ban reaction
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

            // Message contains konlulu
            else if (msg.content.match(this.konluluRegExp)) {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.konlulu_happy);
                if (emoji) msg.react(emoji);
                msg.channel.send({files: ['./assets/voice/KONLULU.mp3']});
            }

            // Pat back
            else if (msg.mentions.members.size > 0 && msg.mentions.members.first().id == bot.user.id && msg.content.match(this.patRegExp)) {
                const emoji = msg.guild.emojis.cache.get(LuluEmoji.kanata_pat);
                if (emoji) msg.reply(emoji.toString());
            }


            // Pray count increment
            if (msg.channel.id == config.vbois.pray_room_channel_id) {
                try {
                    await MODEL.Cultist.updateOne(
                        {discord_user_id: msg.member.id},
                        {$inc: {'pray_count': 1}},
                        {upsert: true, new: true, setDefaultsOnInsert: true}
                    )
                    console.log(`${msg.member.displayName}\`s pray_count was incremented`);
                }
                catch (e) {
                    console.error(`${msg.member.displayName}\`s pray_count increment failed`, e);
                }
            }

        }
    }

    onGuildMemberRemove(member: GuildMember | PartialGuildMember) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .addField('Server Nickname', member.displayName)
            .addField('User Name', member.user.username)
            .setImage(member.user.avatarURL({size: 128}));

        const msg = `${member} has left ${member.guild.name}`;
        
        [config.creator_id, member.guild.ownerID].forEach(async id => {
            try {
                const m = await member.guild.members.fetch({user: id});
                if (m) m.send(msg, {embed: embed});
            }
            catch (e) {
                console.error('Member leave notification failed: ', e);
            }
        })
    }
}

function start() {
    const token = parseArg(/--token=(.*)/);
    const DBPassword = parseArg(/--DBPassword=(.*)/);

    if (token && DBPassword) {
        console.log('Token was found: ' + token);
        console.log('DBPassword was found: ' + DBPassword);
        const program = new Program();
        program.main(token, DBPassword);
    }
    else {
        if (!token) console.error('NO TOKEN WAS PROVIDED! Set token as arg using [--token=TOKEN]');
        if (!DBPassword) console.error('NO DBPASSWORD WAS PROVIDED! Set DBPassword as arg using [--DBPassword=DBPASSWORD]');
        process.exit(5);
    }

    function parseArg(argRegExp: RegExp) {
        for (let arg of process.argv) {
            const match = arg.match(argRegExp);
            if (match) return match[1];
        }
        return null;
    }
}