<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<link
	href="${pageContext.request.contextPath}/resources/css/custom/style.css"
	rel="stylesheet" type="text/css">

<script
	src="${pageContext.request.contextPath}/resources/js/jquery-2.1.0.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/sockjs-0.3.4.js"
	type="text/javascript"></script>
<script src="${pageContext.request.contextPath}/resources/js/stomp.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/soundjs-0.5.2.min.js"
	type="text/javascript"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/custom/drums.js"
	type="text/javascript"></script>

<script type="text/javascript">
	$(window).load(function() {
		initialize("${pageContext.request.contextPath}");
	});
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

	<h1 id="mainheading">TooManyDrummers</h1>

	<!-- Div for connect, disconnect and username fields. TODO: Make pretty -->
	<!-- TODO: Automate connection, TODO: filter bad usernames, TODO: clear the hint in the enterUsername element. -->
	<div>
		<button id="connect" onclick="connect();">Connect</button>
		<button id="disconnect" disabled="disabled" onclick="disconnect();">Disconnect</button>
		<br /> <input id="enterUsername" type="text"
			placeholder="Please enter your username..." maxlength="20" />
		<!-- TODO: Check this entry field for commas, both here and on the server. -->
		<p id="connectedUsers"></p>
	</div>

	<!-- This div presents the main functionality of the application -->
	<div id="drumkit_div">

		<!-- The drumkit to play on! TODO: Sort out scaling -->
		<div>
			<img id="drumkit" draggable="false" class="unselectable"
				src="${pageContext.request.contextPath}/resources/images/drumkit.png"
				width="600" height="450" alt="drumkit" usemap="#drummap">

			<map id="drummap" name="drummap" draggable="false"
				class="unselectable">
				<area id="hato" shape="poly" alt="hato"
					coords="151,150,175,155,183,169,179,180,164,194,125,206,87,206,65,198,61,182,82,164,97,157,125,150,135,149" />
				<area id="hatc" shape="poly" alt="hatc"
					coords="151,346,159,387,201,441,219,432,175,336,161,332" />
				<area id="snare" shape="poly" alt="snare"
					coords="251,205,280,210,298,221,309,239,308,257,291,280,268,288,250,292,223,287,200,272,193,253,197,234,217,213,231,208" />
				<area id="kick" shape="poly" alt="kick"
					coords="324,222,349,229,374,241,387,253,380,317,346,332,334,333,325,401,309,405,299,328,271,318,295,305,309,292,312,272,312,242,299,219,309,219" />
				<area id="rtom" shape="poly" alt="rtom"
					coords="278,90,301,95,319,108,325,121,318,137,293,150,262,149,240,139,229,118,248,96,253,94" />
				<area id="ftom" shape="poly" alt="ftom"
					coords="445,203,474,208,502,224,516,241,521,259,512,281,484,292,454,294,419,285,397,266,388,239,401,216,420,207" />
				<area id="crash" shape="poly" alt="crash"
					coords="216,78,256,71,270,59,273,40,257,20,223,7,182,10,158,29,157,43,167,58,184,69" />
				<area id="ride" shape="poly" alt="ride"
					coords="429,95,476,86,507,61,501,35,467,19,421,21,387,36,367,55,364,68,383,84,401,92" />
				<area id="cuica1" alt="honk" shape="rect" coords="440,420,453,432" />
				<area id="cuica2" alt="honk!" shape="rect" coords="451,99,463,115" />
				<area id="cuica3" alt="Honk!" shape="rect" coords="103,107,113,119" />
				<area id="cuica4" alt="HONK!" shape="rect" coords="115,409,130,426" />
			</map>
			<svg width="600" height="450">
		<defs>
		<radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
			<stop offset="0%" style="stop-color:rgb(255,255,255); stop-opacity:0" />
		    <stop offset="100%"
					style="stop-color:rgb(0,0,255); stop-opacity:1" />
		    </radialGradient>
		 </defs>
		    <polygon
					points="151,150,175,155,183,169,179,180,164,194,125,206,87,206,65,198,61,182,82,164,97,157,125,150,135,149" fill="url(#grad1)" />
		    <polygon points="151,346,159,387,201,441,219,432,175,336,161,332" fill="url(#grad1)" />
		    <polygon
					points="251,205,280,210,298,221,309,239,308,257,291,280,268,288,250,292,223,287,200,272,193,253,197,234,217,213,231,208" fill="url(#grad1)" />
		    <polygon
					points="324,222,349,229,374,241,387,253,380,317,346,332,334,333,325,401,309,405,299,328,271,318,295,305,309,292,312,272,312,242,299,219,309,219" fill="url(#grad1)" />
		    <polygon
					points="278,90,301,95,319,108,325,121,318,137,293,150,262,149,240,139,229,118,248,96,253,94" fill="url(#grad1)" />
		    <polygon
					points="445,203,474,208,502,224,516,241,521,259,512,281,484,292,454,294,419,285,397,266,388,239,401,216,420,207" fill="url(#grad1)" />
		    <polygon
					points="216,78,256,71,270,59,273,40,257,20,223,7,182,10,158,29,157,43,167,58,184,69" fill="url(#grad1)" />
		    <polygon
					points="429,95,476,86,507,61,501,35,467,19,421,21,387,36,367,55,364,68,383,84,401,92" fill="url(#grad1)" />
		 
		</svg>
		</div>


		<!-- Holder for the cursors of other users. -->
		<div id="drumsticks"></div>

	</div>

</body>
</html>

