const connectOpts = require( "./conf.json" );
const myServer = require( "./src/server.js" ).serverFactory( connectOpts );

myServer.start()
    .then( () => console.log( "Server listening" ) )
    .catch( err => console.log( `Got error: ${err}` ) );
