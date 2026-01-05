package org.paymentservice.kafka;

import org.paymentservice.entity.Payment;
import org.paymentservice.event.OrderCreatedEvent;
import org.paymentservice.repository.PaymentRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentConsumer {

        private final PaymentRepository repository;

        public PaymentConsumer(PaymentRepository repository) {
            this.repository = repository;
        }

        @KafkaListener(topics = "order.created", groupId = "payment-group")
        public void consume(OrderCreatedEvent event) {
            Payment payment = new Payment();
            payment.setOrderId(event.getOrderId());
            payment.setAmount(event.getPrice());
            payment.setStatus("COMPLETED");

            repository.save(payment);
        }
    }

