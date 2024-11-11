package com.example.projetpfesrtb2.GestionPharmacie.service;

import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.ActeBSRepo;
import com.example.projetpfesrtb2.GestionPharmacie.model.Pharmacie;
import com.example.projetpfesrtb2.GestionPharmacie.repo.PharmacieRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PharmacieService {

    @Autowired
    private PharmacieRepo pharmacieRepo;

    @Autowired
    ActeBSRepo acteBSRepo ;

    public Pharmacie addPharmacie(Pharmacie pharmacie){return pharmacieRepo.save(pharmacie);}

    public List<Pharmacie> findAllPharmacies() {
        return pharmacieRepo.findAll();
    }

    public Pharmacie findPharmacieByMatriculeFiscale(String matriculeFiscale) {
        return pharmacieRepo.findPharmacieByMatfisc(matriculeFiscale);
    }
    public Pharmacie findPharmacieByMatricule(String matricule) {
        Pharmacie pharmacie = new Pharmacie() ;
        if (pharmacieRepo.findPharmacieByMatriculePharmacie(matricule).isPresent()){
            pharmacie = pharmacieRepo.findPharmacieByMatriculePharmacie(matricule).get();
        }
        return pharmacie ;
    }

    public Pharmacie findPharmacieById(Long id) {
        return pharmacieRepo.findPharmacieById(id);
    }

    public Pharmacie updatePharmacie(Pharmacie pharmacie) {
        return pharmacieRepo.save(pharmacie);
    }

    public void deletePharmacie(Long id) {
        pharmacieRepo.deletePharmacieById(id);
    }

    public List<Pharmacie> findPharmacieByNom(String nom) {return pharmacieRepo.findPharmacieByNom(nom);}

    public Boolean existPharByMatricule(String mat) { return pharmacieRepo.existsPharmacieByMatriculePharmacie(mat); }
    public Boolean existPharByFisc(String fisc) { return pharmacieRepo.existsPharmacieByMatfisc(fisc); }

    public Boolean existPharByMatr(String matricule) { return acteBSRepo.existsActeBSByPharmacie_MatriculePharmacie(matricule); }
    public Boolean existPraByMatr(String matricule) { return acteBSRepo.existsActeBSByMatPraticienActeBS(matricule); }

}
