package com.toomanydrummers.dao;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.toomanydrummers.bean.User;

public final class Data {

	//List of all users details
	private static Map<String,User> users = new HashMap<String,User>();
	private static final ThreadLocal<String> currentUser = new ThreadLocal<String>();
	
	/**
	 * private constructor
	 */
	private Data()
	{
		
	}
	
	/**
	 * If user id is not already in list the users is added otherwise does nothing
	 * 
	 * @param user - user to add
	 */
	public static void addUser(User user)
	{
		if(!users.containsKey(user.getId()))
		{
			users.put(user.getId(),user);
		}
	}
	
	synchronized public static void deleteUser(String id)
	{
		users.remove(id);
	}
	
	/**
	 * gets a 'List' of the users
	 * 
	 * @return - List<User> allusers
	 */
	public static Collection<User> getUsers()
	{ 
		return users.values();
	}
	
	/**
	 * Returns the user with provided ID or null
	 * 
	 * @param id - id of user in list
	 * @return - null or user object with specified id
	 */
	public static User getUser(String id)
	{
		return users.get(id);
	}
}
