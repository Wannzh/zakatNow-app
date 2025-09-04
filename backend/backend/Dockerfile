FROM maven:3.9.11-openjdk-21 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM openjdk:21.0.8-jdk-slim
COPY --from=build /target/backend-0.0.1-SNAPSHOT.jar backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-Xmx512m","-jar","backend.jar"]
