package com.example.projetpfesrtb2.GestionAgent.repo;

import com.example.projetpfesrtb2.GestionAgent.model.Agent;
import com.example.projetpfesrtb2.GestionAgent.model.Enfant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AgentRepo extends JpaRepository<Agent,Long> {

    Agent findAgentByMatsrtb(Long matsrtb);

    Optional<Agent> findAgentByMatstar(Long matstar);

    Boolean existsAgentByMatstar(Long matstar);

    List<Agent> findAgentByVisite_Nextdate(LocalDate visite_nextdate);

    List<Agent> findAgentByVisite_Event(LocalDate date) ;

    List<Agent> findAgentByVisite_NextEvent(LocalDate date) ;

    Boolean existsAgentByVisite_Event(LocalDate date);
    Boolean existsAgentByVisite_NextEvent(LocalDate date);
    Boolean existsAgentByVisite_Nextdate(LocalDate date);

}
