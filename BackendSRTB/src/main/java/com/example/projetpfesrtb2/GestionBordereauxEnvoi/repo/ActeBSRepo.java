package com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo;

import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.ActeBS;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActeBSRepo extends JpaRepository<ActeBS , Long> {


    List<ActeBS> findActeBSByBulletinSoinId(Long id);

    void deleteActeBSById(Long idActeBS);

    Boolean existsActeBSByMatPraticienActeBS(String matriculePra);
    Boolean existsActeBSByPharmacie_MatriculePharmacie(String matriculePhar);
    Boolean existsActeBSByMedecin_MatriculeMedecin(String matriculeMed);
    Boolean existsActeBSByActeMedical_Code(String code);
    Boolean existsActeBSByPraticien_MatriculePraticien(String matriculePra);
}
