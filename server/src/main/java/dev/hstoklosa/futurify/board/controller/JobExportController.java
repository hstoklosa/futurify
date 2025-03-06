package dev.hstoklosa.futurify.board.controller;

import dev.hstoklosa.futurify.board.service.JobExportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/jobs/export")
@RequiredArgsConstructor
@Slf4j
public class JobExportController {

    private final JobExportService jobExportService;

    /**
     * Export jobs from a specific board to Excel format
     * @param boardId The ID of the board containing the jobs
     * @return Excel file as a byte array
     */
    @GetMapping("/excel/board/{boardId}")
    public ResponseEntity<byte[]> exportJobsToExcel(@PathVariable Integer boardId) throws IOException {
        log.info("Exporting jobs to Excel for board ID: {}", boardId);
        byte[] excelBytes = jobExportService.exportJobsToExcel(boardId);
        log.info("Excel export complete. Size: {} bytes", excelBytes.length);
        
        String filename = "job_applications_board_" + boardId + ".xlsx";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
        headers.setContentLength(excelBytes.length);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        headers.setPragma("no-cache");
        headers.setExpires(0);
        
        // CORS headers
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        
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
        log.info("Exporting jobs to JSON for board ID: {}", boardId);
        byte[] jsonBytes = jobExportService.exportJobsToJson(boardId);
        log.info("JSON export complete. Size: {} bytes", jsonBytes.length);
        
        String filename = "job_applications_board_" + boardId + ".json";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setContentLength(jsonBytes.length);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
        headers.setCacheControl("no-cache, no-store, must-revalidate");
        headers.setPragma("no-cache");
        headers.setExpires(0);
        
        // CORS headers
        headers.add("Access-Control-Expose-Headers", "Content-Disposition");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(jsonBytes);
    }
} 