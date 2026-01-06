package com.shelkari.hotel.controller;

import com.shelkari.hotel.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping
    public Map<String, Object> getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}