
//Current room and message info
var currentRoomId;
var currentRoomName;
var currentRoomLastMessageId;

//Room URI's
var roomsURI = "REST/rooms";
var usersURI = "REST/users";

//Current user info
var currentUserID;
var currentUserFirstName;
var currentUserLastName;
var currentUserFullName;
var currentUserPictureURL;

var room_list = [];

//room id's known to page
var room_id_list = [];

//Interval storing message fect
var message_fetch_interval;

//list of users
var user_list = [];

//list of id's known to page
var user_id_list = [];

//blocker enabled if message spamming
var message_send_blocker = false;

//blocker enabled if room spamming
var create_room_blocker = false;

//default active room id (2 on sever)
var active_room_id = 2;

//default room id (2 on sever)
var default_room_id = 2;

//interupt boolean to stop fetches
var stop_fetches = false;

//Timeout controlling chat spam (can clear)
var chat_spam_timeout;

var stop_fetches_timeout;


/**
 * Joins chat rooms
 * @param room_id
 * @param alreadyConnected
 */
function joinRoom(room_id, alreadyConnected) {
	stop_fetches = false;
	//clear spam message blocker
	clearInterval(message_fetch_interval);
	currentRoomId = room_id;
	currentRoomLastMessageId = -1; //Ensure getting all messages
	
	//Get all messages from room
	var getRoomURI = roomsURI + "/" + room_id;
	var getting = $.get(getRoomURI);
	getting.done(function(data) {
		
		//Switch to room and update messages
		$("#chat-rooms-list").children("li[default_room!='true'][room_id]").remove();
		
		//default room creation handled elsewhere
		if(data.roomID != default_room_id){
			$("#chat-rooms-list").append(createRoomElement(data));
		}
		
		activateRoom(room_id);
		$("#chat-message-area-div").empty(); // empty the area
		message_fetch_interval = setInterval(function() {
			if(!stop_fetches){
				fetchMessages(room_id);
			}
		}, 100);
		
		//Already established to server, attempt drum room change
		if (alreadyConnected) {
			changeDrumRoom();
		}
	});
}

/**
 * Active room elements to current room
 * @param room_id
 */
function activateRoom(room_id) {
	active_room_id = room_id;
	$("#chat-rooms-list > li").removeAttr("class"); //removes active
	$("#chat-rooms-dropdown-list > li").removeAttr("class"); 
	$("#chat-rooms-list").children("li[room_id='" + room_id +  "']").attr("class","active");
}

/**
 * Update to new rooms to client currently known by the sever
 */
function updateRooms() {
	//Get on the already set rooms URI
	var getting = $.get(roomsURI);
	getting.done(function(data) {
		var rooms = JSON.parse(JSON.stringify(data));
		room_list = rooms;
		var new_room_id_list = []; // used to add new elements to switch too
		for (var i = 0; i < rooms.length; i++) {
			//Add new room id to room id list if the room is not known
			if($.inArray(rooms[i].roomID, room_id_list) == -1){ //-1 is false check
				room_id_list.push(rooms[i].roomID); //add to global list
				new_room_id_list.push(rooms[i].roomID); //add to local list
				//$("#chat-rooms-list").append(createRoomElement(rooms[i]));//add to screen
				$("#chat-rooms-dropdown-list").append(createRoomElement(rooms[i]));//add to screen
			}
			
			//Update current users count
			$("li[room_id =" + rooms[i].roomID + "]").children("a").text(rooms[i].name + " (" + rooms[i].userCount + ")" );
		}
		
		//Add all received id's to a list
		var recieved_room_id_list = [];
		for(var i = 0; i < rooms.length; i++){
			recieved_room_id_list.push(rooms[i].roomID);
		}
		
		//check the local list against the servers list, remove any missing
		for(var i = 0; i < room_id_list.length; i++){
			if($.inArray(room_id_list[i], recieved_room_id_list) == -1){
				//room is not in received room list, delete
				console.log("FOUND ROOM TO REMOVE");
				$("li[room_id =" + room_id_list[i] + "]").remove();
			}
		}
		
		activateRoom(active_room_id);
	});
}

