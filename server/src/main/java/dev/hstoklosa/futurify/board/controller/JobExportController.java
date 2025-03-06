package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.service.JobExportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/jobs/export")
@RequiredArgsConstructor
public class JobExportController {

    private final JobExportService jobExportService;

    /**
     * Export jobs from a specific board to Excel format
     * @param boardId The ID of the board containing the jobs
     * @return Excel file as a byte array
     */
    @GetMapping("/excel/board/{boardId}")
    public ResponseEntity<byte[]> exportJobsToExcel(@PathVariable Integer boardId) throws IOException {
        byte[] excelBytes = jobExportService.exportJobsToExcel(boardId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentDispositionFormData("attachment", "job_applications.xlsx");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(excelBytes);
    }
    
    /**
     * Export jobs from a specific board to JSON format
     * @param boardId The ID of the board containing the jobs
     * @return JSON file as a byte array
     */
    @GetMapping("/json/board/{boardId}")
    public ResponseEntity<byte[]> exportJobsToJson(@PathVariable Integer boardId) throws IOException {
        byte[] jsonBytes = jobExportService.exportJobsToJson(boardId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentDispositionFormData("attachment", "job_applications.json");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(jsonBytes);
    }
} 