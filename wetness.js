var cssFile,
    thresholdPercent = 0,
    verbosity,
    files,
    fileProcessor = require( "./libs/FileProcessor" ),
    fileList, rc, x;

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
        case '-l':
            arg++;
            fileList = process.argv[ arg ];
            break;
        default:
            console.log( process.argv[ arg ] );
            usage();
            break;
        }
    }
} )();

fileProcessor.verbosity = verbosity;
fileProcessor.thresholdPercent = thresholdPercent;

if ( !cssFile && !fileList ) {
    usage();
    return;
}

if ( cssFile ) {
    rc = fileProcessor.init( cssFile );
    if ( rc === fileProcessor.StatusCodes.EMPTY_FILE ) {
        usage();
        return;
    } else if ( rc === fileProcessor.StatusCodes.NON_EXISTANT_FILE ) {
        console.log( "Error: Supplied CSS file does not exist: " + cssFile + "." );
        return;
    }

    fileProcessor.processFile( cssFile );
} else if ( fileList ) {
    files = fileList.split( "," );
    for ( x = 0; x < files.length; x++ ) {
        rc = fileProcessor.init( files[ x ] );
        if ( rc === fileProcessor.StatusCodes.EMPTY_FILE ) {
            console.log( "Error: empty name: " + files[ x ] + "." );
        } else if ( rc === fileProcessor.StatusCodes.NON_EXISTANT_FILE ) {
            console.log( "Error: Supplied CSS file does not exist: " + files[ x ] + "." );
        } else if ( rc === fileProcessor.StatusCodes.OK ) {
            fileProcessor.processFile( files[ x ] );
        }
    }
}