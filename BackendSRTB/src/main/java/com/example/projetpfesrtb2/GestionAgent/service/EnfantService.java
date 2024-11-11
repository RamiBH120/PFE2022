package com.example.projetpfesrtb2.GestionAgent.service;

import com.example.projetpfesrtb2.GestionAgent.model.Enfant;
import com.example.projetpfesrtb2.GestionAgent.repo.EnfantRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EnfantService {
    @Autowired
    EnfantRepo enfantRepo;

    public void addEnf(Enfant enfant) { enfantRepo.save(enfant); }

    public List<Enfant> getEnf() { return enfantRepo.findAll();}

    public Enfant findEnf(Long id) { return enfantRepo.findEnfantById(id); }

    public void deleteEnf(Long id) { enfantRepo.deleteById(id); }

}
