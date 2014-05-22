var cssFile, fs = require( 'fs' ),
    readline = require( 'readline' ),
    properties = [],
    dupes = [],
    devNull,
    inside = false,
    totalRuleCount = 0,
    verbosity, arg,
    filedata, lines, cssSelector, thresholdPercent = 0;

function usage() {
    console.log( "Usage: node wetness.js -f /path/to/file.css" );
    console.log( "\tor" );
    console.log( "Usage: node wetness.js -f /path/to/file.css -v" );
}

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

if ( !cssFile ) {
    usage();
    return;
}

if ( !fs.statSync( cssFile ).isFile() ) {
    console.log( "Error: Supplied CSS file does not exist: " + cssFile + "." );
    return;
}

function strip( str ) {
    return str.replace( /^ */g, '' ).replace( / *$/g, '' ).replace( /;/, '' );
}

filedata = fs.createReadStream( cssFile );
devNull = fs.createWriteStream( '/dev/null' );

lines = readline.createInterface( {
    input: filedata,
    output: devNull
} );

function trim( instr ) {
    return instr.replace( /^[\s|\t]*/g, '' ).replace( /[\s|\t]*$/g, '' );
}

lines.on( 'line', function ( cmd ) {
    var property, value, linex, o, rn;
    if ( cmd && cmd.match( /\{/ ) && !cmd.match( /\// ) ) {
        inside = true;
        rn = cmd.substring( 0, cmd.indexOf( "{" ) );
        if ( rn.replace( /[\s|\t]*/g, '' ) !== '' ) {
            cssSelector = trim( rn );
        }
    } else if ( cmd && cmd.match( /\}/ ) && !cmd.match( /\// ) ) {
        inside = false;
    } else if ( inside && cmd.match( /\:/ ) ) {

        property = cmd.substring( 0, cmd.indexOf( ":" ) );
        property = strip( property );
        value = cmd.substring( cmd.indexOf( ":" ) );
        value = strip( value );

        linex = property + ":" + value + ";";

        o = {
            'name': [ cssSelector ],
            'value': linex,
            'count': 1
        };

        if ( properties[ linex ] ) {
            o = properties[ linex ];
            o.count++;
            o.name.push( cssSelector );
            properties[ linex ] = o;
            dupes[ linex ] = properties[ linex ];
        } else {
            properties[ linex ] = o;
        }
        totalRuleCount++;
    } else if ( !inside && cmd.replace( /[\s|\t]*/g, '' ) !== '' ) {
        cssSelector = trim( cmd );
    }
} );

lines.on( 'close', function ( cmd ) {
    var i, ct = 0,
        dup = 0,
        pct;
    for ( i in dupes ) {
        if ( verbosity ) {
            console.log( JSON.stringify( dupes[ i ] ) );
        }
        ct++;
        dup += dupes[ i ].count;
    }
    pct = ct / totalRuleCount * 100;
    if ( pct >= thresholdPercent ) {
        console.log( "File: " + cssFile );
        console.log( "Duplicate rule count: " + ct );
        console.log( "Total rule count: " + totalRuleCount );
        console.log( "Percentage duplication: " + Number( pct ).toFixed( 2 ) + "%" );
    }
} );