// Necessary for websocket communication with the server.
var stompClient = null;

// To relieve some load from the server, we retain a copy of this client's id
// and filter it out on this end. This must be unique or we may wrongly ignore
// another user's information.
var myId = null;

// An array of identifiers for all users connected to the service.
var ids = new Array();

// Modified version of the code available at this address:
// http://www.storiesinflight.com/html5/audio.html
// Updated: October 31, 2010
// Implementation of Rotating Audio Channels
// If a request is made for an audio element to play a file while
// already playing one, the request will be dropped.
// This array contains channel_max audio channels and the earliest
// 'free' channel is used to handle a sound request.
var audio_channel_max = 5;
var audiochannels = new Array();

// A holder for the x,y coordinates of this user's cursor so it can be relayed
// to the server every so often
var mousePos;

// How many milliseconds between each cursor location send.
var mouseDelay = 200;
// How many milliseconds between each cleanup of dead drumsticks.
var cleanupDelay = 10000;

// Change the UI to better represent the options available to a
// connected/disconnected user.
function setConnected(connected) {

	// Hide the enterUsername field once a connection is established.
	// Changes wouldn't make a difference from this point on.
	document.getElementById('enterUsername').style.visibility = connected ? 'hidden'
			: 'visible';

	// Show the list of connected users so the user can see who's online.
	document.getElementById('connectedUsers').style.visibility = connected ? 'visible'
			: 'hidden';

	// A connected user can't connect if they're already connected!
	document.getElementById('connect').disabled = connected;

	// A disconnected user can't connect if they're already disconnected!
	document.getElementById('disconnect').disabled = !connected;

	// If we're connected, show the drumkit so the user can play!
	document.getElementById('drumkit').style.visibility = connected ? 'visible'
			: 'hidden';
}

// This function is fired when the user tries to connect via a websocket to the
// application.
// TODO: This step should be automated with information from facebook.
// function connect(facebookId) {
function connect() {

	// TODO: Make this element less of a nightmare to use by emptying it of the
	// hint
	// when clicked.
	// TODO: Check for validity both here and on the serverside, even if
	// facebook is supplying the info.
	if (document.getElementById('enterUsername').value === "") {
		alert('Please enter a username before connecting');
	} else {

		// TODO: As above, get this from another source.
		myId = document.getElementById('enterUsername').value;

		// Create a socket which looks for the 'hit' endpoint.
		var socket = new SockJS('./hit');

		// Prepare for full Stomp communication.
		stompClient = Stomp.over(socket);

		// Make the connection!
		stompClient.connect({}, function(frame) {

			// Let the user know we're connected!
			setConnected(true);

			// Register for hitreports so the user can hear other users playing
			// and join in!
			stompClient.subscribe('/topic/hitreports', function(drumhit) {
				play(JSON.parse(drumhit.body).name);
			});

			// Subscribe for changes in the room's users so new users can join
			// in
			// and old users don't fill up the room with artifacts.
			stompClient.subscribe('/topic/allusers', function(allUsers) {
				refreshUsers(JSON.parse(allUsers.body));
			});

			// TODO: Replace 'myId' with Facebook details
			// TODO: Maybe we just need to send the ID and the server can pick
			// up everything else.
			// Let the Server know I've joined!
			stompClient.send('/app/newuser', {}, JSON.stringify({
				'id' : myId,
				'firstName' : myId,
				'lastName' : myId
			}));

			// Subscribe for updates on the cursor positions of other users.
			stompClient.subscribe('/topic/motion', function(cursorPositions) {
				moveDrumsticks(JSON.parse(cursorPositions.body));
			});

			// Listen for mouse movements
			window.onmousemove = handleMouseMove;
			// Fire off your location 5 times per second
			// Increase this time for better performance
			setInterval(sendMousePosition, mouseDelay);

			// Clear dead users every 10 seconds.
			setInterval(cleanDeadDrumsticks, cleanupDelay);

		});
	}

}

// This is fired when the user hits 'Disconnect'
// This would be preferable everytime but the user is likely to hit 'back' or
// 'close' too
function disconnect() {

	// TODO Rather than sending a message, it would be much better to react to
	// disconnections on the serverside...
	stompClient.send('/app/finished', {}, JSON.stringify({
		'id' : myId,
		'firstName' : null,
		'lastName' : null
	}));

	// Cleanly disconnect and inform the user.
	stompClient.disconnect();
	setConnected(false);
}

// Lets the server know that the bass drum has been hit!
function hitBass() {
	stompClient.send("/app/hit", {}, JSON.stringify({
		'name' : 'bass'
	}));
}

//Lets the server know that the tomtom has been hit!
function hitTomTom() {
	stompClient.send("/app/hit", {}, JSON.stringify({
		'name' : 'tomtom'
	}));
}

//Lets the server know that the snare has been hit!
function hitSnare() {
	stompClient.send("/app/hit", {}, JSON.stringify({
		'name' : 'snare'
	}));
}

// Play a sound!
function play(message) {
	
	// This will (must) be the id of the appropriate <audio /> element 
	var audio = message + 'sound';

	// Modified version of the code available at this address:
	// http://www.storiesinflight.com/html5/audio.html
	// Updated: October 31, 2010
	// Implementation of Rotating Audio Channels
	// Searches audiochannels for a free channel to play the
	// drum sound.
	for (var a = 0; a < audio_channel_max; a++) {
		var thistime = new Date();

		if (audiochannels[a]['finished'] < thistime.getTime()) {
			audiochannels[a]['finished'] = thistime.getTime()
					+ document.getElementById(audio).duration * 1000;
			audiochannels[a]['channel'].src = document.getElementById(audio).src;
			audiochannels[a]['channel'].load();
			audiochannels[a]['channel'].play();
			break;
		}

	}

}

