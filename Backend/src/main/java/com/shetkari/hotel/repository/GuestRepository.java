package com.shelkari.hotel.repository;

import com.shelkari.hotel.model.Guest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GuestRepository extends MongoRepository<Guest, String> {
    List<Guest> findByIdIn(List<String> ids);
}