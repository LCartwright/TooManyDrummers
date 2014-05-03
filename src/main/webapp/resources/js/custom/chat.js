/**
 * 
 */
var currentRoomId;
var currentRoomName;
var currentRoomLastMessageId;

var roomsURI = "REST/rooms";
var roomsAddURI = roomsURI + "/add";

var usersURI = "REST/users";
	
var currentUserID;
var currentUserFirstName;
var currentUserLastName;
var currentUserFullName;
var currentUserPictureURL;

var room_id_list = [];

function joinRoom(room_id) {
	currentRoomId = roomId;
	currentRoomLastMessageId = -1;
	var getRoomURI = roomsURI + "/" + room_id
	var getting = $.get(getRoomURI);
	
	$('#current-room-name').text(currentRoomName);
	
	getting.done(function(data) {
		var room = JSON.parse(data);
	});
	
	//window.setInterval(fetchMessages(), 100);
	setInterval(function() {
		fetchMessages();
	}, 100);
}

function changeToRoom(room){
	//{"name":"default","roomID":1,"messages":[]}
	name = room.name;
	room_id = room.roomID;
	messages = room.messages;
	
	//switch the tabs
}

function updateRooms(){
	var getting = $.get(roomsURI);
	
	getting.done(function(data) {
		var rooms = JSON.parse(JSON.stringify(data));
		//[{"name":"default","roomID":1,"messages":[]}]
		//alert(JSON.stringify(data));
		//Check if room id is in room ID list
		var new_room_id_list = []; //used to add new elements to switch too
		for(var i = 0; i < rooms.length; i++){
			
			console.log(rooms[i].roomID);
			
			$.inArray(rooms[i].roomID, room_id_list);
			if(!(true)){
				console.log("test passed");
				room_id_list.push(room[i].roomID); //add to global list
				new_room_id_list.push(room[i].roomID); //add to local list
				$("#chat-rooms-list").append(createRoomElement(room)); //add to screen
			}
		}
		
		
	});
}

function createRoomElement(room){
	//<li class="active"><a onclick="alert();">Default</a></li>
	var room_li = 
	$(document.createElement("li"))
	.attr("class","")
	.attr("room_id", room.roomID)
	.append(
			$(document.createElement("a"))
			.attr("onclick","alert();")
			.text(room.name)
	);
	return room_li;
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

function createNewRoom(){
	
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
	$("#chat-message-area-div").append(createMessageElement(0,0,"FUCKING BACON"));
}

$( document ).ready(function() {
	
	
	//First set the user as logged out
	setLoggedOut();
	
	//Assign controls to all buttons
	$( "#das-boot" ).click(function() {
		  //$( "#chat-message-area" ).animate({ "width": "+=50px" }, "slow" );
		  console.log("booted");
		  updateRooms();
	});
	
	$( "#das-add-message" ).click(function() {
		console.log("message added");
		addChatMessageToArea();
	});
	
	$("#chat-signin-button").click(function() {
		setUserDEMO();
		console.log("UserID: " + userID);
	});
	
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function(){
	    FB.init({
	      appId: '1483054771924097',
	    });     
	    $('#loginbutton,#feedbutton').removeAttr('disabled');
	    FB.getLoginStatus(updateStatusCallback);
	});
	
	
	$("#chat-facebook-login").click(function() {
		FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
			    console.log('user already logged in');
			    setLoggedIn(response);
			  }
			  else {
				console.log("user not logged in, Facebook login called");
			    
				FB.login(function(response) {
					   if (response.authResponse) {
					     console.log('Welcome!  Fetching your information.... ');
					     FB.api('/me', function(response) {
					       console.log('Good to see you, ' + response.name + '.');
					     });
					     setLoggedIn(response);
					   } else {
					     console.log('User cancelled login or did not fully authorize.');
					   }
				});
			  }
		});
	});
	
	$("#chat-facebook-logout").click(function() {
		FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') {
				console.log("user logged in, Facebook logout called");
			    FB.logout();
			    setLoggedOut();
			  } else {
				  console.log("user not logged in");
			  }
		});
	});
});


//Call to setup the page that the user is logged out
// facebook auth response
function setLoggedIn(response){
	
	console.log("function LOGGED IN called");
	
	$("#chat-facebook-login").attr("disabled","disabled");
	$("#chat-facebook-logout").removeAttr("disabled");
	
	
	FB.api('/me', {fields: ['last_name', "first_name", "picture"]}, function(response) {
		//alert(JSON.stringify(response));
		currentUserID = response.id;
		currentUserFirstName = response.first_name;
		currentUserLastName = response.last_name;
		currentUserFullName = response.first_name + " " + response.last_name;
		currentUserPictureURL = response.picture.data.url;
		
		console.log("currentUserID: " + currentUserID);
		console.log("currentUserFirstName: " + currentUserFirstName);
		console.log("currentUserLastName: " + currentUserLastName);
		console.log("currentUserFullName: " + currentUserFullName);
		console.log("currentUserPictureURL: " + currentUserPictureURL);
		
		$("#current-user").text("Welcome " + currentUserFullName);
		
		var posting = $.post(usersURI + "/add", {
			first_name : currentUserFirstName,
			last_name : currentUserLastName,
			id : currentUserID
		});
		
		posting.done(function(data) {
			alert(JSON.stringify(data));
		});
	});
	
	$("#chat-main-div").css("display","block");
	
	//welcome message!
	//disble login button
}

//Call the setup the page that the user is logged out
function setLoggedOut(){
	
	console.log("function LOGGED OUT called");
	currentUserID = null;
	currentUserFirstName = null;
	currentUserLastName = null;
	currentUserFullName = null;
	currentUserPictureURL = null;
	
	$("#chat-facebook-login").removeAttr("disabled");
	$("#chat-facebook-logout").attr("disabled","disabled");
	$("#current-user").text("");
	
	$("#chat-main-div").css("display","none");
}

function updateStatusCallback(status){
	console.log("used status callback, possible put into use for the login");
	
}

function setUserDEMO(){
	var input = $("#chat-user-id").attr("disabled","disabled");
	userID = input.val();
}

