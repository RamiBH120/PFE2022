package com.example.projetpfesrtb2.GestionBordereauxEnvoi.Controller;


import com.example.projetpfesrtb2.GestionActesMedicaux.model.ActeMedical;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.Service.ActeBSService;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.exception.ResourceNotFoundException;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.ActeBS;
import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import com.example.projetpfesrtb2.GestionPharmacie.model.Pharmacie;
import com.example.projetpfesrtb2.GestionPraticien.model.Praticien;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/ActeBS")
public class ActeBSController {


    @Autowired
    ActeBSService acteBSService ;


    @GetMapping("/listAll")
    public List<ActeBS> getAllActeBS(){
        return acteBSService.findAll();
    }


    @GetMapping("/findAllByMat/{matricule}")
    public ResponseEntity<String> findAllByMat (@PathVariable(name = "matricule") String matricule){
        String ObjectFull = "";
        if(acteBSService.existMed(matricule) &&
                !acteBSService.existPhar(matricule) &&
                !acteBSService.existPra(matricule)){
           String medNom = acteBSService.NomMed(matricule);
           String medPrenom = acteBSService.PrenomMed(matricule);
           ObjectFull = medNom.concat(" ").concat(medPrenom) ;
           System.out.println(ObjectFull);
            return new ResponseEntity<>(ObjectFull,HttpStatus.OK);
        }else if (acteBSService.existPhar(matricule) &&
                !acteBSService.existPra(matricule) &&
                !acteBSService.existMed(matricule)){
            ObjectFull = acteBSService.NomPhar(matricule);
            System.out.println(ObjectFull);
            return new ResponseEntity<>(ObjectFull,HttpStatus.OK);
        }else if (acteBSService.existPra(matricule) &&
                !acteBSService.existPhar(matricule) &&
                !acteBSService.existMed(matricule)){
            String praNom = acteBSService.NomPra(matricule);
            String praPrenom = acteBSService.PrenomPra(matricule);
            ObjectFull = praNom.concat(" ").concat(praPrenom) ;
            System.out.println(ObjectFull);
            return new ResponseEntity<>(ObjectFull,HttpStatus.OK);
        }else  {
            ObjectFull = "" ;
            System.out.println(ObjectFull);
            return new ResponseEntity<>(ObjectFull,HttpStatus.OK);
        }

    }


    @GetMapping("/findPharByMatPhar/{matricule}")
    public ResponseEntity<String> findPharByMatPhar (@PathVariable(name = "matricule") String matricule){
        String phar = acteBSService.NomPhar(matricule);
        return new ResponseEntity<>(phar,HttpStatus.OK);
    }

    @GetMapping("/findPraNomByMatPra/{matricule}")
    public ResponseEntity<String> findPraNomByMatPra (@PathVariable(name = "matricule") String matricule){
        String pra = acteBSService.NomPra(matricule);
        return new ResponseEntity<>(pra,HttpStatus.OK);
    }
    @GetMapping("/findPraPrenomByMatPra/{matricule}")
    public ResponseEntity<String> findPraPrenomByMatPra (@PathVariable(name = "matricule") String matricule){
        String pra = acteBSService.PrenomPra(matricule);
        return new ResponseEntity<>(pra,HttpStatus.OK);
    }

    @GetMapping("/findByBS/{idBS}")
    public ResponseEntity<List<ActeBS>> getActeBS(@PathVariable(name = "idBS") Long id){
        List<ActeBS> acteBS = acteBSService.findActeByBull(id);
        return new ResponseEntity<>(acteBS , HttpStatus.OK);
    }


    @GetMapping("/findMedNomByMatriculeMed/{matMed}")
    public ResponseEntity<String> getMedNomByMatMed(@PathVariable(name = "matMed") String matMed){
        String medecin = acteBSService.NomMed(matMed);
        return new ResponseEntity<>(medecin,HttpStatus.OK);
    }

