'use strict';

document.addEventListener('DOMContentLoaded', ()=> {
	let resultArray         = [],
		positionsArray      = [],
		splitedPlayerInfo   = [],
		playerInfo          = document.getElementById('searchAction');

	// Check status of response
	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response;
		}
		let error = new Error(response.statusText);
		error.response = response;
		throw error;
	}

	//Parse response
	function parseJSON(response) {
		return response.json();
	}

	// Make dynamically list of players
	function dynamicList(array) {
		// Create the list element:
		let list = document.createElement('ul');
		for (let i = 0; i < array.length; i++) {
			// Create the list item:
			let item = document.createElement('li');
			item.classList.add('name-style');
			// Set its contents:
			item.appendChild(document.createTextNode(array[i]));
			// Add it to the list:
			list.appendChild(item);
		}
		// Finally, return the constructed list:
		return list;
	}

	//Searching players by their "position" and "name"
	function search(serverResponse) {
		serverResponse.forEach(item=> {
			if (playerInfo.value === item.position) {
				// `Cause "position" may consist of two o more worlds
				positionsArray = item.position.split(' ');
				// Divide each word from "position" into array element
				splitedPlayerInfo = playerInfo.value.split(' ');
				// If "position" consist of more than one word
				if (positionsArray.length > 1) {
					for (let elem = 0; elem <= splitedPlayerInfo.length; elem++) {
						if ((splitedPlayerInfo[elem] === positionsArray[elem]) && (splitedPlayerInfo[elem + 1] === positionsArray[elem + 1])) {
							resultArray.push(item.name);
							break;
						}
					}
				}
				// If "position" consist of one word
				else if (positionsArray.length == 1) {
					if (splitedPlayerInfo[0] === positionsArray[0]) {
						resultArray.push(item.name);
					}
				}
			}
			// Get players name by "position" and "nationality"
			else if (playerInfo.value === item.position + ' ' + item.nationality) {
				resultArray.push(item.name);
			}
			else if (playerInfo.value === item.nationality + ' ' + item.position) {
				resultArray.push(item.name);
			}
			// Get players name by "nationality"
			else if (playerInfo.value === item.nationality) {
				resultArray.push(item.name);
			}
			// Just get player`s name
			else if (playerInfo.value === item.name) {
				resultArray.push(item.name);
			}
		});
	}

	fetch('players.json', {
		method: 'GET',
		credentials: 'same-origin' // CORS-mode
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(response => {
			document.getElementById('searchForm').addEventListener('submit', event => {
				search(response);
				event.preventDefault();
				dynamicList(resultArray);
				// Add the contents of resultArray
				document.getElementById('playersList').appendChild(dynamicList(resultArray));
				resultArray = [];
			});
		});

});
