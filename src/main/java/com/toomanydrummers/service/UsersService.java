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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
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

	// Defines how frequently to broadcast the room's members' cursor locations.
	private static final int REFRESH_RATE_MILLIS = 30;
	private SimpMessagingTemplate template;
	private static final int TIMEOUT_MILLIS = 5000;
	private static final int CHECK_FOR_TIMEOUT_MILLIS = 1000;

	private final ArrayList<User> users = new ArrayList<User>();
	private static Map<String, User> users = new HashMap<String, User>();
	// private final ArrayList<User> users = new ArrayList<User>();
	private final ArrayList<CursorPosition> cursorPositions = new ArrayList<CursorPosition>();
	private final ReentrantLock usersLock = new ReentrantLock();

	@Autowired
	public UsersService(SimpMessagingTemplate template) {
		this.template = template;
	}

	public void addUser(User newUser) {

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

	public List<User> listUsers() {

		try {
			usersLock.lock();

			return users;

		} finally {
			usersLock.unlock();
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

			for (User user : users) {
				if (user.getId().equals(id)) {
					user.setLastOnline(System.currentTimeMillis());
					user.setX(cursorPosition.getX());
					user.setY(cursorPosition.getY());
					break;
				}
			}

		} finally {
			usersLock.unlock();
		}
	}

	@Scheduled(fixedRate = CHECK_FOR_TIMEOUT_MILLIS)
	public void checkForTimeouts() {

		boolean somebodyKilled = false;

		try {
			usersLock.lock();

			long now = System.currentTimeMillis();

			for (int i = 0; i < users.size(); i++) {
				if (users.get(i).getLastOnline() + TIMEOUT_MILLIS < now) {
					removeUser(users.get(i));
					i--;
					somebodyKilled = true;
				}
			}

			if (somebodyKilled) {
				try {
					template.convertAndSend("/topic/allusers", listUsers());
				} catch (MessageDeliveryException e) {
					// e.printStackTrace();
				}
			}

		} finally {
			usersLock.unlock();
		}

	}

	// public int getUsersCount() {
	// try {
	// usersLock.lock();
	// return users.size();
	// } finally {
	// usersLock.unlock();
	// }
	// }

	@Scheduled(fixedRate = REFRESH_RATE_MILLIS)
	public void provideMotionService() {

		try {
			// Package the information into an appropriate object.
			template.convertAndSend("/topic/motion", preparePositions());
		} catch (MessageDeliveryException e) {
			// e.printStackTrace();
		}

	}

	private ArrayList<CursorPosition> preparePositions() {
		this.cursorPositions.clear();
		// TODO May need to find a faster way of doing this... :(

		try {
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

	// @Override
	// public void onApplicationEvent(ApplicationEvent event) {
	//
	// if (event instanceof SessionDisconnectEvent) {
	// SessionDisconnectEvent sde = (SessionDisconnectEvent) event;
	// System.out.println("JSD: " + sde.getSessionId());
	// System.out.println("JSD: " + sde.getCloseStatus().getCode());
	// System.out.println("JSD: " + sde.getCloseStatus().getReason());
	// } else if (event instanceof SessionConnectedEvent) {
	// SessionConnectedEvent sce = (SessionConnectedEvent) event;
	// StompHeaderAccessor headers = StompHeaderAccessor.wrap(sce.getMessage());
	// System.out.println("JSC: " + headers.getSessionId());
	// System.out.println("JSC: " + headers.getSessionAttributes());
	// System.out.println("JSC: " + headers.getMessage());
	// }
	//
	// }

	// private void startMotionService() {
	// if (motionService == null || !motionService.isAlive()) {
	// motionService = new Thread(new MotionRunner());
	// motionService.setDaemon(true);
	// motionService.start();
	// }
	// }
	//
	// @Override
	// public void onApplicationEvent(ApplicationEvent event) {
	//
	// if (event instanceof BrokerAvailabilityEvent) {
	// if (((BrokerAvailabilityEvent) event).isBrokerAvailable()) {
	// startMotionService();
	// } else {
	// motionService.interrupt();
	// }
	//
	// }
	//
	// }

	/**
	 * This Runnable defines the behaviour of a thread that will repeatedly
	 * broadcast the positions of the mouse cursors of all the connected users.
	 * 
	 * @author john
	 */
	// private class MotionRunner implements Runnable {
	//
	// @Override
	// public void run() {
	//
	// try {
	// while (true) {
	//
	// Thread.sleep(REFRESH_RATE_MILLIS);
	//
	// try {
	// // Use usersService to package the information into an
	// // appropriate object.
	// template.convertAndSend("/topic/motion", preparePositions());
	//
	// } catch (MessageDeliveryException e) {
	// // e.printStackTrace();
	// }
	// }
	// } catch (InterruptedException e) {
	// e.printStackTrace();
	// }
	//
	// }
	//
	// }

}
