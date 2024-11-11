package com.example.projetpfesrtb2.GestionAgent.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Agence implements Serializable {

    @Id
    @Column(unique = true,updatable = false,nullable = false)
    private Long id ;
    @Column(unique = true,nullable = false)
    private String nomAgence ;
    private String adresseAgence ;
    private String villeAgence ;
}
