package com.toomanydrummers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.toomanydrummers.bean.CursorPosition;
import com.toomanydrummers.bean.DrumHit;
import com.toomanydrummers.bean.User;
import com.toomanydrummers.service.UsersService;

/**
 * This controller handles all websocket communication in the application. It is
 * responsible for one room - including its users, their identifications, their
 * drum hits and cursor positions.
 */
@Controller
public class HitController {

	// This service keeps a list of all the connected users of the drumkit/chat.
	@Autowired
	private UsersService usersService;

	// This is used for Websocket communication which needs to be more
	// specific than the SendTo annotation.
	private SimpMessagingTemplate template;

	@Autowired
	public HitController(SimpMessagingTemplate template) {
		this.template = template;
	}

	/**
	 * Listen for hits and broadcast them for everyone in the room to hear
	 * 
	 * @param message
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/{room_id}/hit")
	public void hit(@DestinationVariable String room_id, DrumHit message) throws Exception {
		template.convertAndSend("/topic/" + room_id + "/hitreports", message);
	}

	/**
	 * This is fired when a new user joins the room.
	 * 
	 * @param user
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/{room_id}/newuser")
	public void newUser(@DestinationVariable String room_id, User user) throws Exception {
		usersService.userHasJoinedRoom(user.getId(), room_id);
		usersService.updateRoom(room_id);
	}

	/**
	 * This is fired when a user is finished and leaves the room in a healthy
	 * manner.
	 * 
	 * @param user
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/{room_id}/finished")
	public void removeUser(@DestinationVariable String room_id, User user) throws Exception {
		usersService.userHasLeftRoom(user.getId());
		usersService.updateRoom(room_id);
	}

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