package com.shelkari.hotel.service;

import com.shelkari.hotel.model.Order;
import com.shelkari.hotel.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    public Map<String, Object> getDashboardStats() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date today = calendar.getTime();

        calendar.add(Calendar.DATE, 1);
        Date tomorrow = calendar.getTime();

        Long dailyOrders = orderRepository.findByCreatedAtBetween(today, tomorrow).stream().count();
        Long pendingOrders = orderRepository.findByStatus("Pending").stream().count();
        Long preparingOrders = orderRepository.findByStatus("Preparing").stream().count();

        Double totalEarnings = orderRepository.findAll().stream()
                .mapToDouble(Order::getTotalPrice)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("dailyOrders", dailyOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("preparingOrders", preparingOrders);
        stats.put("totalEarnings", totalEarnings);

        return stats;
    }
}