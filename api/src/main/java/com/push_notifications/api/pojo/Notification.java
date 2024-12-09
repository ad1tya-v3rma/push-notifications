package com.push_notifications.api.pojo;

import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Component
public class Notification{
    private String headLine;
    private String body;

    private Timestamp timestamp;

    public String getHeadLine() {
        return headLine;
    }

    public void setHeadLine(String headLine) {
        this.headLine = headLine;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Timestamp getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Timestamp timestamp) {
        this.timestamp = timestamp;
    }
}
