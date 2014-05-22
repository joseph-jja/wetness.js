var cssFile, fs = require( 'fs' ),
    readline = require( 'readline' ),
    properties = [],
    dupes = [],
    devNull,
    inside = false,
    filedata, lines;

cssFile = process.argv[ 2 ];

if ( !cssFile ) {
    console.log( "Usage: node wetness.js /path/to/file.css" );
    return;
}

if ( !fs.statSync( cssFile ).isFile() ) {
    console.log( "Error: Supplied CSS file does not exist." );
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

lines.on( 'line', function ( cmd ) {
    var property, value, linex;
    if ( cmd && cmd.match( /\{/ ) && !cmd.match( /\// ) ) {
        inside = true;
    } else if ( cmd && cmd.match( /\}/ ) && !cmd.match( /\// ) ) {
        inside = false;
    } else if ( inside && cmd.match( /\:/ ) ) {

        property = cmd.split( ":" )[ 0 ];
        property = strip( property );
        value = cmd.split( ":" )[ 1 ];
        value = strip( value );

        linex = property + ":" + value + ";";

        if ( properties[ linex ] ) {
            properties[ linex ]++;
            dupes[ linex ] = properties[ linex ];
            console.log( dupes[ linex ] );
        } else {
            properties[ linex ] = 1;
        }
    }
} );

lines.on( 'close', function ( cmd ) {
    var i;
    for ( i in dupes ) {
        console.log( i + " " + dupes[ i ] );
    }
} );