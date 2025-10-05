package com.shelkari.hotel.controller;

import com.shelkari.hotel.model.Bill;
import com.shelkari.hotel.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bill")
@CrossOrigin(origins = "*")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping("/{guestId}")
    public ResponseEntity<?> getBillByGuestId(@PathVariable String guestId) {
        Optional<Bill> bill = billService.getBillByGuestId(guestId);
        return ResponseEntity.ok(bill.orElse(null));
    }

    @PutMapping("/{id}")
    public Bill updateBillPaymentStatus(@PathVariable String id, @RequestBody Map<String, String> request) {
        return billService.updateBillPaymentStatus(id, request.get("paymentStatus"));
    }
}