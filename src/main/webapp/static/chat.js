/**
 * 
 */
var currentRoomId;
var currentRoomName;
var currentRoomLastMessageId;

var roomsURI = "rest/rooms";
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
	var roomURI = roomsURI + currentRoomId;
	
	var getting = $.get(roomURI, {
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
	var roomURI = roomsURI + roomId;
	//alert(roomURI);
	var posting = $.post(roomURI, {
		userId : userId,
		messageContent : messageContent
	});
	posting.done(function(data) {
		//alert(JSON.stringify(data));
	});
}

function tryJoinRoom() {
	var roomId = $('#join-room-id').val();
	var roomName = "unknown";
	joinRoom(roomId, roomName);
}