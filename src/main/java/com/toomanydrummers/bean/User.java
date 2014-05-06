/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.toomanydrummers.bean;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * One User of the application. A User object is created and associated
 * with every client. This class contains all necessary associated data.
 */
public class User {

	// Ensures each User has a distinct ID
	private static AtomicInteger counter = new AtomicInteger(0);
	
	private String firstName;
	private String lastName;
	private String id;
	private String picture_url;

	// Coordinates of this user's cursor
	private int x;
	private int y;
	
	// Keeps a note of the last communication from this user.
	// If too long without communication, this object is
	// marked as 'timed out' and is no longer used.
	private long lastOnline = System.currentTimeMillis();
	private boolean isTimedOut = false;
	
	// The room this User is currently 'in'.
	private String room;

	public User() {
		super();
	}
	
	public User(String first_name, String last_name, String id)
	{
		this(first_name, last_name, id, "http://graph.facebook.com/" + id + "/picture", 0, 0);
	}
	
	public User(String first_name, String last_name, String id, int x, int y)
	{
		this(first_name, last_name, id, "http://graph.facebook.com/" + id + "/picture", x, y);
	}
	
	//FB
	public User(String first_name, String last_name, String id, String picture_url, int x, int y)
	{
		this.firstName = first_name;
		this.lastName = last_name;
		this.id = id;
		this.picture_url = picture_url;
		this.x = x;
		this.y = y;
	}
	
	// A Guest User with some sensible default values.
	public User(String name){
		this.firstName = name;
		this.lastName = "";
		this.id = "GUEST" + String.valueOf(counter.getAndIncrement());
		this.picture_url = "http://www.gravatar.com/avatar/" + generateGravatarURL(this.id + String.valueOf(lastOnline)) + "?s=50&d=identicon&r=PG";
		this.x = 0;
		this.y = 0;
	}
	
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName)
	{
		this.firstName = firstName;
	}

	public String getLastName()	{
		return lastName;
	}
	
	public void setLastName(String lastName)
	{
		this.lastName = lastName;
	}

	public String getId()
	{
		return id;
	}
	
	public void setId(String id)
	{
		this.id = id;
	}

	public int getX()
	{
		return x;
	}
	
	public void setX(int x) 
	{
		this.x = x;
	}

	public int getY()
	{
		return y;
	}
	
	public void setY(int y)
	{
		this.y = y;
	}
	
	public String getPictureURL()
	{
		return this.picture_url;
	}
	
	public void setPictureURL(String picture_url)
	{
		this.picture_url = picture_url;
	}

	public long getLastOnline() {
		return lastOnline;
	}
	
	public void setLastOnline(long lastOnline) {
		this.lastOnline = lastOnline;
	}
	
	public String getRoom() {
		return room;
	}
	
	public void setRoom(String room) {
		this.room = room;
	}
	
	public void clearRoom() {
		this.room = null;
	}
	
	
	/**
	 * Adapted from Gravatar implementation guide
	 * Available: http://en.gravatar.com/site/implement/images/java/
	 * @author http://en.gravatar.com
	 * @param input
	 * @return
	 */
	public String generateGravatarURL(String input){
		return md5Hex(input);
	}
	
	/**
	 * Adapted from Gravatar implementation guide 
	 * Available: http://en.gravatar.com/site/implement/images/java/
	 * @author http://en.gravatar.com
	 * @param array
	 * @return
	 */
	private String hex(byte[] inputArray) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < inputArray.length; ++i) {
			sb.append(Integer.toHexString((inputArray[i] & 0xFF) | 0x100).substring(1,3));
		}
		return sb.toString();
	}
	
	/**
	 * Adapted from Gravatar implementation guide
	 * Available: http://en.gravatar.com/site/implement/images/java/
	 * @author http://en.gravatar.com
	 * @param message
	 * @return
	 */
	private String md5Hex(String message) {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			return hex(messageDigest.digest(message.getBytes("CP1252")));
		} catch (NoSuchAlgorithmException e) {
			//do nothing
		} catch (UnsupportedEncodingException e) {
			//do nothing
		}
		return null;
	}

	public void timeOut() {
		this.isTimedOut = true;
	}
	
	public boolean isTimedOut() {
		return isTimedOut;
	}

}
