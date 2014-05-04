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
import com.toomanydrummers.bean.XandY;
import com.toomanydrummers.service.RoomsService;
import com.toomanydrummers.service.UsersService;


@Controller
@RequestMapping("REST")
public class RestController {
	
    
	@Autowired
    private UsersService usersService;
    
    @Autowired
    private RoomsService roomsService;
	
	public RestController() {
		System.out.println("REST CONTROLLER STARTED");
		//Add default room to join
	}
	
	@RequestMapping(value = "/rooms/add", method = RequestMethod.POST)
	public @ResponseBody Room addRoom(@RequestParam(value = "name") String name) {
		Room room = new Room(Jsoup.clean(name, Whitelist.none()));
		roomsService.addRoom(room);
		return room;
	}
	
	@RequestMapping(value = "/rooms/remove", method = RequestMethod.POST)
	public @ResponseBody Room removeRoom(@RequestParam("room_id") String room_id) {
		String cleanedRoomID = Jsoup.clean(room_id, Whitelist.none());
		roomsService.removeRoom(cleanedRoomID);
		return roomsService.getRoom(cleanedRoomID);
	}
	
	
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
	
	@RequestMapping(value = "/rooms/{room_id}/messages", method = RequestMethod.POST)
	public @ResponseBody Message addRoomMessage(
			@PathVariable String room_id,
			@RequestParam(value = "userId", required = true) String userId,
			@RequestParam(value = "messageContent", required = true) String messageContent) {

		Room selectedRoom = roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none()));
		Message returnMessage = null;

		if (selectedRoom != null) {
			returnMessage = new Message(
					Integer.parseInt(Jsoup.clean(userId, Whitelist.none()))
				,	Jsoup.clean(messageContent, Whitelist.none())
			);
			selectedRoom.addMessage(returnMessage);
		}

		return returnMessage;
	}
	
	@RequestMapping(value = "/rooms/{room_id}/name", method = RequestMethod.GET)
	public @ResponseBody String addRoomMessage(
			@PathVariable String room_id) {
		return roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none())).getName();
	}
	
	@RequestMapping(value = "/rooms", method = RequestMethod.GET)
	public @ResponseBody List<Room> rooms() {
		return roomsService.getRooms();
	}

	@RequestMapping(value = "/rooms/{room_id}", method = RequestMethod.GET)
	public @ResponseBody Room getRoom(@PathVariable String room_id) {
		return roomsService.getRoom(Jsoup.clean(room_id, Whitelist.none()));
	}
	
	
    @RequestMapping( value = "/users", method = RequestMethod.GET)
    protected @ResponseBody List<User> getUsers() {
    	//Return a list of users
        return usersService.getUsers();
    }
    
    @RequestMapping( value = "/users/{id}", method = RequestMethod.GET)
    protected @ResponseBody User getUser(@PathVariable("id") String id) throws Exception {
    	//Return user from ID
        return usersService.getUser(Jsoup.clean(id, Whitelist.none()));
    }
    
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
    
    @RequestMapping( value = "/users/{id}/xy", method = RequestMethod.GET)
    protected @ResponseBody XandY getUserXY(@PathVariable("id") String id) throws Exception {
    	User user = usersService.getUser(Jsoup.clean(id, Whitelist.none())); //no null checking
    	XandY xyOUT = null;
    	if(user != null){
    		xyOUT = new XandY(user.getX(), user.getY());
    	}
        return xyOUT;
    }
    
    @RequestMapping( value = "/users/{id}/picture", method = RequestMethod.GET)
    protected @ResponseBody Picture getUserPicture(@PathVariable("id") String id) throws Exception {
    	User user = usersService.getUser(Jsoup.clean(id, Whitelist.none())); //no null checking
    	Picture pictureOUT = null;
    	if(user != null){
    		pictureOUT = new Picture(user.getPictureURL());
    	}
        return pictureOUT;
    }
    
    @RequestMapping( value = "/users/add", method = RequestMethod.POST)
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
    
}
