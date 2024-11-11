package com.example.projetpfesrtb2.GestionAgent.service;

import com.example.projetpfesrtb2.GestionAgent.model.Visite;
import com.example.projetpfesrtb2.GestionAgent.repo.VisiteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class VisiteService {
    @Autowired
    VisiteRepo visiteRepo;

    public List<Visite> findAll() { return visiteRepo.findAll(); }

    public Visite findById(Long id){return visiteRepo.findVisiteById(id);}
    public Visite add(Visite visite) {return visiteRepo.save(visite);}

    public void delete(Long id){visiteRepo.deleteById(id);}
    public Visite update (Visite visite) { return visiteRepo.save(visite); }
}
