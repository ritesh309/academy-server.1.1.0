const express = require( 'express' );
const bcrypt = require( 'bcryptjs' );
require( "../db/connDB" );
const jwt = require( "jsonwebtoken" )

const StudentData = require( "../models/studentSchema" );
const FacultyData = require( "../models/facultySchema" );
const QuestionData = require( "../models/questionSchema" )
const studentAuthentication = require( "../middleware/studentAuthentication" );
const facultyAuthentication = require( "../middleware/facultyAuthentication" );


const router = express.Router();


//Faculty REgistration DATA Storing   start


router.post( '/facultyregister', async ( req, res ) => {

    const { firstName, lastName, email, phone, password, cpassword } = req.body;

    if ( !firstName || !lastName || !email || !phone || !password || !cpassword ) {
        res.status( 422 ).send( { error: 'Fill All fields' } );
    }
    try {
        const userExist = await FacultyData.findOne( { email: email } )
        if ( userExist ) {
            res.status( 421 ).send( { error: 'Faculty already exists' } );
        } else if ( password != cpassword ) {
            res.status( 423 ).send( { error: 'Password not matched' } );
        } else {
            const faculty = new FacultyData( { firstName, lastName, email, phone, password, cpassword } );

            const userRegistered = await faculty.save();

            if ( userRegistered ) {
                res.status( 201 ).send( { success: "Registered Successfully" } )
            } else {
                res.status( 422 ).send( { error: 'Failed to register' } )
            }
        }

    } catch ( error ) {
        res.status( 502 ).send( { error: "Can not be Registered" } )
    }

} )


// faculty Login starts here----


router.post( "/loginfaculty", async ( req, res ) => {

    try {

        let token;
        const { email, _id, password } = req.body;

        if ( !email || !password || !_id ) {
            res.status( 421 ).send( { error: 'Fill the data' } )
        }
        const facultyLogin = await FacultyData.findOne( { email: email } );

        const facultyID = await FacultyData.findOne( { _id: _id } );

        if ( facultyLogin && facultyID ) {
            token = await facultyLogin.generateAuthToken();

            res.cookie( "jwtoken", token, {
                expires: new Date( Date.now() + 432000000 ), //5 days milliseconds
                httpOnly: true
            } );

            const isMatch = await bcrypt.compare( password, facultyLogin.password );


            if ( !isMatch ) {
                res.status( 422 ).send( { error: "Invalid credentials" } );
            }
            else {
                res.status( 201 ).send( { success: "Login Successfully" } )
            }
        }
    } catch ( error ) {
        console.log( error )
    }
} );


// Student REgistration DATA 

router.post( '/studentregister', async ( req, res ) => {

    const { firstName, lastName, email, phone, password, cpassword } = req.body;
    if ( !firstName || !lastName || !email || !phone || !password || !cpassword ) {
        res.status( 421 ).send( { error: 'Please Fill All fields' } );
    }

    try {
        const userExist = await StudentData.findOne( { email: email } )
        if ( userExist ) {
            res.status( 423 ).send( { error: 'Student  already exists' } );
        } else if ( password != cpassword ) {
            res.status( 424 ).send( { error: 'Password not matched' } );
        } else {
            const student = new StudentData( { firstName, lastName, email, phone, password, cpassword } );

            const studentRegistered = await student.save()

            if ( studentRegistered ) {
                res.status( 201 ).send( { success: "Registered Successfully" } )
            } else {
                res.status( 422 ).send( { error: 'Failed to register' } )
            }
        }

    } catch ( error ) {
        console.log( error )
    }
} );

// student Login ----------------------

router.post( "/studentlogin", async ( req, res ) => {

    try {

        let token;
        const { email, password } = req.body;

        if ( !email || !password ) {
            res.status( 421 ).send( { error: 'Fill the data' } )
        }

        const studentLogin = await StudentData.findOne( { email: email } );

        if ( studentLogin ) {
            token = await studentLogin.generateAuthToken();

            res.cookie( "jwtoken", token, {
                expires: new Date( Date.now() + 432000000 ), //5 days milliseconds
                httpOnly: true
            } );

            const isMatch = await bcrypt.compare( password, studentLogin.password );

            if ( !isMatch ) {
                res.status( 422 ).send( { error: "Invalid credentials" } );
            }
            else {
                res.status( 201 ).send( { success: "Login Successfully" } )
            }
        }
    } catch ( error ) {
        console.log( error )
    }
} );


router.post( '/submitquestion', async ( req, res ) => {

    const { questions, question_id, optionA, optionB, optionC, optionD, answer } = req.body;

    const question = new QuestionData( { questions, optionA, optionB, optionC, optionD, answer } );


    const data = question.save().then( () => {
        console.log( data );
        res.status( 201 ).send( "Success Questions Saved" )
    } ).catch( ( error ) => {
        console.log( error );
        res.status( 422 ).send( "Can Not Save" );
    } )
} )



module.exports = router;