package com.example.projetpfesrtb2.GestionPharmacie.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
@Entity
public class Pharmacie implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false , updatable = false)
    private Long id ;
    @Column(nullable = false , unique = true)
    private String matriculePharmacie ;
    @Column(nullable = false)
    private String nom ;
    @Column(unique = true,nullable = false)
    private String matfisc ;
    private String adr ;
    private String numtel;
    private String ville ;
    private Boolean isconventioned;
}
