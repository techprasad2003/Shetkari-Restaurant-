package com.shelkari.hotel.controller;

import com.shelkari.hotel.model.MenuItem;
import com.shelkari.hotel.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping
    public List<MenuItem> getAllMenuItems() {
        return menuItemService.getAllMenuItems();
    }

    @PostMapping
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItem menuItem) {
        try {
            MenuItem createdItem = menuItemService.createMenuItem(menuItem);
            return ResponseEntity.status(201).body(createdItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating menu item");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable String id, @RequestBody MenuItem menuItem) {
        try {
            MenuItem updatedItem = menuItemService.updateMenuItem(id, menuItem);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable String id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.ok().body("Menu item deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}