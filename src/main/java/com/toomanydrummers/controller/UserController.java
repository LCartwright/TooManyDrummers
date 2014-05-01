package com.toomanydrummers.controller;

import com.toomanydrummers.bean.Userr;
import com.toomanydrummers.service.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Bogdan Vrusias
 */
@Controller
public class UserController {

    @Autowired
    private UserService userService;

    
    @RequestMapping( value = "/hello.htm", method = RequestMethod.GET)
    protected String helloUser() throws Exception {
        System.out.println("*** in helloUser");
        return "hello";
    }
    
    @RequestMapping( value = "/user/{id}", method = RequestMethod.GET)
    protected @ResponseBody Userr getUser(@PathVariable("id") int id) throws Exception {
        System.out.println("*** in getUser with id=" + id);
        Userr user = userService.getUser(id);
        return user;
    }
    
//    @RequestMapping( value = "/cock/{id}", method = RequestMethod.GET)
//    protected @ResponseBody User getCock(@PathVariable("id") int id) throws Exception {
//        System.out.println("*** in COCK with id=" + id);
//        User user = userService.getUser(id);
//        return user;
//    }
    
//    @RequestMapping( value = "/users", method = RequestMethod.GET)
//    protected @ResponseBody List<User> getUsers() throws Exception {
//        List<User> users = userService.getUsers();
//        System.out.println("*** in getUsers with number of users=" + users.size());
//        return users;
//    }
    
    @RequestMapping( value = "/cock/cock", method = RequestMethod.GET)
    protected @ResponseBody String cock() throws Exception {
        return "COCK";
    }
}
