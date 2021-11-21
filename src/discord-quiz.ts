import { MessageEmbed, TextChannel } from "discord.js";
import { DiscordQuizEvent } from "./interfaces";

export class DiscordQuiz<T = any> {

    answerTime = 10000;
    reactionNames: string[];

    constructor (
        private question: string,
        private answers: any[],
        private answerDisplayFn?: (answer: any) => string)
    {
        this.reactionNames = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    }

    async sendQuiz(channel: TextChannel, quizParticipantId: string): Promise<DiscordQuizEvent<T>> {
        const stringifiedAnswers: string[] = this.answerDisplayFn ? this.answers.map(this.answerDisplayFn) : this.answers;

        const embded = new MessageEmbed();
        embded.setTitle(this.question);
        for (let i = 0; i < stringifiedAnswers.length; ++i) {
            embded.addField(`Ответ ${i + 1}`, stringifiedAnswers[i]);
        }
        embded.setFooter(`Нажмите на соответсвующую реакцию для ответа в течение ${this.answerTime / 1000} сек`);

        return new Promise(async resolve => {
            const message = await channel.send(embded);
            stringifiedAnswers.map((item, index) => message.react(this.reactionNames[index]));
            const collectedReactions = await message.awaitReactions((reaction, user) => user.id == quizParticipantId, {max: 1, time: this.answerTime});
            message.reactions.removeAll();
            resolve({
                answers: this.answers,
                selectedAnswer: collectedReactions.size
                                ? this.answers[this.reactionNames.indexOf(collectedReactions.first().emoji.name)]
                                : null
            })
        })
    }
    
}