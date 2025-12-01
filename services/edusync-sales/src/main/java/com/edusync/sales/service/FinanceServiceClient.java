package com.edusync.sales.service;

import com.edusync.sales.entity.Lead;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FinanceServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(FinanceServiceClient.class);

    private final RestTemplate restTemplate;

    @Value("${finance.service.url:http://localhost:8081}")
    private String financeServiceUrl;

    @Autowired
    public FinanceServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Creates a tuition invoice transaction when a lead is moved to enrolled status
     * Amount = estimated_tuition_value - scholarship_amount
     */
    public Map<String, Object> createTuitionInvoice(Lead lead, Object studentId) {
        try {
            // Calculate invoice amount: estimated_tuition_value - scholarship_amount
            BigDecimal estimatedTuition = lead.getEstimatedTuitionValue() != null 
                ? lead.getEstimatedTuitionValue() 
                : BigDecimal.ZERO;
            BigDecimal scholarshipAmount = lead.getScholarshipAmount() != null 
                ? lead.getScholarshipAmount() 
                : BigDecimal.ZERO;
            BigDecimal invoiceAmount = estimatedTuition.subtract(scholarshipAmount);

            // Only create invoice if amount is positive
            if (invoiceAmount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Invoice amount must be greater than 0. Estimated tuition: " 
                    + estimatedTuition + ", Scholarship: " + scholarshipAmount);
            }

            // Generate unique transaction ID
            String transactionId = "INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

            // Prepare transaction data
            Map<String, Object> transactionData = new HashMap<>();
            transactionData.put("transactionId", transactionId);
            transactionData.put("type", "INCOME");
            transactionData.put("amount", invoiceAmount);
            transactionData.put("category", "Tuition Invoice");
            transactionData.put("subCategory", "Tuition");
            transactionData.put("date", LocalDate.now());
            transactionData.put("description", "Tuition invoice for " + lead.getName() + 
                (scholarshipAmount.compareTo(BigDecimal.ZERO) > 0 
                    ? " (Scholarship: $" + scholarshipAmount + " applied)" 
                    : ""));
            transactionData.put("status", "PENDING");
            // Convert studentId to Long if it's a number, otherwise use as string
            if (studentId instanceof Number) {
                transactionData.put("studentId", ((Number) studentId).longValue());
            } else if (studentId instanceof String) {
                try {
                    transactionData.put("studentId", Long.parseLong((String) studentId));
                } catch (NumberFormatException e) {
                    // If it's not a number, we can't set it as studentId (which expects Long)
                    // Log warning but continue
                    logger.warn("Could not convert studentId to Long: {}", studentId);
                }
            } else {
                transactionData.put("studentId", studentId);
            }
            transactionData.put("reference", "Lead ID: " + lead.getId());

            // Make HTTP request to Finance Service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(transactionData, headers);

            String url = financeServiceUrl + "/finance/transactions";
            logger.info("Calling Finance Service at: {}", url);
            logger.info("Transaction data: {}", transactionData);
            
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                logger.info("Invoice created successfully: {}", response.getBody());
                @SuppressWarnings("unchecked")
                Map<String, Object> body = response.getBody();
                return body;
            } else {
                String errorMsg = "Failed to create invoice: " + response.getStatusCode();
                logger.error(errorMsg);
                throw new RuntimeException(errorMsg);
            }
        } catch (org.springframework.web.client.RestClientException e) {
            String errorMsg = "Error calling Finance Service at " + financeServiceUrl + ": " + e.getMessage();
            logger.error(errorMsg, e);
            throw new RuntimeException(errorMsg, e);
        } catch (Exception e) {
            String errorMsg = "Error creating tuition invoice: " + e.getMessage();
            logger.error(errorMsg, e);
            throw new RuntimeException(errorMsg, e);
        }
    }
}

