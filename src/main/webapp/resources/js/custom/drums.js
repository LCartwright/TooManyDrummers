// Necessary for websocket communication with the server.
var stompClient;

// To relieve some load from the server, we retain a copy of this client's id
// and filter it out on this end. This must be unique or we may wrongly ignore
// another user's information.
// var myId;

// An array of identifiers for all users connected to the service.
var users = new Array();

// A holder for the x,y coordinates of this user's cursor so it can be relayed
// to the server every so often
var mousePos = {
	x : 0,
	y : 0
};

// Keep a record of the on-screen location of the drumkit for relative cursor
// positions.
var drumPos = {
	left : 0,
	top : 0,
	right : 0,
	bottom : 0
};

// How many milliseconds between each cursor location send.
var mouseDelay = 30;
// How many milliseconds between each cleanup of dead drumsticks.
var cleanupDelay = 1000;

// Variables for autonomous processes
var cursorPositionRunner;
var deadCursorRunner;

// The app's path for retrieving remote resources
var contextPath;

// Prefix for all cursor images
var drumstickPrefix = "drumstick";

// Keep a record of the last room this user was part of
// so it can be disconnected from before connecting to a
// new one.
var lastRoomId = default_room_id;

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

// Records which can be used to unsubscribe.
var hitreportsSubscription;
var allusersSubscription;
var motionSubscription;

// This function is fired when the user tries to connect via a websocket to the
// application.
function drumsConnect() {

	if (stompClient != null) {
		stompClient.disconnect();
	}

	// Form the correct URL of the websocket endpoint.
	var x = "http:\/\/" + $(location).attr("host") + contextPath + "/hit/";

	// Create a socket which looks for the 'hit' endpoint.
	var socket = new SockJS(x);

	// Reconnect on error.
	socket.addEventListener('error', function() {
		drumsDisconnect();
		drumsConnect();
	});

	// Prepare for full Stomp communication.
	stompClient = Stomp.over(socket);

	// Do nothing with debug messages. Keeps the console clear
	// and is more performant than the default behaviour.
	stompClient.debug = function() {
	};

	// Make the connection!
	stompClient.connect({}, function(frame) {

		// Subscribe for updates on the cursor positions of other users.
		motionSubscription = stompClient.subscribe('/topic/motion', function(
				cursorPositions) {
			cursorPositions.ack();
			moveDrumsticks(JSON.parse(cursorPositions.body));
		}, {
			'ack' : 'client'
		});

		// Fire off your location x times per second
		// Decrease this rate for better performance
		cursorPositionRunner = setInterval(sendMousePosition, mouseDelay);

		// Clear dead users every y seconds.
		deadCursorRunner = setInterval(cleanDeadDrumsticks, cleanupDelay);

		// Once fully connected 'change' to the current room
		changeDrumRoom();

	});

}

// This is fired when the user hits 'Disconnect' or we otherwise
// need the user to unsubscribe from the application
function drumsDisconnect() {

	// Stop the repeating functions
	clearInterval(cursorPositionRunner);
	clearInterval(deadCursorRunner);

	// Unsubscribe from messages from the application
	hitreportsSubscription.unsubscribe();
	allusersSubscription.unsubscribe();
	motionSubscription.unsubscribe();

	// Let the app know that this user is done.
	stompClient.send('/app/finished', {}, JSON.stringify({
		'id' : currentUserID,
		'firstName' : null,
		'lastName' : null
	}));

}

