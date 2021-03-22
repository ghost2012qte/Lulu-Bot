import mongoose, { Schema } from 'mongoose';

export interface iCultist extends mongoose.Document {
    discord_user_id: string
    pray_count: number
    catch_count: number
    last_quiz_try: string | Date
}

const schema = new mongoose.Schema({
    discord_user_id: {
        type: String,
        required: true,
        unique: true
    },
    pray_count: {
        type: Number,
        default: 0
    },
    catch_count: {
        type: Number,
        default: 0
    },
    last_quiz_try: {
        type: Date,
        default: () => new Date(Date.UTC(2000, 0, 1, 0, 0, 0, 0))
    }
})
const model = mongoose.connection.model<iCultist>('Cultist', schema);
export default model;