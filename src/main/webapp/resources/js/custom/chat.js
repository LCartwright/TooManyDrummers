/**
 * 
 */
var currentRoomId;
var currentRoomName;
var currentRoomLastMessageId;

var roomsURI = "REST/rooms";
var usersURI = "REST/users";
	
var currentUserID;
var currentUserFirstName;
var currentUserLastName;
var currentUserFullName;
var currentUserPictureURL;

var active_room_id = 1;

var room_id_list = [];

var message_fetch_interval;

var user_list = [];

var user_id_list = [];

var message_send_blocker = false;

var create_room_blocker = false;

function joinRoom(room_id) {
	
	clearInterval(message_fetch_interval);
	
	currentRoomId = room_id;
	currentRoomLastMessageId = -1;
	var getRoomURI = roomsURI + "/" + room_id
	var getting = $.get(getRoomURI);
	
	getting.done(function(data) {
		//alert("done");
		var room = JSON.parse(JSON.stringify(data));
		activateRoom(room_id);
		$("#chat-message-area-div").empty(); // empty the area
		message_fetch_interval = setInterval(function() {
			fetchMessages(room_id);
		}, 100);
	});
	
	//window.setInterval(fetchMessages(), 100);

}

function activateRoom(room_id){
	active_room_id = room_id;
	$("#chat-rooms-list > li").removeAttr("class");
	$("li[room_id='" + room_id +  "']").attr("class","active");
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
			
//			console.log(rooms[i].roomID);
//			console.log(room_id_list);
//			console.log($.inArray(rooms[i].roomID, room_id_list));

			if($.inArray(rooms[i].roomID, room_id_list) == -1){ //-1 is false check
				room_id_list.push(rooms[i].roomID); //add to global list
				new_room_id_list.push(rooms[i].roomID); //add to local list
				$("#chat-rooms-list").append(createRoomElement(rooms[i])); //add to screen
			}
		}
		
		activateRoom(active_room_id);
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
			.text(room.name)
			.click(function (event){
				joinRoom($(event.target).parent().attr("room_id"));
			})
	);
	return room_li;
}

function generateNewRoom(name){
	var posting = $.post(roomsURI + "/add", {name : name});
	
	posting.done(function(data){
		var room = JSON.parse(JSON.stringify(data));
		$("#chat-rooms-list").append(createRoomElement(room));
		room_id_list.push(room.roomID);
	});
}

function initChat(){
	updateUsers();
	updateRooms();
	joinRoom(1);
	//hacky for now

}


/* function startInterval(){
	window.setInterval(fuction(){
		fetchMessages();
	},100);
} */

function fetchMessages(room_id) {
	var currentRoomURI = roomsURI + "/" + room_id + "/messages";
	//alert(currentRoomURI);
	var getting = $.get(currentRoomURI, {
		messageId : currentRoomLastMessageId
	});
	
	//console.log(currentRoomURI);
	//console.log(currentRoomLastMessageId);
	getting.done(function(data) {
		//alert(JSON.stringify(data));
		var messages = JSON.parse(JSON.stringify(data));
		
		//[{"messageId":1,"userId":1,"messageContent":"hello"},{"messageId":2,"userId":2,"messageContent":"goodbye"}]
		// WRITE MESSAGES TO MESSAGE AREA
		//alert(messages[0].messageContent);
		
		var message_added = false;
		for (var i = 0; i < messages.length; i++) {
			//Add to chat
			
			console.log("MESSAGE ADDING");
			
			if($("div[message_id=" + messages[i].messageId + "]").length){
				console.log("MESSAGE ALREADY EXISTS");
			} else {
				addChatMessageToArea(messages[i]);
				message_added = true;
				if (messages[i].messageId > currentRoomLastMessageId) {
					//update last message displayed
					currentRoomLastMessageId = messages[i].messageId;
				}
			}

		}

		//$("div[message_id=" + currentRoomLastMessageId+ "]").focus();
		if(message_added){
			$("#chat-message-area-div").scrollTop($("#chat-message-area-div")[0].scrollHeight);
		}
	});
}

