package com.edusync.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class MultipartFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(MultipartFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String contentType = request.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE);
        String path = request.getURI().getPath();
        
        // Log multipart requests for debugging
        if (contentType != null && contentType.contains("multipart/form-data")) {
            logger.info("Multipart request detected: {} {}", request.getMethod(), path);
        }
        
        // For multipart requests, just pass through - Gateway should handle it
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // High priority
    }
}
