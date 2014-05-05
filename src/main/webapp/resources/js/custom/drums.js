// Necessary for websocket communication with the server.
var stompClient;

// To relieve some load from the server, we retain a copy of this client's id
// and filter it out on this end. This must be unique or we may wrongly ignore
// another user's information.
var myId;

// An array of identifiers for all users connected to the service.
var users = new Array();

// A holder for the x,y coordinates of this user's cursor so it can be relayed
// to the server every so often
var mousePos = {
	x : 0,
	y : 0
};

// How many milliseconds between each cursor location send.
var mouseDelay = 30;
// How many milliseconds between each cleanup of dead drumsticks.
var cleanupDelay = 1000;

var cursorPositionRunner;
var deadCursorRunner;

var contextPath;

var drumstickPrefix = "drumstick";

var snare; // snare
var kick; // kick
var ftom; // ftom
var rtom; // rtom
var hatc; // hatc
var hato; // hato
var crash; // crash
var ride; // ride
var cuica1; // cuica
var cuica2; // cuica
var cuica3; // cuica
var cuica4; // cuica

var hitreportsSubscription;
var allusersSubscription;
var motionSubscription;

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
	document.getElementById('drumkit_div').style.visibility = connected ? 'visible'
			: 'hidden';
}

// This function is fired when the user tries to connect via a websocket to the
// application.
function connect() {

	// TODO: Make this element less of a nightmare to use by emptying it of the
	// hint when clicked.
	// TODO: Check for validity both here and on the serverside, even if
	// facebook is supplying the info.
	if (document.getElementById('enterUsername').value === "") {
		alert('Please enter a username before connecting');
	} else {

		if (stompClient != null) {
			stompClient.disconnect();
		}

		// TODO: As above, get this from another source.
		myId = document.getElementById('enterUsername').value;

		// Create a socket which looks for the 'hit' endpoint.
		var socket = new SockJS('./hit');

		socket.addEventListener('error', function() {
			disconnect();
			connect();
		});

		// Prepare for full Stomp communication.
		stompClient = Stomp.over(socket);

		stompClient.debug = function() {
		};

		// Make the connection!
		stompClient.connect({}, function(frame) {

			// Let the user know we're connected!
			setConnected(true);

			// Register for hitreports so the user can hear other users playing
			// and join in!
			hitreportsSubscription = stompClient.subscribe('/topic/hitreports',
					function(drumhit) {
						drumhit.ack();
						play(JSON.parse(drumhit.body).name);
					}, {
						'ack' : 'client'
					});

			// Subscribe for changes in the room's users so new users can join
			// in
			// and old users don't fill up the room with artifacts.
			allusersSubscription = stompClient.subscribe('/topic/allusers',
					function(allUsers) {
						allUsers.ack();
						refreshUsers(JSON.parse(allUsers.body));
					}, {
						'ack' : 'client'
					});

			// TODO: Replace 'myId' with Facebook details
			// TODO: Maybe we just need to send the ID and the server can pick
			// up everything else.
			// Let the Server know I've joined!
			stompClient.send('/app/newuser', {}, JSON.stringify({
				'id' : myId,
				'firstName' : myId,
				'lastName' : 'LastCustomName'
			}));

			// Subscribe for updates on the cursor positions of other users.
			motionSubscription = stompClient.subscribe('/topic/motion',
					function(cursorPositions) {
						cursorPositions.ack();
						moveDrumsticks(JSON.parse(cursorPositions.body));
					}, {
						'ack' : 'client'
					});

			// Fire off your location 5 times per second
			// Increase this time for better performance
			cursorPositionRunner = setInterval(sendMousePosition, mouseDelay);

			// Clear dead users every 10 seconds.
			deadCursorRunner = setInterval(cleanDeadDrumsticks, cleanupDelay);

		});
	}

}

// This is fired when the user hits 'Disconnect'
// This would be preferable everytime but the user is likely to hit 'back' or
// 'close' too
function disconnect() {

	clearInterval(cursorPositionRunner);
	clearInterval(deadCursorRunner);

	hitreportsSubscription.unsubscribe();
	allusersSubscription.unsubscribe();
	motionSubscription.unsubscribe();

	stompClient.send('/app/finished', {}, JSON.stringify({
		'id' : myId,
		'firstName' : null,
		'lastName' : null
	}));

	// Cleanly disconnect and inform the user.
	setConnected(false);
	// stompClient.disconnect();

}

