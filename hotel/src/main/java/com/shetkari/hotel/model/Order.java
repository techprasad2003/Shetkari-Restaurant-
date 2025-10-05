package com.shelkari.hotel.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    private String guestId;
    private List<OrderItem> items;
    private Double totalPrice;
    private String status = "Pending";
    private Date createdAt = new Date();

    public Order() {}

    public Order(String guestId, List<OrderItem> items, Double totalPrice) {
        this.guestId = guestId;
        this.items = items;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getGuestId() { return guestId; }
    public void setGuestId(String guestId) { this.guestId = guestId; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public static class OrderItem {
        private String menuItemId;
        private Integer quantity;
        private Double price;

        public OrderItem() {}

        public OrderItem(String menuItemId, Integer quantity, Double price) {
            this.menuItemId = menuItemId;
            this.quantity = quantity;
            this.price = price;
        }

        // Getters and Setters
        public String getMenuItemId() { return menuItemId; }
        public void setMenuItemId(String menuItemId) { this.menuItemId = menuItemId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
    }
}