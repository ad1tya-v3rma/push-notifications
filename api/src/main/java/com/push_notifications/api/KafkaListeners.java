package com.push_notifications.api;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaListeners {
    @KafkaListener(topics = "test", groupId = "groupId")
    public void listener(String data){
        System.out.println("Received : "+data + "😏");
    }
}
