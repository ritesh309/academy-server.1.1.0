const mongoose = require( 'mongoose' );
const bcrypt = require( 'bcryptjs' );
const jwt = require( "jsonwebtoken" )

//Creating the DB Schema
const studentSchema = new mongoose.Schema( {
    firstName: {
        type: String,
        required: [true, "Enter Your First Name"],

    },
    lastName: {
        type: String,

    },
    email: {
        type: String,
        required: [true, "Enter Your E-mail"],

    },

    phone: {
        type: Number,
        required: [true, "Enter Your Phone Number"],
        

    },

    password: {
        type: String,
        required: [true, "Enter Your Password"],
    },
    cpassword: {
        type: String
       
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
} );

//HAshing Password Before saving to DB

studentSchema.pre( 'save', async function ( next ) {
    if ( this.isModified( 'password' ) ) {
        this.password = await bcrypt.hash( this.password, 15 );
        this.cpassword = await bcrypt.hash( this.cpassword, 15 );
    }
    next();
} )
// generating  authentication token

studentSchema.methods.generateAuthToken=async function () {
    try {
         token = jwt.sign( { _id: this._id }, process.env.SECRET_KEY );
        this.tokens = this.tokens.concat( { token: token } );
        await this.save();
        return token;
    } catch ( error ) {
        console.log( error );
    }
}

const StudentData = mongoose.model( 'STUDENT', studentSchema );

module.exports = StudentData;