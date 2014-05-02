/**
 * Copyright 2012 Marin Solutions
 */
package com.toomanydrummers.controller;

import java.util.ArrayList;
//import java.util.HashMap;
import java.util.List;
//import java.util.Map;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.social.connect.Connection;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.FacebookProfile;
//import org.springframework.social.facebook.api.FeedOperations;
//import org.springframework.social.facebook.api.Post;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.toomanydrummers.dao.Data;
import com.toomanydrummers.bean.FacebookUser;
import com.toomanydrummers.service.SocialContext;

/**
 * @author Roger
 * 
 */
@Controller
public class FacebookDetailController {

	private static final Logger logger = LoggerFactory.getLogger(FacebookDetailController.class);

	@Inject
	private ConnectionRepository connectionRepository;
	
	@Autowired
	private SocialContext socialContext;

	@RequestMapping(value = "details", method = RequestMethod.GET)
	public String showPostsForUser(HttpServletRequest request, HttpServletResponse response, Model model) throws Exception {

		String nextView;

		if (socialContext.isSignedIn(request, response)) {

			List<FacebookUser> details = retrieveDetails();
			model.addAttribute("details", details);
			nextView = "show-details";
		} else {
			nextView = "home";
		}

		return nextView;
	}

	private List<FacebookUser> retrieveDetails() {
		Connection<Facebook> connection = connectionRepository.findPrimaryConnection(Facebook.class);
		FacebookProfile fbp = connection.getApi().userOperations().getUserProfile();
		
		logger.info("adding: " + fbp.getFirstName() + " " + fbp.getLastName() + " - " + fbp.getId());
		Data.addUser(new FacebookUser(fbp.getFirstName(), fbp.getLastName(), fbp.getId()));	
		
		List<FacebookUser> result = new ArrayList<FacebookUser> ();
		for(FacebookUser user: Data.getUsers())
		{
			result.add(user);
		}

		
		logger.info("Retrieved " + result.size());
		return result;

	}
}
