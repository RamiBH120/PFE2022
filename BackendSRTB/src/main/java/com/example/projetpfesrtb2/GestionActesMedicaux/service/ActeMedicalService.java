package com.example.projetpfesrtb2.GestionActesMedicaux.service;

import com.example.projetpfesrtb2.GestionActesMedicaux.model.ActeMedical;
import com.example.projetpfesrtb2.GestionActesMedicaux.repo.ActeMedicalRepo;
import com.example.projetpfesrtb2.GestionBordereauxEnvoi.repo.ActeBSRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ActeMedicalService {
    
    @Autowired
    ActeMedicalRepo acteMedicalRepo;

    @Autowired
    ActeBSRepo acteBSRepo ;

    public ActeMedical addActeMedical(ActeMedical acteMedical){return acteMedicalRepo.save(acteMedical);}

    public List<ActeMedical> findAllActeMedicals() {
        return acteMedicalRepo.findAll();
    }

    public ActeMedical findActeMedicalById(Long id) {
        return acteMedicalRepo.findActeMedicalById(id);
    }

    public ActeMedical updateActeMedical(ActeMedical acteMedical) {
        return acteMedicalRepo.save(acteMedical);
    }

    public void deleteActeMedical(Long id) {
        acteMedicalRepo.deleteActeMedicalById(id);
    }

    public ActeMedical findActeMedicalByCode(String code){
        ActeMedical acteMedical = new ActeMedical() ;
        if (acteMedicalRepo.findActeMedicalByCode(code).isPresent()){
            acteMedical = acteMedicalRepo.findActeMedicalByCode(code).get();
        }
        return acteMedical;}

    public Boolean exists (String code) { return acteMedicalRepo.existsActeMedicalByCode(code); }

    public Boolean existActeByCode(String code) { return acteBSRepo.existsActeBSByActeMedical_Code(code); }
}
