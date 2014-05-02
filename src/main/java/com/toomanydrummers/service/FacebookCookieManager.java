/**
 * Copyright 2012 Marin Solutions
 */
package com.toomanydrummers.service;

import java.util.Calendar;
import java.util.Random;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.ConnectionSignUp;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.web.SignInAdapter;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.util.CookieGenerator;

/**
 * 
 * Based on example from 'http://java.dzone.com/articles/getting-started-spring-social-0'
 * 
 * Based upon the Spring idea of an application Context, this class is
 * responsible for gluing the application to spring social.
 * 
 * It does this by grouping together the minimum number of the various
 * components in the Spring social quick start app
 * 
 * 
 */
public class FacebookCookieManager implements ConnectionSignUp, SignInAdapter
{

	private static final Logger logger = LoggerFactory.getLogger(FacebookCookieManager.class);


	// Use a random number generator to generate IDs to avoid cookie clashes between server restarts
	private static Random random;

	//Manage cookies - Use cookies to remember state between calls to the server
	private final CookieGenerator cookieGenerator;

	// Store the user id between calls to the server 
	private static final ThreadLocal<String> userList = new ThreadLocal<String>();

	private final UsersConnectionRepository connectionRepository;

	public FacebookCookieManager(UsersConnectionRepository connectionRepository)
	{
		this.connectionRepository = connectionRepository;
		this.cookieGenerator = new CookieGenerator();
		cookieGenerator.setCookieName("chocolate_chip_drumkit");
		random = new Random(Calendar.getInstance().getTimeInMillis());
	}

	@Override
	public String signIn(String id, Connection<?> connection, NativeWebRequest request)
	{
		cookieGenerator.addCookie(request.getNativeResponse(HttpServletResponse.class), id);
		return null;
	}

	@Override
	public String execute(Connection<?> connection)
	{
		return Long.toString(random.nextLong());
	}

	public boolean checkSignedIn(HttpServletRequest request, HttpServletResponse response)
	{
		logger.info("Reading cookie...");
		Cookie[] cookies = request.getCookies();
		boolean userSignedIn = false;
		String id = null;
		if (cookies != null)
		{
			for (Cookie cookie : cookies)
			{
				if (cookie.getName().equals(cookieGenerator.getCookieName()))
				{
					id = cookie.getValue();
				}
			}

			logger.info("cookie id = '" + id + "'");
			if (id != null && id.length() > 0)
			{
				ConnectionRepository connectionRepo = connectionRepository.createConnectionRepository(id);
				Connection<Facebook> facebookConnection = connectionRepo.findPrimaryConnection(Facebook.class);
				if (facebookConnection != null)
				{
					userSignedIn = true;
				}
				else
				{
					//Set cookie to be blank
					cookieGenerator.addCookie(response, "");
				}
			}
		}
		userList.set(id);
		return userSignedIn;
	}
	
	public String getUserId()
	{
		return userList.get();
	}

}
