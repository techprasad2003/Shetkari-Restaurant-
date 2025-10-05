package com.shelkari.hotel.service;

import com.shelkari.hotel.model.Bill;
import com.shelkari.hotel.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public Optional<Bill> getBillByGuestId(String guestId) {
        return billRepository.findByGuestId(guestId);
    }

    public Bill updateBillPaymentStatus(String id, String paymentStatus) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        bill.setPaymentStatus(paymentStatus);
        return billRepository.save(bill);
    }
}