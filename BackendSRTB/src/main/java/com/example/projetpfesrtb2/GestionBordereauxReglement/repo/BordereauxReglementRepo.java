package com.example.projetpfesrtb2.GestionBordereauxReglement.repo;

import com.example.projetpfesrtb2.GestionBordereauxReglement.model.BordereauxReglement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BordereauxReglementRepo extends JpaRepository<BordereauxReglement,Long> {

    Optional<BordereauxReglement> findBordereauxReglementById(Long id);

    void deleteBordereauxReglementById(Long id);

    BordereauxReglement findBordereauxReglementByFileDB_Id(Long id);

    Boolean existsBordereauxReglementByNom(String nom);
}
