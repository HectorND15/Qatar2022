CREATE DATABASE `telematica`;
USE telematica;
CREATE TABLE `arbitros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `procedencia` varchar(45) NOT NULL,
  `id_procedencia` int NOT NULL,
  PRIMARY KEY (`id`,`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `estadios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `capacidad` int NOT NULL,
  `ubicacion` varchar(45) NOT NULL,
  PRIMARY KEY (`id`,`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `selecciones` (
  `id_selecciones` int NOT NULL,
  `nombre_seleccion` varchar(45) NOT NULL,
  `entrenador` varchar(45) NOT NULL,
  `logo` varchar(45) NOT NULL,
  PRIMARY KEY (`id_selecciones`,`nombre_seleccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
CREATE TABLE `jugadores` (
  `id_jugadores` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `numero` int NOT NULL,
  `seleccion` int NOT NULL,
  PRIMARY KEY (`id_jugadores`,`nombre`,`numero`),
  KEY `fk_seleccion_idx` (`seleccion`),
  CONSTRAINT `fk_seleccion` FOREIGN KEY (`seleccion`) REFERENCES `selecciones` (`id_selecciones`)
) ENGINE=InnoDB AUTO_INCREMENT=92472963 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


