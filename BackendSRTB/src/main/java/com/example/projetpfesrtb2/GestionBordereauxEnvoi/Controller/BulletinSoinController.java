package com.example.projetpfesrtb2.GestionBordereauxEnvoi.Controller;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionAgent.model.Enfant;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.Service.BulletinSoinService;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BulletinSoin;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.BordereauxReglement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/BulletinSoin")
public class BulletinSoinController {

    @Autowired
    BulletinSoinService bulletinSoinService;

    @GetMapping("/all")
    public ResponseEntity<List<BulletinSoin>> getAll(){
        List<BulletinSoin> bulletinSoins = bulletinSoinService.findAllBulletinSoin();
        return new ResponseEntity<>(bulletinSoins, HttpStatus.OK);
    }

    @GetMapping("BullByBRID/{id}")
    public ResponseEntity<List<BulletinSoin>> getBullByBRID(@PathVariable(name = "id") Long id){
        List<BulletinSoin> bulletinSoins = bulletinSoinService.findBullByBRID(id);
        return new ResponseEntity<>(bulletinSoins,HttpStatus.OK);
    }

    @GetMapping("getBullByAgence/{id}")
    public ResponseEntity<List<BulletinSoin>> getBullByAgenceId (@PathVariable(name = "id") Long id){
        List<BulletinSoin> bulletinSoins = bulletinSoinService.findBullByAgenceID(id);
        return new ResponseEntity<>(bulletinSoins,HttpStatus.OK);
    }
    

    @GetMapping("/find/{id}")
    public ResponseEntity<BulletinSoin> getById(@PathVariable("id") Long id) {
        BulletinSoin bulletinSoin = new BulletinSoin() ;
        if (bulletinSoinService.findBulletinSoinById(id).isPresent()){
            bulletinSoin = bulletinSoinService.findBulletinSoinById(id).get();
        }
        return new ResponseEntity<>(bulletinSoin, HttpStatus.OK) ;
    }


    @GetMapping("/findByBorId/{idBor}")
    public ResponseEntity<List<BulletinSoin>> getBSBor(@PathVariable("idBor") Long id){
        List<BulletinSoin> bulletinSoin = bulletinSoinService.findBSBor(id);
        return new ResponseEntity<>(bulletinSoin,HttpStatus.OK);
    }

    @GetMapping("/getByNameAgent/{matstar}")
    public ResponseEntity<String> findAgentName(@PathVariable(name = "matstar") Long matstar){
       String agents = bulletinSoinService.findAgName(matstar);
       return new ResponseEntity<>(agents,HttpStatus.OK);

    }

    @GetMapping("/getByLast/{matstar}")
    public ResponseEntity<String> findAgentPrenom(@PathVariable(name = "matstar") Long matstar){
        String agents =  bulletinSoinService.findAgPrenom(matstar);
        return new ResponseEntity<>(agents,HttpStatus.OK);
    }

    @GetMapping("/getNameConj/{matstar}")
    public ResponseEntity<String> findAgentNomConj(@PathVariable(name = "matstar") Long matstar){
        String agents = bulletinSoinService.findAgNomConj(matstar);
        return new ResponseEntity<>(agents,HttpStatus.OK);
    }

    @GetMapping("/getPrenomConj/{matstar}")
    public ResponseEntity<String> findAgentPrenomConj(@PathVariable(name = "matstar") Long matstar){
        String agents = bulletinSoinService.findAgPrenomConj(matstar);
        return new ResponseEntity<>(agents,HttpStatus.OK);
    }


    @GetMapping("/agentEnfNom/{matstar}")
    public ResponseEntity<List<Enfant>> findAgentEnfNom(@PathVariable(name = "matstar") Long matstar){
              List<Enfant> enfant = bulletinSoinService.findEnf(matstar);
              return new ResponseEntity<>(enfant,HttpStatus.OK);
    }


    @GetMapping("/agentEnfPren/{matstar}")
    public ResponseEntity<List<String>> findAgentEnfPrenom(@PathVariable(name = "matstar") Long matstar){
        List<Enfant> enfant = bulletinSoinService.findEnf(matstar);
        List<String> enfantNom = new ArrayList<>();
        for (Enfant enfant1 : enfant){
            enfantNom.add(enfant1.getNom());
        }
        return new ResponseEntity<>(enfantNom,HttpStatus.OK);
    }

    @GetMapping("/agentEnfAge/{matstar}")
    public ResponseEntity<List<Enfant>> findAgentEnfAge(@PathVariable(name = "matstar") Long mats)  {
        List<Enfant> enfants = bulletinSoinService.findEnf(mats);
        return new ResponseEntity<>(enfants,HttpStatus.OK);
    }


    @GetMapping("/getByNameEnf/{matsrtb}")
    public ResponseEntity<List<Enfant>> findEnfantBySrtb(@PathVariable(name = "matsrtb") Long matsrtb){
        List<Enfant> enfants = bulletinSoinService.findEnfSRTB(matsrtb);
        return new ResponseEntity<>(enfants, HttpStatus.OK);


    }

