package dev.hstoklosa.futurify.board.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import dev.hstoklosa.futurify.board.dto.JobResponse;
import dev.hstoklosa.futurify.board.entity.JobType;
import dev.hstoklosa.futurify.stage.entity.Stage;
import dev.hstoklosa.futurify.stage.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class JobExportService {

    private final JobService jobService;
    private final StageRepository stageRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Export jobs from a specific board to Excel format
     * @param boardId The ID of the board containing the jobs
     * @return Byte array containing the Excel file
     */
    @Transactional(readOnly = true)
    public byte[] exportJobsToExcel(Integer boardId) throws IOException {
        log.info("Exporting jobs to Excel for board ID: {}", boardId);
        List<JobResponse> jobs = jobService.getJobs(boardId);
        log.info("Found {} jobs to export", jobs.size());
        
        // Get all stage IDs from the jobs
        List<Integer> stageIds = jobs.stream()
                .map(JobResponse::getStageId)
                .distinct()
                .collect(Collectors.toList());
        
        // Fetch all stages and create a map for quick lookup
        Map<Integer, Stage> stageMap = stageRepository.findAllById(stageIds).stream()
                .collect(Collectors.toMap(Stage::getId, Function.identity()));
        
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            XSSFWorkbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Job Applications");
            
            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = createHeaderStyle(workbook);
            
            String[] columns = {
                    "ID", "Title", "Company", "Location", "Job Type", 
                    "Stage", "Salary", "Description", "Post URL", 
                    "Position", "Created At", "Updated At"
            };
            
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }
            
            // Create data rows
            int rowNum = 1;
            for (JobResponse job : jobs) {
                Row row = sheet.createRow(rowNum++);
                
                row.createCell(0).setCellValue(job.getId());
                row.createCell(1).setCellValue(job.getTitle());
                row.createCell(2).setCellValue(job.getCompanyName());
                row.createCell(3).setCellValue(job.getLocation() != null ? job.getLocation() : "");
                row.createCell(4).setCellValue(formatJobType(job.getType()));
                
                // Get stage name from the map
                String stageName = stageMap.containsKey(job.getStageId()) 
                        ? stageMap.get(job.getStageId()).getName() 
                        : "Unknown";
                row.createCell(5).setCellValue(stageName);
                
                row.createCell(6).setCellValue(job.getSalary() != null ? job.getSalary() : "");
                row.createCell(7).setCellValue(job.getDescription() != null ? job.getDescription() : "");
                row.createCell(8).setCellValue(job.getPostUrl() != null ? job.getPostUrl() : "");
                row.createCell(9).setCellValue(job.getPosition());
                row.createCell(10).setCellValue(job.getCreatedAt() != null ? job.getCreatedAt().format(DATE_FORMATTER) : "");
                row.createCell(11).setCellValue(job.getUpdatedAt() != null ? job.getUpdatedAt().format(DATE_FORMATTER) : "");
            }
            
            // Autosize columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            // Write to ByteArrayOutputStream
            workbook.write(outputStream);
            workbook.close();
            outputStream.flush();
            byte[] result = outputStream.toByteArray();
            log.info("Successfully generated Excel file of size: {} bytes", result.length);
            return result;
        } catch (Exception e) {
            log.error("Error exporting jobs to Excel: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Export jobs from a specific board to JSON format
     * @param boardId The ID of the board containing the jobs
     * @return Byte array containing the JSON file
     */
    @Transactional(readOnly = true)
    public byte[] exportJobsToJson(Integer boardId) throws IOException {
        log.info("Exporting jobs to JSON for board ID: {}", boardId);
        List<JobResponse> jobs = jobService.getJobs(boardId);
        log.info("Found {} jobs to export", jobs.size());
        
        // Get all stage IDs from the jobs
        List<Integer> stageIds = jobs.stream()
                .map(JobResponse::getStageId)
                .distinct()
                .collect(Collectors.toList());
        
        // Fetch all stages and create a map for quick lookup
        Map<Integer, Stage> stageMap = stageRepository.findAllById(stageIds).stream()
                .collect(Collectors.toMap(Stage::getId, Function.identity()));
        
        // Create enhanced job data with stage names
        List<Map<String, Object>> enhancedJobs = jobs.stream().map(job -> {
            Map<String, Object> enhancedJob = new HashMap<>();
            enhancedJob.put("id", job.getId());
            enhancedJob.put("title", job.getTitle());
            enhancedJob.put("companyName", job.getCompanyName());
            enhancedJob.put("location", job.getLocation());
            enhancedJob.put("jobType", formatJobType(job.getType()));
            
            // Add stage name
            String stageName = stageMap.containsKey(job.getStageId()) 
                    ? stageMap.get(job.getStageId()).getName() 
                    : "Unknown";
            enhancedJob.put("stageId", job.getStageId());
            enhancedJob.put("stageName", stageName);
            
            enhancedJob.put("salary", job.getSalary());
            enhancedJob.put("description", job.getDescription());
            enhancedJob.put("postUrl", job.getPostUrl());
            enhancedJob.put("position", job.getPosition());
            
            // Format dates to strings for consistent JSON output
            enhancedJob.put("createdAt", job.getCreatedAt() != null ? job.getCreatedAt().format(DATE_FORMATTER) : null);
            enhancedJob.put("updatedAt", job.getUpdatedAt() != null ? job.getUpdatedAt().format(DATE_FORMATTER) : null);
            
            return enhancedJob;
        }).collect(Collectors.toList());
        
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            // Configure ObjectMapper for proper date serialization
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
            
            // Write to ByteArrayOutputStream
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(outputStream, enhancedJobs);
            outputStream.flush();
            byte[] result = outputStream.toByteArray();
            log.info("Successfully generated JSON file of size: {} bytes", result.length);
            return result;
        } catch (Exception e) {
            log.error("Error exporting jobs to JSON: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    /**
     * Format JobType enum to a more readable format
     */
    private String formatJobType(JobType type) {
        if (type == null) {
            return "";
        }
        
        switch (type) {
            case REMOTE:
                return "Remote";
            case ON_SITE:
                return "On-Site";
            case HYBRID:
                return "Hybrid";
            default:
                return type.toString();
        }
    }
    
    /**
     * Create header style for Excel sheet
     */
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
} 