function updateRoomCounts(rooms){
	$("li[room_id =" + rooms[i].roomID + "]").children("a").text(rooms[i].name + " (" + rooms[i].userCount + ")" );
}

/**
 * Creates room tab elements
 * @param room
 * @returns
 */
function createRoomElement(room){
	var room_li = 
	$(document.createElement("li"))
	.attr("class","")
	.attr("room_id", room.roomID)
	.append(
			$(document.createElement("a"))
			.attr("data-toggle", "tab")
			.text(room.name + " (" + room.userCount + ")" )
			.click(function (event){
				//Pauses message fetching, joins the room
				joinRoom($(event.target).parent().attr("room_id"), true);
			})
	);
	return room_li;
}

/**
 * Create new room with given name
 */
function generateNewRoom(name) {
	
	//send the request to the server
	var posting = $.post(roomsURI + "/add", {
		name : name
	});
	
	//Send new room to server
	posting.done(function(data) {
		var room = JSON.parse(JSON.stringify(data));
		//$("#chat-rooms-list").children("li[room_id!=2]").remove(); //remove the last room
		//$("#chat-rooms-list").append(createRoomElement(room)); //add this in it's place
		$("#chat-rooms-dropdown-list").append(createRoomElement(room));
		room_id_list.push(room.roomID);
		joinRoom(room.roomID,true);
	});
}

/**
 * Create chat panel
 */
function initChat() {
	//get latest rooms and users
	updateUsers();
	updateRooms();
	
	//Update regularly every second
	setInterval(function(){
		//Pause if wanted
		if(!stop_fetches){
			updateUsers();
			updateRooms();
		}
	},1000);
}

/**
 * Fetch messages for given room id
 * @param room_id
 */
function fetchMessages(room_id) {
	//Construct REST url
	var currentRoomURI = roomsURI + "/" + room_id + "/messages";
	var getting = $.get(currentRoomURI, {
		messageId : currentRoomLastMessageId
	});
	
	//send get for latest messages in room
	getting.done(function(data) {
		var messages = JSON.parse(JSON.stringify(data));
		var message_added = false;
		for (var i = 0; i < messages.length; i++) {
			
			if($("#chat-message-area-div").children("div[message_id=" + messages[i].messageId + "]").length){
				//Do nothing, this should not happen
				console.log("MESSAGE ALREADY EXISTS");
			} else {
				//iff message is new, add to currently displayed messages
				addChatMessageToArea(messages[i]);
				message_added = true;
				if (messages[i].messageId > currentRoomLastMessageId) {
					currentRoomLastMessageId = messages[i].messageId;
				}
			}
		}
		
		//Scroll to bottom of message window
		if (message_added) {
			$("#chat-message-area-div").scrollTop(
					$("#chat-message-area-div")[0].scrollHeight);
		}
	});
}

/**
 * Adds a room with the values of the room adding input field
 */
function addRoom() {
	var roomName = $('#add-room-name').val();
	var posting = $.post(roomsAddURI, {
		name : roomName
	});
	posting.done(function(data) {
		//Add room via rest api then join it
		var room = JSON.parse(JSON.stringify(data));
		joinRoom(room.roomId, true);
	});
}

/**
 * Send message to a room from a user
 * @param room_id
 * @param user_id
 */
function sendMessage(room_id, user_id) {
	
	//REST api uri
	var sendmessageRoomURI = roomsURI + "/" + room_id + "/messages"
	$("#chat-room-send-input").val();
	
	//Send message
	console.log(sendmessageRoomURI);
	var posting = $.post(sendmessageRoomURI, {
		userId : user_id,
		messageContent : $("#chat-room-send-input").val()
	});

}

/**
 * Gets the info 
 * @param user_id
 * @returns {___anonymous_user_info_check}
 */
