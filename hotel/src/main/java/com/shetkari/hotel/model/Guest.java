package com.shelkari.hotel.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "guests")
public class Guest {
    @Id
    private String id;
    private String name;
    private String contact;
    private String roomNo;
    private Date checkInDate;
    private String billStatus = "Unpaid";

    public Guest() {}

    public Guest(String name, String contact, String roomNo, Date checkInDate) {
        this.name = name;
        this.contact = contact;
        this.roomNo = roomNo;
        this.checkInDate = checkInDate;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getRoomNo() { return roomNo; }
    public void setRoomNo(String roomNo) { this.roomNo = roomNo; }

    public Date getCheckInDate() { return checkInDate; }
    public void setCheckInDate(Date checkInDate) { this.checkInDate = checkInDate; }

    public String getBillStatus() { return billStatus; }
    public void setBillStatus(String billStatus) { this.billStatus = billStatus; }
}