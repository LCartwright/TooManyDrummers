package com.toomanydrummers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.toomanydrummers.bean.CursorPosition;
import com.toomanydrummers.bean.DrumHit;
import com.toomanydrummers.bean.User;
import com.toomanydrummers.service.UsersService;

@Controller
public class HitController {

	private static final int REFRESH_RATE_MILLIS = 200;
	private volatile boolean keepLooping = true;

	@Autowired
	private UsersService usersService;

	@Autowired
	public HitController(SimpMessagingTemplate template) {
		Thread motionService = new Thread(new MotionRunner(template));
		motionService.setDaemon(true);
		motionService.start();
	}

	@MessageMapping("/hit")
	@SendTo("/topic/hitreports")
	public DrumHit hit(DrumHit message) throws Exception {
		return message;
	}

	// TODO: Check there are no commas in the id!
	@MessageMapping("/newuser")
	@SendTo("/topic/allusers")
	public String newUser(User user) throws Exception {
		usersService.addUser(user);
		return usersService.itemizeIDs();
	}

	// TODO: Call this method and blast out a reformulated list when someone
	// disconnects,
	// rather than waiting for this message.
	@MessageMapping("/finished")
	@SendTo("/topic/allusers")
	public String removeUser(User user) throws Exception {
		usersService.removeUser(user.getId());
		return usersService.itemizeIDs();
	}

	// Provide a better way of checking ids...?
	@MessageMapping("/motion")
	public void mouseMove(CursorPosition position) throws Exception {
		this.usersService.updatePosition(position);
	}

	// How do we call this??
	public void kill() {
		this.keepLooping = false;
	}

	private class MotionRunner implements Runnable {

		private final SimpMessagingTemplate template;

		public MotionRunner(SimpMessagingTemplate template) {
			this.template = template;
		}

		@Override
		public void run() {

			while (keepLooping) {

				try {
					Thread.sleep(REFRESH_RATE_MILLIS);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}

				template.convertAndSend("/topic/motion", usersService.preparePositions());

			}

		}

	}

}