package com.example.projetpfesrtb2.GestionBordereauxReglement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @ToString
public class BordereauxReglement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false , nullable = false)
    private Long id ;
    private String nom ;
    private String description ;
    private LocalDate date;
    private Double montantreg;
    private Boolean cloture ;

    @OneToOne(targetEntity = FileDB.class, cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    @JoinColumn(name = "fichier_id", referencedColumnName = "id")
    private FileDB fileDB ;
}
