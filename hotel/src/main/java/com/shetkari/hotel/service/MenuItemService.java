package com.shelkari.hotel.service;

import com.shelkari.hotel.model.MenuItem;
import com.shelkari.hotel.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public Optional<MenuItem> getMenuItemById(String id) {
        return menuItemRepository.findById(id);
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(String id, MenuItem menuItemDetails) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (menuItemDetails.getName() != null) menuItem.setName(menuItemDetails.getName());
        if (menuItemDetails.getDescription() != null) menuItem.setDescription(menuItemDetails.getDescription());
        if (menuItemDetails.getCategory() != null) menuItem.setCategory(menuItemDetails.getCategory());
        if (menuItemDetails.getPrice() != null) menuItem.setPrice(menuItemDetails.getPrice());

        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(String id) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));
        menuItemRepository.delete(menuItem);
    }
}