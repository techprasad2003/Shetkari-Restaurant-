package com.shelkari.hotel.service;

import com.shelkari.hotel.model.*;
import com.shelkari.hotel.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private BillRepository billRepository;

    public List<Map<String, Object>> getAllOrdersWithDetails() {
        List<Order> orders = orderRepository.findAll();

        List<String> guestIds = orders.stream()
                .map(Order::getGuestId)
                .collect(Collectors.toList());
        List<Guest> guests = guestRepository.findByIdIn(guestIds);
        Map<String, Guest> guestMap = guests.stream()
                .collect(Collectors.toMap(Guest::getId, guest -> guest));

        List<String> menuItemIds = orders.stream()
                .flatMap(order -> order.getItems().stream())
                .map(Order.OrderItem::getMenuItemId)
                .collect(Collectors.toList());
        List<MenuItem> menuItems = menuItemRepository.findByIdIn(menuItemIds);
        Map<String, MenuItem> menuItemMap = menuItems.stream()
                .collect(Collectors.toMap(MenuItem::getId, menuItem -> menuItem));

        return orders.stream().map(order -> {
            Map<String, Object> orderDetails = new HashMap<>();
            orderDetails.put("id", order.getId());
            orderDetails.put("guestId", order.getGuestId());
            orderDetails.put("status", order.getStatus());
            orderDetails.put("createdAt", order.getCreatedAt());

            Guest guest = guestMap.get(order.getGuestId());
            if (guest != null) {
                Map<String, Object> guestDetails = new HashMap<>();
                guestDetails.put("name", guest.getName());
                guestDetails.put("roomNo", guest.getRoomNo());
                orderDetails.put("guest", guestDetails);
            } else {
                Map<String, Object> guestDetails = new HashMap<>();
                guestDetails.put("name", "Unknown");
                guestDetails.put("roomNo", "Unknown");
                orderDetails.put("guest", guestDetails);
            }

            List<Map<String, Object>> itemsWithDetails = order.getItems().stream().map(item -> {
                Map<String, Object> itemDetails = new HashMap<>();
                itemDetails.put("menuItemId", item.getMenuItemId());
                itemDetails.put("quantity", item.getQuantity());

                MenuItem menuItem = menuItemMap.get(item.getMenuItemId());
                if (menuItem != null) {
                    Map<String, Object> menuItemDetails = new HashMap<>();
                    menuItemDetails.put("name", menuItem.getName());
                    menuItemDetails.put("price", menuItem.getPrice());
                    itemDetails.put("menuItem", menuItemDetails);
                    itemDetails.put("price", item.getQuantity() * menuItem.getPrice());
                } else {
                    Map<String, Object> menuItemDetails = new HashMap<>();
                    menuItemDetails.put("name", "Unknown");
                    menuItemDetails.put("price", 0.0);
                    itemDetails.put("menuItem", menuItemDetails);
                    itemDetails.put("price", 0.0);
                }
                return itemDetails;
            }).collect(Collectors.toList());

            orderDetails.put("items", itemsWithDetails);

            Double totalPrice = itemsWithDetails.stream()
                    .mapToDouble(item -> (Double) item.get("price"))
                    .sum();
            orderDetails.put("totalPrice", totalPrice);

            return orderDetails;
        }).collect(Collectors.toList());
    }

    public Order createOrder(Order order) {
        Order savedOrder = orderRepository.save(order);

        Optional<Bill> existingBill = billRepository.findByGuestId(order.getGuestId());
        if (existingBill.isPresent()) {
            Bill bill = existingBill.get();
            bill.setFoodCharges(bill.getFoodCharges() + order.getTotalPrice());
            bill.setTotalAmount(bill.getRoomCharges() + bill.getFoodCharges());
            billRepository.save(bill);
        } else {
            Bill newBill = new Bill();
            newBill.setGuestId(order.getGuestId());
            newBill.setRoomCharges(0.0);
            newBill.setFoodCharges(order.getTotalPrice());
            newBill.setTotalAmount(order.getTotalPrice());
            billRepository.save(newBill);
        }

        return savedOrder;
    }

    public Order updateOrderStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        Optional<Bill> bill = billRepository.findByGuestId(order.getGuestId());
        if (bill.isPresent()) {
            Bill existingBill = bill.get();
            existingBill.setFoodCharges(existingBill.getFoodCharges() - order.getTotalPrice());
            existingBill.setTotalAmount(existingBill.getRoomCharges() + existingBill.getFoodCharges());
            billRepository.save(existingBill);
        }

        orderRepository.delete(order);
    }
}