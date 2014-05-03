package com.toomanydrummers.bean;

public class Name {
	
	private String fullname;
	private String firstname;
	private String lastname;
	public Name(){
		
	}
	
	public Name(String firstname, String lastname){
		this.fullname = firstname + " " + lastname;
		this.firstname = firstname;
		this.lastname = lastname;
	}
	
	public String getFullname(){
		return this.fullname;
	}
	
	public String getFirstname(){
		return this.firstname;
	}
	
	public void setFirstname(String firstname){
		this.firstname = firstname;
	}
	
	public String getLastname(){
		return this.lastname;
	}
	
	public void setLastname(String lastname){
		this.lastname = lastname;
	}
	
	
}
