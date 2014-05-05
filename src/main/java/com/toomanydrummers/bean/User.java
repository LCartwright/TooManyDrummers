/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.toomanydrummers.bean;

public class User
{
	private String id;
	private String firstName;
	private String lastName;
	
	private int x;
	private int y;
	
	private long lastOnline = System.currentTimeMillis();

	public User() {
		super();
	}
	
	public User(String first_name, String last_name, String id) {
		this.id = id;
		this.firstName = first_name;
		this.lastName = last_name;
		x = 0;
		y = 0;
	}
	
	public User(String first_name, String last_name, String id, int x, int y) {
		this.id = id;
		this.firstName = first_name;
		this.lastName = last_name;
		this.x = x;
		this.y = y;
	}
	
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName()	{
		return lastName;
	}
	
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	
	public int getX()
	{
		return x;
	}
	
	public void setX(int x) {
		this.x = x;
	}
	
	public int getY()
	{
		return y;
	}

	public void setY(int y)	{
		this.y = y;
	}
	
	public long getLastOnline() {
		return lastOnline;
	}
	
	public void setLastOnline(long lastOnline) {
		this.lastOnline = lastOnline;
	}

}
