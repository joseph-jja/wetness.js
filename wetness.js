var cssFile, fs = require('fs'),
    readline = require('readline'),
    properties = [],
    dupes = [],
    devNull,
    inside = false,
    filedata, lines, rulename;

cssFile = process.argv[2];

if (!cssFile) {
    console.log("Usage: node wetness.js /path/to/file.css");
    return;
}

if (!fs.statSync(cssFile).isFile()) {
    console.log("Error: Supplied CSS file does not exist.");
    return;
}

function strip(str) {
    return str.replace(/^ */g, '').replace(/ *$/g, '').replace(/;/, '');
}

filedata = fs.createReadStream(cssFile);
devNull = fs.createWriteStream('/dev/null');

lines = readline.createInterface({
    input: filedata,
    output: devNull
});

function trim(instr) {
    return instr.replace(/^[\s|\t]*/g, '').replace(/[\s|\t]*$/g, '');
}

lines.on('line', function(cmd) {
    var property, value, linex, o, rn;
    if (cmd && cmd.match(/\{/) && !cmd.match(/\//)) {
        inside = true;
        rn = cmd.substring(0, cmd.indexOf("{"));
        console.log('rn ' + rn);
        if (rn.replace(/[\s|\t]*/g, '') !== '') {
            rulename = trim(rn);
        }
    } else if (cmd && cmd.match(/\}/) && !cmd.match(/\//)) {
        inside = false;
    } else if (inside && cmd.match(/\:/)) {

        property = cmd.split(":")[0];
        property = strip(property);
        value = cmd.split(":")[1];
        value = strip(value);

        linex = property + ":" + value + ";";

        o = {
            'name': [rulename],
            'value': linex,
            'count': 1
        };

        if (properties[linex]) {
            o = properties[linex];
            o.count++;
            o.name.push(rulename);
            properties[linex] = o;
            dupes[linex] = properties[linex];
        } else {
            properties[linex] = o;
        }
    } else if (!inside && cmd.replace(/[\s|\t]*/g, '') !== '') {
        rulename = trim(cmd);
    }
});

lines.on('close', function(cmd) {
    var i;
    for (i in dupes) {
        console.log(i + " " + JSON.stringify(dupes[i]));
    }
});