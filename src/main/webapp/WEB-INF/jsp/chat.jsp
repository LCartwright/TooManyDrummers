<%@ page language="java" contentType="text/html; charset=US-ASCII"
	pageEncoding="US-ASCII"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=US-ASCII">
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<link rel="shortcut icon" href="../../assets/ico/favicon.ico">

<title>Chat</title>

<!-- Bootstrap core CSS -->
<link
	href="${pageContext.request.contextPath}/resources/css/bootstrap.min.css"
	rel="stylesheet">

<link
	href="${pageContext.request.contextPath}/resources/css/custom/chat.css"
	rel="stylesheet">

<script
	src="${pageContext.request.contextPath}/resources/js/jquery-2.1.0.js"></script>
<script
	src="${pageContext.request.contextPath}/resources/js/bootstrap.min.js"></script>

<script
	src="${pageContext.request.contextPath}/resources/js/custom/chat.js"></script>
<title>Chatroom</title>
</head>
<body>
	<h2>CHAT</h2>
	<div>
		<!-- 
	https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1.0-1/s50x50/1467218_10152405394208136_831500500_t.jpg
	
	
	
	 -->
	 	<div id="testing">
	 		<button id="das-boot" onclick="" class="btn btn-warning">Das Boot</button>
	 		<button id="das-add-message" onclick="" class="btn btn-warning">Das Add Message</button>
	 	</div>
		<div id="user-adding-div" class="well well-sm">
			Username: <input id="add-user-name" type="text" />
			<button id="add-user" onclick="" class="btn btn-primary">Sign-In</button>
		</div>

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

		<div id="chat-message-area">
			<div id="message1">
				<div class="media well well-sm">
					<a class="pull-left" href="#"> <img class="media-object"
						src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1.0-1/s50x50/1467218_10152405394208136_831500500_t.jpg"
						alt="pciture">
					</a>
					<div class="media-body">
						<h4 class="media-heading">Henry Tesei</h4>
						bacon bacon BACON!
					</div>
				</div>
			</div>
			<div id="message2">
				<div class="media well well-sm">
					<a class="pull-left" href="#"> <img class="media-object"
						src="https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1.0-1/s50x50/1467218_10152405394208136_831500500_t.jpg"
						alt="pciture">
					</a>
					<div class="media-body">
						<h4 class="media-heading">Henry Tesei</h4>
						bacon bacon BACON!
					</div>
				</div>
			</div>
		</div>
</body>
</html>
