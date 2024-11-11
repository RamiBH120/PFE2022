package com.example.projetpfesrtb2.GestionActesMedicaux.repo;

import com.example.projetpfesrtb2.GestionActesMedicaux.model.ActeMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ActeMedicalRepo extends JpaRepository<ActeMedical,Long> {

    void deleteActeMedicalById(Long id);
    ActeMedical findActeMedicalById(Long id);

    Optional<ActeMedical> findActeMedicalByCode(String code);
    Boolean existsActeMedicalByCode(String code);
}
