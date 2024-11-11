package com.example.projetpfesrtb2.GestionAgent.controller;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionAgent.model.Visite;
import com.example.projetpfesrtb2.GestionAgent.service.AgentService;
import com.example.projetpfesrtb2.GestionAgent.service.VisiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@RestController
@RequestMapping("/Visite")
public class VisiteController {
    @Autowired
    VisiteService visiteService;
    @Autowired
    AgentService agentService ;

    @GetMapping("/all")
    public ResponseEntity<List<Visite>> getAll() {
        List<Visite> visites = visiteService.findAll();
        return new ResponseEntity<>(visites, HttpStatus.OK) ;
    }

    @PostMapping("/add")
    public ResponseEntity<Visite> addVisite(@RequestBody Visite visite) {
        Visite visite1 = visiteService.add(visite);
        return new ResponseEntity<>(visite1, HttpStatus.CREATED) ;
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Visite> getById(@PathVariable("id") Long id) {
        Visite visite = visiteService.findById(id);
        return new ResponseEntity<>(visite, HttpStatus.OK) ;
    }

    @PutMapping("/update/{id}")
    public Visite updateVisite(@PathVariable(name = "id") Long id , @RequestBody Visite visite) {
        Visite visite1 = visiteService.findById(id);
        if (visite.getEvent() != null){
            visite1.setEvent(visite.getEvent());
        }
        visite1.setVisited(false);
        return visiteService.update(visite1);
    }

    @PutMapping("/updateVisiteForNextEvent/{id}")
    public Visite updateVisiteForNextEvent(@PathVariable(name = "id") Long id , @RequestBody Visite visite){
        Visite visite1 = visiteService.findById(id);
        if (visite.getNextEvent() != null){
            visite1.setNextEvent(visite.getNextEvent());
        }
        visite1.setVisited(visite.isVisited());
        return visiteService.update(visite1);
    }

    @PutMapping("/updateVisiteForEvent/{id}")
    public Visite updateVisiteForEvent(@PathVariable(name = "id") Long id,@RequestBody Visite visite){
        Visite visite1 = visiteService.findById(id);
        if (visite.getNextEvent() != null && visite.getEvent() != null){
            visite1.setNextEvent(null);
            visite1.setEvent(null);
        }
        if (visite.getNextEvent() == null && visite.getEvent() != null){
            visite1.setEvent(null);
        }
        return visiteService.update(visite1);
    }
    @PutMapping("/updateForLastDate/{id}/Agent/{srtb}")
    public Visite updateForLastDate(@PathVariable(name = "id") Long id
            ,@PathVariable(name = "srtb") Long srtb,@RequestBody Visite visite){
        Visite visite1 = visiteService.findById(id);
        Agent agent = agentService.findAgSRTB(srtb);
        if (Objects.equals(agent.getDirection(), "Exploitation")) {
                LocalDate visite2 = (visite.getNextdate().plusMonths(6));
                DayOfWeek day2 = DayOfWeek.from(visite2);
                if (day2.getValue() == 1){
                    visite1.setLastdate(visite.getNextdate().plusMonths(6).plusDays(1));
                }
                else if (day2.getValue() == 6){
                    visite1.setLastdate(visite.getNextdate().plusMonths(6).plusDays(3));
                }
                else if (day2.getValue() == 7){
                    visite1.setLastdate(visite.getNextdate().plusMonths(6).plusDays(2));
                }
                else {
                    visite1.setLastdate(visite.getNextdate().plusMonths(6));
                }
        }
        if (Objects.equals(agent.getDirection(), "Administration")){
                LocalDate visite2 = visite.getNextdate().plusYears(1) ;
                DayOfWeek day2 = DayOfWeek.from(visite2);
                if (day2.getValue() == 1){
                    visite1.setLastdate(visite.getNextdate().plusYears(1).plusDays(1));
                }
                else if (day2.getValue() == 6){
                    visite1.setLastdate(visite.getNextdate().plusYears(1).plusDays(3));
                }
                else if (day2.getValue() == 7){
                    visite1.setLastdate(visite.getNextdate().plusYears(1).plusDays(2));
                }
                else {
                    visite1.setLastdate(visite.getNextdate().plusYears(1));
                }
        }
        return visiteService.update(visite1);
    }
    @PutMapping("/updateForNextDate/{id}/{srtb}")
    public Visite updateForNextDate(@PathVariable(name = "id") Long id,
                                    @PathVariable(name = "srtb") Long srtb,
                                    @RequestBody Visite visite){
        Visite visite1 = visiteService.findById(id);
        Agent agent = agentService.findAgSRTB(srtb);
        if (Objects.equals(agent.getDirection(), "Exploitation")) {
            if (visite.getEvent() != null && visite.getNextEvent() == null) {
                LocalDate visite2 = (visite.getEvent().plusMonths(6));
                DayOfWeek day2 = DayOfWeek.from(visite2);
                if (day2.getValue() == 1){
                    visite1.setNextdate(visite.getEvent().plusMonths(6).plusDays(1));
                }
                else if (day2.getValue() == 6){
                    visite1.setNextdate(visite.getEvent().plusMonths(6).plusDays(3));
                }
                else if (day2.getValue() == 7){
                    visite1.setNextdate(visite.getEvent().plusMonths(6).plusDays(2));
                }
                else {
                    visite1.setNextdate(visite.getEvent().plusMonths(6));
                }
            }
            if (visite.getEvent() != null && visite.getNextEvent() != null) {
                LocalDate visite2 = visite.getNextEvent().plusMonths(6) ;
                DayOfWeek day2 = DayOfWeek.from(visite2);
                if (day2.getValue() == 1){
                    visite1.setNextdate(visite.getNextEvent().plusMonths(6).plusDays(1));
                }
                else if (day2.getValue() == 6){
                    visite1.setNextdate(visite.getNextEvent().plusMonths(6).plusDays(3));
                }
                else if (day2.getValue() == 7){
                    visite1.setNextdate(visite.getNextEvent().plusMonths(6).plusDays(2));
                }
                else {
                    visite1.setNextdate(visite.getNextEvent().plusMonths(6));
                }
            }
        }
        if (Objects.equals(agent.getDirection(), "Administration")){
            if (visite.getEvent() != null && visite.getNextEvent() == null) {
                LocalDate visite2 = visite.getEvent().plusYears(1) ;
                DayOfWeek day2 = DayOfWeek.from(visite2);
                if (day2.getValue() == 1){
                    visite1.setNextdate(visite.getEvent().plusYears(1).plusDays(1));
                }
                else if (day2.getValue() == 6){
                    visite1.setNextdate(visite.getEvent().plusYears(1).plusDays(3));
                }
                else if (day2.getValue() == 7){
                    visite1.setNextdate(visite.getEvent().plusYears(1).plusDays(2));
                }
                else {
                    visite1.setNextdate(visite.getEvent().plusYears(1));
                }
            }
            if (visite.getEvent() != null && visite.getNextEvent() != null) {
                LocalDate visite2 = visite.getNextEvent().plusYears(1) ;
                DayOfWeek day2 = DayOfWeek.from(visite2);
                if (day2.getValue() == 1){
                    visite1.setNextdate(visite.getNextEvent().plusYears(1).plusDays(1));
                }
                else if (day2.getValue() == 6){
                    visite1.setNextdate(visite.getNextEvent().plusYears(1).plusDays(3));
                }
                else if (day2.getValue() == 7){
                    visite1.setNextdate(visite.getNextEvent().plusYears(1).plusDays(2));
                }
                else {
                    visite1.setNextdate(visite.getNextEvent().plusYears(1));
                }
            }
        }
        return visiteService.update(visite1);
    }

    @PutMapping("/updateVisiteForIsVisited/{id}")
    public Visite updateVisiteForIsVisited(@PathVariable(name = "id") Long id , @RequestBody Visite visite){
        Visite visite1 = visiteService.findById(id);
        if(visite.isVisited()){
            visite1.setVisited(false);
        }
        return visiteService.update(visite1);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id){
        visiteService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getDate/{id}")
    public LocalDate Convert(@PathVariable(name = "id") Long id){
        Visite visite = visiteService.findById(id);
        return (visite.getLastdate().minusDays(1));
    }

    @GetMapping("/getDateForEvent/{id}")
    public LocalDate ConvertEvent(@PathVariable(name = "id") Long id){
        Visite visite = visiteService.findById(id);
        return (visite.getEvent().plusDays(1));
    }

    @PutMapping("/updateForDele/{id}")
    public Visite updateForDele(@PathVariable(name = "id")Long id ,@RequestBody Visite visite){
        Visite visite1 = visiteService.findById(id);
        if (visite.getEvent() != null && visite.getNextEvent()==null){
            visite1.setEvent(null);
        }
        if (visite.getEvent() != null && visite.getNextEvent() != null){
            visite1.setNextEvent(null);
        }
        return visiteService.update(visite1);
    }
}
