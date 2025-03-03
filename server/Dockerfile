# Use Maven image for development
FROM maven:3.9.4-eclipse-temurin-21

WORKDIR /app

# Copy Maven configuration and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the entire source
COPY . .

# Make the Maven wrapper script executable
RUN chmod +x ./mvnw

# Expose the application port
EXPOSE 8080

# Create a shell script to run the application
RUN echo '#!/bin/sh\nmvn spring-boot:run' > /app/run.sh && \
    chmod +x /app/run.sh

# Run the application in development mode with hot reload
CMD ["/app/run.sh"]
