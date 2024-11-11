package com.example.projetpfesrtb2.GestionPraticien.repo;


import com.example.projetpfesrtb2.GestionPraticien.model.Praticien;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PraticienRepo extends JpaRepository<Praticien,Long> {

    void deletePraticienById(Long id);

    Praticien findPraticienById(Long id);

    Praticien findPraticienByMatriculeFiscale(String matriculeFiscale);

    Optional<Praticien> findPraticienByMatriculePraticien(String matricule);

    Boolean existsPraticienByMatriculePraticien(String matricule);

    Boolean existsPraticienByMatriculeFiscale(String matriculeFis);

}
