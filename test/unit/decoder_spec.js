const chai = require( "chai" );
chai.use( require( "sinon-chai" ) );
const expect = chai.expect;

const decodeEAN13 = require( "../../src/decoder.js" );
const Rx = require( "rxjs/Rx" );
const sinon = require( "sinon" );

describe( "decoder", () => {

    it( "should correcttly decode a correct and complete BarCode", () => {
        const data = [ [ 2, 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10, 3 ] ];
        const expected = "SDZRjrzb2b\r\n";

        const onNextSpy = sinon.spy();
        const source = Rx.Observable.from( data );

        decodeEAN13( source ).subscribe( onNextSpy );
        expect( onNextSpy ).to.be.calledWith( expected );
    } );

    it( "should decode one BarCode after another", () => {
        const data = [
            [ 2, 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10, 3 ],
            [ 2, 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10, 3 ]
        ];
        const expected = "SDZRjrzb2b\r\n";

        const onNextSpy = sinon.spy();
        const source = Rx.Observable.from( data );

        decodeEAN13( source ).subscribe( onNextSpy );
        expect( onNextSpy ).to.be.calledTwice;
        expect( onNextSpy ).to.be.calledWith( expected );
    } );

    it( "should decode one BarCode that is recived in multiple buffers", () => {
        const data = [
            [ 2, 83, 68, 90, 82 ],
            [ 106, 114, 122, 98, 50, 98, 13, 10, 3 ]
        ];
        const expected = "SDZRjrzb2b\r\n";

        const onNextSpy = sinon.spy();
        const source = Rx.Observable.from( data );

        decodeEAN13( source ).subscribe( onNextSpy );
        expect( onNextSpy ).to.be.calledOnce;
        expect( onNextSpy ).to.be.calledWith( expected );
    } );

    it( "should fail when receiving a BarCode that starts incorrectly", () => {
        const data = [ [ 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10, 3 ] ];

        const errorSpy = sinon.spy();
        const source = Rx.Observable.from( data );

        decodeEAN13( source )
            .subscribe( undefined, errorSpy );
        expect( errorSpy ).to.be.called;
    } );

    it( "should not emit event if it receives an incomplete code", () => {
        const data = [ [ 2, 83, 68, 90, 82, 106, 114, 122, 98, 50, 98, 13, 10 ] ];

        const onNextSpy = sinon.spy();
        const source = Rx.Observable.from( data );

        decodeEAN13( source )
            .subscribe( onNextSpy );
        expect( onNextSpy ).to.not.be.called;
    } );

} );