    @GetMapping("/getByNameEnfStar/{matstar}")
    public ResponseEntity<List<Enfant>> findEnfantByStar(@PathVariable(name = "matstar") Long matstar){
        List<Enfant> enfants = bulletinSoinService.findEnf(matstar);
        return new ResponseEntity<>(enfants, HttpStatus.OK);

    }

    @PostMapping("/add")
    public ResponseEntity<BulletinSoin> add(@RequestBody BulletinSoin bulletinSoin) throws Exception {
        Long tempNumbs = bulletinSoin.getNumbs();
        Long tempNumaff = bulletinSoin.getAgent().getMatstar();
        if (tempNumbs != null && tempNumaff != null && !"".equals(tempNumbs.toString()) && !"".equals(tempNumaff.toString())){
            BulletinSoin bulletinSoin2  = new BulletinSoin() ;
            BulletinSoin bulletinSoin1 = new BulletinSoin() ;
            if (bulletinSoinService.findBulletinSoinByNumaff(tempNumbs).isPresent()){
                bulletinSoin2 = bulletinSoinService.findBulletinSoinByNumaff(tempNumbs).get();
            }
            if (bulletinSoinService.findBulletinSoinByNumbs(tempNumbs).isPresent()){
                bulletinSoin1 = bulletinSoinService.findBulletinSoinByNumbs(tempNumbs).get();
            }

            if (!bulletinSoin1.equals(new BulletinSoin())){
                throw new Exception("BulletinSoin avec " + tempNumbs + " est déjà present(e)");
            }
            if (!bulletinSoin2.equals(new BulletinSoin())){
                throw new Exception("BulletinSoin avec " + tempNumaff + " est déjà present(e)");
            }
        }
        BulletinSoin bulletinSoin1 = bulletinSoinService.addBulletinSoin(bulletinSoin);
        return new ResponseEntity<>(bulletinSoin1, HttpStatus.CREATED) ;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        bulletinSoinService.deleteBulletinSoin(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }



    @PostMapping("BorEn/{idBorEnv}/agents/{agentIdStar}/BS")
    public BulletinSoin createBS (@PathVariable (name = "agentIdStar") Long matriculeStar,
                                  @PathVariable (name = "idBorEnv") Long id,
                                  @RequestBody BulletinSoin BS){

        return bulletinSoinService.findBorddOptional(id).map(bordereauxEnvoi -> {
            BS.setBordereauxEnvoi(bordereauxEnvoi);
            return bulletinSoinService.findAgOptional(matriculeStar).map(agent -> {
                BS.setAgent(agent);
                BS.setBordereauxReglement(null);
                return bulletinSoinService.addBulletinSoin(BS);
            }).orElseThrow(() -> new ResourceNotFoundException("agent not found" + matriculeStar));
        }).orElseThrow(() -> new ResourceNotFoundException("borenvoi not found" + id));
    }


    @GetMapping("/AgentsExiste/{matriculeStar}")
    public Boolean ExistAg (@PathVariable(name = "matriculeStar") Long matriculeStar){
        return bulletinSoinService.existAg(matriculeStar);
    }

    @GetMapping("/AgeBSExist/{numbs}")
    public Boolean ExistNumBS(@PathVariable(name = "numbs") Long numbs){
        return bulletinSoinService.existNumBS(numbs);
    }

    @GetMapping("/AgentsExiste/EnfantExiste/{matriculeStar}")
    public Boolean ExistEnf (@PathVariable(name = "matriculeStar") Long matriculeStar){
        return bulletinSoinService.existAg(matriculeStar);
    }

    @PutMapping("BorEnv/{idBord}/agents/{idAgentsStar}/BS/{idBS}")
    public BulletinSoin updateBS(@PathVariable(name = "idAgentsStar") Long matriculeStar,
                                 @PathVariable(name = "idBS") Long id,
                                 @PathVariable(name = "idBord") Long idBord,
                                 @RequestBody BulletinSoin BS){

        if(!bulletinSoinService.existAg(matriculeStar)){
            throw new ResourceNotFoundException("agents" + matriculeStar + "not found");
        }

        return bulletinSoinService.findBSById(id).map(bulletinSoin -> {
            if (BS.getNumbs() != null){
            bulletinSoin.setNumbs(BS.getNumbs());
            }
            if (BS.getTypemalade() != null){
            bulletinSoin.setTypemalade(BS.getTypemalade());
            }
            if((BS.getSommeTotBull() != null) || (BS.getSommeTotBull() != 0.0)){
                bulletinSoin.setSommeTotBull(BS.getSommeTotBull());
            }
            if ((BS.getSommeTotMed() != null) || (BS.getSommeTotMed() != 0.0)){
                bulletinSoin.setSommeTotMed(BS.getSommeTotMed());
            }
            if ((BS.getSommeTotPhar() != null) || (BS.getSommeTotPhar() != 0.0)){
                bulletinSoin.setSommeTotPhar(BS.getSommeTotPhar());
            }
            if ((BS.getSommeTotPrati() != null) || (BS.getSommeTotPrati() != 0.0)){
                bulletinSoin.setSommeTotPrati(BS.getSommeTotPrati());
            }
            if ((BS.getSommeTotRestant() != null) || (BS.getSommeTotRestant() != 0.0)){
                bulletinSoin.setSommeTotRestant(BS.getSommeTotRestant());
            }
            if (BS.getDatebs() != null){
            bulletinSoin.setDatebs(BS.getDatebs());
             }
            if (!Objects.equals(BS.getBordereauxReglement(), new BordereauxReglement())){
                bulletinSoin.setBordereauxReglement(BS.getBordereauxReglement());
            }
            return bulletinSoinService.findBorddOptional(idBord).map(bordereauxEnvoi -> {
                bulletinSoin.setBordereauxEnvoi(bordereauxEnvoi);
                return bulletinSoinService.findAgOptional(matriculeStar).map(agent -> {
                    bulletinSoin.setAgent(agent);
                    return bulletinSoinService.updateBulletinSoin(bulletinSoin);
                }).orElseThrow(() -> new ResourceNotFoundException(""));
            }).orElseThrow(() -> new ResourceNotFoundException(""));
        }).orElseThrow(()->new ResourceNotFoundException("bulId" + id + "not found"));


    }


    @GetMapping("/findBullByAgentAfill/{matstar}")
    public ResponseEntity<List<BulletinSoin>> findBullAgentAfill(@PathVariable(name = "matstar") Long matstar){
        List<BulletinSoin> bulletinSoins = bulletinSoinService.findBullByAffStar(matstar);
        return new ResponseEntity<>(bulletinSoins , HttpStatus.OK);
    }


    @DeleteMapping("/agents/{idAgentMatStar}/BS/{idBS}")
    public ResponseEntity<?> deleteBS (@PathVariable(name = "idAgentMatStar") Long matstar,
                                       @PathVariable(name = "idBS") Long id){
        return bulletinSoinService.searchBS(id,matstar).map(bul -> {
            bulletinSoinService.BsSupprimmer(bul);
            return ResponseEntity.ok().build();
        }).orElseThrow(() -> new ResourceNotFoundException("BS not found with id = " + id + "and agent matstar with " + matstar));
    }





    @PutMapping("BordEnv/BR/{idBR}/BS/{idBS}")
    public BulletinSoin updateBSForBR(
            @PathVariable(name = "idBS") Long idbs,
            @PathVariable(name = "idBR") Long idbr,
            // @PathVariable(name = "idBord") Long idBord,
            @RequestBody BulletinSoin BS){

        return bulletinSoinService.findNumBS(idbs).map(bulletinSoin -> {
            if (BS.getNumbs() != null) {
                bulletinSoin.setNumbs(BS.getNumbs());
            }
            if (BS.getTypemalade() != null) {
                bulletinSoin.setTypemalade(BS.getTypemalade());
            }
            if ((BS.getSommeTotBull() != null) || (BS.getSommeTotBull() != 0.0)) {
                bulletinSoin.setSommeTotBull(BS.getSommeTotBull());
            }
            if ((BS.getSommeTotMed() != null) || (BS.getSommeTotMed() != 0.0)) {
                bulletinSoin.setSommeTotMed(BS.getSommeTotMed());
            }
            if ((BS.getSommeTotPhar() != null) || (BS.getSommeTotPhar() != 0.0)) {
                bulletinSoin.setSommeTotPhar(BS.getSommeTotPhar());
            }
            if ((BS.getSommeTotPrati() != null) || (BS.getSommeTotPrati() != 0.0)) {
                bulletinSoin.setSommeTotPrati(BS.getSommeTotPrati());
            }
            if ((BS.getSommeTotRestant() != null) || (BS.getSommeTotRestant() != 0.0)){
                bulletinSoin.setSommeTotRestant(BS.getSommeTotRestant());
            }
            if (BS.getDatebs() != null) {
                bulletinSoin.setDatebs(BS.getDatebs());
            }
            if (!Objects.equals(BS.getAgent(), new Agent())) {
                bulletinSoin.setAgent(BS.getAgent());
            }

            return bulletinSoinService.findBorddRegOptional(idbr).map(bordereauxReglement -> {
                bulletinSoin.setBordereauxReglement(bordereauxReglement);
                return bulletinSoinService.updateBulletinSoin(bulletinSoin);
            }).orElseThrow(() -> new ResourceNotFoundException(""));
        }).orElseThrow(() -> new ResourceNotFoundException("bulId" + idbs + "not found"));
    }
}
