package com.push_notifications.api.consumers;

import com.push_notifications.api.pojo.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KafkaConsumer {
    private RestTemplate restTemplate;

    @Autowired
    public KafkaConsumer(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @KafkaListener(topics = "test", groupId = "groupId")
    public void listener(Notification data) {
        restTemplate.postForObject("http://localhost:3000/notify", data, String.class);
    }
}
