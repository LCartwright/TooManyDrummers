package com.toomanydrummers.bean;

public class Picture {
	
	private String pictureURL;
	
	public Picture(){
		
	}
	
	public Picture(String pictureURL){
		this.pictureURL = pictureURL;
	}
	
	public String getPictureURL(){
		return this.pictureURL;
	}
	
	public void setPictureURL(String pictureURL){
		this.pictureURL = pictureURL;
	}
	
}
