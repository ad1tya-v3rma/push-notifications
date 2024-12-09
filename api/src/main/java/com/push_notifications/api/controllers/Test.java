package com.push_notifications.api.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class Test {
    @GetMapping("test")
    public String test()
    {
        return "success";
    }
}
