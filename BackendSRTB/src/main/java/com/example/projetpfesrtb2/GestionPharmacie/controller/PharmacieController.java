package com.example.projetpfesrtb2.GestionPharmacie.controller;


import com.example.projetpfesrtb2.GestionPharmacie.model.Pharmacie;
import com.example.projetpfesrtb2.GestionPharmacie.service.PharmacieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/Pharmacie")
public class PharmacieController {

    @Autowired
    PharmacieService pharmacieService;

    @GetMapping("/all")
    public ResponseEntity<List<Pharmacie>> getAll() {
        List<Pharmacie> pharmacies = pharmacieService.findAllPharmacies();
        return new ResponseEntity<>(pharmacies, HttpStatus.OK) ;
    }



    @GetMapping("/find/{id}")
    public ResponseEntity<Pharmacie> getById(@PathVariable("id") Long id) {
        Pharmacie pharmacie = pharmacieService.findPharmacieById(id);
        return new ResponseEntity<>(pharmacie, HttpStatus.OK) ;
    }

    @GetMapping("/existPhar/{mat}")
    public ResponseEntity<Boolean> existPharMatricule(@PathVariable(name = "mat") String mat){
        Boolean existsPhar = pharmacieService.existPharByMatricule(mat);
        return new ResponseEntity<>(existsPhar,HttpStatus.OK);
    }
    @GetMapping("/existPharFisc/{fisc}")
    public ResponseEntity<Boolean> existPharMatriculeFis(@PathVariable(name = "fisc") String mat){
        Boolean existsPhar = pharmacieService.existPharByFisc(mat);
        return new ResponseEntity<>(existsPhar,HttpStatus.OK);
    }

    @GetMapping("/findByMatricule/{matricule}")
    public ResponseEntity<Pharmacie> getByMatricule(@PathVariable("matricule") String matricule) {
        Pharmacie pharmacie = pharmacieService.findPharmacieByMatricule(matricule);
        return new ResponseEntity<>(pharmacie, HttpStatus.OK) ;
    }

    @PostMapping("/add")
    public ResponseEntity<Pharmacie> add(@RequestBody Pharmacie pharmacie) throws Exception {
        String tempMatricule = pharmacie.getMatfisc();
        if (tempMatricule != null && !"".equals(tempMatricule)){
            Pharmacie pharmacie1 = pharmacieService.findPharmacieByMatriculeFiscale(tempMatricule);
            if (pharmacie1 != null){
                throw new Exception("pharmacie avec " + tempMatricule + " est déjà present(e)");
            }
        }
        Pharmacie pharmacie1 = pharmacieService.addPharmacie(pharmacie);
        return new ResponseEntity<>(pharmacie1, HttpStatus.CREATED) ;
    }



    @PutMapping("/update/{id}")
    public Pharmacie update (@RequestBody Pharmacie pharmacie, @PathVariable(name = "id") Long id)  {
        Pharmacie pharmacie1 = pharmacieService.findPharmacieById(id);
        if (pharmacie.getNom() != null){
            pharmacie1.setNom(pharmacie.getNom());
        }
        if (pharmacie.getMatfisc() != null){
            pharmacie1.setMatfisc(pharmacie.getMatfisc());
        }
        if (pharmacie.getAdr() != null){
            pharmacie1.setAdr(pharmacie.getAdr());
        }

        if (pharmacie.getNumtel() != null){
            pharmacie1.setNumtel(pharmacie.getNumtel());
        }
        if (pharmacie.getVille() != null){
            pharmacie1.setVille(pharmacie.getVille());
        }
        if (pharmacie.getIsconventioned() != null){
            pharmacie1.setIsconventioned(pharmacie.getIsconventioned());
        }
        if (pharmacie.getMatriculePharmacie() != null){
            pharmacie1.setMatriculePharmacie(pharmacie.getMatriculePharmacie());
        }

        return pharmacieService.updatePharmacie(pharmacie1);
    }


    @GetMapping("/findActeBSByMat/{matricule}")
    public ResponseEntity<Boolean> findActeBSByMat(@PathVariable(name = "matricule") String matricule){
        if (pharmacieService.existPharByMatr(matricule) || pharmacieService.existPraByMatr(matricule)){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(false,HttpStatus.OK);
        }

    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePhar(@PathVariable("id") Long id){
        if ((pharmacieService.existPharByMatr(pharmacieService.findPharmacieById(id).getMatriculePharmacie())) ||
                (pharmacieService.existPraByMatr(pharmacieService.findPharmacieById(id).getMatriculePharmacie()))){
            throw new ResourceNotFoundException("désolé cette pharmacie avec id = " + id + " contient des actes BS");
        }else{
            pharmacieService.deletePharmacie(id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
