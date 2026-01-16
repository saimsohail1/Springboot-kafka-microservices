package org.inventoryservice.service;

import org.inventoryservice.entity.InventoryItem;
import org.inventoryservice.repository.InventoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository repository;

    public InventoryService(InventoryRepository repository) {
        this.repository = repository;
    }

    public InventoryItem getByProductId(String productId) {
        return repository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<InventoryItem> getAll() {
        return repository.findAll();
    }

    public InventoryItem createInventoryItem(InventoryItem item) {
        return repository.save(item);
    }
}
