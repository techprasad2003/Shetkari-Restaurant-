package com.shelkari.hotel.repository;

import com.shelkari.hotel.model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MenuItemRepository extends MongoRepository<MenuItem, String> {
    List<MenuItem> findByIdIn(List<String> ids);
}