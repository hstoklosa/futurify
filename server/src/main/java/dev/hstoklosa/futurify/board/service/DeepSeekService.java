package dev.hstoklosa.futurify.board.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.hstoklosa.futurify.board.dto.ai.DeepSeekMessage;
import dev.hstoklosa.futurify.board.dto.ai.DeepSeekRequest;
import dev.hstoklosa.futurify.board.dto.ai.DeepSeekResponse;
import dev.hstoklosa.futurify.board.dto.ai.JobInsightsResponse;
import dev.hstoklosa.futurify.common.exception.ServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class DeepSeekService {

    private final WebClient deepSeekWebClient;
    private final ObjectMapper objectMapper;
    private final String modelName;

    public DeepSeekService(
            WebClient deepSeekWebClient,
            @Value("${deepseek.api.model}") String modelName) {
        this.deepSeekWebClient = deepSeekWebClient;
        this.objectMapper = new ObjectMapper();
        this.modelName = modelName;
    }

    /**
     * Extract job insights from job description
     * @param jobDescription Job description text
     * @return JobInsightsResponse containing extracted responsibilities, qualifications, and keywords
     */
    public JobInsightsResponse extractJobInsights(String jobTitle, String companyName, String jobDescription) {
        if (jobDescription == null || jobDescription.trim().isEmpty()) {
            return JobInsightsResponse.builder()
                    .responsibilities(new ArrayList<>())
                    .qualifications(new ArrayList<>())
                    .keywords(new ArrayList<>())
                    .build();
        }

        String prompt = buildInsightsPrompt(jobTitle, companyName, jobDescription);
        String response = callDeepSeekAPI(prompt);
        
        try {
            return parseResponse(response);
        } catch (Exception e) {
            throw new ServiceException("Failed to parse AI insights response: " + e.getMessage());
        }
    }

    private String buildInsightsPrompt(String jobTitle, String companyName, String jobDescription) {
        return "I need to extract structured information from this job posting for " + jobTitle + " at " + companyName + ". " +
                "Please analyze the job description and extract the following information: \n\n" +
                "1. All job responsibilities (what a person will be doing in this role)\n" +
                "2. All required and preferred qualifications (what employers are looking for)\n" +
                "3. Important keywords that stand out in this posting (skills, technologies, methodologies, etc.)\n\n" +
                "Format your response as a valid JSON object with these fields:\n" +
                "- responsibilities: array of strings, each describing a distinct responsibility\n" +
                "- qualifications: array of strings, each describing a distinct qualification\n" +
                "- keywords: array of strings containing key terms from the posting\n\n" +
                "Here's the job description:\n\n" + jobDescription + "\n\n" +
                "Please provide a comprehensive analysis while maintaining proper JSON formatting. Include only the JSON response.";
    }

    private String callDeepSeekAPI(String prompt) {
        List<DeepSeekMessage> messages = List.of(new DeepSeekMessage("user", prompt));
        
        DeepSeekRequest request = DeepSeekRequest.builder()
                .model(modelName)
                .messages(messages)
                .temperature(0.3)
                .build();
        
        try {
            DeepSeekResponse response = deepSeekWebClient.post()
                    .uri("/v1/chat/completions")
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(DeepSeekResponse.class)
                    .block();

            if (response == null || response.getContent() == null) {
                throw new ServiceException("No response received from DeepSeek API");
            }
            
            return response.getContent();
        } catch (Exception e) {
            throw new ServiceException("Failed to call DeepSeek API: " + e.getMessage());
        }
    }

    private JobInsightsResponse parseResponse(String jsonResponse) throws JsonProcessingException {
        // Clean up the response if needed (remove markdown code blocks, etc.)
        String cleanedJson = jsonResponse.trim();
        if (cleanedJson.startsWith("```json")) {
            cleanedJson = cleanedJson.substring(7);
        }
        if (cleanedJson.startsWith("```")) {
            cleanedJson = cleanedJson.substring(3);
        }
        if (cleanedJson.endsWith("```")) {
            cleanedJson = cleanedJson.substring(0, cleanedJson.length() - 3);
        }
        cleanedJson = cleanedJson.trim();
        
        return objectMapper.readValue(cleanedJson, JobInsightsResponse.class);
    }
} 