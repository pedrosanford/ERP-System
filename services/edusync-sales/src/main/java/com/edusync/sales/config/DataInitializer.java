package com.edusync.sales.config;

import com.edusync.sales.entity.Communication;
import com.edusync.sales.entity.Lead;
import com.edusync.sales.entity.SalesStage;
import com.edusync.sales.entity.Task;
import com.edusync.sales.repository.CommunicationRepository;
import com.edusync.sales.repository.LeadRepository;
import com.edusync.sales.repository.SalesStageRepository;
import com.edusync.sales.repository.TaskRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@SuppressWarnings("null")
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final SalesStageRepository stageRepository;
    private final LeadRepository leadRepository;
    private final TaskRepository taskRepository;
    private final CommunicationRepository communicationRepository;

    @Autowired
    public DataInitializer(
            SalesStageRepository stageRepository,
            LeadRepository leadRepository,
            TaskRepository taskRepository,
            CommunicationRepository communicationRepository) {
        this.stageRepository = stageRepository;
        this.leadRepository = leadRepository;
        this.taskRepository = taskRepository;
        this.communicationRepository = communicationRepository;
    }

    @PostConstruct
    public void init() {
        logger.info("Initializing Sales module data...");

        // Only initialize if database is empty
        if (stageRepository.count() == 0) {
            initializeStages();
            initializeLeads();
            logger.info("Sales module initialization completed successfully");
        } else {
            logger.info("Sales module data already exists, skipping initialization");
        }
    }

    private void initializeStages() {
        logger.info("Creating default pipeline stages...");

        SalesStage[] stages = {
            new SalesStage("inquiry", "New Inquiry", "bg-blue-500", 1, true),
            new SalesStage("contacted", "Contacted", "bg-yellow-500", 2, true),
            new SalesStage("application-started", "Application Started", "bg-orange-500", 3, true),
            new SalesStage("application-submitted", "Application Submitted", "bg-purple-500", 4, true),
            new SalesStage("interview-scheduled", "Interview/Tour Scheduled", "bg-indigo-500", 5, true),
            new SalesStage("accepted", "Accepted/Offered", "bg-green-500", 6, true),
            new SalesStage("enrolled", "Enrolled", "bg-emerald-500", 7, true),
            new SalesStage("lost", "Lost/Not Interested", "bg-gray-500", 8, true)
        };

        for (SalesStage stage : stages) {
            stageRepository.save(stage);
        }

        logger.info("Created {} default pipeline stages", stages.length);
    }

    private void initializeLeads() {
        logger.info("Creating sample leads...");

        // Lead 1: New Inquiry
        Lead lead1 = new Lead();
        lead1.setName("Sarah Johnson");
        lead1.setParentName("Mike Johnson");
        lead1.setGrade("9th Grade");
        lead1.setProgram("STEM Program");
        lead1.setSource("School Fair");
        lead1.setEnrollmentTerm("Fall 2025");
        lead1.setStatus("inquiry");
        lead1.setPriority(Lead.Priority.HIGH);
        lead1.setPhone("(555) 123-4567");
        lead1.setEmail("mike.johnson@example.com");
        lead1.setEstimatedTuitionValue(new BigDecimal("25000"));
        lead1.setAssignedRecruiter("John Smith");
        lead1.setPreferredContactMethod("email");
        lead1.setFollowUpDate(LocalDate.now().plusDays(5));
        lead1.setNextFollowUpDate(LocalDate.now().plusDays(10));
        lead1.setStatusNotes("Very interested in robotics program. Parent is an engineer.");
        lead1.setApplicationFeeStatus(true);
        lead1.setScholarshipRequested(true);
        lead1.setScholarshipAmount(new BigDecimal("5000"));
        lead1.setScholarshipNotes("Family interested in merit-based scholarships");
        lead1 = leadRepository.save(lead1);
        createTasksForLead(lead1.getId(), "Send program brochure", "Schedule campus tour");
        createCommunicationsForLead(lead1.getId(), "Sent initial welcome email with program information");

        // Lead 2: Contacted
        Lead lead2 = new Lead();
        lead2.setName("Alex Chen");
        lead2.setParentName("Lisa Chen");
        lead2.setGrade("11th Grade");
        lead2.setProgram("IB Program");
        lead2.setSource("Online Form");
        lead2.setEnrollmentTerm("Fall 2025");
        lead2.setStatus("contacted");
        lead2.setPriority(Lead.Priority.MEDIUM);
        lead2.setPhone("(555) 987-6543");
        lead2.setEmail("lisa.chen@example.com");
        lead2.setEstimatedTuitionValue(new BigDecimal("28000"));
        lead2.setAssignedRecruiter("Jane Doe");
        lead2.setPreferredContactMethod("phone");
        lead2.setFollowUpDate(LocalDate.now().plusDays(3));
        lead2.setNextFollowUpDate(LocalDate.now().plusDays(6));
        lead2.setStatusNotes("Parent works two jobs, needs flexible payment options.");
        lead2.setScholarshipRequested(true);
        lead2.setScholarshipAmount(new BigDecimal("10000"));
        lead2.setScholarshipNotes("Needs significant financial assistance");
        lead2 = leadRepository.save(lead2);
        createTasksForLead(lead2.getId(), "Send financial aid packet", "Schedule financial consultation");
        createCommunicationsForLead(lead2.getId(), "Initial contact call, discussed program options");

        // Lead 3: Application Started
        Lead lead3 = new Lead();
        lead3.setName("Emma Rodriguez");
        lead3.setParentName("Carlos Rodriguez");
        lead3.setGrade("10th Grade");
        lead3.setProgram("Arts Program");
        lead3.setSource("Referral");
        lead3.setEnrollmentTerm("Spring 2026");
        lead3.setStatus("application-started");
        lead3.setPriority(Lead.Priority.HIGH);
        lead3.setPhone("(555) 456-7890");
        lead3.setEmail("carlos.rodriguez@example.com");
        lead3.setEstimatedTuitionValue(new BigDecimal("26000"));
        lead3.setAssignedRecruiter("Maria Garcia");
        lead3.setPreferredContactMethod("email");
        lead3.setFollowUpDate(LocalDate.now().plusDays(2));
        lead3.setApplicationFeeStatus(true);
        lead3.setSubmissionDate(LocalDate.now().minusDays(5));
        lead3.setInterviewDate(LocalDate.now().plusDays(10));
        lead3.setInterviewer("Prof. Williams");
        lead3.setEnrollmentDeadline(LocalDate.now().plusMonths(6));
        lead3 = leadRepository.save(lead3);
        createTasksForLead(lead3.getId(), "Review art portfolio", "Schedule art department meeting");

        // Lead 4: Application Submitted
        Lead lead4 = new Lead();
        lead4.setName("David Kim");
        lead4.setParentName("Jennifer Kim");
        lead4.setGrade("12th Grade");
        lead4.setProgram("AP Program");
        lead4.setSource("Social Media");
        lead4.setEnrollmentTerm("Fall 2025");
        lead4.setStatus("application-submitted");
        lead4.setPriority(Lead.Priority.MEDIUM);
        lead4.setPhone("(555) 234-5678");
        lead4.setEmail("jennifer.kim@example.com");
        lead4.setEstimatedTuitionValue(new BigDecimal("30000"));
        lead4.setAssignedRecruiter("Tom Wilson");
        lead4.setPreferredContactMethod("email");
        lead4.setApplicationFeeStatus(true);
        lead4.setSubmissionDate(LocalDate.now().minusDays(10));
        lead4.setEnrollmentDeadline(LocalDate.now().plusMonths(2));
        lead4.setScholarshipRequested(true);
        lead4.setScholarshipAmount(new BigDecimal("8000"));
        lead4.setScholarshipNotes("Academic merit scholarship candidate");
        lead4 = leadRepository.save(lead4);

        // Lead 5: Interview Scheduled
        Lead lead5 = new Lead();
        lead5.setName("Sophia Williams");
        lead5.setParentName("Robert Williams");
        lead5.setGrade("9th Grade");
        lead5.setProgram("General Studies");
        lead5.setSource("Website");
        lead5.setEnrollmentTerm("Fall 2025");
        lead5.setStatus("interview-scheduled");
        lead5.setPriority(Lead.Priority.HIGH);
        lead5.setPhone("(555) 345-6789");
        lead5.setEmail("robert.williams@example.com");
        lead5.setEstimatedTuitionValue(new BigDecimal("24000"));
        lead5.setAssignedRecruiter("Sarah Johnson");
        lead5.setPreferredContactMethod("phone");
        lead5.setApplicationFeeStatus(true);
        lead5.setSubmissionDate(LocalDate.now().minusDays(7));
        lead5.setInterviewDate(LocalDate.now().plusDays(1));
        lead5.setInterviewer("Ms. Davis");
        lead5.setEnrollmentDeadline(LocalDate.now().plusMonths(2));
        lead5.setStatusNotes("Very enthusiastic family, ready to commit.");
        lead5 = leadRepository.save(lead5);
        createTasksForLead(lead5.getId(), "Prepare campus tour materials", "Conduct campus tour", "Send follow-up information packet");

        logger.info("Created 5 sample leads with tasks and communications");
    }

    private void createTasksForLead(Long leadId, String... taskTitles) {
        for (int i = 0; i < taskTitles.length; i++) {
            Task task = new Task();
            task.setLeadId(leadId);
            task.setTitle(taskTitles[i]);
            task.setCompleted(i == 0); // First task is completed, rest are pending
            task.setDueDate(LocalDate.now().plusDays(i + 1));
            taskRepository.save(task);
        }
    }

    private void createCommunicationsForLead(Long leadId, String... summaries) {
        for (int i = 0; i < summaries.length; i++) {
            Communication comm = new Communication();
            comm.setLeadId(leadId);
            comm.setType(i % 2 == 0 ? Communication.CommunicationType.EMAIL : Communication.CommunicationType.CALL);
            comm.setSummary(summaries[i]);
            comm.setTimestamp(LocalDateTime.now().minusDays(summaries.length - i));
            comm.setFollowUpRequired(i == summaries.length - 1); // Last one requires follow-up
            comm.setCreatedBy("System");
            communicationRepository.save(comm);
        }
    }
}
