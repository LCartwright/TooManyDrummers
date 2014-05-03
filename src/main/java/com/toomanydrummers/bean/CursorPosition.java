/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.toomanydrummers.bean;

/**
 * A basic DTO for a cursor's x,y coordinates and the user identification to be
 * associated with it.
 *
 * @author john
 */
public class CursorPosition {

	private String id;
	private int x;
	private int y;
	
	public CursorPosition() {
		
	}

	//Needed for JSON Mapper
	public CursorPosition(){
		
	}
	
	/**
	 * A full constructor, specifying all of a CursorPosition's attributes.
	 * 
	 * @param id
	 * @param x
	 * @param y
	 */
	public CursorPosition(String id, int x, int y) {
		this.id = id;
		this.x = x;
		this.y = y;
	}

	public String getId() {
		return id;
	}

	// TODO: Do we even need setters?
	// @JhonnyJhone Yes, for the JSON mapper 
	public void setId(String id) {
		this.id = id;
	}

	public int getX() {
		return x;
	}

	public void setX(int x) {
		this.x = x;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

}
