package com.example.projetpfesrtb2.GestionBordereauxEnvoi.Service;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionAgent.model.Enfant;
import com.example.projetpfesrtb2.GestionAgent.repo.AgentRepo;
import com.example.projetpfesrtb2.GestionAgent.repo.EnfantRepo;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BordereauxEnvoi;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BulletinSoin;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.BordereauxEnvoiRepo;
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
public class BulletinSoinService {

    @Autowired
    BulletinSoinRepo bulletinSoinRepo;
    @Autowired
    EnfantRepo enfantRepo ;
    @Autowired
    AgentRepo agentRepo ;
    @Autowired
    BordereauxEnvoiRepo bordereauxEnvoiRepo;
    @Autowired
    BordereauxReglementRepo bordereauxReglementRepo ;

    public BulletinSoin addBulletinSoin(BulletinSoin bulletinSoin){

        return bulletinSoinRepo.save(bulletinSoin);
    }

    public List<BulletinSoin> findAllBulletinSoin(){
        return bulletinSoinRepo.findAll();
    }

    public Optional<BulletinSoin> findBulletinSoinByNumbs(Long numbs){
        return bulletinSoinRepo.findBulletinSoinByNumbs(numbs);
    }

    public Optional<BulletinSoin> findBulletinSoinByNumaff(Long numaff){
        return bulletinSoinRepo.findBulletinSoinByAgent_Matstar(numaff);
    }

    public Optional<BulletinSoin> findBulletinSoinById(Long id){
        return bulletinSoinRepo.findBulletinSoinById(id);
    }

    public BulletinSoin updateBulletinSoin(BulletinSoin bulletinSoin){
        return bulletinSoinRepo.save(bulletinSoin);
    }

    public void deleteBulletinSoin(Long id){
        bulletinSoinRepo.deleteById(id);
    }

    public Optional<BulletinSoin> findBSById (Long id){
       return bulletinSoinRepo.findById(id);
    }

    public Optional<BulletinSoin> searchBS (Long id , Long matstar){
        return bulletinSoinRepo.findBulletinSoinByIdAndAgent_Matstar(id , matstar);
    }

    public void BsSupprimmer(BulletinSoin bulletinSoin){
        bulletinSoinRepo.delete(bulletinSoin);
    }

    public List<BulletinSoin> findBSBor (Long idBor) {
        return bulletinSoinRepo.findBulletinSoinByBordereauxEnvoiId(idBor);
    }

    public Boolean existNumBS(Long numbs){
        return bulletinSoinRepo.existsBulletinSoinByNumbs(numbs);
    }
    public List<BulletinSoin> findBullByAffStar(Long matstar) {return bulletinSoinRepo.findAllByAgent_Matstar(matstar);}

    public Optional<BulletinSoin>findNumBS(Long numbs){ return bulletinSoinRepo.findBulletinSoinByNumbs(numbs); }

    public List<BulletinSoin> findBullByAgenceID(Long id) { return bulletinSoinRepo.findBulletinSoinByAgent_Agence_Id(id); }

    public List<BulletinSoin> findBullByBRID(Long id) { return bulletinSoinRepo.findBulletinSoinByBordereauxReglementId(id); }

    public String findAgName(Long matstar) {
        String obj = null ;
        if (agentRepo.findAgentByMatstar(matstar).isPresent()){
            obj = agentRepo.findAgentByMatstar(matstar).get().getNom();
        }
        return obj;
    }
    public String findAgPrenom(Long matstar) {
        String obj = null ;
        if (agentRepo.findAgentByMatstar(matstar).isPresent()){
            obj = agentRepo.findAgentByMatstar(matstar).get().getPrenom();
        }
        return obj;
    }
    public String findAgNomConj(Long matstar) {
        String obj = null ;
        if (agentRepo.findAgentByMatstar(matstar).isPresent()){
            obj = agentRepo.findAgentByMatstar(matstar).get().getNomconj();
        }
        return obj;
    }
    public String findAgPrenomConj(Long matstar) {
        String obj = null ;
        if (agentRepo.findAgentByMatstar(matstar).isPresent()){
            obj = agentRepo.findAgentByMatstar(matstar).get().getPrenomconj();;
        }
        return obj;
    }
    public List<Enfant> findEnf(Long matstar) { return enfantRepo.findEnfantByAgent_Matstar(matstar); }
    public List<Enfant> findEnfSRTB(Long matsrtb) { return enfantRepo.findEnfantByAgent_Matsrtb(matsrtb); }
    public Optional<Agent> findAgOptional(Long matriculeStar) { return agentRepo.findAgentByMatstar(matriculeStar); }
    public Boolean existAg (Long matriculeStar) {return agentRepo.existsAgentByMatstar(matriculeStar); }
    public Optional<BordereauxEnvoi> findBorddOptional(Long id) { return bordereauxEnvoiRepo.findBordereauxById(id); }
    public Optional<BordereauxReglement> findBorddRegOptional(Long idBR) { return  bordereauxReglementRepo.findBordereauxReglementById(idBR); }
}
