
package com.toomanydrummers.service;

import com.toomanydrummers.bean.Userr;
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
    
    public Userr getUser(int id) {
        if (id < 0) {
            return null;
        }
        Userr user = userDAO.getUser(id);
        return user;
    }
    
    public List<Userr> getUsers() {
        List<Userr> users = userDAO.getUsers();
        return users;
    }
}
