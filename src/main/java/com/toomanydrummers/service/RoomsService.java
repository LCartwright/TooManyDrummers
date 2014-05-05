package com.toomanydrummers.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.toomanydrummers.bean.Room;


@Service
public class RoomsService {
	
	private final Map<String, Room> roomMap = new HashMap<String, Room>();
	
	public RoomsService(){
		System.out.println("ROOMS SERVICE STARTED");
		
		//Add default room
		Room room = new Room("default");
		this.addRoom(room);
	}
	
	public Room getRoom(String room_id){
		return roomMap.get(room_id);
	}
	
	public void addRoom(Room room){
		roomMap.put(room.getRoomID(), room);
	}
	
	public List<Room> getRooms(){
		List<Room> roomList = new ArrayList<Room>(roomMap.values());
		Collections.sort(roomList);
		return roomList;
	}
	
	public void removeRoom(String room_id){
		roomMap.remove(room_id);
	}
}
