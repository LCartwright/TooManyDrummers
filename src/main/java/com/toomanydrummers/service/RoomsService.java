package com.toomanydrummers.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.toomanydrummers.bean.Room;
import com.toomanydrummers.bean.User;

/**
 * The service to manage the rooms associated with the application,
 * which can be created, joined and/or left by any user at any time.
 */
@Service
public class RoomsService {
	
	private final Map<String, Room> roomMap = new HashMap<String, Room>();
	
	private static final int CHECK_FOR_EMPTY_ROOMS_MILLIS = 500;
	
	private static final int ROOM_CREATION_GRACE_MILLIS = 5000;
	
	private static final int ROOM_EMPTY_DELETE_MILLIS = 10000;
	
	public RoomsService(){
		//Add default room
		Room room = new Room("Main Lobby",true);
		this.addRoom(room);
	}
	
	public Room getRoom(String room_id){
		return roomMap.get(room_id);
	}
	
	public void addRoom(Room room){
		roomMap.put(room.getRoomID(), room);
	}
	
	/**
	 * Sort the rooms before returning them such that they can
	 * be presented nicely when they reach the UI.
	 * Only returns rooms which have not been removed
	 * @return
	 */
	public List<Room> getRooms(){
		List<Room> roomList = new ArrayList<Room>(roomMap.values());
		Collections.sort(roomList);
		
		List<Room> purgedRoomList = new ArrayList<Room>();
		
		for(Room room : roomList){
			if(!room.isRemoved()){
				purgedRoomList.add(room);
			}
		}
		return purgedRoomList;
	}
	
	/**
	 * Checks for any empty rooms which have remained empty for a set period of time
	 * If these rooms exists, set them to not exist as an active room any longer
	 */
	@Scheduled(fixedRate = CHECK_FOR_EMPTY_ROOMS_MILLIS)
	public void checkForTimeouts() {
		
		long now = System.currentTimeMillis();

		Iterator<String> it = roomMap.keySet().iterator();

		while (it.hasNext()) {
			String key = it.next();
			Room room = roomMap.get(key);
			if ((!room.isRemoved()) && (!room.isRemovalProtected()) && (room.getUserCount() == 0) && (room.getRoomCreation() + ROOM_CREATION_GRACE_MILLIS < now)) {
				if((room.getLastUserInRoom() + ROOM_EMPTY_DELETE_MILLIS) < now){
					room.setIsRemoved(true);
				} else {
					//do nothing
				}
			}
		}
	}
	
}
