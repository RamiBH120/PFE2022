package com.example.projetpfesrtb2.GestionAgent.controller;

import com.example.projetpfesrtb2.GestionAgent.model.Enfant;
import com.example.projetpfesrtb2.GestionAgent.service.EnfantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Enfant")
public class EnfantController {

    @Autowired
    EnfantService enfantService ;

    @PostMapping("/add")
    public void add(@RequestBody Enfant enfant){
        enfantService.addEnf(enfant);
    }

    @GetMapping("/all")
    public List<Enfant> get(){
        return enfantService.getEnf();
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Enfant> getById(@PathVariable("id") Long id){
        Enfant enfant = enfantService.findEnf(id);
        return new ResponseEntity<>(enfant, HttpStatus.OK) ;
    }

    @GetMapping("/findByLast/{id}")
    public ResponseEntity<String> getByIdNom(@PathVariable("id") Long id) {
        String enfant = enfantService.findEnf(id).getNom();
        return new ResponseEntity<>(enfant, HttpStatus.OK) ;
    }

    @GetMapping("/findByName/{id}")
    public ResponseEntity<String> getByIdPrenom(@PathVariable("id") Long id) {
        String enfant = enfantService.findEnf(id).getPrenom();
        return new ResponseEntity<>(enfant, HttpStatus.OK) ;
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable(name = "id") Long id){
        enfantService.deleteEnf(id);
    }
}
