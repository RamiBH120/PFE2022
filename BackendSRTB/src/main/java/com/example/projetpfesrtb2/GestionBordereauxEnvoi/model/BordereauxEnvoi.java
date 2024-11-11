package com.example.projetpfesrtb2.GestionBordereauxEnvoi.model;

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
import java.util.ArrayList;
import java.util.List;


@Entity
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
//@JsonIdentityReference(alwaysAsId = false)
@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class BordereauxEnvoi implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(updatable = false , nullable = false)
    private Long id ;
    @Column(unique = true , nullable = false)
    private String nom ;
    private String description ;
    private LocalDate dateDebut ;
    private LocalDate dateFin ;

    @OneToMany(targetEntity = BulletinSoin.class, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference(value = "bulletin")
    //@JsonIgnoreProperties
    @JoinColumn(name = "bebs",referencedColumnName = "id")
    //@OnDelete(action = OnDeleteAction.CASCADE)
    private List<BulletinSoin> bulletinSoinList ;


}
