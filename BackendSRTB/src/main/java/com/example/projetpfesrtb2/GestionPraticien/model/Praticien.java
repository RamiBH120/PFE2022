package com.example.projetpfesrtb2.GestionPraticien.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class Praticien implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false , updatable = false)
    private Long id;
    @Column(nullable = false,unique = true)
    private String matriculePraticien ;
    @Column(nullable = false)
    private String nom ;
    @Column(nullable = false)
    private String prenom ;
    @Column(nullable = false , unique = true)
    private String matriculeFiscale ;
    private String description ;
    private String adresse ;
    private String phoneNumber ;
    private String ville ;

}
