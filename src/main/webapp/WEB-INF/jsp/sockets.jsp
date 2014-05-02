<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script
	src="${pageContext.request.contextPath}/resources/js/lib/jquery-2.1.0.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/lib/sockjs-0.3.4.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/lib/stomp.js"></script>

<script type="text/javascript">
	// Necessary for websocket communication with the server.
	var stompClient = null;
	// To relieve some load from the server, we retain a copy of this client's id and
	// filter it out on this end. This must be unique or we may wrongly ignore another
	// user's information.
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
	var channel_max = 10; // Decrease if there's a noticeable performance hit.
	var audiochannels = new Array();
	for (var a = 0; a < channel_max; a++) {
		audiochannels[a] = new Array();
		audiochannels[a]['channel'] = new Audio();
		audiochannels[a]['finished'] = -1;
	}

	// A holder for the x,y coordinates of this user's cursor so it can be relayed
	// to the server every so often
	var mousePos;

	// Change the UI to better represent the options available to a connected/disconnected user.
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

		// TODO: Continue commenting from this point...
		document.getElementById('drumkit').style.visibility = connected ? 'visible'
				: 'hidden';
	}

	function connect() {

		if (document.getElementById('enterUsername').value === "") {
			alert('Please enter a username before connecting');
		} else {
			myId = document.getElementById('enterUsername').value;
			//document.getElementById('chosenUsername').innerHTML = myId;

			var socket = new SockJS('./hit');
			stompClient = Stomp.over(socket);
			stompClient.connect({}, function(frame) {
				setConnected(true);
				//console.log('Connected: ' + frame);
				stompClient.subscribe('/topic/hitreports', function(drumhit) {
					play(JSON.parse(drumhit.body).name);
				});

				stompClient.subscribe('/topic/allusers', function(allUsers) {
					refreshUsers(JSON.parse(allUsers.body));
				});

				// TODO: Replace 'names' with Facebook details
				stompClient.send('/app/newuser', {}, JSON.stringify({
					'id' : myId,
					'firstName' : myId,
					'lastName' : myId
				}));

				stompClient.subscribe('/topic/motion',
						function(cursorPositions) {
							moveDrumsticks(JSON.parse(cursorPositions.body));
						});

			});
		}
	}

	function disconnect() {

		// TODO Rather than sending a message, it would be better to react to disconnections on the serverside
		stompClient.send('/app/finished', {}, JSON.stringify({
			'id' : myId,
			'firstName' : null,
			'lastName' : null
		}));

		stompClient.disconnect();
		setConnected(false);
		//console.log("Disconnected");
	}

	function hitBass() {
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'bass'
		}));
	}

	function hitTomTom() {
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'tomtom'
		}));
	}

	function hitSnare() {
		stompClient.send("/app/hit", {}, JSON.stringify({
			'name' : 'snare'
		}));
	}

	function play(message) {

		var audio = message + 'sound';

		// TODO Reference, see above
		for (var a = 0; a < channel_max; a++) {
			var thistime = new Date();

			if (audiochannels[a]['finished'] < thistime.getTime()) {
				audiochannels[a]['finished'] = thistime.getTime()
						+ document.getElementById(audio).duration * 1000;
				audiochannels[a]['channel'].src = document
						.getElementById(audio).src;
				audiochannels[a]['channel'].load();
				audiochannels[a]['channel'].play();
				break;
			}

		}

	}

	// Users is a comma-delimited string
	function refreshUsers(users) {
		document.getElementById('connectedUsers').innerHTML = users;

		var drumsticks = document.getElementById('drumsticks').childNodes;

		var allIds = users.split(",");
		ids = new Array();

		// Filter out my own username.
		for (var i = 0; i < allIds.length; i++) {
			if (allIds[i] != myId && allIds[i] != "") {
				ids.push(allIds[i]);
				// Ensure this id has a drumstick, else create one

				var noDrumstick = true;

				for (var j = 0; j < drumsticks.length; j++) {
					if (drumsticks[j].getAttribute("id") == allIds[i]) {
						noDrumstick = false;
						break;
					}
				}

				if (noDrumstick) {

					var newChild = document.createElement("img");
					newChild
							.setAttribute("src",
									"${pageContext.request.contextPath}/resources/images/drumstick.png");
					newChild.setAttribute("id", allIds[i]);
					newChild.setAttribute("width", "80");
					newChild.setAttribute("width", "50");
					newChild.setAttribute("style", "position:absolute;");

					document.getElementById('drumsticks').appendChild(newChild);
				}

			}

		}

	}

	// SLOOOW, find a more efficient way of doing this...
	// This method is NOT responsible for creating/removing drumsticks.
	function moveDrumsticks(positions) {

		var iMax = positions.length;
		var drumsticks = document.getElementById('drumsticks').childNodes;
		var jMax = drumsticks.length;

		// For every user
		for (var i = 0; i < iMax; i++) {

			var currentId = positions[i].id;

			if (currentId == myId) {
				continue;
			}

			// Find their drumstick
			for (var j = 0; j < jMax; j++) {

				// If we've landed on the right drumstick
				if (drumsticks[j].getAttribute("id") == currentId) {

					//$("#" + drumsticks[j].getAttribute("id")).animate({
					//	left : "'" + positions[i].x + "px'",
					//	top : "'" + positions[i].y + "px'"
					//});
					drumsticks[j].style.left = positions[i].x + 'px';
					drumsticks[j].style.top = positions[i].y + 'px';

					// Change its position then break to the next id.
					break;
				}

			}

		}

	}

	window.onload = function() {

		setConnected(false);

		window.onmousemove = handleMouseMove;
		setInterval(sendMousePosition, 100);
		setInterval(cleanDeadDrumsticks, 10000);

		function handleMouseMove(event) {
			event = event || window.event; // IE
			// Consider nullifying mousePos if it hasn't changed
			// so sendMousePosition() won't send an update
			mousePos = {
				y : event.clientY,
				x : event.clientX
			};
		}

		function sendMousePosition() {
			if (mousePos) {
				stompClient.send('/app/motion', {}, JSON.stringify({
					'id' : myId,
					'x' : mousePos.x,
					'y' : mousePos.y
				}));
			}
		}

		function cleanDeadDrumsticks() {

			var drumsticks = document.getElementById('drumsticks').childNodes;

			for (var i = 0; i < drumsticks.length; i++) {

				var drumstickMatchesDeadConnection = true;

				for (var j = 0; j < ids.length; j++) {

					// if we find a live user for this drumstick, we're done.
					if (drumsticks[i].getAttribute("id") == ids[j]) {
						drumstickMatchesDeadConnection = false;
						break;
					}

				}

				if (drumstickMatchesDeadConnection) {
					document.getElementById('drumsticks').removeChild(
							drumsticks[i]);
					i--;
				}

			}

		}

	}
