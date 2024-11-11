package com.example.projetpfesrtb2.GestionAgent.service;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionAgent.repo.AgentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class AgentService {
    @Autowired
    AgentRepo agentRepo;

    public List<Agent> findAll() { return agentRepo.findAll(); }

    public void addAg(Agent agent) { agentRepo.save(agent); }

    public Agent findAgSRTB(Long matsrtb) {  return agentRepo.findAgentByMatsrtb(matsrtb); }

    public Agent findAgSTAR(Long matstar) {
        Agent agent = new Agent() ;
        if (agentRepo.findAgentByMatstar(matstar).isPresent()){
            agent  = agentRepo.findAgentByMatstar(matstar).get() ;
        }
        return agent;
    }

    public void deleteAg(Long matsrtb) {  agentRepo.deleteById(matsrtb); }

    public Agent addAgent(Agent agent) {  return agentRepo.save(agent); }

    public List<Agent> finAgByNextDate(LocalDate date) {
        List<Agent> agents = new ArrayList<>();
        if (agentRepo.existsAgentByVisite_Nextdate(date)){
           agents = agentRepo.findAgentByVisite_Nextdate(date);
        }
        return agents ;
    }

    public List<Agent> finAgByEvent(LocalDate date) {
        List<Agent> agent = new ArrayList<>();
        if (agentRepo.existsAgentByVisite_Event(date)){
            agent= (agentRepo.findAgentByVisite_Event(date));
        }
        return agent;
    }
    public List<Agent> finAgByNextEvent(LocalDate date) {
        List<Agent> agents = new ArrayList<>();
        if (agentRepo.existsAgentByVisite_NextEvent(date)){
          agents = agentRepo.findAgentByVisite_NextEvent(date);
        }
        return agents;
    }
}
