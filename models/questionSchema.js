const mongoose = require( 'mongoose' );

//Creating the DB Schema

const questionSchema = new mongoose.Schema( {
    questions: [
        {
            question_id: Number,
            question: String,
            optionA: String,
            optionB: String,
            optionC: String,
            optionD: String,
            answer: String
        }
    ]
    ,

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
} );

const QuestionData = mongoose.model( 'QUESTION', questionSchema );

module.exports = QuestionData;