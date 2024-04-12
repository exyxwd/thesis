# Thesis - EXYXWD

This project is a full-stack application built with React on the frontend, Spring Boot on the backend, and PostgreSQL is used as the database. 
The aim of the project is the map visualization of illegally disposed wastes mainly around Hungarian bodies of water, the data is provided by Trashout.

## Prerequisites
- [Bun](https://bun.sh/docs/installation)
- [Java 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Maven](https://maven.apache.org/download.cgi)
- [PostgreSQL](https://www.postgresql.org/download/)

## Set-up

### Backend
1. Access the psql command line (on linux sudo might be needed):
```bash
-u postgres psql
```
2. Create a database named wastedb:
```
create database wastedb;
```
3. Create a user named crassus with the same password (or optionally without password):
```
create user crassus with encrypted password 'crassus';
```
4. Grant priviliges on database to user:
```
grant all privileges on database wastedb to crassus;
```
5. Build the application in the ```backend``` directory:
```bash
mvn clean install
```
6. Run the application:
```bash
mvn spring-boot:run
```
The backend will start on http://localhost:8080 by default.

### Frontend

In the ```frontend``` directory:

1. Install dependencies:
```bash
bun install
```
2. Start the development server:
```bash
bun run dev
``` 
or simply 
```bash
bun dev
```
The frontend will start on http://localhost:5173 by default.
