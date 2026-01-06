package com.shelkari.hotel.controller;

import com.shelkari.hotel.model.Order;
import com.shelkari.hotel.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Map<String, Object>> getAllOrders() {
        return orderService.getAllOrdersWithDetails();
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}")
    public Order updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return orderService.updateOrderStatus(id, request.get("status"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok().body("Order deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}