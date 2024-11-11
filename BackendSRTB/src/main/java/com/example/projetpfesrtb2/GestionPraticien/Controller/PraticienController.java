package com.example.projetpfesrtb2.GestionPraticien.Controller;


import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.ActeBSRepo;
import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import com.example.projetpfesrtb2.GestionPraticien.Service.PraticienService;
import com.example.projetpfesrtb2.GestionPraticien.model.Praticien;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Praticien")
public class PraticienController {

    @Autowired
    private PraticienService praticienService ;

    @GetMapping("/all")
    public ResponseEntity<List<Praticien>> getAllPraticien() {
        List<Praticien> praticiens = praticienService.findAllPraticiens();
        return new ResponseEntity<>(praticiens, HttpStatus.OK) ;
    }


    @GetMapping("/find/{id}")
    public ResponseEntity<Praticien> getPraticienById(@PathVariable("id") Long id) {
        Praticien praticien = praticienService.findPraticienById(id);
        return new ResponseEntity<>(praticien, HttpStatus.OK) ;
    }

    @PostMapping("/add")
    public ResponseEntity<Praticien> addPraticien(@RequestBody Praticien praticien) throws Exception {
        String tempMatricule = praticien.getMatriculeFiscale();
        if (tempMatricule != null && !"".equals(tempMatricule)){
            Praticien praticienObj = praticienService.fetchPraticienByMatriculeFiscale(tempMatricule);
            if (praticienObj != null){
                throw new Exception("praticien avec " + tempMatricule + " est déjà present(e)");
            }
        }
        Praticien praticienObj= null;
        praticienObj = praticienService.addPraticien(praticien);
        return new ResponseEntity<>(praticienObj, HttpStatus.CREATED) ;
    }
/*
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePraticien(@PathVariable("id") Long id){
        praticienService.deletePraticien(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

 */



    @PutMapping("/updatePraticien/{id}")
    public Praticien updatePraticien (@RequestBody Praticien praticien, @PathVariable(name = "id") Long id)  {
        Praticien praticien1 = praticienService.findPraticienById(id);
        if (praticien.getNom() != null){
            praticien1.setNom(praticien.getNom());
        }
        if (praticien.getPrenom() != null){
            praticien1.setPrenom(praticien.getPrenom());
        }
        if (praticien.getDescription() != null){
            praticien1.setDescription(praticien.getDescription());
        }

        if (praticien.getAdresse() != null){
            praticien1.setAdresse(praticien.getAdresse());
        }
        if (praticien.getPhoneNumber() != null){
            praticien1.setPhoneNumber(praticien.getPhoneNumber());
        }
        if (praticien.getMatriculeFiscale() != null){
            praticien1.setMatriculeFiscale(praticien.getMatriculeFiscale());
        }
        if (praticien.getVille() != null){
          praticien1.setVille(praticien.getVille());
        }
        if(praticien.getMatriculePraticien() != null){
            praticien1.setMatriculePraticien(praticien.getMatriculePraticien());
        }

        return praticienService.updatePraticien(praticien1);
    }

    @GetMapping("/existPraByMat/{mat}")
    public ResponseEntity<Boolean> ExistPraMat(@PathVariable(name = "mat") String mat){
        Boolean pra = praticienService.existPraByMat(mat) ;
        return new ResponseEntity<>(pra , HttpStatus.OK);
    }

    @GetMapping("/existPraMatFis/{matFis}")
    public ResponseEntity<Boolean> existPraMatFis(@PathVariable(name = "matFis") String matFis){
        Boolean praFis = praticienService.existPraByMatFis(matFis);
        return new ResponseEntity<>(praFis , HttpStatus.OK);
    }

    @GetMapping("/findActeBSByMat/{matricule}")
    public ResponseEntity<Boolean> findActeBSByMat(@PathVariable(name = "matricule") String matricule){
        if (praticienService.existPraByMatr(matricule) || praticienService.existPraByMatrActeBS(matricule)){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(false,HttpStatus.OK);
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePraticien(@PathVariable("id") Long id){
        if ((praticienService.existPraByMatr(praticienService.findPraticienById(id).getMatriculePraticien())) ||
                (praticienService.existPraByMatrActeBS(praticienService.findPraticienById(id).getMatriculePraticien()))){
            throw new ResourceNotFoundException("désolé ce praticien avec id = " + id + " contient des actes BS");
        }else{
            praticienService.deletePraticien(id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
