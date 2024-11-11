package com.example.projetpfesrtb2.GestionActesMedicaux.controller;

import com.example.projetpfesrtb2.GestionActesMedicaux.model.ActeMedical;
import com.example.projetpfesrtb2.GestionActesMedicaux.service.ActeMedicalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/ActeMedical")
public class ActeMedicalController {
    @Autowired
    ActeMedicalService acteMedicalService;


    @GetMapping("/all")
    public ResponseEntity<List<ActeMedical>> getAll() {
        List<ActeMedical> acteMedicals = acteMedicalService.findAllActeMedicals();
        return new ResponseEntity<>(acteMedicals, HttpStatus.OK) ;
    }

    @PostMapping("/add")
    public ResponseEntity<ActeMedical> add(@RequestBody ActeMedical acteMedical) {
        ActeMedical acteMedical1 = acteMedicalService.addActeMedical(acteMedical);
        return new ResponseEntity<>(acteMedical1, HttpStatus.CREATED) ;
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<ActeMedical> getById(@PathVariable("id") Long id) {
        ActeMedical acteMedical = acteMedicalService.findActeMedicalById(id);
        return new ResponseEntity<>(acteMedical, HttpStatus.OK) ;
    }

    @GetMapping("/exist/{code}")
    public ResponseEntity<Boolean> existActMed(@PathVariable("code") String code){
        Boolean exis = acteMedicalService.exists(code);
        return new ResponseEntity<>(exis , HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ActeMedical update (@RequestBody ActeMedical acteMedical, @PathVariable(name = "id") Long id)  {
        ActeMedical acteMedical1 = acteMedicalService.findActeMedicalById(id);
        if (acteMedical.getCode() != null){
            acteMedical1.setCode(acteMedical.getCode());
        }
        if (acteMedical.getDesignation() != null){
            acteMedical1.setDesignation(acteMedical.getDesignation());
        }
        if (acteMedical.getMode() != null){
            acteMedical1.setMode(acteMedical.getMode());
        }

        if (acteMedical.getObservation() != null){
            acteMedical1.setObservation(acteMedical.getObservation());
        }
        if (acteMedical.getValeur() != null){
            acteMedical1.setValeur(acteMedical.getValeur());
        }
        if (acteMedical.getPlafond() != null){
            acteMedical1.setPlafond(acteMedical.getPlafond());
        }

        return acteMedicalService.updateActeMedical(acteMedical1);
    }

    @GetMapping("/findActeBSByCode/{code}")
    public ResponseEntity<Boolean> findActeBSByCode(@PathVariable(name = "code") String code){
        if (acteMedicalService.existActeByCode(code)){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(false,HttpStatus.OK);
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        if ((acteMedicalService.existActeByCode(acteMedicalService.findActeMedicalById(id).getCode()))){
              throw new ResourceNotFoundException("désolé cette acte Médical avec id = " + id + " contient des actes B.S");
        }else{
            acteMedicalService.deleteActeMedical(id);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
