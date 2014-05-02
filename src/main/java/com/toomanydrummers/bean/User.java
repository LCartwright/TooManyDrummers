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

	private int x;
	private int y;

	public User()
	{
		super();
	}
	
	public User(String first_name, String last_name, String id)
	{
		this.firstName = first_name;
		this.lastName = last_name;
		this.id = id;
		x = 0;
		y = 0;
	}
	
	public User(String first_name, String last_name, String id, int x, int y)
	{
		this.firstName = first_name;
		this.lastName = last_name;
		this.id = id;
		this.x = x;
		this.y = y;
	}

	public void setX(int x) {
		this.x = x;
	}
	
	public String getFirstName()
	{
		return firstName;
	}

	public String getLastName()
	{
		return lastName;
	}

	public String getId()
	{
		return id;
	}

	public int getX()
	{
		return x;
	}

	public int getY()
	{
		return y;
	}

	public void setY(int y)
	{
		this.y = y;
	}

	public void setFirstName(String firstName)
	{
		this.firstName = firstName;
	}

	public void setLastName(String lastName)
	{
		this.lastName = lastName;
	}

	public void setId(String id)
	{
		this.id = id;
	}

}