</script>

<title>TooManyDrummers</title>

</head>
<body>

	<noscript>
		<h2 style="color: #ff0000">Seems your browser doesn't support
			Javascript! Websocket relies on Javascript being enabled. Please
			enable Javascript and reload this page!</h2>
	</noscript>

	<h2>TooManyDrummers</h2>
	<div>
		<button id="connect" onclick="connect();">Connect</button>
		<button id="disconnect" disabled="disabled" onclick="disconnect();">Disconnect</button>
		<br />
		<input id="enterUsername" type="text"
			value="Please enter your username..." />
			<!-- TODO: Check this for commas, both here and on the server. -->
		<p id="connectedUsers"></p>
	</div>

	<div id="drumkit">
		<audio id="basssound"
			src="${pageContext.request.contextPath}/resources/sounds/bass.wav"
			preload="auto"></audio>
		<audio id="tomtomsound"
			src="${pageContext.request.contextPath}/resources/sounds/tomtom.wav"
			preload="auto"></audio>
		<audio id="snaresound"
			src="${pageContext.request.contextPath}/resources/sounds/snare.wav"
			preload="auto"></audio>

		<img
			src="${pageContext.request.contextPath}/resources/images/drums.png"
			alt="drums" usemap="#drumsmap" />

		<map name="drumsmap">
			<area shape="circle" coords="150,150,150" alt="Bass"
				href="javascript:hitBass()" />
			<area shape="circle" coords="450,150,150" alt="TomTom"
				href="javascript:hitTomTom()" />
			<area shape="circle" coords="750,150,150" alt="Snare"
				href="javascript:hitSnare()" />
		</map>
		
		<div id="drumsticks"></div>

	</div>
	
</body>
</html>

