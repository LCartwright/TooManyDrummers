package com.toomanydrummers.bean;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import com.toomanydrummers.bean.Message;

public class Room {
	
	private static AtomicInteger counter = new AtomicInteger(0);
    private final String name;
    private final String roomId;
    private List<Message> messageList = new ArrayList<Message>();
    
    public Room(String name) {
    	this.name = name;
    	this.roomId = String.valueOf(Room.counter.incrementAndGet()) ;
    	System.out.println("ROOM MADE" + name);
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
    
}
