package org.orderservice.service;

import org.orderservice.dto.CreateOrderRequest;
import org.orderservice.entity.Orders;
import org.orderservice.event.OrderCreatedEvent;
import org.orderservice.kafka.OrderEventProducer;
import org.orderservice.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository repository;
    private final OrderEventProducer eventProducer;

    public OrderService(OrderRepository repository, OrderEventProducer eventProducer) {
        this.repository = repository;
        this.eventProducer = eventProducer;
    }

    @Transactional
    public Orders createOrder(CreateOrderRequest request) {
        Orders order = new Orders();
        order.setProductId(request.getProductId());
        order.setQuantity(request.getQuantity());
        order.setPrice(request.getPrice());
        
        Orders savedOrder = repository.save(order);

        // Publish event to Kafka (async, non-blocking - handled in producer)
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(savedOrder.getId());
        event.setProductId(savedOrder.getProductId());
        event.setQuantity(savedOrder.getQuantity());
        event.setPrice(savedOrder.getPrice());
        
        eventProducer.sendOrderCreatedEvent(event);

        return savedOrder;
    }

    public List<Orders> getAll() {
        return repository.findAll();
    }
}