    @GetMapping("/findMedPrenomByMatriculeMed/{matMed}")
    public ResponseEntity<String> getMedPrenomByMatMed(@PathVariable(name = "matMed") String matMed){
        String medecin = acteBSService.PrenomMed(matMed);
        return new ResponseEntity<>(medecin,HttpStatus.OK);
    }

    @GetMapping("/findMedTypeByMatriculeMed/{matMed}")
    public ResponseEntity<String> getMedTypeByMatMed(@PathVariable(name = "matMed") String matMed){
        String medecin = acteBSService.TypeMed(matMed);
        return new ResponseEntity<>(medecin,HttpStatus.OK);
    }

    @GetMapping("/existKeyup/{matMed}")
    public ResponseEntity<Boolean> ExistMatMed(@PathVariable(name = "matMed") String matMed){
        Boolean med = acteBSService.existMed(matMed);
        return new ResponseEntity<>(med , HttpStatus.OK);
    }
    @GetMapping("/existPhar/{matPhar}")
    public ResponseEntity<Boolean> ExistMatPhar(@PathVariable(name = "matPhar") String matPhar){
        Boolean phar = acteBSService.existPhar(matPhar);
        return new ResponseEntity<>(phar,HttpStatus.OK);
    }
    @GetMapping("/existPra/{matPra}")
    public ResponseEntity<Boolean> ExistMatPra(@PathVariable(name = "matPra") String matPra){
        Boolean pra = acteBSService.existPra(matPra);
        return new ResponseEntity<>(pra,HttpStatus.OK);
    }
    @GetMapping("/existActeMed/{code}")
    public ResponseEntity<Boolean> ExistCodeActeMed(@PathVariable(name = "code") String code){
        Boolean acteMed = acteBSService.existCode(code);
        return new ResponseEntity<>(acteMed,HttpStatus.OK);
    }

    @GetMapping("/findMedByType/{type}")
    public ResponseEntity<List<Medecin>> findMedByType(@PathVariable(name = "type") String type){
        List<Medecin> medecins = acteBSService.MedAllByType(type);
        return new ResponseEntity<>(medecins , HttpStatus.OK);
    }


