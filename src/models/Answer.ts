import mongoose, { Schema } from 'mongoose';
import { iQuestion } from './Question';

export interface iAnswer extends mongoose.Document {
    text: string
    correct: boolean
    question: Schema.Types.ObjectId | iQuestion
}

const schema = new mongoose.Schema({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    text: {
        type: String,
        required: true,
        unique: true
    },
    correct: {
        type: Boolean,
        required: true
    }
})

schema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'category'
})

const model = mongoose.connection.model<iAnswer>('Answer', schema);
export default model;