function getUserInfoForMessage(user_id) {

	var user_info = null;
	//Iff user is in the know list of users
	if ($.inArray(user_id, user_id_list) != -1) {
		//find the user
		for (var i = 0; i < user_list.length; i++) {
			if (user_list[i].id == user_id) {
				//once found, return details
				user_info = {
					name : user_list[i].firstName + " " + user_list[i].lastName,
					profile_img_src : user_list[i].pictureURL
				};
				break;
			}
		}
	}
	
	//If no user is found, should be null
	return user_info;
}

/**
 * Updates the users, then executes a function upon finishing said update
 * @param func function to execture
 */
function updateUsersFunc(func) {
	
	//Get from the user URI
	var getting = $.get(usersURI);
	getting.done(function(data) {
		user_list = JSON.parse(JSON.stringify(data));
		//Add new users to the known user list
		for (var i = 0; i < user_list.length; i++) {
			if ($.inArray(user_list[i].id, user_id_list) == -1) {
				user_id_list.push(user_list[i].id);
			}
		}

		func();
	});
}

/**
 * Wrapper updateUsers when no functions is needed
 */
function updateUsers() {
	updateUsersFunc(function() {
	});
}

/**
 * Create a new message element from a user
 * @param message
 * @param user_info
 * @returns
 */
function createMessageElement(message, user_info) {
	var name = user_info.name;
	var img_src = user_info.profile_img_src;
	var message_div = $(document.createElement("div")).attr("message_id",
			message.messageId)
			.append(
					$(document.createElement("div"))
						.attr("class", "media well well-sm")
						.append(
							$(document.createElement("a"))
							.attr("class", "pull-left")
							.attr("href", "#")
							.append(
									$(document.createElement("img"))
									.attr("class", "media-object")
									.attr("src", img_src).attr("alt","profile")))
									.append(
											$(document.createElement("div"))
											.attr("class","media-body")
											.text(message.messageContent)
											.prepend(
													$(document.createElement("h4"))
													.attr("class","media-heading")
													.text(name))));
	return message_div;
}

/**
 * Adds message to chat area 
 * @param message
 */
function addChatMessageToArea(message) {
	
	//Check to see if users is found
	user_info_check = getUserInfoForMessage(message.userId);
	user_found = user_info_check == null ? false : true;
	func = function() {
		//Update function
		var user_info = getUserInfoForMessage(message.userId);
		if (user_info == null) {
			console.log("user info is null when it should not be");
		}
		$("#chat-message-area-div").append(createMessageElement(message, user_info));
	};

	//if found, update
	if (user_found) {
		func();
	} else {
		//If not found, update
		updateUsersFunc(func);
	}
}

/**
 * Send button has been pressed
 */
function sendButtonPressed() {
	
	//If not spamming
	if (!message_send_blocker) {
		//Room name
		var message_contents = $("#chat-room-send-input").val();
		if (message_contents !== "") {
			message_send_blocker = true;
			chat_spam_timeout = setTimeout(function(){message_send_blocker = false;}, 100);
			sendMessage(active_room_id, currentUserID);
			$("#chat-room-send-input").val(""); //empty the comments
		} else {
			//if tried to enter a blank message
			$("#chat-room-send-button").attr("data-content","Enter a message to send").popover("toggle");
			setTimeout(function(){
				$("#chat-room-send-button").popover("toggle");
			}, 1000);
		}
	} else {
		
		//Deal with spamming
		clearTimeout(chat_spam_timeout);
		$("#chat-room-send-button").attr("data-content","You're entering messages too quickly").popover("toggle");
		setTimeout(function(){
			message_send_blocker = false;
			$("#chat-room-send-button").popover("toggle");
		},5000);
	}
}

/**
 * Create room button pressed
 * Create a room with the name of the input next to pressed button
 */
