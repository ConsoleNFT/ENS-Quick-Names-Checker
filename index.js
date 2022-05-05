/*
	
	This version of ENS names checker reads from wordlist.txt file and puts free names into available_names.txt file:
	1. Place your wordlist into wordlist.txt, line by line
	2. Get your Infura URL and place it into line 13
	3. Run the script with "node index.js"
	4. Free, unregistered domains will be saved into available_names.txt file for you.
	
*/

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
				
				file = "available_names.txt";
				
				fs.appendFile(file, _line + "\n", function(err) {
					if(err) {
						return console.log(err);
					}
				});
				
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