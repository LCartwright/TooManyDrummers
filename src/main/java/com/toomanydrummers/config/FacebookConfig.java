package com.toomanydrummers.config;

import javax.inject.Inject;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.security.crypto.encrypt.Encryptors;
import org.springframework.social.connect.ConnectionFactoryLocator;
import org.springframework.social.connect.ConnectionRepository;
import org.springframework.social.connect.NotConnectedException;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.connect.jdbc.JdbcUsersConnectionRepository;
import org.springframework.social.connect.support.ConnectionFactoryRegistry;
import org.springframework.social.connect.web.ProviderSignInController;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;

import com.toomanydrummers.service.SocialContext;
import com.toomanydrummers.service.UserCookieGenerator;

@Configuration
public class FacebookConfig implements InitializingBean {

	private static final Logger logger = LoggerFactory.getLogger(FacebookConfig.class);
	
//	private static final String appId = "1417475415186556"; //Henry
//	private static final String appSecret = "b5acd3061b80a889a0536c5e32d65923"; //Henry

	private static final String appId = "1483054771924097"; //Laurence
	private static final String appSecret = "d22acf6e69ec2ab8000a4c7a1377726b"; //Laurence

	private SocialContext socialContext;

	private UsersConnectionRepository usersConnectionRepositiory;

	@Inject
	private DataSource dataSource;

	/**
	 * Point to note: the name of the bean is either the name of the method
	 * "socialContext" or can be set by an attribute
	 * 
	 * @Bean(name="myBean")
	 */
	@Bean
	public SocialContext socialContext() {

		return socialContext;
	}

	@Bean
	public ConnectionFactoryLocator connectionFactoryLocator() {

		logger.info("getting connectionFactoryLocator");
		ConnectionFactoryRegistry registry = new ConnectionFactoryRegistry();
		registry.addConnectionFactory(new FacebookConnectionFactory(appId, appSecret));
		return registry;
	}

	/**
	 * Singleton data access object providing access to connections across all
	 * users.
	 */
	@Bean
	public UsersConnectionRepository usersConnectionRepository() {

		return usersConnectionRepositiory;
	}

	/**
	 * Request-scoped data access object providing access to the current user's
	 * connections.
	 */
	@Bean
	@Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
	public ConnectionRepository connectionRepository() {
		String userId = socialContext.getUserId();
		logger.info("Createing ConnectionRepository for user: " + userId);
		return usersConnectionRepository().createConnectionRepository(userId);
	}

	/**
	 * A proxy to a request-scoped object representing the current user's
	 * primary Facebook account.
	 * 
	 * @throws NotConnectedException
	 *             if the user is not connected to facebook.
	 */
	@Bean
	@Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
	public Facebook facebook() {
		return connectionRepository().getPrimaryConnection(Facebook.class).getApi();
	}

	/**
	 * Create the ProviderSignInController that handles the OAuth2 stuff and
	 * tell it to redirect back to /posts once sign in has completed
	 */
	@Bean
	public ProviderSignInController providerSignInController() {
		ProviderSignInController providerSigninController = new ProviderSignInController(connectionFactoryLocator(), usersConnectionRepository(), socialContext);
		logger.info(" providerSignInController ");
		providerSigninController.setPostSignInUrl("/details");
		return providerSigninController;
	}

	@Override
	public void afterPropertiesSet() throws Exception {

		JdbcUsersConnectionRepository usersConnectionRepositiory = new JdbcUsersConnectionRepository(dataSource, connectionFactoryLocator(), Encryptors.noOpText());

		socialContext = new SocialContext(usersConnectionRepositiory, new UserCookieGenerator(), facebook());

		usersConnectionRepositiory.setConnectionSignUp(socialContext);
		this.usersConnectionRepositiory = usersConnectionRepositiory;
	}
}
