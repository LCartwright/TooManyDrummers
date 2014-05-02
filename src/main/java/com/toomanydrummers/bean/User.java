package com.toomanydrummers.bean;

public class User {

	public String first_name;
	public String last_name;
	public String id;
	
	public User(String first_name, String last_name, String id)
	{
		this.first_name = first_name;
		this.last_name = last_name;
		this.id = id;
	}

	public String getFirst_name() {
		return first_name;
	}

	public String getLast_name() {
		return last_name;
	}

	public String getId() {
		return id;
	}
}
