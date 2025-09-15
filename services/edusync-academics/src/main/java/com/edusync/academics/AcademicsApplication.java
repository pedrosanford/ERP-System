package com.edusync.academics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class AcademicsApplication {
    public static void main(String[] args) {
        SpringApplication.run(AcademicsApplication.class, args);
    }
}
