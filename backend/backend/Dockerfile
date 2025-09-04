# Stage 1: Build
FROM maven:3.9.11-openjdk-21 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml dan src saja
COPY pom.xml .
COPY src ./src

# Build JAR tanpa test
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:21.0.8-jdk-slim
WORKDIR /app

# Copy hasil build dari stage sebelumnya
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar backend.jar

# Expose port Spring Boot
EXPOSE 8080

# Jalankan aplikasi dengan JVM memory limit
ENTRYPOINT ["java","-Xmx512m","-jar","backend.jar"]
