package com.example.projetpfesrtb2.GestionPraticien.Service;

import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.ActeBSRepo;
import com.example.projetpfesrtb2.GestionPraticien.model.Praticien;
import com.example.projetpfesrtb2.GestionPraticien.repo.PraticienRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PraticienService {

    @Autowired
    private PraticienRepo praticienRepo;


    @Autowired
    private ActeBSRepo acteBSRepo ;


    public Praticien addPraticien (Praticien praticien) {
        return praticienRepo.save(praticien);
    }

    public List<Praticien> findAllPraticiens() {
        return praticienRepo.findAll();
    }

    public Praticien fetchPraticienByMatriculeFiscale(String matriculeFiscale) {
        return praticienRepo.findPraticienByMatriculeFiscale(matriculeFiscale);
    }

    public Praticien findPraticienById(Long id) {
        return praticienRepo.findPraticienById(id);
    }

    public Praticien updatePraticien(Praticien praticien) {
        return praticienRepo.save(praticien);
    }

    public void deletePraticien(Long id) {
        praticienRepo.deletePraticienById(id);
    }

    public Boolean existPraByMat(String mat) { return praticienRepo.existsPraticienByMatriculePraticien(mat) ; }

    public Boolean existPraByMatFis(String matFis) { return praticienRepo.existsPraticienByMatriculeFiscale(matFis) ; }

    public Boolean existPraByMatr(String matricule) { return acteBSRepo.existsActeBSByMatPraticienActeBS(matricule); }
    public Boolean existPraByMatrActeBS(String matricule) { return acteBSRepo.existsActeBSByPraticien_MatriculePraticien(matricule); }

}
