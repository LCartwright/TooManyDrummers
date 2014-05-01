package com.toomanydrummers.bean;

import java.util.concurrent.atomic.AtomicInteger;

public class Message {
	private final static AtomicInteger counter = new AtomicInteger(0);
	private final int messageId;
	private final int userId;
	private final String messageContent;
	
	public Message(int userId, String messageContent){
		this.messageId = Message.counter.incrementAndGet();
		this.userId = userId;
		this.messageContent = messageContent;
	}
	
	public int getMessageId(){
		return this.messageId;
	}
	
	public int getUserId(){
		return this.userId;
	}
	
	public String getMessageContent(){
		return messageContent;
	}
}
