package com.example.projetpfesrtb2.GestionMedecin.repo;

import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface MedecinRepo extends JpaRepository<Medecin,Long> {

    void deleteMedecinById(Long id);

    Medecin findMedecinById(Long id);

    Medecin findMedecinByMatriculeFiscale(String matriculeFiscale);

    Optional<Medecin> findMedecinByMatriculeMedecin(String matriculeMed) ;

    Boolean existsByMatriculeMedecin (String matriculeMed) ;

    Boolean existsMedecinByMatriculeFiscale(String matriculeFis);

    List<Medecin> findMedecinsByType (String type);



}
