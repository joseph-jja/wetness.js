var cssFile, fs = require( 'fs' ),
    readline = require( 'readline' ),
    properties = [],
    dupes = [],
    devNull,
    inside = false,
    totalRuleCount = 0,
    verbosity,
    filedata, lines,
    cssSelector, thresholdPercent = 0,
    utils = require( "./libs/Utils" ),
    fileProcessor = require( "./libs/FileProcessor" ),
    rc;

// function for the usage
function usage() {
    console.log( "Usage: node wetness.js -f /path/to/file.css" );
    console.log( "\tor" );
    console.log( "Usage: node wetness.js -f /path/to/file.css -v" );
}

// process the arguments
( function () {
    var arg;
    for ( arg = 2; arg < process.argv.length; arg++ ) {
        switch ( process.argv[ arg ] ) {
        case '-v':
            verbosity = process.argv[ arg ];
            break;
        case '-f':
            arg++;
            cssFile = process.argv[ arg ];
            break;
        case '-tp':
            arg++;
            thresholdPercent = process.argv[ arg ];
            break;
        default:
            console.log( process.argv[ arg ] );
            usage();
            break;
        }
    }
} )();

rc = fileProcessor.init( cssFile );
if ( rc === fileProcessor.StatusCodes.EMPTY_FILE ) {
    usage();
    return;
} else if ( rc === fileProcessor.StatusCodes.NON_EXISTANT_FILE ) {
    console.log( "Error: Supplied CSS file does not exist: " + cssFile + "." );
    return;
}

fileProcessor.processFile( cssFile );