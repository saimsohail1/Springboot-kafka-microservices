package org.inventoryservice.kafka;

import org.inventoryservice.event.OrderCreatedEvent;
import org.inventoryservice.entity.InventoryItem;
import org.inventoryservice.repository.InventoryRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class InventoryConsumer {

    private final InventoryRepository repository;

    public InventoryConsumer(InventoryRepository repository) {
        this.repository = repository;
    }

    @KafkaListener(topics = "order.created", groupId = "inventory-group")
    public void consume(OrderCreatedEvent event) {
        InventoryItem item = repository.findById(event.getProductId())
                .orElseGet(() -> {
                    InventoryItem i = new InventoryItem();
                    i.setProductId(event.getProductId());
                    i.setAvailableQuantity(100); // default stock
                    return i;
                });

        item.setAvailableQuantity(
                item.getAvailableQuantity() - event.getQuantity()
        );

        repository.save(item);
    }
}
