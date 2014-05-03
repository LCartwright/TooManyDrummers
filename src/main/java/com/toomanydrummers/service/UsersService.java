/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.toomanydrummers.service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.stereotype.Service;

import com.toomanydrummers.bean.CursorPosition;
import com.toomanydrummers.bean.User;

/**
 *
 * @author john
 */
@Service
public class UsersService {

	private final ArrayList<User> users = new ArrayList<User>();
	private final ArrayList<CursorPosition> cursorPositions = new ArrayList<CursorPosition>();
	private final ReentrantLock usersLock = new ReentrantLock();

	//private SimpMessagingTemplate template;

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

	public void addUser(User newUser) {

		try {
			usersLock.lock();
			users.add(newUser);
		} finally {
			usersLock.unlock();
		}
	}

	public void removeUser(User oldUser) {
		try {
			usersLock.lock();
			users.remove(oldUser);
		} finally {
			usersLock.unlock();
		}
	}

	public void removeUser(String oldUserId) {

		for (int i = 0; i < users.size(); i++) {

			if (users.get(i).getId().equals(oldUserId)) {

				try {
					usersLock.lock();
					users.remove(i);
				} finally {
					usersLock.unlock();
				}
				break;
			}
		}

	}

	public String itemizeIDs() {
		String allIDs = "";

		try {
			usersLock.lock();
			for (User user : users) {

				allIDs += user.getId() + ",";
			}
		} finally {
			usersLock.unlock();
		}

		return allIDs;
	}

	public void updatePosition(CursorPosition cursorPosition) {

		String id = cursorPosition.getId();

		try {
			usersLock.lock();

			for (User user : users) {
				if (user.getId().equals(id)) {
					user.setX(cursorPosition.getX());
					user.setY(cursorPosition.getY());
					break;
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

	public ArrayList<CursorPosition> preparePositions() {
		this.cursorPositions.clear();
		// TODO May need to find a faster way of doing this... :(
		try {
			usersLock.lock();
			
			for (User user : users) {
				this.cursorPositions.add(new CursorPosition(user.getId(), user
						.getX(), user.getY()));
			}
		} finally {
			usersLock.unlock();
		}
		
		return this.cursorPositions;

	}
	
	public User getUser(String id){
		//Need to user a map really
		User userOUT = null;
		for(User user : users){
			if(!"".equals(id) && id.equals(user.getId())){
				userOUT = user;
				break;
			}
		}
		return userOUT;
	}
	
	public List<User> getUsers(){
		return users;
	}

}
