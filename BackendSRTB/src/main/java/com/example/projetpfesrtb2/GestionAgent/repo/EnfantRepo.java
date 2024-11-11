package com.example.projetpfesrtb2.GestionAgent.repo;

import com.example.projetpfesrtb2.GestionAgent.model.Enfant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


public interface EnfantRepo extends JpaRepository<Enfant,Long> {
    List<Enfant> findEnfantByAgent_Matsrtb(Long matsrtb);

    List<Enfant> findEnfantByAgent_Matstar(Long matstar);

    Enfant findEnfantById(Long id);
}
