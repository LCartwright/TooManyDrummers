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
<script type="text/javascript" src="static/chat.js"></script>
<title>Chat Screen!</title>
</head>
<body>
		<div id="room-adding-div">
			<button id="add-room" onclick="addRoom();">Add Room</button>
			Name: <input id="add-room-name" type="text" />
		</div>
		<div id="room-joining-div">
			<button id="join-room" onclick="tryJoinRoom();">Join Room</button>
			id: <input id="join-room-id" type="text" />
		</div>
		<div id="message-sending-div">
			<button id="send-message" onclick="sendMessage();">Send
				Message</button>
			<!--         <input id="send-room-id" type="text" />
        <input id="send-user-id" type="text" /> -->
			<input id="send-message-content" type="text" />
		</div>
		<div id="current-room-div">
			<div id="current-room-name">Add a room to join a conversation</div>
			<div id="current-room-messages"></div>
			<button id="fetch-messages" onclick="fetchMessages();">FetchMessages</button>
			<div />
		</div>
</body>
</html>
