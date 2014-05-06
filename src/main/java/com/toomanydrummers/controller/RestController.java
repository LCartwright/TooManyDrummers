package com.toomanydrummers.controller;

import java.util.List;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.toomanydrummers.bean.Message;
import com.toomanydrummers.bean.Name;
import com.toomanydrummers.bean.Picture;
import com.toomanydrummers.bean.Room;
import com.toomanydrummers.bean.User;
import com.toomanydrummers.service.NameGeneratorService;
import com.toomanydrummers.service.RoomsService;
import com.toomanydrummers.service.UsersService;

/**
 * A controller for the chat functionality of the application.
 * Capable of receiving and distributing chat messages between
 * Users in Rooms. Features JSoup cleaning of all data received
 * to protect the application and its clients from malicious
 * input.
 */
@Controller
@RequestMapping("REST")
public class RestController {
	
    
	@Autowired
    private UsersService usersService;
    
    @Autowired
    private RoomsService roomsService;
    
    @Autowired 
    private NameGeneratorService nameGeneratorService;
    
	/**
	 * This method is called when a request to create a new chatroom is 
	 * received. The contents are cleaned for malicious values and
	 * contain the desired name of the room.
	 * @param name
	 * @return
	 */
	@RequestMapping(value = "/rooms/add", method = RequestMethod.POST)
	public @ResponseBody Room addRoom(@RequestParam(value = "name") String name) {
		Room room = new Room(Jsoup.clean(name, Whitelist.none()));
		roomsService.addRoom(room);
		return room;
	}
	
	/**
	 * Fired when a request is received to draw all the messages associated with
	 * a room. Necessary to update connected users and also caters for users
	 * who were not connected at the room's inception.
	 * @param room_id
	 * @param messageId
	 * @return
	 */
	@RequestMapping(value = "/rooms/{room_id}/messages", method = RequestMethod.GET)
	public @ResponseBody List<Message> getRoomMessages(
			@PathVariable String room_id,
			@RequestParam(value = "messageId", required = false, defaultValue = "0") String messageId) {

		Room selectedRoom = roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none()));
		List<Message> returnMessages = null;

		if (selectedRoom != null) {
			returnMessages = selectedRoom.getMessages(Integer.parseInt(Jsoup.clean(messageId, Whitelist.none())));
		}
		
		return returnMessages;
	}
	
	/**
	 * This method is fired when a user wants to send a new message to the chatroom
	 * and contains the message they would like to post.
	 * @param room_id
	 * @param userId
	 * @param messageContent
	 * @return
	 */
	@RequestMapping(value = "/rooms/{room_id}/messages", method = RequestMethod.POST)
	public @ResponseBody Message addRoomMessage(
			@PathVariable String room_id,
			@RequestParam(value = "userId", required = true) String userId,
			@RequestParam(value = "messageContent", required = true) String messageContent) {

		Room selectedRoom = roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none()));
		Message returnMessage = null;

		if (selectedRoom != null) {
			returnMessage = new Message(
					Jsoup.clean(userId, Whitelist.none())
				,	Jsoup.clean(messageContent, Whitelist.none())
			);
			selectedRoom.addMessage(returnMessage);
		}
		
		return returnMessage;
	}
	
	/**
	 * Grab a room's name.
	 * @param room_id
	 * @return
	 */
	@RequestMapping(value = "/rooms/{room_id}/name", method = RequestMethod.GET)
	public @ResponseBody String addRoomMessage(
			@PathVariable String room_id) {
		return roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none())).getName();
	}
	
	/**
	 * View a list of all rooms.
	 * @return
	 */
	@RequestMapping(value = "/rooms", method = RequestMethod.GET)
	public @ResponseBody List<Room> rooms() {
		return roomsService.getRooms();
	}

	/**
	 * Return the details of a specified room.
	 * @param room_id
	 * @return
	 */
	@RequestMapping(value = "/rooms/{room_id}", method = RequestMethod.GET)
	public @ResponseBody Room getRoom(@PathVariable String room_id) {
		return roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none()));
	}
	
	/**
	 * Return a list of all users.
	 * @return
	 */
    @RequestMapping( value = "/users", method = RequestMethod.GET)
    protected @ResponseBody List<User> getUsers() {
        return usersService.getUsers();
    }
    
    /**
     * Return the details of one user.
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping( value = "/users/{id}", method = RequestMethod.GET)
    protected @ResponseBody User getUser(@PathVariable("id") String id) throws Exception {
    	//Return user from ID
        return usersService.getUser(Jsoup.clean(id, Whitelist.none()));
    }
    
    /**
     * Return the name of a specified user.
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping( value = "/users/{id}/name", method = RequestMethod.GET)
    protected @ResponseBody Name getUserName(@PathVariable("id") String id) throws Exception {
    	//Return user firstname + lastname
    	User user = usersService.getUser(Jsoup.clean(id, Whitelist.none())); //no null checking
    	Name nameOUT = null;
    	if(user != null){
    		nameOUT =  new Name(user.getFirstName(), user.getLastName());
    	}
        return nameOUT;
    }
    
    /**
     * Return the image associated with a specified user.
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping( value = "/users/{id}/picture", method = RequestMethod.GET)
    protected @ResponseBody Picture getUserPicture(@PathVariable("id") String id) throws Exception {
    	User user = usersService.getUser(Jsoup.clean(id, Whitelist.none())); //no null checking
    	Picture pictureOUT = null;
    	if(user != null){
    		pictureOUT = new Picture(user.getPictureURL());
    	}
        return pictureOUT;
    }
    
    /**
     * Adds a user to the system who has connected through Facebook
     * @param first_name
     * @param last_name
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping( value = "/users/add_fb", method = RequestMethod.POST)
    protected @ResponseBody User addUser(
    			@RequestParam("first_name") String first_name
    		,	@RequestParam("last_name") String last_name
    		, 	@RequestParam("id") String id
    		) throws Exception {
    	String pictureURL = "https://graph.facebook.com/" + id +"/picture";
    	User user = new User(
    			Jsoup.clean(first_name, Whitelist.none())
    		, 	Jsoup.clean(last_name, Whitelist.none())
    		, 	Jsoup.clean(id, Whitelist.none())
    		, 	Jsoup.clean(pictureURL, Whitelist.none())
    		, 	0 
    		, 	0
    	);
    	usersService.addUser(user);
    	
    	return user;
    }
    
    /**
     * Adds a user who connected anonymously.
     * @param name
     * @return
     * @throws Exception
     */
    @RequestMapping( value = "/users/add_guest", method = RequestMethod.POST)
    protected @ResponseBody User addGuestUser(
    			@RequestParam("name") String name
    		) throws Exception {
    	User user = new User(Jsoup.clean(name, Whitelist.none()));
    	usersService.addUser(user);
    	return user;
    }

    /**
     * Gets a pseudo-random name for use by some clients who do not wish
     * to provide their own.
     * @return
     * @throws Exception
     */
    @RequestMapping( value = "/users/random_name", method = RequestMethod.GET)
    protected @ResponseBody Name randomName() throws Exception {
    	String firstName = nameGeneratorService.generateFirstName();
    	String lastName = nameGeneratorService.generateLastName();
    	return new Name(firstName, lastName);
    }
    
}