function createRoomButtonPressed() {
	//if not spamming
	if (!create_room_blocker) {
		var room_name = $("#chat-room-add-input").val();
		//iff not empty room
		if (room_name !== "") {
			create_room_blocker = true;
			room_spam_timeout = setTimeout(function(){create_room_blocker = false;}, 3000);
			generateNewRoom(room_name);
			$("#chat-room-add-input").val("");
		} else {
			//Iff entered blank room, prompt them
			$("#chat-room-add-button").attr("data-content","Enter a room name").popover("toggle");
			setTimeout(function(){
				$("#chat-room-add-button").popover("toggle");
			},1000);
		}
	} else {
		//Deal with spamming
		clearTimeout(room_spam_timeout);
		$("#chat-room-add-button").attr("data-content","You're making rooms too quickly").popover("toggle");
		setTimeout(function(){
			create_room_blocker = false;
			$("#chat-room-add-button").popover("toggle");
		},10000);
	}
}

/**
 * Set's up initial login
 */
function setupLogin() {
	$("#guest-username-input").val(""); // clear guest username
}

/**
 * Login sequence when logging in as a guest
 */
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
		//Prompt to entere a name
		$("#guest-username-submit-button").attr("data-content","Enter a name").popover("toggle");
		setTimeout(function(){
			$("#guest-username-submit-button").popover("toggle");
		}, 1000);
	}
}


/*
 * Set's current user info
 */
function setCurrentUserInfo(){
	$("#current-user-picture").attr("src", currentUserPictureURL);
	$("#current-user-name").text(currentUserFullName);
	$("#chat-current-user-div").css("display","block");
}

/**
 * Set logged in status of guest
 * @param user_response
 */
function setLoggedInGuest(user_response){

	//set vairables
	currentUserID = user_response.id;
	currentUserFirstName = user_response.firstName;
	currentUserLastName = user_response.lastName;
	currentUserFullName = user_response.firstName + " " + user_response.lastName;
	currentUserPictureURL = user_response.pictureURL;

	//echo to console
	console.log("currentUserID: " + currentUserID);
	console.log("currentUserFirstName: " + currentUserFirstName);
	console.log("currentUserLastName: " + currentUserLastName);
	console.log("currentUserFullName: " + currentUserFullName);
	console.log("currentUserPictureURL: " + currentUserPictureURL);
	
	//setup global vars with new user
	setCurrentUserInfo();
	user_list.push(user_response);
	user_id_list.push(user_response.id);
	
	//enable chat window adn connec to drums
	$("#drumkit").show();
	$("#chat-main-div").show();
	realignSVG();
	
	$('#login-modal').modal('toggle');	
	stompClient = null;
	drumsConnect();
	
	//connect to default room
	var defaultRoom = room_list[0];
	$("#chat-rooms-list").append(createRoomElement(defaultRoom).attr("default_room","true"));
	
	joinRoom(default_room_id, false);
}

/**
 * Gets a randomly generated name from REST api 
 */
function populateGuestNameRandom() {
	var randomNameURI = usersURI + "/random_name";
	var getting = $.get(randomNameURI);
	//Gets name value
	getting.done(function(data) {
		var name = JSON.parse(JSON.stringify(data));
		$("#guest-username-input").val(name.fullname);
	});
}

/**
 * Setup functions called on load
 */