// Play a sound!
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
		$("#effhatc").css("opacity", 0.4);
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

	// Get the array of drumsticks. One is needed to track each user's mouse
	// movements.
	var drumsticks = document.getElementById('drumsticks').childNodes;

	// Clear the ids array - we have more recent information.
	users = new Array();

	// For all users
	for (var i = 0; i < lastUsers.length; i++) {

		// Filter out my own username and the empty value at the end
		if (lastUsers[i].id != currentUserID && lastUsers[i].id != "") {

			// Add it to the array of connected users!
			users.push(lastUsers[i]);

			// Ensure this id has a drumstick, else create one
			var noDrumstick = true;

			for (var j = 0; j < drumsticks.length; j++) {
				// If we can find a drumstick for this user, we're done
				if (drumsticks[j].getAttribute("id") === drumstickPrefix
						+ lastUsers[i].id) {
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

				newImage.setAttribute("width", "60px");
				newImage.setAttribute("height", "80px");

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
	
	updateRoomUsersList(lastUsers);
}

function updateRoomUsersList(lastUsers){
	$("#current-users-list").empty();
	addUserToRoomList(currentUserFirstName);
	for(var i = 0; i < lastUsers.length; i++){
		if(lastUsers[i].id != currentUserID){
			addUserToRoomList(lastUsers[i].firstName);
		}
	}
}

function addUserToRoomList(username){
	var li = $(document.createElement("li"))
	.attr("class","room-user-name")
	.append(
			$(document.createElement("div"))
			.attr("class", "well well-sm user-name-well")
			.append(
					$(document.createElement("span")).text(username)
			)
	);
	$("#current-users-list").append(li);
}


// This method is not responsible for creating/removing drumsticks but
// only for moving them with new information.
function moveDrumsticks(positions) {

	var iMax = positions.length;
	var drumsticks = document.getElementById('drumsticks').childNodes;
	var jMax = drumsticks.length;

	// For every user
	for (var i = 0; i < iMax; i++) {

		var currentId = positions[i].id;

		// Filter out my own id.
		if (currentId === currentUserID) {
			continue;
		}

		// Find their drumstick
		for (var j = 0; j < jMax; j++) {

			var drumstickId = drumsticks[j].getAttribute("id");
			// If we've landed on the right drumstick
			if (drumstickId === (drumstickPrefix + currentId)) {
				var posX = positions[i].x + drumPos.left;
				var posY = positions[i].y + drumPos.top;

				drumsticks[j].style.left = posX + 'px';
				drumsticks[j].style.top = posY + 'px';

				// Make opaque when the cursor is within bounds, else dim.
				if (posX > drumPos.left && posY > drumPos.top
						&& posX < drumPos.right && posY < drumPos.bottom) {
					drumsticks[j].style.opacity = 1.0;
				} else {
					drumsticks[j].style.opacity = 0.3;
				}

				break;
			}

		}

	}

}

// Fire off this client's mouse location to the server
function sendMousePosition() {
	stompClient.send('/app/motion', {}, JSON.stringify({
		'id' : currentUserID,
		'x' : mousePos.x,
		'y' : mousePos.y
	}));
}

// Every now and then, delete the drumsticks belonging to disconnected users
// both to remove clutter and free up resources.
function cleanDeadDrumsticks() {

	var drumsticks = document.getElementById('drumsticks').childNodes;

	// For every drumstick image
	for (var i = 0; i < drumsticks.length; i++) {

		var drumstickMatchesDeadConnection = true;

		for (var j = 0; j < users.length; j++) {

			// if we find a live user for this drumstick, we're done.
			if (drumsticks[i].getAttribute("id") === drumstickPrefix
					+ users[j].id) {
				drumstickMatchesDeadConnection = false;
				break;
			}

		}

		// If this is still true, delete the node!
		if (drumstickMatchesDeadConnection) {
			document.getElementById('drumsticks').removeChild(drumsticks[i]);
		}

	}

}

function realignSVG() {
	drumPos.left = $('#drumkit').position().left;
	drumPos.top = $('#drumkit').position().top;
	drumPos.right = drumPos.left + $('#drumkit').width();
	drumPos.bottom = drumPos.top + $('#drumkit').height();
	$("#effects").css("left", drumPos.left);
	$("#effects").css("top", drumPos.top);
}

function changeDrumRoom() {

	// Unsubscribe from the last room
	if (hitreportsSubscription) {
		hitreportsSubscription.unsubscribe();
		allusersSubscription.unsubscribe();

		stompClient.send('/app/' + lastRoomId + '/finished', {}, JSON
				.stringify({
					'id' : currentUserID,
					'firstName' : null,
					'lastName' : null
				}));
	}

	// Resubscribe to the new destination

	// Register for hitreports so the user can hear other users playing
	// and join in!
	hitreportsSubscription = stompClient.subscribe('/topic/' + active_room_id
			+ '/hitreports', function(drumhit) {
		drumhit.ack();
		play(JSON.parse(drumhit.body).name);
	}, {
		'ack' : 'client'
	});

	// Subscribe for changes in the room's users so new users can join
	// in and old users don't fill up the room with artifacts.
	allusersSubscription = stompClient.subscribe('/topic/' + active_room_id
			+ '/allusers', function(allUsers) {
		allUsers.ack();
		refreshUsers(JSON.parse(allUsers.body));
	}, {
		'ack' : 'client'
	});

	// Let the Server know I've joined!
	stompClient.send('/app/' + active_room_id + '/newuser', {}, JSON
			.stringify({
				'id' : currentUserID,
				'firstName' : null,
				'lastName' : null
			}));

	lastRoomId = active_room_id;

}

// Stuff to do as soon as everything on the page has loaded
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

	$('#hato').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'hato'
						}));
			});

	$('#hatc').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'hatc'
						}));
			});

	$('#snare').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'snare'
						}));
			});

	$('#kick').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'kick'
						}));
			});

	$('#rtom').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'rtom'
						}));
			});

	$('#ftom').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'ftom'
						}));
			});

	$('#crash').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'crash'
						}));
			});

	$('#ride').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'ride'
						}));
			});
	$('#cuica1').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'cuica1'
						}));
			});
	$('#cuica2').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'cuica2'
						}));
			});
	$('#cuica3').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'cuica3'
						}));
			});
	$('#cuica4').mousedown(
			function(e) {
				e.originalEvent.preventDefault();
				stompClient.send("/app/" + active_room_id + "/hit", {}, JSON
						.stringify({
							'name' : 'cuica4'
						}));
			});

	// Force the SVG graphics to be correctly positioned
	realignSVG();

	// Listen for mouse movements
	$(window).mousemove(function(event) {
		mousePos = {
			x : (event.pageX - drumPos.left),
			y : (event.pageY - drumPos.top - 50)
		};
	});

	// Fired when the window is resized
	$(window).resize(function() {
		realignSVG();
	});

	// Prevent the drumkit from being dragged so image 'ghosts'
	// do not appear.
	$("#drumkit").on('dragstart', function(event) {
		event.preventDefault();
	});
	$("#drummap").on('dragstart', function(event) {
		event.preventDefault();
	});
	
	// Make an effort to cleanly disconnect when the user leaves.
	// If this is not called, the server can deal with the abrupt
	// disconnection.
	$(window).on('beforeunload', function() {
		drumsDisconnect();
		return;
	});

}