function addRoom() {
	//alert(roomsAddURI);
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

function sendMessage(room_id, user_id) {
	
	var sendmessageRoomURI = roomsURI + "/" + room_id + "/messages" 
	$("#chat-room-send-input").val();
	
	console.log(sendmessageRoomURI);
	var posting = $.post(sendmessageRoomURI, {
		userId : user_id,
		messageContent : $("#chat-room-send-input").val()
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
			name : "UNKNOWN_USER" //"Henry Tesei"
		,	profile_img_src : "" //"http://graph.facebook.com/518733135/picture"
	};
	
	
	for(var i = 0; i < user_list.length; i++){
		if(user_list[i].id == user_id){
			user_info.name = user_list[i].firstName + " " + user_list[i].lastName;
			user_info.profile_img_src = user_list[i].pictureURL;
			break;
		}
	}
	
	if($.inArray(user_id, user_id_list) != -1){
		for(var i = 0; i < user_list.length; i++){
			if(user_list[i].id == user_id){
				user_info.name = user_list[i].firstName + " " + user_list[i].lastName;
				user_info.profile_img_src = user_list[i].pictureURL;
				break;
			}
		}
	} else {
		updateUsers();
	}

	return user_info;
}

function updateUsers(){
	
	var getting = $.get(usersURI);
	
	getting.done(function (data){
		user_list = JSON.parse(JSON.stringify(data));
		for(var i = 0; i < user_list.length; i++){
			if($.inArray(user_list[i].id, user_id_list) == -1){
				user_id_list.push(user_list[i].id);
			}
		}
	});
}

function createNewRoom(){
	
}

var message_counter = 0;

function createMessageElement(message){
	var user_info = getUserInfoForMessage(message.userId);
	var name = user_info.name;
	var img_src = user_info.profile_img_src;
	var message_div = 
	$(document.createElement("div")).attr("message_id",message.messageId)
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
					.text(message.messageContent)
					.prepend(
							$(document.createElement("h4"))
							.attr("class", "media-heading")
							.text(name)
					)
			)
	);
		
	
	return message_div;
}

function addChatMessageToArea(message){
	$("#chat-message-area-div").append(
			createMessageElement(message)
	);
}

function sendButtonPressed(){
	console.log("chat room sent");
	
	if(!message_send_blocker){
		
		var message_contents = $("#chat-room-send-input").val();
		
		if(message_contents !== ""){
			
			message_send_blocker = true;
			
			setTimeout(function(){message_send_blocker = false;}, 3000);
			
			sendMessage(active_room_id, currentUserID);
			
			$("#chat-room-send-input").val("");
		}
		
	} else {
		alert("SLOW DOWN"); // DO something else
	}
	
}

function createRoomButtonPressed(){

	if(!create_room_blocker){
		
		var room_name = $("#chat-room-add-input").val();

		if(room_name !== ""){

			create_room_blocker = true;
			
			setTimeout(function(){create_room_blocker = false;}, 3000);
			
			generateNewRoom(room_name);
			
			$("#chat-room-add-input").val("");
			
		}
		
	} else {
		alert("STOP CREATING ROOMS");
	}
}

$( document ).ready(function() {
	
	// BUTTON_ASSIGNMENTS
	//First set the user as logged out
	setLoggedOut();
	
	//Assign controls to all buttons
	
	$("#chat-signin-button").click(function() {
		setUserDEMO();
		console.log("UserID: " + userID);
	});
	
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function(){
	    FB.init({
	      appId: '233440613522080',
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
	
	$("#chat-room-add-button").click(function(){
		alert("clicked chat");
		createRoomButtonPressed();
	});
	
	$( "#chat-room-add-input" ).on( "keydown", function( event ) {
		if(event.which == 13){
			createRoomButtonPressed();
		}
	});
	
	$("#chat-room-send-button").click(function(){
		sendButtonPressed();
	});
	
	$( "#chat-room-send-input" ).on( "keydown", function( event ) {
		if(event.which == 13){
			sendButtonPressed();
		}
	});
	
	$("#chat-guest-login").click(function(event){
		if($(event.target).hasClass('active')){
			$("#guest-inputs").css("display", "none");
		} else {
			$("#guest-inputs").css("display", "table");
		}
//		$(this).hasClass('disabled') // for disabled states
//		$(this).hasClass('active') // for active states
//		$(this).is(':disabled') // for disabled buttons only
	});
	
	
	initChat();
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
		
		////
		connect();
		////
		
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
			//alert(JSON.stringify(data));
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

