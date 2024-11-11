package com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BulletinSoin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BulletinSoinRepo extends JpaRepository<BulletinSoin,Long> {
    Optional<BulletinSoin> findBulletinSoinByNumbs(Long numbs);
    Optional<BulletinSoin> findBulletinSoinByAgent_Matstar(Long numaff);
    List<BulletinSoin> findAllByAgent_Matstar(Long matstar);
    Optional<BulletinSoin> findBulletinSoinById(Long id);
    void delete (BulletinSoin bulletinSoin);
    Optional<BulletinSoin> findBulletinSoinByIdAndAgent_Matstar(Long id , Long matstar);
    List<BulletinSoin> findBulletinSoinByBordereauxEnvoiId(Long idBor);
    Boolean existsBulletinSoinByNumbs(Long numbs);
    List<BulletinSoin> findBulletinSoinByAgent_Agence_Id (Long id);
    List<BulletinSoin> findBulletinSoinByBordereauxReglementId(Long id) ;
    Boolean existsBulletinSoinByBordereauxReglement_Id(Long id) ;


}
