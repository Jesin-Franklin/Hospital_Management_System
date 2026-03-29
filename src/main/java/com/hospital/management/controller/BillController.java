package com.hospital.management.controller;

import com.hospital.management.model.Bill;
import com.hospital.management.service.BillService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bills")
public class BillController {

    private final BillService billService;

    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public List<Bill> getAllBills() {
        return billService.getAllBills();
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or hasRole('PATIENT')")
    public List<Bill> getBillsByPatient(@PathVariable Long patientId) {
        return billService.getBillsByPatient(patientId);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    public Bill generateBill(@RequestBody Bill bill) {
        bill.setBillDate(LocalDateTime.now());
        if(bill.getIsPaid() == null) bill.setIsPaid(false);
        return billService.saveBill(bill);
    }

    @PutMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<Bill> markAsPaid(@PathVariable Long id) {
        return billService.getBillById(id)
                .map(bill -> {
                    bill.setIsPaid(true);
                    return ResponseEntity.ok(billService.saveBill(bill));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<InputStreamResource> downloadPdf(@PathVariable Long id) {
        ByteArrayInputStream bis = billService.generatePdfBill(id);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=bill-" + id + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
