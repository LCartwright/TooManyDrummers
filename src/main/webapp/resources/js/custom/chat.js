/**
 * 
 */
var currentRoomId;
var currentRoomName;
var currentRoomLastMessageId;

var roomsURI = "REST/rooms";
var roomsAddURI = roomsURI + "/add";


function joinRoom(roomId, roomName) {
	currentRoomId = roomId;
	currentRoomName = roomName;
	currentRoomLastMessageId = -1;
	
	$('#current-room-name').text(currentRoomName);
	//window.setInterval(fetchMessages(), 100);
	setInterval(function() {
		fetchMessages()
	}, 100);
}

/* function startInterval(){
	window.setInterval(fuction(){
		fetchMessages();
	},100);
} */

function fetchMessages() {
	var currentRoomURI = roomsURI + "/" + currentRoomId;
	//alert(currentRoomURI);
	var getting = $.get(currentRoomURI, {
		messageId : currentRoomLastMessageId
	});
	getting.done(function(data) {
		//alert(JSON.stringify(data));
		var messages = JSON.parse(JSON.stringify(data));
		//alert(messages[0].messageContent);
		for (i = 0; i < messages.length; i++) {
			$('#current-room-messages').append(
					"<p>" + messages[i].messageContent + "</p>");
			if (messages[i].messageId > currentRoomLastMessageId) {
				currentRoomLastMessageId = messages[i].messageId;
			}
		}
	});
}

function addRoom() {
	alert(roomsAddURI);
	var roomName = $('#add-room-name').val();
	var posting = $.post(roomsAddURI, {
		name : roomName
	});
	posting.done(function(data) {

		//alert(JSON.stringify(data));
		//Join room after adding
		var room = JSON.parse(JSON.stringify(data));
		joinRoom(room.roomId, room.name);

	});
}

function sendMessage() {
	//var roomId = $('#send-room-id').val();
	//var userId = $('#send-user-id').val();
	var roomId = currentRoomId;
	var userId = 1; //dummy
	var messageContent = $('#send-message-content').val();
	var currentRoomURI = roomsURI + "/" + roomId;
	//alert(roomURI);
	var posting = $.post(currentRoomURI, {
		userId : userId,
		messageContent : messageContent
	});
	posting.done(function(data) {
		//alert(JSON.stringify(data));
	});
}

function addDummyMessage(){
	$("#chat-message-area").append(
	""
	
	);
}

function tryJoinRoom() {
	var roomId = $('#join-room-id').val();
	var roomName = "unknown";
	joinRoom(roomId, roomName);
}

function getUserInfoForMessage(user_id){
	var user_info = {
			name : "Henry Tesei"
		,	profile_img_src : "http://graph.facebook.com/518733135/picture"
	};
	return user_info;
}

var message_counter = 0;

function createMessageElement(user_id, room_id, message_text){
	var user_info = getUserInfoForMessage(0);
	var name = user_info.name;
	var img_src = user_info.profile_img_src;
	var message_div = 
	$(document.createElement("div")).attr("id","message-" + message_counter)
	.append(
			$(document.createElement("div"))
			.attr("class","media well well-sm")
			.append(
					$(document.createElement("a"))
					.attr("class","pull-left")
					.attr("href","#")
					.append(
							$(document.createElement("img"))
							.attr("class","media-object")
							.attr("src",img_src)
							.attr("alt","profile")
					)
			).append(
					$(document.createElement("div"))
					.attr("class", "media-body")
					.text(message_text)
					.prepend(
							$(document.createElement("h4"))
							.attr("class", "media-heading")
							.text(name)
					)
			)
	);
		
	
	return message_div;
}

function addChatMessageToArea(user_id, room_id, message){
	$("#chat-message-area").append(createMessageElement(0,0,"FUCKING BACON"));
}
$( document ).ready(function() {
	$( "#das-boot" ).click(function() {
		  $( "#chat-message-area" ).animate({ "width": "+=50px" }, "slow" );
		  console.log("booted");
		  addChatMessageToArea();
	});
	
	$( "#das-add-message" ).click(function() {
		console.log("message added");
		addChatMessageToArea();
	});
});
