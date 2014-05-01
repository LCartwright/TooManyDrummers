package com.toomanydrummers.dao;

import com.toomanydrummers.bean.Userr;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Bogdan Vrusias
 */
@Repository
public class UserDAO {

    List<Userr> users = new ArrayList<Userr>();

    public UserDAO() {
        System.out.println("*** UserDAO instantiated");
        
        Userr user1 = new Userr();
        user1.setName("John");
        user1.setId(1);
        user1.setAge(21);
        user1.setDateOfBirth(new Date());
        List<String> hobbies = new ArrayList();
        hobbies.add("tennis");
        hobbies.add("football");
        user1.setHobbies(hobbies);
        users.add(user1);

        Userr user2 = new Userr();
        user2.setName("Jack");
        user2.setId(2);
        user2.setAge(22);
        user2.setDateOfBirth(new Date());
        List<String> hobbies2 = new ArrayList();
        hobbies2.add("painting");
        user2.setHobbies(hobbies2);
        users.add(user2);

        Userr user3 = new Userr();
        user3.setName("Helen");
        user3.setId(3);
        user3.setAge(20);
        user3.setDateOfBirth(new Date());
        List<String> hobbies3 = new ArrayList();
        hobbies3.add("music");
        hobbies3.add("netball");
        hobbies3.add("chess");
        user3.setHobbies(hobbies3);
        users.add(user3);
    }

    public Userr getUser(int id) {
        if (id >= 0 && id < users.size()) {
            return users.get(id);
        } else {
            return null;
        }
    }

    public List<Userr> getUsers() {
        return users;
    }
}
