package com.example.projetpfesrtb2.GestionAgent.service;


import com.example.projetpfesrtb2.GestionAgent.model.Agence;
import com.example.projetpfesrtb2.GestionAgent.repo.AgenceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AgenceService {

    @Autowired
    AgenceRepo agenceRepo ;

    public List<Agence> getAllAgence() {
        return agenceRepo.findAll() ;
    }
}
