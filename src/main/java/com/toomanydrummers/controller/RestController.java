package com.toomanydrummers.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.toomanydrummers.bean.Message;
import com.toomanydrummers.bean.Room;

@Controller
@RequestMapping("REST")
public class RestController {

	List<Room> roomList = new ArrayList<Room>();
	
	public RestController() {
		System.out.println("REST CONTROLLER STARTED");
		
		roomList.add(new Room("bacon"));
		roomList.add(new Room("avocado"));
		roomList.add(new Room("chicken"));
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

//	@RequestMapping(value = "/rooms", method = RequestMethod.GET)
//	public @ResponseBody String rooms() {
//		StringBuilder sb = new StringBuilder();
//		for (Room room : roomList) {
//			sb.append(room.getName() + "");
//		}
//		return sb.toString();
//	}
}