    @GetMapping("/getMedecins")
    public ResponseEntity<List<Medecin>> findMedecinNomPrenom (){
        List<Medecin> medecins = acteBSService.MedAll();
        return new ResponseEntity<>(medecins,HttpStatus.OK);
    }
    @PostMapping("/BullSoin/{idBull}/acteMedical/{code}/Med/{matricule}/acteBS")
    public ActeBS createActeBSMed(@PathVariable(name = "idBull") Long idBull,
                               @PathVariable(name = "code") String code,
                               @PathVariable(name = "matricule") String matricule,
                               @RequestBody ActeBS acteBS){

        return acteBSService.findBullById(idBull).map(bulletinSoin -> {
            acteBS.setBulletinSoin(bulletinSoin);
            return acteBSService.findCodeByCode(code).map(acteMedical -> {
                acteBS.setActeMedical(acteMedical);
                return (acteBSService.findMedByMatr(matricule).map(medecin -> {
                    acteBS.setMedecin(medecin);
                    return acteBSService.addActe(acteBS);
                })).orElseThrow(() -> new ResourceNotFoundException("medecin not found" + matricule));
            }).orElseThrow(() -> new ResourceNotFoundException("acte not found" + code));
        }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
    }


    @PostMapping("/BullSoin/{idBull}/acteMedical/{code}/Phar/{matricule}/acteBS")
    public ActeBS createActeBSPhar (@PathVariable(name = "idBull") Long idBull ,
                                    @PathVariable(name = "code") String code ,
                                    @PathVariable(name = "matricule") String matricule,
                                    @RequestBody ActeBS acteBS){
        return acteBSService.findBullById(idBull).map(bulletinSoin -> {
            acteBS.setBulletinSoin(bulletinSoin);
            return acteBSService.findCodeByCode(code).map(acteMedical -> {
                acteBS.setActeMedical(acteMedical);
                return (acteBSService.findPharByMatr(matricule).map(pharmacie -> {
                    acteBS.setPharmacie(pharmacie);
                    return acteBSService.addActe(acteBS);
                })).orElseThrow(() -> new ResourceNotFoundException("pharmacie not found " + matricule));
            }).orElseThrow(() -> new ResourceNotFoundException("acte medical not found" + code));

        }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
    }

    @PostMapping("/BullSoin/{idBull}/acteMedical/{code}/MedPhar/{matricule}/acteBS")
    public ActeBS createActeBSMedPhar (@PathVariable(name = "idBull") Long idBull,
                                       @PathVariable(name = "code") String code ,
                                       @PathVariable(name = "matricule") String matricule,
                                       @RequestBody ActeBS acteBS){
        return acteBSService.findBullById(idBull).map(bulletinSoin -> {
            acteBS.setBulletinSoin(bulletinSoin);
            return acteBSService.findCodeByCode(code).map(acteMedical -> {
                acteBS.setActeMedical(acteMedical);
                return (acteBSService.findMedByMatr(matricule).map(medecin -> {
                    acteBS.setMedecin(medecin);
                    return acteBSService.addActe(acteBS);
                })).orElseGet(() -> createActeBSPhar(idBull , code , matricule , acteBS) );
            }).orElseThrow(() -> new ResourceNotFoundException("acte medical not found" + code));

        }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
    }





    @PostMapping("/BullSoin/{idBull}/acteMedical/{code}/Pra/{matricule}/acteBS")
    public ActeBS createActeBSPra(@PathVariable(name = "idBull") Long idBull,
                                  @PathVariable(name = "code") String code ,
                                  @PathVariable(name = "matricule") String matricule,
                                  @RequestBody ActeBS acteBS){

        return acteBSService.findBullById(idBull).map(bulletinSoin ->{
            acteBS.setBulletinSoin(bulletinSoin);
            return acteBSService.findCodeByCode(code).map(acteMedical -> {
                acteBS.setActeMedical(acteMedical);
                return (acteBSService.findPraByMatr(matricule).map(praticien -> {
                    acteBS.setPraticien(praticien);
                    return acteBSService.addActe(acteBS);
                })).orElseGet(() -> createActeBSMedPhar(idBull, code ,matricule,acteBS));
            }).orElseThrow(() -> new ResourceNotFoundException("acte medical not found" + code));

        }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));


    }


    @PutMapping("/Bull/{idBull}/acteMedical/{code}/Med/{matricule}/acteBS/{idActeBS}")
    public ActeBS updateMed(@PathVariable(name = "idBull") Long idBull,
                            @PathVariable(name = "code") String code,
                            @PathVariable(name = "matricule") String matricule,
                            @RequestBody ActeBS acteBS,
                            @PathVariable(name = "idActeBS") Long idActeBS){
        return acteBSService.findActeByID(idActeBS).map(acteBS1 -> {

            if (!Objects.equals(acteBS.getMatPraticienActeBS(),"")){
                acteBS1.setMatPraticienActeBS(null);
            }
            if (acteBS.getBeneficiaire() != null){
                acteBS1.setBeneficiaire(acteBS.getBeneficiaire());
            }

            if(Objects.equals(acteBSService.ModeCode(code), "Quantité")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(acteBS.getQuantiteActeBS());
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                }
            }else if (Objects.equals(acteBSService.ModeCode(code), "Valeur")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }else {
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }
            if (acteBS.getMontantTheoriqueActeBS() != null){
                acteBS1.setMontantTheoriqueActeBS(acteBS.getMontantTheoriqueActeBS());
            }

            if (acteBS.getDateActeBS() != null){
                acteBS1.setDateActeBS(acteBS.getDateActeBS());
            }
            if (!Objects.equals(acteBS.getPharmacie(), new Pharmacie())){
              acteBS1.setPharmacie(null);

            }
            if (!Objects.equals(acteBS.getPraticien(), new Praticien())){
                acteBS1.setPraticien(null);
            }
            return acteBSService.findBullById(idBull).map(bulletinSoin -> {
                acteBS1.setBulletinSoin(bulletinSoin);
                return acteBSService.findCodeByCode(code).map(acteMedical -> {
                    acteBS1.setActeMedical(acteMedical);
                    return acteBSService.findMedByMatr(matricule).map(medecin -> {
                        acteBS1.setMedecin(medecin);
                        return acteBSService.updateActe(acteBS1);
                    }).orElseThrow(() -> new ResourceNotFoundException("medecin not found" + matricule));
                }).orElseThrow(() -> new ResourceNotFoundException("acteMedical not found" + code));
            }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
        }).orElseThrow(() -> new ResourceNotFoundException("acteBS not found" + idActeBS));
    }

    @PutMapping("/Bull/{idBull}/acteMedical/{code}/Phar/{matricule}/acteBS/{idActeBS}")
    public ActeBS updatePhar(@PathVariable(name = "idBull") Long idBull,
                             @PathVariable(name = "code") String code,
                             @PathVariable(name = "matricule") String matricule,
                             @RequestBody ActeBS acteBS,
                             @PathVariable(name = "idActeBS") Long idActeBS){
        return acteBSService.findActeByID(idActeBS).map(acteBS1 -> {

            if (!Objects.equals(acteBS.getMatPraticienActeBS(),"")){
                acteBS1.setMatPraticienActeBS(null);
            }
            if (acteBS.getBeneficiaire() != null){
                acteBS1.setBeneficiaire(acteBS.getBeneficiaire());
            }
            if(Objects.equals(acteBSService.ModeCode(code), "Quantité")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(acteBS.getQuantiteActeBS());
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                }
            }else if (Objects.equals(acteBSService.ModeCode(code), "Valeur")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }else {
                if (acteBS.getQuantiteActeBS() != null) {
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null) {
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }
            if (acteBS.getMontantTheoriqueActeBS() != null){
                acteBS1.setMontantTheoriqueActeBS(acteBS.getMontantTheoriqueActeBS());
            }

            if (acteBS.getDateActeBS() != null){
                acteBS1.setDateActeBS(acteBS.getDateActeBS());
            }
            if (!Objects.equals(acteBS.getMedecin(), new Medecin())){
                acteBS1.setMedecin(null);

            }
            if (!Objects.equals(acteBS.getPraticien(), new Praticien())){
                acteBS1.setPraticien(null);
            }

            return acteBSService.findBullById(idBull).map(bulletinSoin -> {
                acteBS1.setBulletinSoin(bulletinSoin);
                return acteBSService.findCodeByCode(code).map(acteMedical -> {
                    acteBS1.setActeMedical(acteMedical);
                    return acteBSService.findPharByMatr(matricule).map(pharmacie -> {
                        acteBS1.setPharmacie(pharmacie);
                        return acteBSService.updateActe(acteBS1);
                    }).orElseThrow(() -> new ResourceNotFoundException("pharmacie not found" + matricule));
                }).orElseThrow(() -> new ResourceNotFoundException("acteMedical not found" + code));
            }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
        }).orElseThrow(() -> new ResourceNotFoundException("acteBS not found" + idActeBS));
    }


    @PutMapping("/Bull/{idBull}/acteMedical/{code}/MedPhar/{matricule}/acteBS/{idActeBS}")
    public ActeBS updateMedPhar(@PathVariable(name = "idBull") Long idBull,
                                @PathVariable(name = "code") String code,
                                @PathVariable(name = "matricule") String matricule,
                                @RequestBody ActeBS acteBS,
                                @PathVariable(name = "idActeBS") Long idActeBS){
        return acteBSService.findActeByID(idActeBS).map(acteBS1 -> {

            if (acteBS.getMatPraticienActeBS() != null){
                acteBS1.setMatPraticienActeBS(acteBS.getMatPraticienActeBS());
            }
            if (acteBS.getBeneficiaire() != null){
                acteBS1.setBeneficiaire(acteBS.getBeneficiaire());
            }
            if(Objects.equals(acteBSService.ModeCode(code), "Quantité")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(acteBS.getQuantiteActeBS());
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                }
            }else if (Objects.equals(acteBSService.ModeCode(code), "Valeur")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }else {
                if (acteBS.getQuantiteActeBS() != null) {
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null) {
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }
            if (acteBS.getMontantTheoriqueActeBS() != null){
                acteBS1.setMontantTheoriqueActeBS(acteBS.getMontantTheoriqueActeBS());
            }

            if (acteBS.getDateActeBS() != null){
                acteBS1.setDateActeBS(acteBS.getDateActeBS());
            }
            if (!Objects.equals(acteBS.getPharmacie(), new Pharmacie())){
                acteBS1.setPharmacie(null);

            }
            if (!Objects.equals(acteBS.getPraticien(), new Praticien())){
                acteBS1.setPraticien(null);
            }
            return acteBSService.findBullById(idBull).map(bulletinSoin -> {
                acteBS1.setBulletinSoin(bulletinSoin);
                return acteBSService.findCodeByCode(code).map(acteMedical -> {
                    acteBS1.setActeMedical(acteMedical);
                    return acteBSService.findMedByMatr(matricule).map(medecin -> {
                        acteBS1.setMedecin(medecin);
                        return acteBSService.updateActe(acteBS1);
                    }).orElseGet(() -> updatePharPra(idBull,code,matricule,acteBS,idActeBS));
                }).orElseThrow(() -> new ResourceNotFoundException("acteMedical not found" + code));
            }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
        }).orElseThrow(() -> new ResourceNotFoundException("acteBS not found" + idActeBS));
    }




    @PutMapping("/Bull/{idBull}/acteMedical/{code}/PharPra/{matricule}/acteBS/{idActeBS}")
    public ActeBS updatePharPra(@PathVariable(name = "idBull") Long idBull,
                             @PathVariable(name = "code") String code,
                             @PathVariable(name = "matricule") String matricule,
                             @RequestBody ActeBS acteBS,
                             @PathVariable(name = "idActeBS") Long idActeBS){
        return acteBSService.findActeByID(idActeBS).map(acteBS1 -> {

            if (acteBS.getMatPraticienActeBS() != null){
                acteBS1.setMatPraticienActeBS(acteBS.getMatPraticienActeBS());
            }
            if (acteBS.getBeneficiaire() != null){
                acteBS1.setBeneficiaire(acteBS.getBeneficiaire());
            }
            if(Objects.equals(acteBSService.ModeCode(code), "Quantité")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(acteBS.getQuantiteActeBS());
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                }
            }else if (Objects.equals(acteBSService.ModeCode(code), "Valeur")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }else {
                if (acteBS.getQuantiteActeBS() != null) {
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null) {
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }
            if (acteBS.getMontantTheoriqueActeBS() != null){
                acteBS1.setMontantTheoriqueActeBS(acteBS.getMontantTheoriqueActeBS());
            }

            if (acteBS.getDateActeBS() != null){
                acteBS1.setDateActeBS(acteBS.getDateActeBS());
            }
            if (!Objects.equals(acteBS.getMedecin(), new Medecin())){
                acteBS1.setMedecin(null);

            }
            if (!Objects.equals(acteBS.getPraticien(), new Praticien())){
                acteBS1.setPraticien(null);
            }

            return acteBSService.findBullById(idBull).map(bulletinSoin -> {
                acteBS1.setBulletinSoin(bulletinSoin);
                return acteBSService.findCodeByCode(code).map(acteMedical -> {
                    acteBS1.setActeMedical(acteMedical);
                    return acteBSService.findPharByMatr(matricule).map(pharmacie -> {
                        acteBS1.setPharmacie(pharmacie);
                        return acteBSService.updateActe(acteBS1);
                    }).orElseThrow(() -> new ResourceNotFoundException("pharmacie not found" + matricule));
                }).orElseThrow(() -> new ResourceNotFoundException("acteMedical not found" + code));
            }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
        }).orElseThrow(() -> new ResourceNotFoundException("acteBS not found" + idActeBS));
    }






    @PutMapping("/Bull/{idBull}/acteMedical/{code}/Pra/{matricule}/acteBS/{idActeBS}")
    public ActeBS updatePra(@PathVariable(name = "idBull") Long idBull,
                            @PathVariable(name = "code") String code,
                            @PathVariable(name = "matricule") String matricule,
                            @RequestBody ActeBS acteBS ,
                            @PathVariable(name = "idActeBS") Long idActeBS){
        return acteBSService.findActeByID(idActeBS).map(acteBS1 -> {

            if (acteBS.getMatPraticienActeBS() != null){
                acteBS1.setMatPraticienActeBS(acteBS.getMatPraticienActeBS());
            }
            if (acteBS.getBeneficiaire() != null){
                acteBS1.setBeneficiaire(acteBS.getBeneficiaire());
            }
            if(Objects.equals(acteBSService.ModeCode(code), "Quantité")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(acteBS.getQuantiteActeBS());
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                }
            }else if (Objects.equals(acteBSService.ModeCode(code), "Valeur")){
                if (acteBS.getQuantiteActeBS() != null){
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null){
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }else {
                if (acteBS.getQuantiteActeBS() != null) {
                    acteBS1.setQuantiteActeBS(null);
                }
                if (acteBS.getMontantActeBS() != null) {
                    acteBS1.setMontantActeBS(acteBS.getMontantActeBS());
                    acteBS1.setQuantiteActeBS(null);
                }
            }
            if (acteBS.getMontantTheoriqueActeBS() != null){
                acteBS1.setMontantTheoriqueActeBS(acteBS.getMontantTheoriqueActeBS());
            }

            if (acteBS.getDateActeBS() != null){
                acteBS1.setDateActeBS(acteBS.getDateActeBS());
            }
            if (!Objects.equals(acteBS.getPharmacie(), new Pharmacie())){
                acteBS1.setPharmacie(null);

            }
            if (!Objects.equals(acteBS.getMedecin(), new Medecin())){
                acteBS1.setMedecin(null);
            }

            return acteBSService.findBullById(idBull).map(bulletinSoin -> {
                acteBS1.setBulletinSoin(bulletinSoin);
                return acteBSService.findCodeByCode(code).map(acteMedical -> {
                    acteBS1.setActeMedical(acteMedical);
                    return acteBSService.findPraByMatr(matricule).map(praticien -> {
                        acteBS1.setPraticien(praticien);
                        return acteBSService.updateActe(acteBS1);
                    }).orElseGet(() -> updateMedPhar(idBull , code , matricule , acteBS , idActeBS));
                }).orElseThrow(() -> new ResourceNotFoundException("acteMedical not found" + code));
            }).orElseThrow(() -> new ResourceNotFoundException("bulletin de soin not found" + idBull));
        }).orElseThrow(() -> new ResourceNotFoundException("acteBS not found" + idActeBS));
    }

    @Transactional
    @DeleteMapping("/delete/{idActeBS}")
    public ResponseEntity<?> deleteActeBS(@PathVariable(name = "idActeBS") Long idActeBS){
        acteBSService.deleteActe(idActeBS);
       return new  ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/findActeMedByCode/{code}")
    public ResponseEntity<ActeMedical> getActeMedByCode(@PathVariable("code") String code) {
        ActeMedical acteMedical = acteBSService.getCode(code);
        return new ResponseEntity<>(acteMedical, HttpStatus.OK) ;
    }

    @GetMapping("/findPharInActeBS/{mat}")
    public ResponseEntity<Pharmacie> findPharInActeBS(@PathVariable(name = "mat") String mat){
        Pharmacie pharmacie = null;
        if (acteBSService.existPhar(mat)){
            pharmacie = acteBSService.getPhar(mat);
            return new ResponseEntity<>(pharmacie,HttpStatus.OK);
        }
        return new ResponseEntity<>(pharmacie , HttpStatus.OK);
    }
}
