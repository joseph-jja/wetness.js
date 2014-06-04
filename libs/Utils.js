// simple string trim function
function trim( instr ) {
    return instr.replace( /^[\s|\t]*/g, '' ).replace( /[\s|\t]*$/g, '' );
}

function strip( str ) {
    return trim( str ).replace( /;/, '' );
}

module.exports = {
    trim: trim,
    strip: strip
};