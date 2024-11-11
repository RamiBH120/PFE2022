package com.example.projetpfesrtb2.GestionAgent.controller;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionAgent.service.AgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/Agent")
public class AgentController {

    @Autowired
    AgentService agentService ;

    @PostMapping("/add")
    public void add(@RequestBody Agent agent){
          agentService.addAg(agent);
    }


    @GetMapping("/all")
    public List<Agent> get(){
        return agentService.findAll();
    }

    @GetMapping("/get/{matsrtb}")
    public Agent get(@PathVariable(name = "matsrtb") Long matsrtb){
       return agentService.findAgSRTB(matsrtb);
    }


    @GetMapping("/getMatStar/{matstar}")
    public Agent getMatStar(@PathVariable(name = "matstar") Long matstar){
      return agentService.findAgSTAR(matstar);
    }

    @DeleteMapping("/delete/{matsrtb}")
    public void delete(@PathVariable(name = "matsrtb") Long matsrtb){
        agentService.deleteAg(matsrtb);
    }



    @GetMapping("/getMatstar/{matstar}")
    public void getMatstar(@PathVariable(name = "matstar") Long matstar){

       agentService.findAgSTAR(matstar);
    }

    @PutMapping("/updateAgent/{matstar}")
    public Agent updateAgent (@PathVariable(name = "matstar") Long matstar , @RequestBody Agent agent)  {
        Agent agent1 = agentService.findAgSTAR(matstar);
        if(agent.getMatsrtb() != null){
            agent1.setMatsrtb(agent.getMatsrtb());
        }
        if (agent.getMatstar() != null){
            agent1.setMatstar(agent.getMatstar());
        }
        if (agent.getAffstar() != null){
            agent1.setAffstar(agent.getAffstar());
        }
        if (agent.getNom() != null){
            agent1.setNom(agent.getNom());
        }
        if (agent.getPrenom() != null){
            agent1.setPrenom(agent.getPrenom());
        }
        if (agent.getDirection() != null){
            agent1.setDirection(agent.getDirection());
        }
        if (agent.getFonction() != null){
            agent1.setFonction(agent.getFonction());
        }
        if (agent.getDatenaiss() != null){
            agent1.setDatenaiss(agent.getDatenaiss());
        }
        if (agent.getSituationcivil() != null){
            agent1.setSituationcivil(agent.getSituationcivil());
        }
        if (agent.getNomconj() != null){
            agent1.setNomconj(agent.getNomconj());
        }
        if (agent.getPrenomconj() != null){
            agent1.setPrenomconj(agent.getPrenomconj());
        }
        if (agent.getEnfants() != null){
            agent1.setEnfants(agent.getEnfants());
        }
        if (agent.getSommeBulletinDeSoins() != null){
            agent1.setSommeBulletinDeSoins(agent.getSommeBulletinDeSoins());
        }
        if (agent.getSommePharmacieActeBS() != null){
            agent1.setSommePharmacieActeBS(agent.getSommePharmacieActeBS());
        }
        if (agent.getSommerestant() != null){
            agent1.setSommerestant(agent.getSommerestant());
        }
        if (agent.getVisite() != null){
            agent1.setVisite(agent.getVisite());
        }
        if (agent.getAgence() != null){
            agent1.setAgence(agent.getAgence());
        }

        return agentService.addAgent(agent1);
    }


    @Scheduled(cron = "0 0 0 1 1 ?")
    public void doSometing(){
        List<Agent> agents = agentService.findAll();
        for (Agent agent : agents){
            if(agent.getSommeBulletinDeSoins() != null || agent.getSommeBulletinDeSoins() != 0.0){
                agent.setSommeBulletinDeSoins(0.0);
            }
            if (agent.getSommePharmacieActeBS() != null || agent.getSommePharmacieActeBS() != 0.0){
                agent.setSommePharmacieActeBS(0.0);
            }
            if (agent.getSommerestant() != null || agent.getSommerestant() != 0.0){
                agent.setSommerestant(0.0);
            }

            updateAgent(agent.getMatstar(),agent);
        }
    }


    //@DateTimeFormat
    @GetMapping("/findAgByNextDate/{date}")
    public ResponseEntity<List<Agent>> findAgentByNextDate(@PathVariable(name = "date")String date){
        LocalDate date1 = LocalDate.parse(date);
        List<Agent> agents = agentService.finAgByNextDate(date1);
        return new ResponseEntity<>(agents, HttpStatus.OK);
    }

    @GetMapping("/ConvertDate/{date}")
    public LocalDate Convert(@PathVariable(name = "date") String date){
        return LocalDate.parse(date);
    }

    @GetMapping("/findAgByEventDate/{date}")
    public ResponseEntity<List<Agent>> findAgByEventDate(@PathVariable(name = "date") String date){
        LocalDate date1 = LocalDate.parse(date);
        List<Agent> agents = agentService.finAgByEvent(date1);
        return new ResponseEntity<>(agents,HttpStatus.OK);
    }

    @GetMapping("/findAgByNextEventDate/{date}")
    public ResponseEntity<List<Agent>> findAgByNextEventDate(@PathVariable(name = "date") String date){
        LocalDate date1 = LocalDate.parse(date);
        List<Agent> agents = agentService.finAgByNextEvent(date1);
        return new ResponseEntity<>(agents,HttpStatus.OK);
    }





}
