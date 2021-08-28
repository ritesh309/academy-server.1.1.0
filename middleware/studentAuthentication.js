const jwt = require( 'jsonwebtoken' );
const StudentData = require( "../models/studentSchema" );

const studentAuthentication = async ( req, res, next ) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify( token, process.env.SECRET_KEY );
        const rootUser = await StudentData.findOne( { _id: verifyToken._id, "tokens:token": token } );
        if(!rootUser){
            res.status( 403 ).send({error: 'User not found'})
        }
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
    } catch ( error ) {
        res.status( 401 ).send( { error: "Unauthorized No token Provided" } );
        console.log( error );
    }
}

module.exports = studentAuthentication