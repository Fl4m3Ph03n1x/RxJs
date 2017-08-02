const chai = require( "chai" );
const expect = chai.expect;
const serverFactory = require( "../../src/server.js" ).serverFactory;

describe( "serverFactory", () => {
    const CONFIG = {
        "reader": {
            "host": "localhost",
            "port": 4002
        },
        "crossbar": {
            "url": "ws://localhost:8080/ws"
        },
        "name": "barcodeReader1"
    };

    it( "should return a server", () => {
        const server = serverFactory( CONFIG );
        expect( server ).to.have.property( "start" );
        expect( server ).to.have.property( "stop" );
    } );
} );
