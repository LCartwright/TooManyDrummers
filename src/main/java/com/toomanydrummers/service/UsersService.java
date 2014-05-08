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
import com.toomanydrummers.bean.Room;
import com.toomanydrummers.bean.User;

/**
 * This service is responsible for maintaining the list of Users associated
 * with this application and manages their movement between rooms, as well
 * as periodically broadcasting cursor-coordinates information and cleaning
 * up Users who haven't contacted the application in a certain period of time.
 */
@Service
public class UsersService {

	// Defines how frequently to broadcast the room's members' cursor locations.
	private static final int REFRESH_RATE_MILLIS = 30;
	
	// A User has 5 seconds without communication before it is classed as TimedOut.
	private static final int TIMEOUT_MILLIS = 5000;
	// The check is performed once per second.
	private static final int CHECK_FOR_TIMEOUT_MILLIS = 1000;

	private SimpMessagingTemplate template;
	
	// Users are held in this map.
	private final Map<String, User> users = new HashMap<String, User>();
	private final ArrayList<CursorPosition> cursorPositions = new ArrayList<CursorPosition>();
	
	// This lock ensures thread-safe modification of the system's users.
	private final ReentrantLock usersLock = new ReentrantLock();
	
	@Autowired
	private RoomsService roomsService;
	
	@Autowired
	public UsersService(SimpMessagingTemplate template) {
		this.template = template;
	}
	
	public void addUser(User newUser) {
		try {
			usersLock.lock();
			if (!users.containsKey(newUser.getId())) {
				users.put(newUser.getId(), newUser);
			}else {
				//If ID already exists (facebook) reset object to base point
				users.get(newUser.getId()).resetUser();
			}
		} finally {
			usersLock.unlock();
		}
	}

	public User getUser(String id) {
		User user = null;
		if (id != null && id.length() > 0) {
			user = users.get(id);
		}
		return user;
	}

	public List<User> getUsers() {
		return new ArrayList<User>(users.values());
	}

	public void userHasJoinedRoom(String id, String room_id) {
		Room oldRoom = roomsService.getRoom(users.get(id).getRoom());
		if(oldRoom != null){
			oldRoom.decUserCount();
		} else {
			//Do nothing
		}
		Room newRoom = roomsService.getRoom(room_id);
		if(newRoom != null){
			newRoom.incUserCount();
		} else {
			// Do nothing
		}
	
		users.get(id).setRoom(room_id);
	}

	/**
	 * This room has experienced a change in its membership. This
	 * method gets all users still associated with the room provided
	 * and informs them who is still connected.
	 * @param room_id
	 */
	public void updateRoom(String room_id) {
		List<User> usersInRoom = new ArrayList<User>();

		// Collect all attached users
		for (User user : users.values()) {

			if (user.getRoom() != null && user.getRoom().equals(room_id)
					&& !user.isTimedOut()) {
				usersInRoom.add(user);
			}
			
		}
		
		try {
			template.convertAndSend("/topic/" + room_id + "/allusers",
					usersInRoom);
		} catch (MessageDeliveryException e) {
			
		}
	}

	/**
	 * Update the position of a cursor for a User and update their
	 * last communication time so they don't time out.
	 * @param cursorPosition
	 */
	public void updatePosition(CursorPosition cursorPosition) {
		String id = cursorPosition.getId();
		try {
			usersLock.lock();

			for (User user : users.values()) {
				if (user.getId().equals(id) && !user.isTimedOut()) {
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

	/**
	 * Periodically check for timed-out users and flag them
	 * appropriately.
	 */
	@Scheduled(fixedRate = CHECK_FOR_TIMEOUT_MILLIS)
	public void checkForTimeouts() {

		boolean somebodyKilled = false;

		long now = System.currentTimeMillis();

		Iterator<String> it = users.keySet().iterator();

		while (it.hasNext()) {
			String key = it.next();
			if (users.get(key).getLastOnline() + TIMEOUT_MILLIS < now) {
				users.get(key).timeOut();
				somebodyKilled = true;
				userHasJoinedRoom(key, null);
			}
		}

		if (somebodyKilled) {

			for (User user : users.values()) {
				 updateRoom(user.getRoom());
			}

		}

	}

	/**
	 * Broadcast cursor information to everyone connected.
	 */
	@Scheduled(fixedRate = REFRESH_RATE_MILLIS)
	public void provideMotionService() {

		try {
			// Package the information into an appropriate object.
			template.convertAndSend("/topic/motion", preparePositions());
		} catch (MessageDeliveryException e) {
		}

	}

	private ArrayList<CursorPosition> preparePositions() {
		this.cursorPositions.clear();

		try {
			usersLock.lock();
			for (User user : users.values()) {
				if (!user.isTimedOut()) {
					this.cursorPositions.add(new CursorPosition(user.getId(),
							user.getX(), user.getY()));
				}
			}
		} finally {
			usersLock.unlock();
		}
		return this.cursorPositions;
	}

}
