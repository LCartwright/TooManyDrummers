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

   <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
	<div class="container">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse"
				data-target=".navbar-collapse">
				<span class="sr-only">Toggle navigation</span> <span
					class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">Too Many Drummers</a>
		</div>
		<div class="collapse navbar-collapse">
			<ul class="nav navbar-nav">
				<li class="active">
				<li>
					<button class="btn btn-primary btn-lg" data-toggle="modal" data-target="#myModal">
  						Launch demo modal
					</button>
				</li>
			</ul>
		</div>
		<!--/.nav-collapse -->
	</div>
</div>



<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
       <!--  <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> -->
        <h4 class="modal-title" id="myModalLabel">Choose login service</h4>
      </div>
      <div class="modal-body">
		<div id="facebook-buttons">
			
<!-- 			<button id="chat-facebook-logout" class="btn btn-danger">Logout</button> -->
		</div>
		<div id="login-buttons">
			<button id="chat-facebook-login" class="btn btn-primary">Facebook</button>
			<button id="chat-guest-login" class="btn btn-success" data-toggle="button">Guest</button>
		</div>

		<div id="guest-inputs" class="input-group">
			<input id="fack" type="text" class="form-control" placeholder="enter a username here" />
			<span class="input-group-btn">
				<button id="fuck" class="btn btn-success">Go!</button>
			</span>
		</div>
      </div>
<!--       <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div> -->
    </div>
  </div>
</div>

	<div id="chat-main-div">

		<div id="chat-control-area-div">
			<div id="chat-rooms-create-div" class="input-group">
				<span class="input-group-btn">
					<button id="chat-room-add-button" class="btn btn-success">Create Room</button>
				</span>
				<input id="chat-room-add-input" type="text" class="form-control"
					placeholder="enter a room name here" />
			</div>
			<div id="chat-rooms-list-div">
				<ul id="chat-rooms-list" class="nav nav-tabs nav-justified">
				</ul>
			</div>
		</div>
		<div id="chat-message-area-div"></div>
		<div id="chat-message-controls-div" class="input-group input-group-md">
			<span class="input-group-btn">
				<button id="chat-room-send-button" class="btn btn-primary btn-md">Send</button>
			</span> <input id="chat-room-send-input" type="text" class="form-control"
				placeholder="enter your message here" />
		</div>
	</div>
</body>
</body>
</html>
