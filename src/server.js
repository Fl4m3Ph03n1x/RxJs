const net = require( "net" );
const Rx = require( "rxjs/Rx" );
const bufferToArray = require( "./lib/utils.js" ).bufferToArray;

const server = ( { decoder, crossbar }, config ) => {

    let readerSocket, subscription;
    const host = config.crossbar.url;

    const start = () =>
        connecToReader( config.reader )
            .then( setupObs );

    const connecToReader = connectOpts => new Promise( ( resolve, reject ) => {
        readerSocket = net.createConnection( connectOpts, () => {
            resolve( readerSocket );
        } );
        readerSocket.once( "error", reject );
    } );

    const setupObs = socket => {
        const source = Rx.Observable.fromEvent( socket, "data" )
            .map( bufferToArray );

        const observer = {
            next: barCode =>
                crossbar.publish( host, `${config.name}.onRead`, barCode )
                    .then( () => console.log( `Published: ${barCode}` ) )
                    .catch( console.error ),
            error: error => console.error( error )
        };

        subscription = decoder( source ).subscribe( observer );
    };

    const stop = () =>
        crossbar.cleanup()
            .then( () => readerSocket.destroy() )
            .then( () => subscription.unsubscribe() );

    return Object.freeze( {
        start,
        stop
    } );
};

module.exports.server = server;
module.exports.serverFactory = config => {
    return server( {
        crossbar: require( "crossbar-connman" )(),
        decoder: require( "./decoder.js" )
    }, config );
};
