import mongoose, { Schema } from 'mongoose';
import { iAnswer } from './Answer';
import { iCategory } from './Category';

export interface iQuestion extends mongoose.Document {
    text: string
    category: Schema.Types.ObjectId | iCategory
    answers?: Array<iAnswer>
}

const schema = new mongoose.Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    text: {
        type: String,
        required: true
    }
})

schema.virtual('answers', {
    ref: 'Answer',
    localField: '_id',
    foreignField: 'question'
})

const model = mongoose.model<iQuestion>('Question', schema);
export default model;