package com.push_notifications.api.controllers;

import com.push_notifications.api.pojo.Notification;
import com.push_notifications.api.pojo.Response;
import com.push_notifications.api.producers.KafkaProducerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Timestamp;
import java.time.Instant;

@RestController
@RequestMapping("/kafka")
public class KafkaController {

    private KafkaProducerService producerService;

    @Autowired
    KafkaController(KafkaProducerService producerService)
    {
        this.producerService = producerService;
    }
    @GetMapping("/producer")
    public Response producer(@RequestBody Notification notification)
    {
        if(notification == null)
        {
            return new Response("403", "empty request object");
        }
        Timestamp timestamp = Timestamp.from(Instant.now());
        notification.setTimestamp(timestamp);
        boolean result = producerService.send("test", notification);
        if(result)
        {
            return new Response("200", "posted successfully");
        }
        else{
            return new Response("500", "error occurred");
        }
    }
}
