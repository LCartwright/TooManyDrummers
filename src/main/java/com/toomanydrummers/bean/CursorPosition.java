/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package com.toomanydrummers.bean;

/**
 *
 * @author john
 */
public class CursorPosition {

	private String id;
	private int x;
	private int y;
	
	public CursorPosition() {
		
	}
	
	public CursorPosition(String id, int x, int y) {
		this.id = id;
		this.x = x;
		this.y = y;
	}

	public String getId() {
		return id;
	}

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
