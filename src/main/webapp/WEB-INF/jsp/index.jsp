<%@ page language="java" contentType="text/html; charset=US-ASCII"
	pageEncoding="US-ASCII"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<script src="${pageContext.request.contextPath}/resources/js/lib/jquery-2.1.0.js"></script>
<script src="${pageContext.request.contextPath}/resources/js/custom/chat.js"></script>
<title>TooManyDrums Chatroom test</title>
</head>
<body>
	<h2>BACON</h2>
	<div>
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