package com.toomanydrummers.bean;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A room which users can create, join or leave. While in a room
 * a user can communicate by sharing and receiving all messages
 * associated with the room and can share and hear all drum
 * hits. Implements Comparable so they can be re-ordered.
 */
public class Room implements Comparable<Room> {
	
	// Ensures all Rooms have a different ID.
	private static AtomicInteger counter = new AtomicInteger(0);
	
    private final String name;
    private final String roomId;
    private List<Message> messageList = new ArrayList<Message>();
    
    public Room(String name) {
    	this.name = name;
    	this.roomId = String.valueOf(Room.counter.incrementAndGet()) ;
    }
    
    public String getRoomID(){
    	return this.roomId;
    }
    
    public String getName(){
    	return this.name;
    }
    
    public void addMessage(Message message){
    	this.messageList.add(message);
    }
    
    public List<Message> getMessages(){
    	return messageList;
    }
    
    public List<Message> getMessages(int afterMessageId){
    	List<Message> returnMessageList = new ArrayList<Message>();
    	for(Message message : messageList){
    		if(message.getMessageId() > afterMessageId){
    			returnMessageList.add(message);
    		}
    	}
    	return returnMessageList;
    }
    
    public Message getMessage(int messageId){
    	Message returnMessage = null;
    	for(Message message : messageList){
    		if(message.getMessageId() == messageId){
    			returnMessage = message;
    		}
    	}
    	return returnMessage;
    }

    /**
     * Used to reorder Rooms so they are presented correctly.
     */
	@Override
	public int compareTo(Room compare) {
		final int BEFORE = -1;
	    final int EQUAL = 0;
	    final int AFTER = 1;
	    
	    int id = Integer.parseInt(roomId);
	    int comp_id = Integer.parseInt(compare.roomId);
	    if(id > comp_id){
	    	return AFTER;
	    } else if (id < comp_id){
	    	return BEFORE;
	    } else {
	    	return EQUAL;
	    }
	}
}
