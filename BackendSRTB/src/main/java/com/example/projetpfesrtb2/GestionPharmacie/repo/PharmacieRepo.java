package com.example.projetpfesrtb2.GestionPharmacie.repo;

import com.example.projetpfesrtb2.GestionPharmacie.model.Pharmacie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PharmacieRepo extends JpaRepository<Pharmacie,Long> {

    void deletePharmacieById(Long id);
    Pharmacie findPharmacieById(Long id);
    Pharmacie findPharmacieByMatfisc(String matriculeFiscale);
    List<Pharmacie> findPharmacieByNom(String nom);
    Optional<Pharmacie> findPharmacieByMatriculePharmacie(String matPhar);
    Boolean existsPharmacieByMatriculePharmacie(String mat);
    Boolean existsPharmacieByMatfisc(String matfis);
}
