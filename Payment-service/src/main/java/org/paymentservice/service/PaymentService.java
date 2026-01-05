package org.paymentservice.service;

import org.paymentservice.entity.Payment;
import org.paymentservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository repository;

    public PaymentService(PaymentRepository repository) {
        this.repository = repository;
    }

    public Payment createPayment(UUID orderId, double amount) {
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setAmount(amount);
        payment.setStatus("COMPLETED");
        return repository.save(payment);
    }

    public List<Payment> getAll() {
        return repository.findAll();
    }
}
