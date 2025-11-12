package com.edusync.hr.controller;

import com.edusync.hr.dto.DepartmentDTO;
import com.edusync.hr.dto.StaffDTO;
import com.edusync.hr.dto.StaffDocumentDTO;
import com.edusync.hr.dto.mapper.DepartmentMapper;
import com.edusync.hr.dto.mapper.StaffMapper;
import com.edusync.hr.dto.mapper.StaffDocumentMapper;
import com.edusync.hr.entity.Department;
import com.edusync.hr.entity.Staff;
import com.edusync.hr.entity.StaffDocument;
import com.edusync.hr.service.DepartmentService;
import com.edusync.hr.service.HrStatsService;
import com.edusync.hr.service.StaffDocumentService;
import com.edusync.hr.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hr")
@CrossOrigin(origins = "*")
public class HrController {
    
    private final DepartmentService departmentService;
    private final StaffService staffService;
    private final HrStatsService hrStatsService;
    private final StaffDocumentService staffDocumentService;
    
    @Autowired
    public HrController(
            DepartmentService departmentService,
            StaffService staffService,
            HrStatsService hrStatsService,
            StaffDocumentService staffDocumentService
    ) {
        this.departmentService = departmentService;
        this.staffService = staffService;
        this.hrStatsService = hrStatsService;
        this.staffDocumentService = staffDocumentService;
    }
    
