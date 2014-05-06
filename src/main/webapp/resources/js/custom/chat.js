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

var default_room_id = 2;

var stop_fetches = false;

var chat_spam_timeout;

function joinRoom(room_id, alreadyConnected) {
	
	clearInterval(message_fetch_interval);

	currentRoomId = room_id;
	currentRoomLastMessageId = -1;
	var getRoomURI = roomsURI + "/" + room_id;
	var getting = $.get(getRoomURI);

	getting.done(function(data) {
		var room = JSON.parse(JSON.stringify(data));
		activateRoom(room_id);
		$("#chat-message-area-div").empty(); // empty the area
		message_fetch_interval = setInterval(function() {
			if(!stop_fetches){
				fetchMessages(room_id);
			}
		}, 100);

		if (alreadyConnected) {
			changeDrumRoom();
		}
	});

	// window.setInterval(fetchMessages(), 100);

}

function activateRoom(room_id) {
	active_room_id = room_id;
	$("#chat-rooms-list > li").removeAttr("class");
	$("#chat-rooms-dropdown-list > li").removeAttr("class");
	$("#chat-rooms-list").children("li[room_id='" + room_id +  "']").attr("class","active");
}

function updateRooms() {
	var getting = $.get(roomsURI);

	getting.done(function(data) {
		var rooms = JSON.parse(JSON.stringify(data));
		// [{"name":"default","roomID":1,"messages":[]}]
		// alert(JSON.stringify(data));
		// Check if room id is in room ID list
		var new_room_id_list = []; // used to add new elements to switch too
		for (var i = 0; i < rooms.length; i++) {

			if($.inArray(rooms[i].roomID, room_id_list) == -1){ //-1 is false check
				room_id_list.push(rooms[i].roomID); //add to global list
				new_room_id_list.push(rooms[i].roomID); //add to local list
				$("#chat-rooms-list").append(createRoomElement(rooms[i]));//add to screen
				$("#chat-rooms-dropdown-list").append(createRoomElement(rooms[i]));//add to screen
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
			.attr("data-toggle", "tab")
			.text(room.name)
			.click(function (event){
				stop_fetches = false;
				joinRoom($(event.target).parent().attr("room_id"), true);
			})
	);
	return room_li;
}

function generateNewRoom(name) {
	var posting = $.post(roomsURI + "/add", {
		name : name
	});

	posting.done(function(data) {
		var room = JSON.parse(JSON.stringify(data));
		$("#chat-rooms-list").append(createRoomElement(room));
		$("#chat-rooms-dropdown-list").append(createRoomElement(room));
		room_id_list.push(room.roomID);
		joinRoom(room.roomID,true);
	});
}

function initChat() {
	updateUsers();
	updateRooms();
	
	setInterval(function(){
		
		if(!stop_fetches){
			updateUsers();
			updateRooms();
		}
	},1000);

}

/*
 * function startInterval(){ window.setInterval(fuction(){ fetchMessages();
 * },100); }
 */

function fetchMessages(room_id) {
	console.log("FETCH MESSAGE ENTERED");
	var currentRoomURI = roomsURI + "/" + room_id + "/messages";
	// alert(currentRoomURI);
	var getting = $.get(currentRoomURI, {
		messageId : currentRoomLastMessageId
	});

	// console.log(currentRoomURI);
	// console.log(currentRoomLastMessageId);
	getting.done(function(data) {
		// alert(JSON.stringify(data));
		var messages = JSON.parse(JSON.stringify(data));
		
		//[{"messageId":1,"userId":1,"messageContent":"hello"},{"messageId":2,"userId":2,"messageContent":"goodbye"}]
		// WRITE MESSAGES TO MESSAGE AREA
		// alert(messages[0].messageContent);

		var message_added = false;
		
		for (var i = 0; i < messages.length; i++) {
			// Add to chat

			console.log("MESSAGE ADDING");
			
			if($("#chat-message-area-div").children("div[message_id=" + messages[i].messageId + "]").length){
				console.log("MESSAGE ALREADY EXISTS");
			} else {
				addChatMessageToArea(messages[i]);
				message_added = true;
				if (messages[i].messageId > currentRoomLastMessageId) {
					// update last message displayed
					currentRoomLastMessageId = messages[i].messageId;
				}
			}

		}

		// $("div[message_id=" + currentRoomLastMessageId+ "]").focus();
		if (message_added) {
			$("#chat-message-area-div").scrollTop(
					$("#chat-message-area-div")[0].scrollHeight);
		}
	});
}

function addRoom() {
	// alert(roomsAddURI);
	var roomName = $('#add-room-name').val();
	var posting = $.post(roomsAddURI, {
		name : roomName
	});
	posting.done(function(data) {

		// alert(JSON.stringify(data));
		// Join room after adding
		var room = JSON.parse(JSON.stringify(data));
		joinRoom(room.roomId, true);

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

function addDummyMessage() {
	$("#chat-message-area").append(""

	);
}

// function tryJ/oinRoom() {
// var roomId = $('#j/oin-room-id').val();
// var roomName = "unknown";
// j/oinRoom(roomId, roomName);
// }

function getUserInfoForMessage(user_id) {
	// var user_info = {
	// name : "UNKNOWN_USER" //"Henry Tesei"
	// , profile_img_src : "" //"http://graph.facebook.com/518733135/picture"
	// };

	// user_info = null;

	// for(var i = 0; i < user_list.length; i++){
	// if(user_list[i].id == user_id){
	// user_info.name = user_list[i].firstName + " " + user_list[i].lastName;
	// user_info.profile_img_src = user_list[i].pictureURL;
	// break;
	// }
	// }

	var user_info = null;

	// console.log("### START GET USER INFO ###");
	// console.log(user_id);
	// console.log(user_list);
	// console.log(user_id_list);
	// console.log($.inArray(user_id, user_id_list) != -1);
	if ($.inArray(user_id, user_id_list) != -1) {
		for (var i = 0; i < user_list.length; i++) {
			if (user_list[i].id == user_id) {
				user_info = {
					name : user_list[i].firstName + " " + user_list[i].lastName,
					profile_img_src : user_list[i].pictureURL
				};
				break;
				console.log("use found inside get user info");
			}
		}
	}

	// console.log("### END GET USER INFO ###");
	return user_info;
}

function updateUsersFunc(func) {

	var getting = $.get(usersURI);

	getting.done(function(data) {
		user_list = JSON.parse(JSON.stringify(data));
		// alert(JSON.stringify(data));
		for (var i = 0; i < user_list.length; i++) {
			if ($.inArray(user_list[i].id, user_id_list) == -1) {
				user_id_list.push(user_list[i].id);
				// console.log("user " + user_list[i].id + " added");
			}
		}

		// console.log(user_id_list);
		// console.log(user_list);
		// console.log("calling func");
		func();
	});
}

function updateUsers() {
	updateUsersFunc(function() {
		// do nothing
	});
}

function createNewRoom() {

}

var message_counter = 0;

function createMessageElement(message, user_info) {
	var name = user_info.name;
	var img_src = user_info.profile_img_src;
	var message_div = $(document.createElement("div")).attr("message_id",
			message.messageId).append(
			$(document.createElement("div"))
					.attr("class", "media well well-sm").append(
							$(document.createElement("a")).attr("class",
									"pull-left").attr("href", "#").append(
									$(document.createElement("img")).attr(
											"class", "media-object").attr(
											"src", img_src).attr("alt",
											"profile"))).append(
							$(document.createElement("div")).attr("class",
									"media-body").text(message.messageContent)
									.prepend(
											$(document.createElement("h4"))
													.attr("class",
															"media-heading")
													.text(name))));

	return message_div;
}

function addChatMessageToArea(message) {
	user_info_check = getUserInfoForMessage(message.userId);
	user_found = user_info_check == null ? false : true;
	console.log(user_found);

	func = function() {
		var user_info = getUserInfoForMessage(message.userId);
		if (user_info == null) {
			console.log("user info is null when it should not be");
		}
		$("#chat-message-area-div").append(
				createMessageElement(message, user_info));
	};

	if (user_found) {
		console.log("user found");
		console.log(user_info_check.name);
		func();
	} else {
		console.log("user not found");
		updateUsersFunc(func);
	}
}

function sendButtonPressed() {
	console.log("chat room sent");

	if (!message_send_blocker) {

		var message_contents = $("#chat-room-send-input").val();

		if (message_contents !== "") {

			message_send_blocker = true;
			
			chat_spam_timeout = setTimeout(function(){message_send_blocker = false;}, 100);
			
			sendMessage(active_room_id, currentUserID);

			$("#chat-room-send-input").val("");
		} else {
			$("#chat-room-send-button").attr("data-content","Enter a message to send").popover("toggle");
			setTimeout(function(){
				$("#chat-room-send-button").popover("toggle");
			}, 1000);
		}

	} else {
		clearTimeout(chat_spam_timeout);
		$("#chat-room-send-button").attr("data-content","You're entering messages too quickly").popover("toggle");
		setTimeout(function(){
			message_send_blocker = false;
			$("#chat-room-send-button").popover("toggle");
		},5000);
	}

}

function createRoomButtonPressed() {

	if (!create_room_blocker) {

		var room_name = $("#chat-room-add-input").val();

		if (room_name !== "") {

			create_room_blocker = true;
			
			room_spam_timeout = setTimeout(function(){create_room_blocker = false;}, 3000);
			
			generateNewRoom(room_name);

			$("#chat-room-add-input").val("");
			
		} else {
			$("#chat-room-add-button").attr("data-content","Enter a room name").popover("toggle");
			setTimeout(function(){
				$("#chat-room-add-button").popover("toggle");
			},1000);
		}

	} else {
		clearTimeout(room_spam_timeout);
		$("#chat-room-add-button").attr("data-content","You're making rooms too quickly").popover("toggle");
		setTimeout(function(){
			create_room_blocker = false;
			$("#chat-room-add-button").popover("toggle");
		},10000);
	}
}

function setupLogin() {
	$("#guest-username-input").val(""); // clear guest username
	// REMOVE ATTRS ALSO
}

function loginGuest(){
	
	var username_input = $("#guest-username-input").val();
	
	if(username_input != ""){
		var posting = $.post(usersURI + "/add_guest", {
			name : username_input
		});
		
		posting.done(function(data){
			//alert(JSON.stringify(data));
			setLoggedInGuest(JSON.parse(JSON.stringify(data)));
		});
	} else {
		$("#guest-username-submit-button").attr("data-content","Enter a name").popover("toggle");
		setTimeout(function(){
			$("#guest-username-submit-button").popover("toggle");
		}, 1000);
	}
	

}

function setCurrentUserInfo(){
	$("#current-user-picture").attr("src", currentUserPictureURL);
	$("#current-user-name").text(currentUserFullName);
	$("#chat-current-user-div").css("display","block");
	console.log("CURRENT USER INFO SET");
}

function setLoggedInGuest(user_response){
console.log("function GUEST LOGGED IN called");
	
	currentUserID = user_response.id;
	currentUserFirstName = user_response.firstName;
	currentUserLastName = user_response.lastName;
	currentUserFullName = user_response.firstName + " " + user_response.lastName;
	currentUserPictureURL = user_response.pictureURL;

	console.log("currentUserID: " + currentUserID);
	console.log("currentUserFirstName: " + currentUserFirstName);
	console.log("currentUserLastName: " + currentUserLastName);
	console.log("currentUserFullName: " + currentUserFullName);
	console.log("currentUserPictureURL: " + currentUserPictureURL);
	
	setCurrentUserInfo();
	
	user_list.push(user_response);
	user_id_list.push(user_response.id);
	
	$("#chat-main-div").css("display","block");
	$('#login-modal').modal('toggle');
//	drumsDisconnect();
	
	stompClient = null;
	drumsConnect();
	joinRoom(default_room_id, false);

}

function populateGuestNameRandom() {
	var randomNameURI = usersURI + "/random_name";
	var getting = $.get(randomNameURI);

	getting.done(function(data) {
		var name = JSON.parse(JSON.stringify(data));
		$("#guest-username-input").val(name.fullname);
	});
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
		//alert("clicked chat");
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
	
	$("#guest-username-random-button").click(function(event){
		populateGuestNameRandom();
	});
	
	$("#guest-username-submit-button").click(function(event){
		loginGuest();
	});
	
	$( "#guest-username-input" ).on( "keydown", function( event ) {
		if(event.which == 13){
			loginGuest();
		}
	});
	
	$("#chat-rooms-drop-down-toggle").click(function(event){
		//alert("You have been alerted");
		stop_fetches = true;
	});
	
	$("#login-modal").modal({
		  backdrop: 'static',
		  keyboard: false
	});
	
	$("#user-logout-button").click(function(){
		location.reload();
	});

	
	initChat();
	
});

// Call to setup the page that the user is logged out
// facebook auth response
function setLoggedIn(response) {

	console.log("function LOGGED IN called");

	$("#chat-facebook-login").attr("disabled", "disabled");
	$("#chat-facebook-logout").removeAttr("disabled");

	FB.api('/me', {
		fields : [ 'last_name', "first_name", "picture" ]
	}, function(response) {
		// alert(JSON.stringify(response));
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

		var posting = $.post(usersURI + "/add_fb", {
			first_name : currentUserFirstName,
			last_name : currentUserLastName,
			id : currentUserID
		});

		posting.done(function(data) {
			// alert(JSON.stringify(data));

			var user = JSON.parse(JSON.stringify(data));
			user_list.push(user);
			user_id_list.push(user.id);
			
			setCurrentUserInfo();
			$("#chat-main-div").css("display","block");
//			drumsDisconnect();
			stompClient = null;
			drumsConnect();
			joinRoom(default_room_id,false);
			$('#login-modal').modal('toggle');
		});
	});

	// welcome message!
	// disble login button
}

// Call the setup the page that the user is logged out
function setLoggedOut() {

	console.log("function LOGGED OUT called");
	currentUserID = null;
	currentUserFirstName = null;
	currentUserLastName = null;
	currentUserFullName = null;
	currentUserPictureURL = null;

	$("#chat-facebook-login").removeAttr("disabled");
	$("#chat-facebook-logout").attr("disabled", "disabled");
	$("#current-user").text("");

	$("#chat-main-div").css("display", "none");
}

function updateStatusCallback(status) {
	console.log("used status callback, possible put into use for the login");

}

function setUserDEMO() {
	var input = $("#chat-user-id").attr("disabled", "disabled");
	userID = input.val();
}
