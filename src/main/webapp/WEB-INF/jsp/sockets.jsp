<%-- 
    Document   : hello
    Created on : Feb 25, 2013, 10:08:08 PM
    Author     : Bogdan Vrusias
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery-2.1.0.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/sockjs-0.3.4.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/lib/stomp.js"></script>
<script type="text/javascript">
        var stompClient = null;

        function setConnected(connected) {
            document.getElementById('connect').disabled = connected;
            document.getElementById('disconnect').disabled = !connected;
            document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
            document.getElementById('response').innerHTML = '';
        }

        function connect() {
            var socket = new SockJS('./hello');
            stompClient = Stomp.over(socket);
            stompClient.connect({}, function(frame) {
                setConnected(true);
                console.log('Connected: ' + frame);
                stompClient.subscribe('/topic/greetings', function(greeting){
                    showGreeting(JSON.parse(greeting.body).content);
                });
            });
        }

        function disconnect() {
            stompClient.disconnect();
            setConnected(false);
            console.log("Disconnected");
        }

        function sendName() {
            var name = document.getElementById('name').value;
            stompClient.send("/app/hello", {}, JSON.stringify({ 'name': name }));
        }

        function showGreeting(message) {
            var response = document.getElementById('response');
            var p = document.createElement('p');
            p.style.wordWrap = 'break-word';
            p.appendChild(document.createTextNode(message));
            response.appendChild(p);
        }
    </script>
<title>SOCKETS</title>
</head>
<body>
	<h2>SOCKETS</h2>
	<div>
		<button id="connect" onclick="connect();">Connect</button>
		<button id="disconnect" disabled="disabled" onclick="disconnect();">Disconnect</button>
	</div>
	<div id="conversationDiv">
		<label>What is your name?</label><input type="text" id="name" />
		<button id="sendName" onclick="sendName();">Send</button>
		<p id="response"></p>
	</div>
</body>
</html>
