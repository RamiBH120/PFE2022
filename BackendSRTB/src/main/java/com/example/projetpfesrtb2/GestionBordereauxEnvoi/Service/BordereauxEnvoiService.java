package com.example.projetpfesrtb2.GestionBordereauxEnvoi.Service;


import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BordereauxEnvoi;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.BordereauxEnvoiRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class BordereauxEnvoiService {

    @Autowired
    private BordereauxEnvoiRepo bordereauxEnvoiRepo;

    public BordereauxEnvoi addBordereauxEnvoi(BordereauxEnvoi bordereaux) {
        return bordereauxEnvoiRepo.save(bordereaux);
    }

    public List<BordereauxEnvoi> findAllBordereauxEnvoi() {
        return bordereauxEnvoiRepo.findAll();
    }


    public BordereauxEnvoi findBordereauxEnvoiById(Long id) {
        return bordereauxEnvoiRepo.findBordereauxEnvoiById(id);
    }

    public BordereauxEnvoi updateBordereauxEnvoi(BordereauxEnvoi bordereauxEnvoi) {
        return bordereauxEnvoiRepo.save(bordereauxEnvoi);
    }

    public void deleteBordereauxEnvoi(Long id) {
        bordereauxEnvoiRepo.deleteBordereauxEnvoiById(id);
    }

    public Boolean exists (String nom) { return bordereauxEnvoiRepo.existsBordereauxEnvoiByNom(nom); }

}
