package com.toomanydrummers.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * Prepares the project for websocket communication
 * 
 * @author john
 *
 */
@Configuration
@EnableScheduling
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

	/**
	 * Prepares to write to the /topic/ folder (to which clients will be
	 * subscribed) and to read the /app/ folder which will be the master
	 * endpoint of this application.
	 */
	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic/");
		config.setApplicationDestinationPrefixes("/app");
	}

	/**
	 * These are the app's Stomp endpoints and allow for a fallback to SockJS
	 * technology when websockets are not available.
	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/hit").withSockJS();
	}

}