package org.paymentservice.controller;

import org.paymentservice.entity.Payment;
import org.paymentservice.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Payment> pay(
            @RequestParam UUID orderId,
            @RequestParam double amount) {

        return ResponseEntity.ok(service.createPayment(orderId, amount));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
