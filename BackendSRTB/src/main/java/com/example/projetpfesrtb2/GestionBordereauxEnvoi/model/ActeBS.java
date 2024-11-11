package com.example.projetpfesrtb2.GestionBordereauxEnvoi.model;

import com.example.projetpfesrtb2.GestionActesMedicaux.model.ActeMedical;
import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import com.example.projetpfesrtb2.GestionPharmacie.model.Pharmacie;
import com.example.projetpfesrtb2.GestionPraticien.model.Praticien;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;


@Entity
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class ActeBS implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(updatable = false , nullable = false)
    private Long id ;
    private String matPraticienActeBS ;
    private String beneficiaire ;
    private Double montantActeBS = 0.0;
    private Long quantiteActeBS;
    private LocalDate dateActeBS;
    private Double montantTheoriqueActeBS = 0.0 ;

    @ManyToOne(targetEntity = BulletinSoin.class , fetch = FetchType.LAZY)
    @JsonBackReference(value = "acteBS")
    @JoinColumn(name = "BS" , referencedColumnName = "id")
    private BulletinSoin bulletinSoin;

    @ManyToOne(targetEntity = Medecin.class , fetch = FetchType.LAZY)
    @JoinColumn(name = "medecin" , referencedColumnName = "matriculeMedecin")
    private Medecin medecin;

    @ManyToOne(targetEntity = Praticien.class , fetch = FetchType.LAZY)
    @JoinColumn(name = "praticien" , referencedColumnName = "matriculePraticien")
    private Praticien praticien;

    @ManyToOne(targetEntity = Pharmacie.class , fetch = FetchType.LAZY)
    @JoinColumn(name = "pharmacie" , referencedColumnName = "matriculePharmacie")
    private Pharmacie pharmacie;

    @ManyToOne(targetEntity = ActeMedical.class , fetch = FetchType.LAZY)
    @JoinColumn(name = "acteMedical" , referencedColumnName = "code")
    private ActeMedical acteMedical;


}