// Called whenever a user joins or leaves.
function refreshUsers(users) {
	
	// TODO: Do something better with the list of connected users than just print them.
	// TODO: Move this into the loop so this client's name is not displayed.
	document.getElementById('connectedUsers').innerHTML = users;
	
	// Get the array of drumsticks. One is needed to track each user's mouse movements.
	var drumsticks = document.getElementById('drumsticks').childNodes;

	// Get all the ids provided
	var allIds = users.split(",");
	
	// Clear the ids array - we have more recent information.
	// TODO: Is there a cheaper clear() that can be used?
	ids = new Array();

	// For all users
	for (var i = 0; i < allIds.length; i++) {
		
		// Filter out my own username and the empty value at the end
		if (allIds[i] != myId && allIds[i] != "") {
			
			// Add it to the array of connected users!
			ids.push(allIds[i]);
			
			// Ensure this id has a drumstick, else create one
			var noDrumstick = true;

			for (var j = 0; j < drumsticks.length; j++) {
				// If we can find a drumstick for this user, we're done
				if (drumsticks[j].getAttribute("id") == allIds[i]) {
					noDrumstick = false;
					break;
				}
			}

			if (noDrumstick) {

				// Create a new image
				var newChild = document.createElement("img");
				// Make it display the correct image
				newChild
						.setAttribute("src",
								"${pageContext.request.contextPath}/resources/images/drumstick.png");
				// Give it the appropriate id so it can be found by other methods
				newChild.setAttribute("id", allIds[i]);
				
				// TODO: Find a better way of scaling down
				newChild.setAttribute("width", "80");
				newChild.setAttribute("width", "50");
				
				// Needed for positions to work
				newChild.setAttribute("style", "position:absolute;");

				document.getElementById('drumsticks').appendChild(newChild);
			}

		}

	}

}


// This method is NOT responsible for creating/removing drumsticks.
function moveDrumsticks(positions) {

	var iMax = positions.length;
	var drumsticks = document.getElementById('drumsticks').childNodes;
	var jMax = drumsticks.length;

	// For every user
	for (var i = 0; i < iMax; i++) {

		var currentId = positions[i].id;

		// Filter out my own id.
		if (currentId == myId) {
			continue;
		}

		// Find their drumstick
		for (var j = 0; j < jMax; j++) {

			// If we've landed on the right drumstick
			if (drumsticks[j].getAttribute("id") == currentId) {

				// TODO: Make movement smooth
				// $("#" + drumsticks[j].getAttribute("id")).animate({
				// left : "'" + positions[i].x + "px'",
				// top : "'" + positions[i].y + "px'"
				// });
				drumsticks[j].style.left = positions[i].x + 'px';
				drumsticks[j].style.top = positions[i].y + 'px';

				// Change its position then break to the next id.
				break;
			}

		}

	}

}

function handleMouseMove(event) {
	event = event || window.event; // IE
	
	// TODO: Consider nullifying mousePos if it hasn't changed
	// so sendMousePosition() won't send an update
	// if (mousePos.x == event.clientX && mousePos.y == event.clientY) {
	// 	  mousePos = null;
	// } else {
	
	// Update mousePos
	mousePos = {
		y : event.clientY,
		x : event.clientX
	};
	
	// }
}

// Fire off this client's mouse location to the server
function sendMousePosition() {
	if (mousePos) {
		stompClient.send('/app/motion', {}, JSON.stringify({
			'id' : myId,
			'x' : mousePos.x,
			'y' : mousePos.y
		}));
	}
}

// Every now and then, delete the drumsticks belonging to disconnected users
// both to remove clutter and free up resources.
function cleanDeadDrumsticks() {

	var drumsticks = document.getElementById('drumsticks').childNodes;

	// For every drumstick image
	for (var i = 0; i < drumsticks.length; i++) {

		var drumstickMatchesDeadConnection = true;

		for (var j = 0; j < ids.length; j++) {

			// if we find a live user for this drumstick, we're done.
			if (drumsticks[i].getAttribute("id") == ids[j]) {
				drumstickMatchesDeadConnection = false;
				break;
			}

		}
		
		// If this is still true, delete the node!
		if (drumstickMatchesDeadConnection) {
			document.getElementById('drumsticks').removeChild(drumsticks[i]);
			// TODO: I'm not sure we need to step back.
			//i--;
		}

	}

}

// Stuff to do as soon as everything has loaded
function initialize() {

	// Make sure the user is not initially connected
	setConnected(false);

	// Modified version of the code available at this address:
	// http://www.storiesinflight.com/html5/audio.html
	// Updated: October 31, 2010
	// Implementation of Rotating Audio Channels
	// If a request is made for an audio element to play a file while
	// already playing one, the request will be dropped.
	// This array contains channel_max audio channels and the earliest
	// 'free' channel is used to handle a sound request.
	for (var a = 0; a < audio_channel_max; a++) {
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();
		audiochannels[a]['finished'] = -1;
	}
}