package com.shelkari.hotel.repository;

import com.shelkari.hotel.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.Date;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStatus(String status);

    @Query("{ 'createdAt': { $gte: ?0, $lt: ?1 } }")
    List<Order> findByCreatedAtBetween(Date start, Date end);

    List<Order> findByGuestId(String guestId);
}