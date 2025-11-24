package com.edusync.sales.service;

import com.edusync.sales.repository.LeadRepository;
import com.edusync.sales.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class SalesStatsService {

    private final LeadRepository leadRepository;
    private final TaskRepository taskRepository;

    @Autowired
    public SalesStatsService(LeadRepository leadRepository, TaskRepository taskRepository) {
        this.leadRepository = leadRepository;
        this.taskRepository = taskRepository;
    }

    public Map<String, Object> getSalesStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalLeads = leadRepository.count();
        long newLeads = leadRepository.countByStatus("inquiry");
        long enrolledCount = leadRepository.countByStatus("enrolled");
        Double potentialRevenue = leadRepository.sumPotentialRevenue();
        long scholarshipRequests = leadRepository.countScholarshipRequests();
        long overdueTasks = taskRepository.countOverdueTasks(LocalDate.now());

        // Calculate conversion rate
        double conversionRate = totalLeads > 0 ? (enrolledCount * 100.0 / totalLeads) : 0.0;

        stats.put("totalLeads", totalLeads);
        stats.put("newLeads", newLeads);
        stats.put("enrolledCount", enrolledCount);
        stats.put("conversionRate", Math.round(conversionRate * 10.0) / 10.0);
        stats.put("potentialRevenue", potentialRevenue != null ? potentialRevenue : 0.0);
        stats.put("scholarshipRequests", scholarshipRequests);
        stats.put("overdueTasks", overdueTasks);

        return stats;
    }
}
