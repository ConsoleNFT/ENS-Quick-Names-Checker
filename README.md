# ENS Quick Names Checker

This simple script reads wordlist line by line from file and checks for free domains. Those are put either in other, separate file or into MYSQL database for you.

## Installation

Use npm to install the dependencies

```javascript
npm install
```

If you wish to use MYSQL version of this script, install WAMP, XAMPP or any other software for handling SQL connection.

Read instructions written in index files to proceed. You basicly need to set up infura endpoint and thats it.

## Usage

1. Place your wordlist into `wordlist.txt` file
2. If you wish to use MYSQL version, read instructions in `index_mysql.js` file, if not proceed to next step
2. Run `node index.js` or `node index_mysql.js` depending on the version of the script you want to use
