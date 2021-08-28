const mongoose = require( 'mongoose' );

const DB = process.env.DATABASE;


mongoose.connect( DB, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
} ).then( () => {
    console.log( "Connected to DB" )
} ).catch( ( err ) => {
    console.log( "Error connecting to.... DB" )
} )