var fs = require( 'fs' ),
    readline = require( 'readline' ),
    statusCodes = {
        "OK": 0,
        "EMPTY_FILE": 1,
        "NON_EXISTANT_FILE": 2
    },
    utils = require( "./Utils" ),
    verbosity = false,
    thresholdPercent = 0,
    counter = {
        totalRuleCount: 0,
        properties: [],
        dupes: [],
        cssFile: ''
    };

function init( cssFile ) {
    var rc = statusCodes.OK;

    if ( !cssFile ) {
        rc = statusCodes.EMPTY_FILE;
    }

    if ( rc === statusCodes.OK && !fs.statSync( cssFile ).isFile() ) {
        rc = statusCodes.NON_EXISTANT_FILE;
    }

    if ( rc === statusCodes.OK ) {
        counter.cssFile = cssFile;
    }

    return rc;
}

// update counters, the counters are globals
// global - properties
// global - totalRuleCount
// global - dupes
function updateCounters( props, selector ) {
    var property, value, linex, o;

    property = props.substring( 0, props.indexOf( ":" ) );
    property = utils.strip( property );
    value = props.substring( props.indexOf( ":" ) );
    value = utils.strip( value );

    linex = property + ":" + value + ";";

    o = {
        'name': [ selector ],
        'value': linex,
        'count': 1
    };

    if ( counter.properties[ linex ] ) {
        o = counter.properties[ linex ];
        o.count++;
        o.name.push( selector );
        counter.properties[ linex ] = o;
        counter.dupes[ linex ] = counter.properties[ linex ];
    } else {
        counter.properties[ linex ] = o;
    }
    counter.totalRuleCount++;
}

// default print
function printCounters() {
    var i, ct = 0,
        dup = 0,
        pct;
    for ( i in counter.dupes ) {
        if ( verbosity ) {
            console.log( JSON.stringify( counter.dupes[ i ] ) );
        }
        ct++;
        dup += counter.dupes[ i ].count;
    }
    pct = ct / counter.totalRuleCount * 100;
    if ( pct >= thresholdPercent ) {
        console.log( "File: " + counter.cssFile );
        console.log( "\tDuplicate rule count: " + ct );
        console.log( "\tTotal rule count: " + counter.totalRuleCount );
        console.log( "\tPercentage duplication: " + Number( pct ).toFixed( 2 ) + "%" );
    }
}

function processFile( cssFile, closeCallback ) {

    var filedata, devNull, lines, cssSelector, inside = false;

    filedata = fs.createReadStream( cssFile );
    devNull = fs.createWriteStream( '/dev/null' );

    lines = readline.createInterface( {
        input: filedata,
        output: devNull
    } );

    lines.on( 'line', function ( cmd ) {
        var property, value, linex, o, rn;
        if ( cmd && cmd.match( /\{/ ) && !cmd.match( /\// ) ) {
            inside = true;
            rn = cmd.substring( 0, cmd.indexOf( "{" ) );
            if ( utils.trim( rn ) !== '' ) {
                cssSelector = utils.trim( rn );
            }
        } else if ( cmd && cmd.match( /\}/ ) && !cmd.match( /\// ) ) {
            rn = cmd.substring( 0, cmd.indexOf( "}" ) );
            if ( utils.trim( rn ) !== '' ) {
                updateCounters( rn, cssSelector );
            }
            inside = false;
        } else if ( inside && cmd.match( /\:/ ) ) {
            updateCounters( cmd, cssSelector );
        } else if ( !inside && utils.trim( cmd ) !== '' ) {
            cssSelector = utils.trim( cmd );
        }
    } );

    lines.on( 'close', function ( cmd ) {

        if ( typeof closeCallback !== 'undefined' ) {
            closeCallback( counter );
        } else {
            // default
            printCounters();
        }
    } );
}

module.exports = {
    StatusCodes: statusCodes,
    verbosity: verbosity,
    thresholdPercent: thresholdPercent,
    init: init,
    processFile: processFile
};