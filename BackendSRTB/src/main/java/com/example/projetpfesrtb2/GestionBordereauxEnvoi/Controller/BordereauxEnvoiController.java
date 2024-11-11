package com.example.projetpfesrtb2.GestionBordereauxEnvoi.Controller;


import com.example.projetpfesrtb2.GestionBordereauxEnvoi.Service.BordereauxEnvoiService;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.model.BordereauxEnvoi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/BordereauxEnvoi")
public class BordereauxEnvoiController {

    @Autowired
    private BordereauxEnvoiService bordereauxEnvoiService ;

    @GetMapping("/all")
    public ResponseEntity<List<BordereauxEnvoi>> getAllBordereauxEnvoi() {
        List<BordereauxEnvoi> employees = bordereauxEnvoiService.findAllBordereauxEnvoi();
        return new ResponseEntity<>(employees, HttpStatus.OK) ;
    }


    @GetMapping("/find/{id}")
    public ResponseEntity<BordereauxEnvoi> getBordereauxEnvoiById(@PathVariable("id") Long id) {
        BordereauxEnvoi bordereauxEnvoi = bordereauxEnvoiService.findBordereauxEnvoiById(id);
        return new ResponseEntity<>(bordereauxEnvoi, HttpStatus.OK) ;
    }

    @GetMapping("/existBordEnv/{nom}")
    public ResponseEntity<Boolean> existBordEnv(@PathVariable("nom") String nom){
        Boolean exis = bordereauxEnvoiService.exists(nom);
        return new ResponseEntity<>(exis,HttpStatus.OK);
    }


    @PostMapping("/add")
    public ResponseEntity<BordereauxEnvoi> addBordereauxEnvoi(@RequestBody BordereauxEnvoi bordereauxEnvoi) {
        BordereauxEnvoi BorEnvObj = bordereauxEnvoiService.addBordereauxEnvoi(bordereauxEnvoi);
        return new ResponseEntity<>(BorEnvObj, HttpStatus.CREATED) ;
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBordereauxEnvoi(@PathVariable("id") Long id){
            bordereauxEnvoiService.deleteBordereauxEnvoi(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }



    @PutMapping("/update/{id}")
    public BordereauxEnvoi updateBordereauxEnvoi (@RequestBody BordereauxEnvoi bordereauxEnvoi, @PathVariable(name = "id") Long id)  {
        BordereauxEnvoi bordereauxEnvoi1 = bordereauxEnvoiService.findBordereauxEnvoiById(id);
        if (bordereauxEnvoi.getDateDebut() != null){
            bordereauxEnvoi1.setDateDebut(bordereauxEnvoi.getDateDebut());
        }
        if (bordereauxEnvoi.getDateFin() != null){
            bordereauxEnvoi1.setDateFin(bordereauxEnvoi.getDateFin());
        }
        if (bordereauxEnvoi.getDescription() != null){
            bordereauxEnvoi1.setDescription(bordereauxEnvoi.getDescription());
        }
        if (bordereauxEnvoi.getNom() != null){
            bordereauxEnvoi1.setNom(bordereauxEnvoi.getNom());
        }

       if(bordereauxEnvoi.getBulletinSoinList() != null){
            bordereauxEnvoi1.setBulletinSoinList(bordereauxEnvoi.getBulletinSoinList());
        }

        return bordereauxEnvoiService.updateBordereauxEnvoi(bordereauxEnvoi1);
    }

}
