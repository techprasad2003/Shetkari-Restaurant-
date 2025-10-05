package com.shelkari.hotel.service;

import com.shelkari.hotel.model.Guest;
import com.shelkari.hotel.repository.GuestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GuestService {

    @Autowired
    private GuestRepository guestRepository;

    public List<Guest> getAllGuests() {
        return guestRepository.findAll();
    }

    public Optional<Guest> getGuestById(String id) {
        return guestRepository.findById(id);
    }

    public Guest createGuest(Guest guest) {
        return guestRepository.save(guest);
    }

    public Guest updateGuest(String id, Guest guestDetails) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found"));

        if (guestDetails.getName() != null) guest.setName(guestDetails.getName());
        if (guestDetails.getContact() != null) guest.setContact(guestDetails.getContact());
        if (guestDetails.getRoomNo() != null) guest.setRoomNo(guestDetails.getRoomNo());
        if (guestDetails.getCheckInDate() != null) guest.setCheckInDate(guestDetails.getCheckInDate());
        if (guestDetails.getBillStatus() != null) guest.setBillStatus(guestDetails.getBillStatus());

        return guestRepository.save(guest);
    }

    public void deleteGuest(String id) {
        Guest guest = guestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guest not found"));
        guestRepository.delete(guest);
    }
}