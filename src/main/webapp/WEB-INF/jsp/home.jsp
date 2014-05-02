<%@ page session="false" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<html>
	<head>
		<title>Sign In</title>
	</head>
	<body>
		<h2>This application requires you to sign in to Facebook</h2>
		<!-- FACEBOOK SIGNIN -->
		<form name="fb_signin" id="fb_signin" action="<c:url value="/signin/facebook"/>" method="POST">
	        <input type="hidden" name="scope" value="offline_access" />
			<button type="submit"><img src="<c:url value="/resources/images/sign-in-with-facebook.png"/>" /></button>
		</form>
	</body>
</html>
