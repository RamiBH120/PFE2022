package com.example.projetpfesrtb2.GestionCompte.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
@Entity
@Table(name = "user")
public class UserDB {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false , updatable = false)
    private Long id ;
    @Column(unique = true ,nullable = false)
    private String username = "";
    @Column(unique = true ,nullable = false)
    private String password ;
    @Column(unique = true , nullable = false)
    private String matricule ;
    @Column(nullable = false, unique = true)
    private String email = "";
    private String type = "utilisateur";
    private String phoneNumber ;
    private String adresse;
    private String firstname;
    private String lastname;
    private LocalDate dateNaiss;
    @Column(unique = true)
    private String token;
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime tokenCreationDate;

    @OneToOne(targetEntity = Image.class, cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private Image image ;
}
