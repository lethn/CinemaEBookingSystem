package cs4050.A6.CinemaBookingSystem;

import java.util.ArrayList;

public class Movie {

    // It might be easier to store dates and times of the movie showings directly in the database for searching reasons.
    // An instance of the Movie class should have info that is the same no matter the showing time.

    private String title;
    private String category;
    private ArrayList<String> cast;
    private String director;
    private String producer;
    private String synopsis;
    private String trailer;
    private String picture;

    // set methods

    public void setTitle(String title) {
        this.title = title;
    } // setTitle

    public void setCategory(String category) {
        this.category = category;
    } // setCategory

    public void setCast(ArrayList<String> cast) {
        this.cast = cast;
    } // setCast

    public void setDirector(String director) {
        this.director = director;
    } // setDirector

    public void setProducer(String producer) {
        this.producer = producer;
    } // setProducer

    public void setSynopsis(String synopsis) {
        this.synopsis = synopsis;
    } // setSynopsis

    public void setPicture(String picture) {
        this.picture = picture;
    } // setPicture

    public void setTrailer(String trailer) {
        this.trailer = trailer;
    } // setTrailer

    // get methods

    public String getTitle() {
        return title;
    } // getTitle

    public String getCategory() {
        return category;
    } // getCategory

    public ArrayList<String> getCast() {
        return cast;
    } // getCast

    public String getDirector() {
        return director;
    } // getDirector

    public String getProducer() {
        return producer;
    } // getProducer

    public String getSynopsis() {
        return synopsis;
    } // getsynopsis

    public String getPicture() {
        return picture;
    } // getPicture

    public String getTrailer() {
        return trailer;
    } // getTrailer
}
