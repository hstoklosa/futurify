# Use Maven image for development
FROM maven:3.9.4-eclipse-temurin-21

WORKDIR /app

# Copy Maven configuration and download dependencies
COPY pom.xml ./
RUN mvn dependency:go-offline

# Copy the entire source
COPY . .

# Expose the application port
EXPOSE 8080

# Run the application in development mode with hot reload
CMD ["mvn", "spring-boot:run"]
