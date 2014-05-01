package com.toomanydrummers.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.toomanydrummers.bean.Message;
import com.toomanydrummers.bean.Room;

@Controller
public class RoomController {
	
	
//	public RoomController(){
//		System.out.println("ROOM CONTROLLER STARTED");
//	}
//    //private static final String template = "Hello, %s!";
//    //private final AtomicLong counter = new AtomicLong();
//    
//    List<Room> roomList = new ArrayList<Room>();
//    
//    @RequestMapping(value = "/bacon", method = RequestMethod.GET)
//    public @ResponseBody String getBacon()
//    {	
//    	return "bacon";
//    }
//    
//    @RequestMapping(value = "/rooms/add", method = RequestMethod.POST)
//    public @ResponseBody Room addRoom(@RequestParam(value="name") String name)
//    {	
//    	Room room = new Room(name);
////    	room.addMessage(new Message(1, "Hello room!"));
//    	roomList.add(room);
//    	return room;
//    }
//    
//    @RequestMapping(value = "/rooms/remove", method = RequestMethod.POST)
//    public @ResponseBody Room removeRoom( @RequestParam("roomId") int roomId) {	
//    	Room removedRoom = null;
//    	for(Room room : roomList){
//    		if(room.getRoomId() == roomId){
//    			removedRoom = room;
//    			roomList.remove(room);
//    			break;
//    		}
//    	}
//    	return removedRoom;
//    }
//    
//  @RequestMapping(value = "/rooms/{roomId}", method = RequestMethod.GET)
//  public @ResponseBody List<Message> getRoomMessages(
//		  	@PathVariable int roomId
//		  , @RequestParam(value="messageId", required=false, defaultValue="0") int messageId
//   ) {
//	  
//	  Room selectedRoom = null;
//	  List<Message> returnMessages = null;
//	  for(Room room: roomList){
//		  if(room.getRoomId() == roomId){
//			  selectedRoom = room;
//		  }
//	  }
//	  
//	  if(selectedRoom != null){
//		  returnMessages = selectedRoom.getMessages(messageId);
////		  StringBuilder sb = new StringBuilder();
////		  for(Message message : messageList){
////			  sb.append(message.getMessageContent() + "; ");
////		  }
////		  output = sb.toString();
//	  }
//	  
//	  return returnMessages;
//  }
//  
//  @RequestMapping(value = "/rooms/{roomId}", method = RequestMethod.POST)
//  public @ResponseBody Message addRoomMessage(
//		  		@PathVariable int roomId
//		  	, 	@RequestParam(value="userId", required=true) String userId
//		  	, 	@RequestParam(value="messageContent", required=true) String messageContent
//   ) {
//	  
//	  Room selectedRoom = null;
//	  Message returnMessage = null;
//	  for(Room room: roomList){
//		  if(room.getRoomId() == roomId){
//			  selectedRoom = room;
//		  }
//	  }
//	  
//	  if(selectedRoom != null){
//		  returnMessage = new Message(Integer.parseInt(userId), messageContent);
//		  selectedRoom.addMessage(returnMessage);
//	  }
//	  
//	  return returnMessage;
//  }
//    
//    @RequestMapping(value = "/rooms", method = RequestMethod.GET)
//    public @ResponseBody String rooms() {	
//    	StringBuilder sb = new StringBuilder();
//    	for(Room room : roomList){
//    		sb.append(room.getName() + "");
//    	}
//    	return sb.toString();
//    }

//    @RequestMapping(value = "/room", method = RequestMethod.GET)
//    public @ResponseBody Room room( @RequestParam(value="name", required=false, defaultValue="World") String name) {	
//        return new Room(counter.incrementAndGet(),String.format(template, name));
//    }
    
//    @RequestMapping(value = "/user/{userId}", method = RequestMethod.GET)
//    public @ResponseBody User getUser(@PathVariable String userId) {
//
//    	return null;
//    }
}
