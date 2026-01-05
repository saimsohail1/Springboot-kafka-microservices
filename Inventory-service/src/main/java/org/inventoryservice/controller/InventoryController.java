package org.inventoryservice.controller;

import org.inventoryservice.entity.InventoryItem;
import org.inventoryservice.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryItem> getByProduct(@PathVariable String productId) {
        return ResponseEntity.ok(service.getByProductId(productId));
    }
}
