/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.toomanydrummers.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.stereotype.Service;

import com.toomanydrummers.bean.CursorPosition;
import com.toomanydrummers.bean.User;

/**
 *
 * @author john
 */
@Service
public class UsersService
{

	private static Map<String, User> users = new HashMap<String, User>();
	// private final ArrayList<User> users = new ArrayList<User>();
	private final ArrayList<CursorPosition> cursorPositions = new ArrayList<CursorPosition>();
	private final ReentrantLock usersLock = new ReentrantLock();

	// private SimpMessagingTemplate template;

	// @Autowired
	// public UsersService(SimpMessagingTemplate template) {
	//
	// //System.out.println("JS: " +
	// template==null?"template is null":"template is not null");
	//
	// if (template != null) {
	// this.template = template;
	//
	// this.cursorPositions = new ArrayList<CursorPosition>();
	//
	// // Thread tracker = new Thread(new MotionRunner(template));
	// // tracker.setDaemon(true);
	// // tracker.start();
	//
	// } else {
	// this.cursorPositions = null;
	// }
	//
	// }

	// public int getUsersCount() {
	// try {
	// usersLock.lock();
	// return users.size();
	// } finally {
	// usersLock.unlock();
	// }
	// }

	public void addUser(User newUser)
	{
		try
		{
			usersLock.lock();
			if (!users.containsKey(newUser.getId()))
			{
				users.put(newUser.getId(), newUser);
			}
		}
		finally
		{
			usersLock.unlock();
		}
	}

	public void removeUser(String id)
	{
		try
		{
			usersLock.lock();
			users.remove(id);
		}
		finally
		{
			usersLock.unlock();
		}
	}

	public void removeUser(User oldUser)
	{
		removeUser(oldUser.getId());
	}

	public User getUser(String id)
	{
		User userOUT = null;
		if (id != null && id.length() > 0)
		{
			userOUT = users.get(id);
		}
		return userOUT;
	}

	/**
	 * gets a 'List' of the users
	 * 
	 * @return - List<User> allusers
	 */
	public List<User> getUsers()
	{
		List<User> result = new ArrayList<User>();
		for (User user : users.values())
		{
			result.add(user);
		}
		return result;
	}

	public Collection<User> getUserCollection()
	{
		return users.values();
	}

	public void updatePosition(CursorPosition cursorPosition)
	{
		String id = cursorPosition.getId();
		try
		{
			usersLock.lock();
			User user = getUser(id);
			user.setX(cursorPosition.getX());
			user.setY(cursorPosition.getY());
		}
		finally
		{
			usersLock.unlock();
		}
	}

	public ArrayList<CursorPosition> preparePositions()
	{
		this.cursorPositions.clear();
		// TODO May need to find a faster way of doing this... :(
		try
		{
			usersLock.lock();
			for (User user : getUserCollection())
			{
				this.cursorPositions.add(new CursorPosition(user.getId(), user.getX(), user.getY()));
			}
		}
		finally
		{
			usersLock.unlock();
		}
		return this.cursorPositions;
	}

	public String itemizeIDs()
	{
		String allIDs = "";
		try
		{
			usersLock.lock();
			for (User user : getUserCollection())
			{
				allIDs += user.getId() + ",";
			}
		}
		finally
		{
			usersLock.unlock();
		}
		return allIDs;
	}

}
