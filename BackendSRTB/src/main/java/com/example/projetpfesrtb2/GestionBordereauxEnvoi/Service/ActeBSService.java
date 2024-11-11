package com.example.projetpfesrtb2.GestionBordereauxEnvoi.Service;


import com.example.projetpfesrtb2.GestionActesMedicaux.model.ActeMedical;
import com.example.projetpfesrtb2.GestionActesMedicaux.repo.ActeMedicalRepo;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.ActeBS;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BulletinSoin;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.ActeBSRepo;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.BulletinSoinRepo;
import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import com.example.projetpfesrtb2.GestionMedecin.repo.MedecinRepo;
import com.example.projetpfesrtb2.GestionPharmacie.model.Pharmacie;
import com.example.projetpfesrtb2.GestionPharmacie.repo.PharmacieRepo;
import com.example.projetpfesrtb2.GestionPraticien.model.Praticien;
import com.example.projetpfesrtb2.GestionPraticien.repo.PraticienRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class ActeBSService {

    @Autowired
    ActeBSRepo acteBSRepo;

    @Autowired
    MedecinRepo medecinRepo;

    @Autowired
    BulletinSoinRepo bulletinSoinRepo ;

    @Autowired
    PraticienRepo praticienRepo ;

    @Autowired
    PharmacieRepo pharmacieRepo ;

    @Autowired
    ActeMedicalRepo acteMedicalRepo ;

    public List<ActeBS> findAll() { return acteBSRepo.findAll(); }
    public List<ActeBS> findActeByBull(Long id) { return acteBSRepo.findActeBSByBulletinSoinId(id); }
    public ActeBS addActe(ActeBS acteBS) { return acteBSRepo.save(acteBS); }
    public Optional<ActeBS> findActeByID(Long idActeBS) { return acteBSRepo.findById(idActeBS); }
    public ActeBS updateActe(ActeBS acteBS) { return acteBSRepo.save(acteBS); }
    public void deleteActe(Long idActeBS) {  acteBSRepo.deleteActeBSById(idActeBS); }

    public Boolean existMed(String matricule) { return medecinRepo.existsByMatriculeMedecin(matricule); }
    public String NomMed(String matricule) {
        String obj = null ;
        if (medecinRepo.findMedecinByMatriculeMedecin(matricule).isPresent()){
            obj = medecinRepo.findMedecinByMatriculeMedecin(matricule).get().getNom();
        }
        return obj;
    }
    public String PrenomMed(String matricule) {
        String obj = null ;
        if (medecinRepo.findMedecinByMatriculeMedecin(matricule).isPresent()){
            obj = medecinRepo.findMedecinByMatriculeMedecin(matricule).get().getPrenom();
        }
        return obj;
    }
    public String TypeMed(String matricule) {
        String obj = null;
        if (medecinRepo.findMedecinByMatriculeMedecin(matricule).isPresent()) {
            obj = medecinRepo.findMedecinByMatriculeMedecin(matricule).get().getType();
        }
        return obj;
    }
    public List<Medecin> MedAllByType(String type) { return medecinRepo.findMedecinsByType(type); }
    public List<Medecin> MedAll() { return medecinRepo.findAll(); }

    public Optional<Medecin> findMedByMatr(String matricule) { return medecinRepo.findMedecinByMatriculeMedecin(matricule); }

    public Optional<BulletinSoin> findBullById (Long idBull ) {return bulletinSoinRepo.findBulletinSoinById(idBull);}

    public Boolean existPra(String matricule) { return praticienRepo.existsPraticienByMatriculePraticien(matricule); }
    public String NomPra(String matricule) {
        String obj = null ;
        if (praticienRepo.findPraticienByMatriculePraticien(matricule).isPresent()){
            obj = praticienRepo.findPraticienByMatriculePraticien(matricule).get().getNom();
        }
        return obj ;
    }
    public String PrenomPra(String matricule) {
        String obj = null ;
        if (praticienRepo.findPraticienByMatriculePraticien(matricule).isPresent()){
            obj = praticienRepo.findPraticienByMatriculePraticien(matricule).get().getPrenom();
        }
        return obj;
    }

    public Optional<Praticien> findPraByMatr(String matricule) { return praticienRepo.findPraticienByMatriculePraticien(matricule); }

    public Optional<Pharmacie> findPharByMatr(String matricule) { return pharmacieRepo.findPharmacieByMatriculePharmacie(matricule); }

    public Boolean existPhar(String matricule) { return pharmacieRepo.existsPharmacieByMatriculePharmacie(matricule); }
    public String NomPhar(String matricule) {
        String obj = null ;
        if (pharmacieRepo.findPharmacieByMatriculePharmacie(matricule).isPresent()){
            obj = pharmacieRepo.findPharmacieByMatriculePharmacie(matricule).get().getNom();
        }
        return obj;
    }
    public Pharmacie getPhar(String matricule) {
        Pharmacie pharmacie = new Pharmacie() ;
        if (pharmacieRepo.findPharmacieByMatriculePharmacie(matricule).isPresent()){
            pharmacie = pharmacieRepo.findPharmacieByMatriculePharmacie(matricule).get();
        }
        return pharmacie;
    }

    public Boolean existCode(String code) { return acteMedicalRepo.existsActeMedicalByCode(code); }
    public String ModeCode(String code) {
        String obj = null;
        if (acteMedicalRepo.findActeMedicalByCode(code).isPresent()){
            obj = acteMedicalRepo.findActeMedicalByCode(code).get().getMode();
        }
        return obj; }
    public ActeMedical getCode(String code) {
        ActeMedical acteMedical = new ActeMedical() ;
        if (acteMedicalRepo.findActeMedicalByCode(code).isPresent()){
            acteMedical = acteMedicalRepo.findActeMedicalByCode(code).get();
        }
        return acteMedical;
    }

    public Optional<ActeMedical> findCodeByCode(String code) { return acteMedicalRepo.findActeMedicalByCode(code); }






}
