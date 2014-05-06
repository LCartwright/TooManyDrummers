package com.toomanydrummers.bean;

import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class represents an object transferred via REST and represents
 * one message from a user to his/her chat room.
 */
public class Message {
	
	// This incrementing value ensures all messages have different IDs.
	private final static AtomicInteger counter = new AtomicInteger(0);
	
	private final int messageId;
	private final String userId;
	private final String messageContent;
	
	public Message(String userId, String messageContent){
		this.messageId = Message.counter.incrementAndGet();
		this.userId = userId;
		this.messageContent = messageContent;
	}
	
	public int getMessageId(){
		return this.messageId;
	}
	
	public String getUserId(){
		return this.userId;
	}
	
	public String getMessageContent(){
		return messageContent;
	}
}
