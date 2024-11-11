package com.example.projetpfesrtb2.GestionBordereauxReglement.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Entity @Data @NoArgsConstructor @AllArgsConstructor @ToString
public class FileDB {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false , nullable = false)
    private Long id;
    private String name;
    private String type;
    @Lob
    private byte[] data;

    /*
    @OneToOne(mappedBy = "fichier")
    private BordereauxReglement bordereauxReglement;*/
}
