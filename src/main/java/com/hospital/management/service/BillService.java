package com.hospital.management.service;

import com.hospital.management.model.Bill;
import com.hospital.management.repository.BillRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public List<Bill> getBillsByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Bill saveBill(Bill bill) {
        bill.setTotalAmount((bill.getConsultationFee() != null ? bill.getConsultationFee() : 0) +
                (bill.getMedicineFee() != null ? bill.getMedicineFee() : 0) +
                (bill.getTestFee() != null ? bill.getTestFee() : 0));
        return billRepository.save(bill);
    }
    
    public ByteArrayInputStream generatePdfBill(Long id) {
        Bill bill = billRepository.findById(id).orElseThrow(() -> new RuntimeException("Bill not found"));
        
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter.getInstance(document, out);
        document.open();
        
        document.add(new Paragraph("Hospital Management System - Invoice"));
        document.add(new Paragraph("--------------------------------------------------"));
        document.add(new Paragraph("Bill ID: " + bill.getId()));
        if(bill.getPatient() != null) {
            document.add(new Paragraph("Patient Name: " + bill.getPatient().getName()));
        }
        document.add(new Paragraph("Date: " + bill.getBillDate()));
        document.add(new Paragraph("--------------------------------------------------"));
        document.add(new Paragraph("Consultation Fee: $" + bill.getConsultationFee()));
        document.add(new Paragraph("Medicine Fee: $" + bill.getMedicineFee()));
        document.add(new Paragraph("Test Fee: $" + bill.getTestFee()));
        document.add(new Paragraph("--------------------------------------------------"));
        document.add(new Paragraph("Total Amount: $" + bill.getTotalAmount()));
        document.add(new Paragraph("Status: " + (bill.getIsPaid() ? "Paid" : "Pending")));

        document.close();
        return new ByteArrayInputStream(out.toByteArray());
    }
}
