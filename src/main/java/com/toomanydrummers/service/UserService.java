
package com.toomanydrummers.service;

import com.toomanydrummers.bean.User;
import com.toomanydrummers.dao.UserDAO;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Bogdan Vrusias
 */
@Service
public class UserService {

    @Autowired
    UserDAO userDAO;
    
    public UserService() {
        System.out.println("*** UserService instantiated");
    }
    
    public String sayHello(String name) {
        return "Hello " + name + "!";
    }
    
    public User getUser(int id) {
        if (id < 0) {
            return null;
        }
        User user = userDAO.getUser(id);
        return user;
    }
    
    public List<User> getUsers() {
        List<User> users = userDAO.getUsers();
        return users;
    }
}
