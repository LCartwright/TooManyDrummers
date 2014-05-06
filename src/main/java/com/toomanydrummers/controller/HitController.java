package com.toomanydrummers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.toomanydrummers.bean.CursorPosition;
import com.toomanydrummers.bean.DrumHit;
import com.toomanydrummers.bean.User;
import com.toomanydrummers.service.UsersService;

/**
 * 
 * @author john
 *
 *         This controller handles all websocket communication in the
 *         application. It is responsible for one room - including its users,
 *         their identifications, their drum hits and cursor positions.
 *
 */
@Controller
public class HitController {

	// This service keeps a list of all the connected users of the drumkit.
	@Autowired
	private UsersService usersService;
	

	/**
	 * Listen for hits and broadcast them for everyone to hear
	 * 
	 * @param message
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/hit")
	@SendTo("/topic/hitreports")
	public DrumHit hit(DrumHit message) throws Exception {
		return message;
	}

	// TODO: Check there are no commas in the id!
	/**
	 * This is fired when a new user joins the room.
	 * 
	 * @param user
	 * @return
	 * @throws Exception
	 */
//	@MessageMapping("/newuser")
//	@SendTo("/topic/allusers")
//	public List<User> newUser(User user) throws Exception {
//		usersService.addUser(user);
//		return usersService.getUsers();
//	}
	@MessageMapping("/newuser")
	public void newUser(User user) throws Exception {
		//usersService.addUser(user);
	}

	/**
	 * This is fired when a user is finished and leaves the room in a healthy manner.
	 * 
	 * @param user
	 * @return
	 * @throws Exception
	 */
//	@MessageMapping("/finished")
//	@SendTo("/topic/allusers")
//	public List<User> removeUser(User user) throws Exception {
//		usersService.removeUser(user.getId());
//		return usersService.getUsers();
//	}
	@MessageMapping("/finished")
	public void removeUser(User user) throws Exception {
		//usersService.removeUser(user.getId());
		
	}

	// TODO: Provide a better way of checking ids...?
	/**
	 * The application listens for the positions of all its participants' mouse
	 * cursors and stores them, ready to be broadcast.
	 * 
	 * @param position
	 * @throws Exception
	 */
	@MessageMapping("/motion")
	public void mouseMove(CursorPosition position) throws Exception {
		this.usersService.updatePosition(position);
	}

}