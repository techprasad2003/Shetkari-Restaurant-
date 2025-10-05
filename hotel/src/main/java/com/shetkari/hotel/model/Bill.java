package com.shelkari.hotel.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "bills")
public class Bill {
    @Id
    private String id;
    private String guestId;
    private Double roomCharges;
    private Double foodCharges;
    private Double totalAmount;
    private String paymentStatus = "Unpaid";

    public Bill() {}

    public Bill(String guestId, Double roomCharges, Double foodCharges, Double totalAmount) {
        this.guestId = guestId;
        this.roomCharges = roomCharges;
        this.foodCharges = foodCharges;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getGuestId() { return guestId; }
    public void setGuestId(String guestId) { this.guestId = guestId; }

    public Double getRoomCharges() { return roomCharges; }
    public void setRoomCharges(Double roomCharges) { this.roomCharges = roomCharges; }

    public Double getFoodCharges() { return foodCharges; }
    public void setFoodCharges(Double foodCharges) { this.foodCharges = foodCharges; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}