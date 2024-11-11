package com.example.projetpfesrtb2.GestionAgent.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.io.Serializable;

@Entity
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Enfant implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private String prenom;
    private Long age;
    private String niveau;


    @ManyToOne(targetEntity = Agent.class , fetch = FetchType.LAZY)
    @JsonBackReference(value = "enfants")
    //@JsonIgnoreProperties
    @JoinColumn(name = "agenf" , referencedColumnName = "matsrtb")
    //@OnDelete(action = OnDeleteAction.CASCADE)
    private Agent agent ;




}
