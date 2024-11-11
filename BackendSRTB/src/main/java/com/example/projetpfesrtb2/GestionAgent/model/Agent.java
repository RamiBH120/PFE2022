package com.example.projetpfesrtb2.GestionAgent.model;

import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileDB;
import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Agent implements Serializable {
    @Id
    @Column(unique = true,updatable = false,nullable = false)
    private Long matsrtb;
    @Column(unique = true)
    private Long matstar;
    private Boolean affstar;
    private String nom;
    private String prenom;
    private String direction;
    private String fonction;
    private LocalDate datenaiss;
    private String situationcivil;
    private String nomconj;
    private String prenomconj;
    private Double SommeBulletinDeSoins = 0.0;
    private Double SommePharmacieActeBS = 0.0 ;
    private Double Sommerestant = 0.0 ;

    @OneToMany(targetEntity = Enfant.class, cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference(value = "enfants")
    //@JsonIgnoreProperties
    @JoinColumn(name = "agenf",referencedColumnName = "matsrtb")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Enfant> enfants;

    @ManyToOne(targetEntity = Agence.class , cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "agence" , referencedColumnName = "id")
    private Agence agence ;

    @OneToOne(targetEntity = Visite.class , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    @JoinColumn(name = "VisiteId" , referencedColumnName = "id")
    private Visite visite ;

}
