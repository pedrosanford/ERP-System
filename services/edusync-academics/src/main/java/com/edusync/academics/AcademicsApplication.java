package com.edusync.academics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class AcademicsApplication {
    public static void main(String[] args) {
        SpringApplication.run(AcademicsApplication.class, args);
    }
}
