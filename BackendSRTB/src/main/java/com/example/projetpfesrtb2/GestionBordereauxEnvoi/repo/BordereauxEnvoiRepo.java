package com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo;

import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BordereauxEnvoi;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BordereauxEnvoiRepo extends JpaRepository<BordereauxEnvoi,Long> {

    void deleteBordereauxEnvoiById(Long id);

    BordereauxEnvoi findBordereauxEnvoiById(Long id);


    Optional<BordereauxEnvoi> findBordereauxById(Long id);

    Boolean existsBordereauxEnvoiByNom(String nom) ;

}
