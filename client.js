const crossbar = require( "crossbar-connman" )();

const config = require( "./conf.json" );
const HOST = config.crossbar.url;
const NAME = config.name;

crossbar.subscribe(HOST, `${NAME}.onRead`, console.log )
    .then( () => console.log( "subscribed to topic 'onRead'" ) )
    .catch( err => console.log( "failed to subscribed: " + err ) );
