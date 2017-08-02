const decodeEAN13 = source => {

    /**
     *  @private
     *  @desc       Byte that represents the start of a new barcode. All valid barcodes start
     *              with this byte. If they don't they are malformed.
     */
    const BARCODE_START = 2;

    /**
     *  @private
     *  @desc       Byte that represents the end of a new barcode. All valid barcodes end
     *              with this byte. If they don't they are malformed.
     */
    const BARCODE_END = 3;

    const toUTF8 = bytesArray => {
        return bytesArray
            .filter( byte => byte !== BARCODE_START && byte !== BARCODE_END )
            .map( byte => String.fromCharCode( byte ) )
            .join( "" );
    };

    return source
        .scan( ( acc, buffer ) => {

            /*
             * While decoding, if we receive a Buffer with a BARCODE_START in
             * the middle, we forget everything we were doing and start
             * decoding the new Buffer instead.
             */
            if ( buffer[ 0 ] === BARCODE_START )
                return buffer;

            if ( acc[ acc.length - 1 ] === BARCODE_END || acc.length === 0 )
                throw new Error( `Incorrect START sequence for code: ${buffer}` );

            return acc.concat( buffer );
        }, [] )
        .filter( buffer => buffer[ buffer.length - 1 ] === BARCODE_END )
        .map( toUTF8 );
};

module.exports = decodeEAN13;
