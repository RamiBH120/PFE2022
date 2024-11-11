package com.example.projetpfesrtb2.GestionMedecin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
@Entity
public class Medecin implements Serializable{


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false , updatable = false)
    private Long id ;
    @Column(unique = true , nullable = false)
    private String matriculeMedecin;
    @Column(nullable = false)
    private String nom ;
    @Column(nullable = false)
    private String prenom ;
    @Column(unique = true , nullable = false , length = 13)
    private String matriculeFiscale ;
    @Column(nullable = false)
    private String type ;
    private String adresse ;
    private String phoneNumber ;
    private String ville ;

}
