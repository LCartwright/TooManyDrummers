/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.toomanydrummers.bean;

public class User
{

	private String firstName;
	private String lastName;
	private String id;
	private String picture_url;

	private int x;
	private int y;
	
	private long lastOnline = System.currentTimeMillis();

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
	
	public User(String first_name, String last_name, String id, String picture_url, int x, int y)
	{
		this.firstName = first_name;
		this.lastName = last_name;
		this.id = id;
		this.picture_url = picture_url;
		this.x = x;
		this.y = y;
	}
	
	public void setId(String id) {
		this.id = id;
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
}
