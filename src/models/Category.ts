import mongoose from 'mongoose';
import { iQuestion } from './Question';

export interface iCategory extends mongoose.Document {
    name: string
    questions?: Array<iQuestion>
}

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

schema.virtual('questions', {
    ref: 'Question',
    localField: '_id',
    foreignField: 'category'
})

const model = mongoose.connection.model<iCategory>('Category', schema);
export default model;