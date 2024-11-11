package com.example.projetpfesrtb2.GestionAgent.repo;

import com.example.projetpfesrtb2.GestionAgent.model.Visite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VisiteRepo extends JpaRepository<Visite,Long> {

    List<Visite> findAll();

    Visite findVisiteById(Long id);

    void deleteById(Long id);
}