    // ============ HEALTH & STATS ============
    
    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "edusync-hr");
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getHrStats() {
        return ResponseEntity.ok(hrStatsService.getHrStats());
    }
    
    // ============ DEPARTMENTS ============
    
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }
    
    @GetMapping("/departments/active")
    public ResponseEntity<List<Department>> getActiveDepartments() {
        return ResponseEntity.ok(departmentService.getActiveDepartments());
    }
    
    @GetMapping("/departments/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id) {
        return departmentService.getDepartmentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/departments/code/{code}")
    public ResponseEntity<Department> getDepartmentByCode(@PathVariable String code) {
        return departmentService.getDepartmentByCode(code)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/departments/{id}/subdepartments")
    public ResponseEntity<List<Department>> getSubDepartments(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getSubDepartments(id));
    }
    
    @PostMapping("/departments")
    public ResponseEntity<Department> createDepartment(@Valid @RequestBody DepartmentDTO departmentDTO) {
        Department department = DepartmentMapper.toEntity(departmentDTO);
        Department created = departmentService.createDepartment(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/departments/{id}")
    public ResponseEntity<Department> updateDepartment(
        @PathVariable Long id,
        @Valid @RequestBody DepartmentDTO departmentDTO
    ) {
        Department departmentDetails = DepartmentMapper.toEntity(departmentDTO);
        Department updated = departmentService.updateDepartment(id, departmentDetails);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/departments/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/departments/{id}/stats")
    public ResponseEntity<Map<String, Object>> getDepartmentStats(@PathVariable Long id) {
        return ResponseEntity.ok(hrStatsService.getDepartmentStats(id));
    }
    
    // ============ STAFF ============
    
    @GetMapping("/staff")
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }
    
    @GetMapping("/staff/active")
    public ResponseEntity<List<Staff>> getActiveStaff() {
        return ResponseEntity.ok(staffService.getActiveStaff());
    }
    
    @GetMapping("/staff/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/staff/employee/{employeeId}")
    public ResponseEntity<Staff> getStaffByEmployeeId(@PathVariable String employeeId) {
        return staffService.getStaffByEmployeeId(employeeId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/staff/email/{email}")
    public ResponseEntity<Staff> getStaffByEmail(@PathVariable String email) {
        return staffService.getStaffByEmail(email)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/staff/department/{departmentId}")
    public ResponseEntity<List<Staff>> getStaffByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(staffService.getStaffByDepartment(departmentId));
    }
    
    @PostMapping("/staff")
    public ResponseEntity<Staff> createStaff(@Valid @RequestBody StaffDTO staffDTO) {
        Staff staff = StaffMapper.toEntity(staffDTO);
        Staff created = staffService.createStaff(staff);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/staff/{id}")
    public ResponseEntity<Staff> updateStaff(
        @PathVariable Long id,
        @Valid @RequestBody StaffDTO staffDTO
    ) {
        Staff staffDetails = StaffMapper.toEntity(staffDTO);
        Staff updated = staffService.updateStaff(id, staffDetails);
        return ResponseEntity.ok(updated);
    }
    
    @PutMapping("/staff/{id}/terminate")
    public ResponseEntity<Staff> terminateStaff(@PathVariable Long id) {
        Staff terminated = staffService.terminateStaff(id, java.time.LocalDate.now());
        return ResponseEntity.ok(terminated);
    }
    
    @DeleteMapping("/staff/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }

    // ============ STAFF DOCUMENTS ============
    
    @GetMapping("/staff/{staffId}/documents")
    public ResponseEntity<List<StaffDocument>> getStaffDocuments(@PathVariable Long staffId) {
        try {
            List<StaffDocument> documents = staffDocumentService.getDocumentsByStaffId(staffId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
    
    @GetMapping("/staff/{staffId}/documents/type/{documentType}")
    public ResponseEntity<List<StaffDocument>> getStaffDocumentsByType(
        @PathVariable Long staffId,
        @PathVariable String documentType
    ) {
        return ResponseEntity.ok(staffDocumentService.getDocumentsByStaffIdAndType(staffId, documentType));
    }
    
    @GetMapping("/staff/{staffId}/documents/{documentId}")
    public ResponseEntity<StaffDocument> getStaffDocument(
        @PathVariable Long staffId,
        @PathVariable Long documentId
    ) {
        return staffDocumentService.getDocumentById(documentId)
            .map(doc -> {
                if (!doc.getStaff().getId().equals(staffId)) {
                    return ResponseEntity.notFound().<StaffDocument>build();
                }
                return ResponseEntity.ok(doc);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/staff/{staffId}/documents/upload")
    public ResponseEntity<StaffDocument> uploadStaffDocument(
        @PathVariable Long staffId,
        @RequestParam("file") MultipartFile file,
        @RequestParam("documentType") String documentType,
        @RequestParam(value = "description", required = false) String description
    ) {
        StaffDocument document = staffDocumentService.uploadDocument(staffId, file, documentType, description);
        return ResponseEntity.status(HttpStatus.CREATED).body(document);
    }
    
//    @PostMapping("/staff/{staffId}/documents")
//    public ResponseEntity<StaffDocument> createStaffDocument(
//        @PathVariable Long staffId,
//        @Valid @RequestBody StaffDocumentDTO documentDTO
//    ) {
//        StaffDocument document = StaffDocumentMapper.toEntity(documentDTO);
//        StaffDocument created = staffDocumentService.createDocument(staffId, document);
//        return ResponseEntity.status(HttpStatus.CREATED).body(created);
//    }
    
    @PutMapping("/staff/{staffId}/documents/{documentId}")
    public ResponseEntity<StaffDocument> updateStaffDocument(
        @PathVariable Long staffId,
        @PathVariable Long documentId,
        @Valid @RequestBody StaffDocumentDTO documentDTO
    ) {
        StaffDocument documentDetails = StaffDocumentMapper.toEntity(documentDTO);
        StaffDocument updated = staffDocumentService.updateDocument(staffId, documentId, documentDetails);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/staff/{staffId}/documents/{documentId}")
    public ResponseEntity<Void> deleteStaffDocument(
        @PathVariable Long staffId,
        @PathVariable Long documentId
    ) {
        staffDocumentService.deleteDocument(staffId, documentId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/staff/{staffId}/documents/{documentId}/download")
    public ResponseEntity<Resource> downloadStaffDocument(
        @PathVariable Long staffId,
        @PathVariable Long documentId
    ) throws MalformedURLException {
        Resource resource = staffDocumentService.downloadDocument(staffId, documentId);
        StaffDocument document = staffDocumentService.getDocumentById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(document.getContentType()))
            .header(HttpHeaders.CONTENT_DISPOSITION, 
                "attachment; filename=\"" + document.getFileName() + "\"")
            .body(resource);
    }
    
    @GetMapping("/documents/types")
    public ResponseEntity<List<String>> getDocumentTypes() {
        return ResponseEntity.ok(staffDocumentService.getAvailableDocumentTypes());
    }
    
//    @GetMapping("/documents/search")
//    public ResponseEntity<List<StaffDocument>> searchDocuments(
//        @RequestParam(required = false) String documentType,
//        @RequestParam(required = false) String fileName,
//        @RequestParam(required = false) Long staffId
//    ) {
//        return ResponseEntity.ok(staffDocumentService.searchDocuments(documentType, fileName, staffId));
//    }
}