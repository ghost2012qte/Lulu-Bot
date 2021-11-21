import { Message, TextChannel } from "discord.js";
import { Command } from "./@command-base";
import { DiscordQuiz } from "../discord-quiz";

export class ExecCommand extends Command {

    match(str: string): boolean {
        return str.indexOf('exec') > -1;
    }

    async execute(msg: Message) {
        const quiz = new DiscordQuiz('Вы топ дуд?', ['Да', 'Нет', 'Не уверен']);
        const quizEvent = await quiz.sendQuiz(msg.channel as TextChannel, msg.member.id);
        console.log('selected', quizEvent.selectedAnswer);
    }
}