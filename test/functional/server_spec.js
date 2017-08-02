//https://www.hacksparrow.com/tcp-socket-programming-in-node-js.html

const expect = require( "chai" ).expect;
const net = require( "net" );
const sinon = require( "sinon" );

const connman = require( "crossbar-connman" );
const server = require( "../../src/server.js" ).server;

describe( "server", () => {

    const MAX_TIMEOUT = 50,
        CONFIG = {
            "reader": {
                "host": "localhost",
                "port": 4002
            },
            "crossbar": {
                "url": "ws://localhost:8080/ws"
            },
            "name": "barcodeReader1"
        };

    const dummyReader = {
        server: undefined,
        socket: undefined
    };
    const onRead = sinon.stub();
    const client = connman();
    let myServer;

    before( "Sets up dummyReader, server and client", done => {
        setUpReader( CONFIG.reader )
            .then( () => setUpServer( CONFIG ) )
            .then( () =>
                client.subscribe( CONFIG.crossbar.url, `${CONFIG.name}.onRead`, onRead )
            )
            .then( done )
            .catch( done );
    } );

    const setUpReader = connectOpts => new Promise( resolve => {
        dummyReader.server = net.createServer( undefined, socket => dummyReader.socket = socket );

        dummyReader.server.listen(
            connectOpts.port,
            connectOpts.host,
            undefined,
            resolve
        );
    } );

    const setUpServer = connectOpts => {
        myServer = server( {
            decoder: require( "../../src/decoder.js" ),
            crossbar: connman()
        }, connectOpts );
        return myServer.start();
    };

    after( "Kills dummyReader, server and client", done => {
        myServer.stop()
            .then( () => dummyReader.server.close() )
            .then( client.cleanup )
            .then( done )
            .catch( done );
    } );

    beforeEach( "Resetting stubs", () => {
        onRead.reset();
    } );

    it( "should connect to dummyReader", done => {
        dummyReader.server.getConnections( ( err, count ) => {
            expect( err ).to.be.null;
            expect( count ).to.eql( 1 );
            done();
        } );
    } );

    it( "should call 'onRead' when finishing a code with the code translated", done => {

        const dataBuffer = Buffer.from( [ 2, 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10, 3 ] );
        const result = "SDZRjrzb2b\r\n";

        onRead.callsFake( ( id, message ) => {
            try {
                expect( id ).to.eql( CONFIG.name );
                expect( message ).to.eql( result );
                done();
            } catch ( error ) {
                done( error );
            }
        } );

        dummyReader.socket.write( dataBuffer );
    } );

    it( "should log error message if decoding fails", done => {
        const dataBuffer = Buffer.from( [ 90, 82, 106, 114, 122, 98, 50, 98 ] );
        dummyReader.socket.write( dataBuffer );
        const errorSpy = sinon.stub( console, "error" );

        setTimeout( () => {
            expect( errorSpy.called ).to.be.true;
            done();
        }, 10 );
    } );

    it( "should not call 'onRead' if a code sequence is incomplete", done => {
        setTimeout( () => {
            expect( onRead.called ).to.be.false;
            done();
        }, MAX_TIMEOUT );

        dummyReader.socket.write( Buffer.from( [ 2, 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10 ] ) );
    } );
} );
