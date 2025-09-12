FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/edusync-student-1.0.0.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java", "-jar", "app.jar"]