function play(message) {

	switch (message) {
	case "hato":
		hato.play();
		hatc.stop();
		$("#effhato").css("opacity", 0.8);
		$("#effhato").stop().fadeTo("fast", 0);
		break;
	case "hatc":
		hatc.play();
		hato.stop();
		$("#effhatc").css("opacity", 0.6);
		$("#effhatc").stop().fadeTo("fast", 0);
		break;
	case "snare":
		snare.play();
		$("#effsnare").css("opacity", 0.8);
		$("#effsnare").stop().fadeTo("fast", 0);
		break;
	case "kick":
		kick.play();
		$("#effkick").css("opacity", 0.5);
		$("#effkick").stop().fadeTo("fast", 0);
		break;
	case "rtom":
		rtom.play();
		$("#effrtom").css("opacity", 0.8);
		$("#effrtom").stop().fadeTo("fast", 0);
		break;
	case "ftom":
		ftom.play();
		$("#effftom").css("opacity", 0.8);
		$("#effftom").stop().fadeTo("fast", 0);
		break;
	case "crash":
		crash.play();
		$("#effcrash").css("opacity", 0.8);
		$("#effcrash").stop().fadeTo("fast", 0);
		break;
	case "ride":
		ride.play();
		$("#effride").css("opacity", 0.8);
		$("#effride").stop().fadeTo("fast", 0);
		break;
	case "cuica1":
		cuica1.play();
		break;
	case "cuica2":
		cuica2.play();
		break;
	case "cuica3":
		cuica3.play();
		break;
	case "cuica4":
		cuica4.play();
		break;
	}
}

