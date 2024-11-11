package com.example.projetpfesrtb2.GestionBordereauxEnvoi.model;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.BordereauxReglement;
import com.fasterxml.jackson.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;


@Entity
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
//@JsonIdentityReference(alwaysAsId = false)
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class BulletinSoin implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true,nullable = false)
    private Long numbs;
    private String typemalade;
    private LocalDate datebs;
    private Double sommeTotBull = 0.0 ;
    private Double sommeTotMed = 0.0 ;
    private Double sommeTotPrati = 0.0 ;
    private Double sommeTotPhar = 0.0 ;
    private Double sommeTotRestant = 0.0 ;

    @ManyToOne(targetEntity = Agent.class , fetch = FetchType.LAZY)
    //@JsonBackReference(value = "agents")
    //@JsonProperty
    @JoinColumn(name = "bullSoinAgentNumAffMatStar" , referencedColumnName = "matstar")
    //@OnDelete(action = OnDeleteAction.CASCADE)
    private Agent agent ;



    @ManyToOne(targetEntity = BordereauxEnvoi.class,fetch = FetchType.LAZY)
    @JsonBackReference(value = "bulletin")
    //@JsonIgnoreProperties
    @JoinColumn(name = "bebs" , referencedColumnName = "id")
    //@OnDelete(action = OnDeleteAction.CASCADE)
    private BordereauxEnvoi bordereauxEnvoi;

    @ManyToOne(targetEntity = BordereauxReglement.class,fetch = FetchType.LAZY)
    @JoinColumn(name = "BR",referencedColumnName = "id")
    private BordereauxReglement bordereauxReglement  ;


    @OneToMany(targetEntity = ActeBS.class , cascade = CascadeType.ALL)
    @JsonManagedReference(value = "acteBS")
    @JoinColumn(name = "BS" , referencedColumnName = "id")
    private List<ActeBS> acteBS ;

}
