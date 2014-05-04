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

<!-- FACEBOOK -->
<!-- <script>
      window.fbAsyncInit = function() {
        FB.init({
          appId      : '1483054771924097',
          xfbml      : true,
          version    : 'v2.0',
          status     : true
        });
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
</script> -->

<title>Chatroom</title>
</head>
<body>
	<h2>CHAT</h2><!-- 
	<div id="fb-root"><div class="fb-login-button" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="false"></div></div>
	 -->
	 <div id="current-user">
	 	
	 </div>
	 <div id="facebook-buttons">
		<button id="chat-facebook-login" class="btn btn-success">Login</button>
		<button id="chat-facebook-logout" class="btn btn-danger">Logout</button>
	</div>
	<div id="chat-main-div">
		<!-- 
	https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t1.0-1/s50x50/1467218_10152405394208136_831500500_t.jpg
	
	
	
	 -->
<!-- 		<div id="testing">
			<button id="das-boot" onclick="" class="btn btn-warning">Das
				Boot</button>
			<button id="das-add-message" onclick="" class="btn btn-warning">Das
				Add Message</button>
		</div> -->
		<div id="chat-control-area-div">
			<!-- 			<div id="chat-signin-div">
				User ID: <input id="chat-user-id" type="text" />
				<button id="chat-signin-button" class="btn btn-primary">Sign-In ID</button>
			</div> -->
			<div id="chat-rooms-create-div" class="input-group">
				<span class="input-group-btn"><button
						id="chat-room-add-button" class="btn btn-success">Create</button></span>
				<input id="chat-room-add-input" type="text" class="form-control"
					placeholder="enter a room name here" />
			</div>
			<div id="chat-rooms-list-div">
				<ul id="chat-rooms-list" class="nav nav-tabs nav-justified">
					<!-- 					<li class="active"><a onclick="alert();">Default</a></li>
					<li><a onclick="alert();">dummy</a></li>
					<li><a onclick="alert();">dummy</a></li> -->
				</ul>
			</div>
			<!-- /input-group -->

			<!-- 			<div class="input-group input-group-md">
          		<span class="input-group-btn">
            		<button id="ButtonSearch" class="btn btn-success btn-md" onclick="SearchItem()" title="Suchen">Hello</button>
            	</span>
          		<input class="form-control" placeholder="search" type="text">
        	</div> -->
		</div>
		<div id="chat-message-area-div"></div>
		<div id="chat-message-controls-div" class="input-group input-group-md">
			<span class="input-group-btn">
				<button id="chat-room-send-button" class="btn btn-primary btn-md">Send</button>
			</span> <input id="chat-room-send-input" type="text" class="form-control"
				placeholder="enter your message here" />
		</div>

	</div>

	<fb:login-button scope="public_profile,email" onlogin="checkLoginState();">
</fb:login-button>

<div id="status">
</div>

</body>
</body>
</html>
