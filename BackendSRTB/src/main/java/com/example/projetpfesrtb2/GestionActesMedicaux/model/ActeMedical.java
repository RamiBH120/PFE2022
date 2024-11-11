package com.example.projetpfesrtb2.GestionActesMedicaux.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ActeMedical implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String code;
    @Column(nullable = false)
    private String designation;
    @Column(nullable = false)
    private String mode;
    private String observation;
    @Column(nullable = false)
    private Double valeur;
    @Column(nullable = false)
    private Double plafond;
}