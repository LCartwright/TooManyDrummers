<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<!-- TODO: Link up a stylesheet -->

<script
	src="${pageContext.request.contextPath}/resources/js/jquery-2.1.0.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/sockjs-0.3.4.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/stomp.js"></script>

<script
	src="${pageContext.request.contextPath}/resources/js/custom/drums.js"></script>

<script type="text/javascript">
	window.onload = function() {
		initialize();
	}
</script>

<title>TooManyDrummers</title>

</head>
<body>

	<!-- Warn the user that Javascript needs to be enabled. -->
	<noscript>
		<h2 style="color: #ff0000">Seems your browser doesn't support
			Javascript! Websocket relies on Javascript being enabled. Please
			enable Javascript and reload this page!</h2>
	</noscript>

	<h1>TooManyDrummers</h1>

	<!-- Div for connect, disconnect and username fields. TODO: Make pretty -->
	<!-- TODO: Automate connection, TODO: filter bad usernames, TODO: clear the hint in the enterUsername element. -->
	<div>
		<button id="connect" onclick="connect();">Connect</button>
		<button id="disconnect" disabled="disabled" onclick="disconnect();">Disconnect</button>
		<br /> <input id="enterUsername" type="text"
			value="Please enter your username..." />
		<!-- TODO: Check this entry field for commas, both here and on the server. -->
		<p id="connectedUsers"></p>
	</div>

	<!-- This div presents the main functionality of the application -->
	<div id="drumkit">
	
		<!-- The library of sound files to play for each drum. Hopefully all autoloaded. -->
		<audio id="basssound"
			src="${pageContext.request.contextPath}/resources/sounds/bass.wav"
			preload="auto"></audio>
		<audio id="tomtomsound"
			src="${pageContext.request.contextPath}/resources/sounds/tomtom.wav"
			preload="auto"></audio>
		<audio id="snaresound"
			src="${pageContext.request.contextPath}/resources/sounds/snare.wav"
			preload="auto"></audio>

		<!-- The drumkit to play on! TODO: Sort out scaling -->
		<img
			src="${pageContext.request.contextPath}/resources/images/drums.png"
			alt="drums" usemap="#drumsmap" />

		<!-- Maps different parts of the image so different drums can make different sounds. -->
		<map name="drumsmap">
			<area shape="circle" coords="150,150,150" alt="Bass"
				href="javascript:hitBass()" />
			<area shape="circle" coords="450,150,150" alt="TomTom"
				href="javascript:hitTomTom()" />
			<area shape="circle" coords="750,150,150" alt="Snare"
				href="javascript:hitSnare()" />
		</map>

		<!-- Holder for the cursors of other users. -->
		<div id="drumsticks"></div>

	</div>

</body>
</html>

