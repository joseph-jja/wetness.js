wetness.js
=======

`wetness.js` is a node port of the `wetness` bash script
'wetness.js` script checks a CSS file for duplicate properties.
Just like [Ellie Kemper][BJ], the aim of this script is to help make it DRY.
This fork adds a few things in to the original wetness script: 1) verbosity
so you can get just rough numbers of duplicates or the actual duplicates; 
2) you can see what rules have the duplicate properties

## Usage

	node wetness.js /path/to/file.css

        or

	node wetness.js /path/to/file.css -v

## Installation

    install node for your platform