// Called whenever a user joins or leaves.
function refreshUsers(lastUsers) {

	// TODO: Do something better with the list of connected users than just
	// print them.
	// TODO: Move this into the loop so this client's name is not displayed.
	// document.getElementById('connectedUsers').innerHTML = users;

	// Get the array of drumsticks. One is needed to track each user's mouse
	// movements.
	var drumsticks = document.getElementById('drumsticks').childNodes;

	// Clear the ids array - we have more recent information.
	users = new Array();

	document.getElementById('connectedUsers').innerHTML = "";

	// For all users
	for (var i = 0; i < lastUsers.length; i++) {

		document.getElementById('connectedUsers').innerHTML += " "
				+ lastUsers[i].firstName;

		// Filter out my own username and the empty value at the end
		if (lastUsers[i].id != myId && lastUsers[i].id != "") {

			// Add it to the array of connected users!
			users.push(lastUsers[i]);

			// Ensure this id has a drumstick, else create one
			var noDrumstick = true;

			for (var j = 0; j < drumsticks.length; j++) {
				// If we can find a drumstick for this user, we're done
				if (drumsticks[j].getAttribute("id") === lastUsers[i].id) {
					noDrumstick = false;
					break;
				}
			}

			if (noDrumstick) {

				var newChild = document.createElement("div");

				// Give it the appropriate id so it can be found by other
				// methods
				newChild.setAttribute("id", drumstickPrefix + lastUsers[i].id);

				$("#" + drumstickPrefix + lastUsers[i].id).on('dragstart',
						function(event) {
							event.preventDefault();
						});

				newChild.setAttribute("class", "unselectable");

				// Needed for positions to work
				newChild.setAttribute("style",
						"position:absolute; pointer-events:none;");

				// Create a new image
				var newImage = document.createElement("img");

				// Make it display the correct image
				newImage.setAttribute("src", contextPath
						+ "/resources/images/drumstick.png");

				// TODO: Find a better way of scaling down
				newImage.setAttribute("width", "80");
				newImage.setAttribute("height", "50");

				var newName = document.createElement("p");
				newName.setAttribute("class", "cursornames");
				var newNameText = document
						.createTextNode(lastUsers[i].firstName);
				newName.appendChild(newNameText);

				newChild.appendChild(newImage);
				newChild.appendChild(newName);

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
			if (drumsticks[j].getAttribute("id") === drumstickPrefix
					+ currentId) {
				drumsticks[j].style.left = positions[i].x + 'px';
				drumsticks[j].style.top = positions[i].y + 'px';

				if (positions[i].x > $('#drumkit').position().left
						&& positions[i].y > $('#drumkit').position().top
						&& (positions[i].x < $('#drumkit').position().left
								+ $('#drumkit').width())
						&& (positions[i].y < $('#drumkit').position().top
								+ $('#drumkit').height())) {
					drumsticks[j].style.opacity = 1.0;
				} else {
					drumsticks[j].style.opacity = 0.2;
				}

				// Change its position then break to the next id.
				break;
			}

		}

	}

}

// function handleMouseMove(event) {
// event = event || window.event; // IE
//
// // so sendMousePosition() won't send an update
// // if (mousePos.x == event.clientX && mousePos.y == event.clientY) {
// // mousePos = null;
// // } else {
//
// // Update mousePos
// mousePos = {
// y : event.clientY,
// x : event.clientX
// };
//
// // }
// }

// Fire off this client's mouse location to the server
function sendMousePosition() {
	stompClient.send('/app/motion', {}, JSON.stringify({
		'id' : myId,
		'x' : mousePos.x,
		'y' : mousePos.y
	}));
}rtom

// Every now and then, delete the drumsticks belonging to disconnected users
// both to remove clutter and free up resources.
function cleanDeadDrumsticks() {

	var drumsticks = document.getElementById('drumsticks').childNodes;

	// For every drumstick image
	for (var i = 0; i < drumsticks.length; i++) {

		var drumstickMatchesDeadConnection = true;

		for (var j = 0; j < users.length; j++) {

			// if we find a live user for this drumstick, we're done.
			if (drumsticks[i].getAttribute("id") == drumstickPrefix
					+ users[j].id) {
				drumstickMatchesDeadConnection = false;
				break;
			}

		}

		// If this is still true, delete the node!
		if (drumstickMatchesDeadConnection) {
			document.getElementById('drumsticks').removeChild(drumsticks[i]);
			// TODO: I'm not sure we need to step back.
			// i--;
		}

	}

}

// Stuff to do as soon as everything has loaded
function initialize(contextPath) {

	// if initializeDefaultPlugins returns false, we cannot play sound
	if (!createjs.Sound.initializeDefaultPlugins()) {
		return;
	}

	this.contextPath = contextPath;

	var manifest = [
			{
				id : "snare",
				src : "resources/sounds/slingerland-kit/Ludwig-Snare-B.ogg"
			},
			{
				id : "kick",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-Kick-A.ogg"
			},
			{
				id : "hatc",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-SabianHHX-HiHat-Closed-A.ogg"
			},
			{
				id : "hato",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-SabianHHX-HiHat-Open-A.ogg"
			},
			{
				id : "rtom",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-RackTom-A.ogg"
			},
			{
				id : "ftom",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-FloorTom-A.ogg"
			},
			{
				id : "crash",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-Sabian-Crash-Left-B.ogg"
			},
			{
				id : "ride",
				src : "resources/sounds/slingerland-kit/Slingerland-Kit-Sabian-Ride-A.ogg"
			}, {
				id : "cuica1",
				src : "resources/sounds/cuica/cuica1.ogg"
			}, {
				id : "cuica2",
				src : "resources/sounds/cuica/cuica2.ogg"
			}, {
				id : "cuica3",
				src : "resources/sounds/cuica/cuica3.ogg"
			}, {
				id : "cuica4",
				src : "resources/sounds/cuica/cuica4.ogg"
			} ];

	createjs.Sound.registerManifest(manifest, contextPath + "/");

	snare = createjs.Sound.createInstance("snare");
	kick = createjs.Sound.createInstance("kick");
	ftom = createjs.Sound.createInstance("ftom");
	rtom = createjs.Sound.createInstance("rtom");
	crash = createjs.Sound.createInstance("crash");
	ride = createjs.Sound.createInstance("ride");
	hatc = createjs.Sound.createInstance("hatc");
	hato = createjs.Sound.createInstance("hato");
	cuica1 = createjs.Sound.createInstance("cuica1");
	cuica2 = createjs.Sound.createInstance("cuica2");
	cuica3 = createjs.Sound.createInstance("cuica3");
	cuica4 = createjs.Sound.createInstance("cuica4");

	snare.volume = 0.9;
	kick.volume = 1.0;
	ftom.volume = 1.0;
	rtom.volume = 1.0;
	crash.volume = 0.4;
	ride.volume = 1.0;
	hatc.volume = 0.8;
	hato.volume = 0.6;

	$('#hato').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'hato'
		}));
	});

	$('#hatc').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'hatc'
		}));
	});

	$('#snare').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'snare'
		}));
	});

	$('#kick').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'kick'
		}));
	});

	$('#rtom').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'rtom'
		}));
	});

	$('#ftom').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'ftom'
		}));
	});

	$('#crash').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'crash'
		}));
	});

	$('#ride').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'ride'
		}));
	});
	$('#cuica1').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'cuica1'
		}));
	});
	$('#cuica2').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'cuica2'
		}));
	});
	$('#cuica3').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'cuica3'
		}));
	});
	$('#cuica4').mousedown(function(e) {
		e.originalEvent.preventDefault();
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'cuica4'
		}));
	});

	// Listen for mouse movements
	// window.onmousemove = handleMouseMove;
	$(window).mousemove(function(event) {
		mousePos = {
			x : event.pageX,
			y : event.pageY
		};
	});

	$("#drumkit").on('dragstart', function(event) {
		event.preventDefault();
	});
	$("#drummap").on('dragstart', function(event) {
		event.preventDefault();
	});

	// Make sure the user is not initially connected
	setConnected(false);

}

$(window).on('beforeunload', function() {
	disconnect();
	return;
});
