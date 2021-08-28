const dotenv = require( 'dotenv' );
dotenv.config( { path: './config.env' } )
const cors = require( 'cors' )
const express = require( 'express' );

const app = express();
app.use( cors() );
app.use( express.json() );

app.use( require( "./router/auth.js" ) );

const StudentData = require( "./models/studentSchema" )
const FacultyData = require( "./models/facultySchema" )
//Define the sever PORT
const PORT = process.env.PORT

//DB connection 
require( './db/connDB' )

// app.use( ( require( './router/auth.js' ) ) )


app.get( '/', ( req, res ) => {
    res.send( "Hello This is HomePage  page " )
} )

app.listen( PORT, () => {
    console.log( `Server is running ..PORT ${ PORT }` )
} )