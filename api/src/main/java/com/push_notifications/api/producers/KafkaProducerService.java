package com.push_notifications.api.producers;

import com.push_notifications.api.pojo.Notification;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    private KafkaTemplate<String, Object> kafkaTemplate;

    KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public boolean send(String topic, Notification notification)
    {

        kafkaTemplate.send(topic,notification);
        return true;
    }
}
