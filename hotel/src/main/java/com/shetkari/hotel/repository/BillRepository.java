package com.shelkari.hotel.repository;

import com.shelkari.hotel.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BillRepository extends MongoRepository<Bill, String> {
    Optional<Bill> findByGuestId(String guestId);
}