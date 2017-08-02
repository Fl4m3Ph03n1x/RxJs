const bufferToArray = buffer => {
    const results = [];
    for ( const byte of buffer )
        results.push( byte );
    return results;
};

module.exports.bufferToArray = bufferToArray;
