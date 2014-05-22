wetness.js
=======

`wetness.js` is a node port of the `wetness` bash script
'wetness.js` script checks a CSS file for duplicate properties.
Just like [Ellie Kemper][BJ], the aim of this script is to help make it DRY.
This fork adds a few things in to the original wetness script: 1) verbosity
so you can get just rough numbers of duplicates or the actual duplicates; 
2) you can see what rules have the duplicate properties

This script utilizes associative arrays in `bash` which requires version 4 or
better. OSX is still shipping with version 3.2 but you can easily upgrade to
4.2 with `brew install bash`.

  [BJ]: http://www.collegehumor.com/video/1183463/derrick-comedy-blowjob

## Usage

	node wetness.js /path/to/file.css

        or

	node wetness.js /path/to/file.css -v

## Installation

    install node for your platform
