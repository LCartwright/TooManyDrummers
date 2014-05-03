package com.toomanydrummers.bean;

/**
 * The most basic DTO imaginable
 * As simple as possible for fast transfer, this represents
 * one hit of a specified drum. It is broadcast as soon as
 * received and should be played as soon as the client gets it.
 * 
 * @author john
 */
public class DrumHit {

    private String name;
    //private String time;
    
    public String getName() {
        return name;
    }
    
    //public String getTime() {
    //    return time;
    //}

}
