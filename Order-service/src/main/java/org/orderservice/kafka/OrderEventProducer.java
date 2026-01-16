package org.orderservice.kafka;

import org.orderservice.event.OrderCreatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class OrderEventProducer {

    private final KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate;

    public OrderEventProducer(KafkaTemplate<String, OrderCreatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderCreatedEvent(OrderCreatedEvent event) {
        try {
            // Send asynchronously - fire and forget to prevent blocking
            // Use a separate thread to avoid any blocking
            new Thread(() -> {
                try {
                    CompletableFuture<SendResult<String, OrderCreatedEvent>> future = 
                        kafkaTemplate.send("order.created", event);
                    
                    // Handle result asynchronously without blocking
                    future.whenComplete((result, ex) -> {
                        if (ex != null) {
                            // Log but don't throw - this prevents blocking
                            System.err.println("Warning: Failed to send Kafka event: " + ex.getMessage());
                        }
                    });
                } catch (Exception e) {
                    // Silently ignore Kafka errors
                    System.err.println("Warning: Kafka send failed: " + e.getMessage());
                }
            }).start();
        } catch (Exception e) {
            // Silently ignore if thread creation fails
            System.err.println("Warning: Could not send Kafka event: " + e.getMessage());
        }
    }
}


