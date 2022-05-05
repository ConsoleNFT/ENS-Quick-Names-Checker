/*
	
	This version of ENS names checker use MYSQL to store checked names:
	1. Install WAMP, XAMPP or any other software to run MYSQL on your machine
	2. Create database "ens_bot"
	3. Create table "ens_words" with rows "id" (BIGINT, autoincrement, primary) and "ens" (TEXT)
	4. Place your wordlist into wordlist.txt, line by line
	5. Get your Infura URL and place it into line 24
	6. Run the script with "node index_mysql.js"
	7. Free, unregistered domains will be saved into SQL table for you. You can export them as CSV or any other format from phpmyadmin or adminer
	
*/

const mysql = require('mysql-await'); // mysql-await async

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'ens_bot'
});

const Web3 = require("web3");

const provider_web3 = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/<your_infura_id>");
var web3 = new Web3(provider_web3);

const keccak256 = require('keccak256');

var ensABI = require("./abis/ens.json");
var ensContract = new web3.eth.Contract(ensABI, "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85");

async function main() {
	
	const { promises: fs } = require("fs");
	
	try {
        let file = await fs.readFile("wordlist.txt", "utf-8");
		
		const lines = file.split(/\r?\n/);
		
		for (let line of lines) {
			
			var _line = line.toLowerCase();
			
			var address0x = "0x" + keccak256(_line).toString('hex');
		
			var expirationDate = await ensContract.methods.nameExpires(address0x).call().then( function(result) {
				
				return result;
				
								
			}, function(error) {
						
				console.log(error);
				
			});
			
			if (expirationDate != 0) {
				
				console.log("Checked : " + _line);
				
			}
			else {
				
				console.log("Not registered : " + _line);
				
				var sql = "INSERT INTO ens_words (ens) VALUES ('" + _line + "')";
				
				connection.query(sql);
				
			}
		
		}
		
    } catch (e) {
        console.log("e", e);
    }
	
	connection.end();
	
	return;

}

main()
.then(() => process.exit(0))
.catch((error) => {
	console.error(error);
	process.exit(1);
});