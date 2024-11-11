package com.example.projetpfesrtb2.GestionBordereauxReglement.service;

import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.BulletinSoinRepo;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.BordereauxReglement;
import com.example.projetpfesrtb2.GestionBordereauxReglement.repo.BordereauxReglementRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BordereauxReglementService {

    @Autowired
    private BordereauxReglementRepo bordereauxReglementRepo;
    /** this is a method for saving
     * */
    @Autowired
    private BulletinSoinRepo bulletinSoinRepo ;
    public BordereauxReglement addBordereauxReglement(BordereauxReglement bordereaux) {
        return bordereauxReglementRepo.save(bordereaux);
    }

    public List<BordereauxReglement> findAllBordereauxEnvoi() {
        return bordereauxReglementRepo.findAll();
    }

    public BordereauxReglement findBordereauxReglementById(Long id) {
        BordereauxReglement bordereauxReglement = new BordereauxReglement() ;
        if (bordereauxReglementRepo.findBordereauxReglementById(id).isPresent()){
            bordereauxReglement = bordereauxReglementRepo.findBordereauxReglementById(id).get();
        }
        return bordereauxReglement ;
    }
    public BordereauxReglement updateBordereauxReglement(BordereauxReglement bordereauxEnvoi) {
        return bordereauxReglementRepo.save(bordereauxEnvoi);
    }

    public Optional<BordereauxReglement> findBRById (Long id){
        return bordereauxReglementRepo.findById(id);
    }

    public void deleteBordereauxReglement(Long id) {
        bordereauxReglementRepo.deleteBordereauxReglementById(id);
    }

    public BordereauxReglement findBRByFDB(Long id) {return bordereauxReglementRepo.findBordereauxReglementByFileDB_Id(id);}

    public Boolean existBRbyRef(String ref) { return bordereauxReglementRepo.existsBordereauxReglementByNom(ref); }

    public Boolean existBullByBordReg(Long id) { return bulletinSoinRepo.existsBulletinSoinByBordereauxReglement_Id(id); }
}
