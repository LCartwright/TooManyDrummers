/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.toomanydrummers.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
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
public class UsersService {

	// Defines how frequently to broadcast the room's members' cursor locations.
	private static final int REFRESH_RATE_MILLIS = 30;
	private static final int TIMEOUT_MILLIS = 60000;
	private static final int CHECK_FOR_TIMEOUT_MILLIS = 1000;

	private SimpMessagingTemplate template;
	private final Map<String, User> users = new HashMap<String, User>();
	private final ArrayList<CursorPosition> cursorPositions = new ArrayList<CursorPosition>();
	private final ReentrantLock usersLock = new ReentrantLock();

	@Autowired
	public UsersService(SimpMessagingTemplate template) {
		this.template = template;
	}

//	public void addUser(String room_id, User newUser) {
//		addUserCore(newUser);
//		
//		try {
//			template.convertAndSend("/topic/" + room_id + "/allusers", getUsers());
//		} catch (MessageDeliveryException e) {
//			// e.printStackTrace();
//		}
//		
//	}
	
	public void addUser(User newUser) {
		addUserCore(newUser);
	}
	
	private void addUserCore(User newUser) {
		try {
			usersLock.lock();
			if (!users.containsKey(newUser.getId())) {
				users.put(newUser.getId(), newUser);
			}
		} finally {
			usersLock.unlock();
		}
	}

//	public void removeUser(String room_id, String id) {
//		removeUserCore(id);
//		
//		try {
//			template.convertAndSend("/topic/" + room_id + "/allusers", getUsers());
//		} catch (MessageDeliveryException e) {
//			// e.printStackTrace();
//		}
//	}

//	public void removeUser(User oldUser) {
//		removeUserCore(oldUser.getId());
//		
//		// try {
//		// template.convertAndSend("/topic/allusers", getUsers());
//		// } catch (MessageDeliveryException e) {
//		// // e.printStackTrace();
//		// }
//	}
	
//	private void removeUserCore(String id) {
//		try {
//			usersLock.lock();
//			users.remove(id);
//		} finally {
//			usersLock.unlock();
//		}
//	}

	public User getUser(String id) {
		User userOUT = null;
		if (id != null && id.length() > 0) {
			userOUT = users.get(id);
		}
		return userOUT;
	}

	public List<User> getUsers() {
		try {
			usersLock.lock();

			return (new ArrayList<User>(users.values()));

		} finally {
			usersLock.unlock();
		}
	}
	
	public void userHasJoinedRoom(String id, String room_id) {
		users.get(id).setRoom(room_id);
	}
	
	public void userHasLeftRoom(String id) {
		users.get(id).clearRoom();
	}
	
	public void updateRoom(String room_id) {
		List<User> usersInRoom = new ArrayList<User>();
		
		for (User user : users.values()) {
			
			if (user.getRoom() != null && user.getRoom().equals(room_id)) {
				usersInRoom.add(user);
			}
		}
		
		 try {
			 template.convertAndSend("/topic/" + room_id + "/allusers", usersInRoom);
		 } catch (MessageDeliveryException e) {
		 // e.printStackTrace();
		 }
	}

	public void updatePosition(CursorPosition cursorPosition) {
		String id = cursorPosition.getId();
		try {
			usersLock.lock();

			for (User user : users.values()) {
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

		long now = System.currentTimeMillis();

		// for (int i = 0; i < users.size(); i++) {
		// if (users.get(i).getLastOnline() + TIMEOUT_MILLIS < now) {
		// removeUser(users.get(i));
		// i--;
		// somebodyKilled = true;
		// }
		// }

		Iterator<String> it = users.keySet().iterator();

		while (it.hasNext()) {
			String key = it.next();
			if (users.get(key).getLastOnline() + TIMEOUT_MILLIS < now) {
				//users.get(key).setIsTimedOut(true);
				it.remove();
				somebodyKilled = true;
			}
		}

		if (somebodyKilled) {
			try {
				template.convertAndSend("/topic/allusers", getUsers());
			} catch (MessageDeliveryException e) {
				// e.printStackTrace();
			}
		}

	}

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
			for (User user : users.values()) {
				this.cursorPositions.add(new CursorPosition(user.getId(), user
						.getX(), user.getY()));
			}
		} finally {
			usersLock.unlock();
		}
		return this.cursorPositions;
	}

}