$( document ).ready(function() {
	
	//Foce logout regardless
	setLoggedOut();
	
	//Setup requests for facebook API integration
	$.ajaxSetup({ cache: true });
	$.getScript('//connect.facebook.net/en_UK/all.js', function(){
	    FB.init({
	      appId: '233440613522080', //TooManyDrummers app id
	    });     
	    $('#loginbutton,#feedbutton').removeAttr('disabled');
	    FB.getLoginStatus();
	});
	
	//facebook login button click bind
	$("#chat-facebook-login").click(function() {
		FB.getLoginStatus(function(response) {
			//If already logged in, continue
			if (response.status === 'connected') {
			    console.log('user already logged in');
			    setLoggedIn(response);
			  }
			  else {
				console.log("user not logged in, Facebook login called");
				FB.login(function(response) {
					   if (response.authResponse) {
						   
					     setLoggedIn(response);
					   } else {
						   //do nothing
					   }
				});
			  }
		});
	});
	
	
	//Add room button bind
	$("#chat-room-add-button").click(function(){
		createRoomButtonPressed();
	});
	
	
	// Add room text input enter key bind
	$( "#chat-room-add-input" ).on( "keydown", function( event ) {
		if(event.which == 13){
			createRoomButtonPressed();
		}
	});
	
	//Send message button bind
	$("#chat-room-send-button").click(function(){
		sendButtonPressed();
	});
	
	//Send message input bind enter key
	$( "#chat-room-send-input" ).on( "keydown", function( event ) {
		if(event.which == 13){
			sendButtonPressed();
		}
	});
	
	//Guest login button toggle
	$("#chat-guest-login").click(function(event){
		if($(event.target).hasClass('active')){
			$("#guest-inputs").css("display", "none");
		} else {
			$("#guest-inputs").css("display", "table");
		}
	});
	
	//Guest random name bind
	$("#guest-username-random-button").click(function(event){
		populateGuestNameRandom();
	});
	
	//Guset name submit bind
	$("#guest-username-submit-button").click(function(event){
		loginGuest();
	});
	
	//Guest input enter key bind
	$( "#guest-username-input" ).on( "keydown", function( event ) {
		if(event.which == 13){
			loginGuest();
		}
	});
	
	//chat rooms drop down bind
	$("#chat-rooms-drop-down-toggle").click(function(event){
		stop_fetches = true;
		clearTimeout(stop_fetches_timeout);
		stop_fetches_timeout = setTimeout(function(){stop_fetches=false;},5000); //make sure this gets reset eventually
	});
	
	//login modal properties to dissallow escaping
	$("#login-modal").modal({
		  backdrop: 'static',
		  keyboard: false
	});
	
	//User signout button bind
	$("#user-logout-button").click(function(){
		location.reload();
	});
	
	//Lastely, initialise chat
	initChat();
});


/**
 * Set facebook logged in, deal with facebook response
 * @param response
 */
function setLoggedIn(response) {

	console.log("function LOGGED IN called");
	$("#chat-facebook-login").attr("disabled", "disabled"); //disble facebook login after being clicked
	FB.api('/me', {
		fields : [ 'last_name', "first_name", "picture" ]
	}, function(response) {
		
		//Setup current user from facebook response
		currentUserID = response.id;
		currentUserFirstName = response.first_name;
		currentUserLastName = response.last_name;
		currentUserFullName = response.first_name + " " + response.last_name;
		currentUserPictureURL = response.picture.data.url;
		
		//echo to console
		console.log("currentUserID: " + currentUserID);
		console.log("currentUserFirstName: " + currentUserFirstName);
		console.log("currentUserLastName: " + currentUserLastName);
		console.log("currentUserFullName: " + currentUserFullName);
		console.log("currentUserPictureURL: " + currentUserPictureURL);

		//Once user initalised locally, add to server via rest
		$("#current-user").text("Welcome " + currentUserFullName);
		var posting = $.post(usersURI + "/add_fb", {
			first_name : currentUserFirstName,
			last_name : currentUserLastName,
			id : currentUserID
		});

		//After recieving the post confirmation, initalise user
		posting.done(function(data) {
			var user = JSON.parse(JSON.stringify(data));
			user_list.push(user);
			user_id_list.push(user.id);
			
			//setup user area
			setCurrentUserInfo();
			$("#drumkit").show();
			$("#chat-main-div").show();
			realignSVG();
			stompClient = null;
			drumsConnect();
			$('#login-modal').modal('toggle');
			
			//connect to default room
			var defaultRoom = room_list[0];
			$("#chat-rooms-list").append(createRoomElement(defaultRoom).attr("default_room","true"));
			
			joinRoom(default_room_id,false);
		});
	});
}

//Set facebook and guest to logged out, clean slate before continue to login
function setLoggedOut() {
	//clean up the user before initailising
	currentUserID = null;
	currentUserFirstName = null;
	currentUserLastName = null;
	currentUserFullName = null;
	currentUserPictureURL = null;

	
	//Disable the components on screen
	$("#chat-facebook-login").removeAttr("disabled");
	$("#chat-facebook-logout").attr("disabled", "disabled");
	$("#current-user").text("");
	
	$("#drumkit").hide();
	$("#chat-main-div").hide();
}

