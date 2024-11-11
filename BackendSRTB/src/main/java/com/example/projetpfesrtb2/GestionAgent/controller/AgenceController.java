package com.example.projetpfesrtb2.GestionAgent.controller;

import com.example.projetpfesrtb2.GestionAgent.model.Agence;
import com.example.projetpfesrtb2.GestionAgent.service.AgenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/Agence")
public class AgenceController {

    @Autowired
    AgenceService agenceService ;

    @GetMapping("/all")
    public List<Agence> get(){
        return agenceService.getAllAgence();
    }


}
