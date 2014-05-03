/**
 * Copyright 2012 Marin Solutions
 */
package com.toomanydrummers.controller;

import java.util.List;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.toomanydrummers.bean.User;
import com.toomanydrummers.service.FacebookCookieManager;
import com.toomanydrummers.service.UsersService;

/**
 * @author Henry Tesei
 * 
 */
@Controller
public class FacebookDetailController
{
	@Inject
	private ConnectionRepository connectionRepository;

	@Autowired
	private FacebookCookieManager facebookCookieManager;
	
	@Autowired
	private UsersService usersService;

	/**
	 * This method checks if the user is signed in and redirects them accordingly
	 * 
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "details", method = RequestMethod.GET)
	public String showPostsForUser(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception
	{
		String nextView;
		if (facebookCookieManager.checkSignedIn(request, response))
		{
			addUser();
			Connection<Facebook> connection = connectionRepository.findPrimaryConnection(Facebook.class);
			FacebookProfile fbp = connection.getApi().userOperations().getUserProfile();
			model.addAttribute("myId", fbp.getId());
			nextView = "sockets";
		}
		else
		{
			nextView = "home";
		}
		return nextView;
	}

	/**
	 * Gets the profile of the current user and add them to the list of users if they do not already exist
	 */
	private void addUser()
	{
		Connection<Facebook> connection = connectionRepository.findPrimaryConnection(Facebook.class);
		FacebookProfile fbp = connection.getApi().userOperations().getUserProfile();
		usersService.addUser(new User(fbp.getFirstName(), fbp.getLastName(), fbp.getId()));
	}
}
