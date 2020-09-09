import bot from './bot';
import config from './config';
import Commands from './commands/@commands';

class Program {
    
    grabTime = false;

    main() {

        const token = this.parseToken();

        if (!token) {
            console.log('set token as argument --token=TOKEN');
            process.exit(5);
        }

        bot.on('ready', () => {
            console.log('Lulu ready!');
            bot.user.setActivity({type: 'WATCHING', name: 'в душу'});
        })

        bot.on('message', msg => {
            if (msg.content.startsWith(config.command_prefix)) {
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