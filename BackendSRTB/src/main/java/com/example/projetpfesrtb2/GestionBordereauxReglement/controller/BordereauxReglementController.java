package com.example.projetpfesrtb2.GestionBordereauxReglement.controller;


import com.example.projetpfesrtb2.GestionBordereauxReglement.model.BordereauxReglement;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileDB;
import com.example.projetpfesrtb2.GestionBordereauxReglement.repo.FileDBRepo;
import com.example.projetpfesrtb2.GestionBordereauxReglement.service.BordereauxReglementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/BordereauxReglement")
public class BordereauxReglementController {

    @Autowired
    private BordereauxReglementService bordereauxReglementService;

    @Autowired
    private FileDBRepo fileDBRepo;

    @GetMapping("/findBR/{id}")
    public ResponseEntity<BordereauxReglement> findBR(@PathVariable(name = "id") Long id){
        BordereauxReglement bordereauxReglement = bordereauxReglementService.findBRByFDB(id);
        return new ResponseEntity<>(bordereauxReglement,HttpStatus.OK);
    }

    @GetMapping("/existBordRegByNom/{nom}")
    public ResponseEntity<Boolean> existBRbyNom(@PathVariable(name = "nom") String nom){
        Boolean existsBR = bordereauxReglementService.existBRbyRef(nom);
        return new ResponseEntity<>(existsBR,HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BordereauxReglement>> getAllBordereauxReglement() {
        List<BordereauxReglement> bordereauxReglements = bordereauxReglementService.findAllBordereauxEnvoi();
        return new ResponseEntity<>(bordereauxReglements, HttpStatus.OK) ;
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<BordereauxReglement> getBordereauxReglementById(@PathVariable("id") Long id) {
        BordereauxReglement bordereauxReglement = bordereauxReglementService.findBordereauxReglementById(id);
        return new ResponseEntity<>(bordereauxReglement, HttpStatus.OK) ;
    }

    @PostMapping("/addBRforFile/{idFichier}/BR")
    public BordereauxReglement addBRForFile(@PathVariable(name = "idFichier") Long id,
                                            @RequestBody BordereauxReglement bordereauxReglement) {

        bordereauxReglement.setCloture(false);
            return fileDBRepo.findFileById(id).map(fileDB -> {
                bordereauxReglement.setFileDB(fileDB);
                return bordereauxReglementService.addBordereauxReglement(bordereauxReglement);
            }).orElseThrow(() -> new ResourceNotFoundException("file not found" + id));
    }

    @PutMapping("updateBRforFile/{idFichier}/BR/{idBR}")
    public BordereauxReglement updateBR(@PathVariable(name = "idFichier") Long idf,
                                 @PathVariable(name = "idBR") Long idbr,
                                 @RequestBody BordereauxReglement BR){

        if(!fileDBRepo.existsFileDBById(idf)){
            throw new ResourceNotFoundException("file" + idf + "not found");
        }

        return bordereauxReglementService.findBRById(idbr).map(bordereauxReglement -> {
            if (BR.getNom() != null){
                bordereauxReglement.setNom(BR.getNom());
            }
            if (BR.getDate() != null){
                bordereauxReglement.setDate(BR.getDate());
            }
            if (BR.getDescription() != null){
                bordereauxReglement.setDescription(BR.getDescription());
            }
            if (BR.getMontantreg() != null){
                bordereauxReglement.setMontantreg(BR.getMontantreg());
            }
                bordereauxReglement.setCloture(false);

            return fileDBRepo.findFileById(idf).map(fileDB -> {
                bordereauxReglement.setFileDB(fileDB);
                return bordereauxReglementService.updateBordereauxReglement(bordereauxReglement);
            }).orElseThrow(() -> new ResourceNotFoundException(""));
        }).orElseThrow(()->new ResourceNotFoundException("bordreg" + idbr + "not found"));


    }


    @PutMapping("updateBRforNoFile/BR/{idBR}")
    public BordereauxReglement updateBRForNoFile(
                                        @PathVariable(name = "idBR") Long idbr,
                                        @RequestBody BordereauxReglement BR){


        return bordereauxReglementService.findBRById(idbr).map(bordereauxReglement -> {
            if (BR.getNom() != null){
                bordereauxReglement.setNom(BR.getNom());
            }
            if (BR.getDate() != null){
                bordereauxReglement.setDate(BR.getDate());
            }
            if (BR.getDescription() != null){
                bordereauxReglement.setDescription(BR.getDescription());
            }
            if (BR.getMontantreg() != null){
                bordereauxReglement.setMontantreg(BR.getMontantreg());
            }

                bordereauxReglement.setCloture(false);

            if (BR.getFileDB() != null){
                bordereauxReglement.setFileDB(BR.getFileDB());
            }


                return bordereauxReglementService.updateBordereauxReglement(bordereauxReglement);
        }).orElseThrow(()->new ResourceNotFoundException("bordreg" + idbr + "not found"));


    }


    @PutMapping("setClotureTrue/BR/{idBR}")
    public BordereauxReglement setCloturetoTrue(
            @PathVariable(name = "idBR") Long idbr){
        BordereauxReglement bordereauxReglement=bordereauxReglementService.findBordereauxReglementById(idbr);
        bordereauxReglement.setCloture(true);
        return bordereauxReglementService.updateBordereauxReglement(bordereauxReglement);
        }

    @PutMapping("updateBRforNoFileCloture/BR/{idBR}")
    public BordereauxReglement updateBRForNoFileCloture(
            @PathVariable(name = "idBR") Long idbr,
            @RequestBody BordereauxReglement BR){

        return bordereauxReglementService.findBRById(idbr).map(bordereauxReglement -> {
                bordereauxReglement.setCloture(true);

            return bordereauxReglementService.updateBordereauxReglement(bordereauxReglement);
        }).orElseThrow(()->new ResourceNotFoundException("bordreg" + idbr + "not found"));

    }

    @GetMapping("/existBRinBull/{id}")
    public ResponseEntity<Boolean> existBRinBull(@PathVariable(name = "id") Long id){
        if (bordereauxReglementService.existBullByBordReg(bordereauxReglementService.findBordereauxReglementById(id).getId())){
            return new ResponseEntity<>(true , HttpStatus.OK);
        }else {
            return new ResponseEntity<>(false,HttpStatus.OK);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBordereauxReglement(@PathVariable("id") Long id){
        if (bordereauxReglementService.existBullByBordReg(bordereauxReglementService.findBordereauxReglementById(id).getId())){
            throw new ResourceNotFoundException("désolé ce BR avec id = " + id + " associé à des Bull Rapprochés");
        }else {
            bordereauxReglementService.deleteBordereauxReglement(id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<BordereauxReglement> addBordereauxReglement(@RequestBody BordereauxReglement bordereauxReglement) {
        BordereauxReglement bordereauxReglement1 = bordereauxReglementService.addBordereauxReglement(bordereauxReglement);
        return new ResponseEntity<>(bordereauxReglement1, HttpStatus.CREATED) ;
    }
}
