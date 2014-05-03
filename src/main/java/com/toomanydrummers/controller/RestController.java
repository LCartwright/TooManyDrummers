package com.toomanydrummers.controller;

import java.util.ArrayList;
import java.util.List;

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
import com.toomanydrummers.service.UsersService;


@Controller
@RequestMapping("REST")
public class RestController {

	List<Room> roomList = new ArrayList<Room>();
	
    @Autowired
    private UsersService usersService;
	
	public RestController() {
		System.out.println("REST CONTROLLER STARTED");
		//Add default room to join
		roomList.add(new Room("default"));
	}

	@RequestMapping(value = "/bacon", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
	public @ResponseBody String getBacon() {
		return "bacon";
	}
	
	@RequestMapping(value = "/rooms/bacon", method = RequestMethod.GET, produces = "application/json; charset=utf-8")
	public @ResponseBody String getRoomsBacon() {
		return "bacon";
	}

	
	@RequestMapping(value = "/rooms/add", method = RequestMethod.POST)
	public @ResponseBody Room addRoom(@RequestParam(value = "name") String name) {
		Room room = new Room(name);
		// room.addMessage(new Message(1, "Hello room!"));
		roomList.add(room);
		return room;
	}
	
	@RequestMapping(value = "/rooms/remove", method = RequestMethod.POST)
	public @ResponseBody Room removeRoom(@RequestParam("roomId") int roomId) {
		Room removedRoom = null;
		for (Room room : roomList) {
			if (room.getRoomId() == roomId) {
				removedRoom = room;
				roomList.remove(room);
				break;
			}
		}
		return removedRoom;
	}
	
	@RequestMapping(value = "/rooms/add", method = RequestMethod.GET)
	public @ResponseBody String addTEST() {
		return "BACON";
	}
	
	@RequestMapping(value = "/rooms/{roomId}", method = RequestMethod.GET)
	public @ResponseBody List<Message> getRoomMessages(
			@PathVariable int roomId,
			@RequestParam(value = "messageId", required = false, defaultValue = "0") int messageId) {

		Room selectedRoom = null;
		List<Message> returnMessages = null;
		for (Room room : roomList) {
			if (room.getRoomId() == roomId) {
				selectedRoom = room;
			}
		}

		if (selectedRoom != null) {
			returnMessages = selectedRoom.getMessages(messageId);
			// StringBuilder sb = new StringBuilder();
			// for(Message message : messageList){
			// sb.append(message.getMessageContent() + "; ");
			// }
			// output = sb.toString();
		}

		return returnMessages;
	}
	
	@RequestMapping(value = "/rooms/{roomId}", method = RequestMethod.POST)
	public @ResponseBody Message addRoomMessage(
			@PathVariable int roomId,
			@RequestParam(value = "userId", required = true) String userId,
			@RequestParam(value = "messageContent", required = true) String messageContent) {

		Room selectedRoom = null;
		Message returnMessage = null;
		for (Room room : roomList) {
			if (room.getRoomId() == roomId) {
				selectedRoom = room;
			}
		}

		if (selectedRoom != null) {
			returnMessage = new Message(Integer.parseInt(userId),
					messageContent);
			selectedRoom.addMessage(returnMessage);
		}

		return returnMessage;
	}
	
	@RequestMapping(value = "/rooms", method = RequestMethod.GET)
	public @ResponseBody List<Room> rooms() {
		return this.roomList;
	}
	
	
	
    @RequestMapping( value = "/users", method = RequestMethod.GET)
    protected @ResponseBody List<User> getUsers() {
    	//Return a list of users
        return usersService.getUsers();
    }
    
    @RequestMapping( value = "/users/{id}", method = RequestMethod.GET)
    protected @ResponseBody User getUser(@PathVariable("id") String id) throws Exception {
    	//Return user from ID
        return usersService.getUser(id);
    }
    
    @RequestMapping( value = "/users/{id}/name", method = RequestMethod.GET)
    protected @ResponseBody Name getUserName(@PathVariable("id") int id) throws Exception {
    	//Return user firstname + lastname
    	User user = usersService.getUser(String.valueOf(id)); //no null checking
    	Name nameOUT = null;
    	if(user != null){
    		nameOUT =  new Name(user.getFirstName(), user.getLastName());
    	}
        return nameOUT;
    }
    
    @RequestMapping( value = "/users/{id}/xy", method = RequestMethod.GET)
    protected @ResponseBody XandY getUserXY(@PathVariable("id") int id) throws Exception {
    	User user = usersService.getUser(String.valueOf(id)); //no null checking
    	XandY xyOUT = null;
    	if(user != null){
    		xyOUT = new XandY(user.getX(), user.getY());
    	}
        return xyOUT;
    }
    
    @RequestMapping( value = "/users/{id}/picture", method = RequestMethod.GET)
    protected @ResponseBody Picture getUserPicture(@PathVariable("id") int id) throws Exception {
    	User user = usersService.getUser(String.valueOf(id)); //no null checking
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
    	String pictureURL = "https://graph.facebook.com" + id +"/picture";
    	User user = new User(first_name, last_name, id, pictureURL, 0, 0);
    	usersService.addUser(user);
    	return user;
    }
    
}
