package com.example.projetpfesrtb2.GestionMedecin.Controller;

import com.example.projetpfesrtb2.GestionMedecin.Service.MedecinService;
import com.example.projetpfesrtb2.GestionMedecin.model.Medecin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/Medecin")
public class MedecinController {

    @Autowired
    private MedecinService medecinService ;


    @GetMapping("/all")
    public ResponseEntity<List<Medecin>> getAllMedecin() {
        List<Medecin> employees = medecinService.findAllMedecins();
        return new ResponseEntity<>(employees, HttpStatus.OK) ;
    }



    @GetMapping("/find/{id}")
    public ResponseEntity<Medecin> getMedecinById(@PathVariable("id") Long id) {
        Medecin employee = medecinService.findMedecinById(id);
        return new ResponseEntity<>(employee, HttpStatus.OK) ;
    }


    @PostMapping("/add")
    public ResponseEntity<Medecin> addEmployee(@RequestBody Medecin medecin) throws Exception {
        String tempMatricule = medecin.getMatriculeFiscale();
        if (tempMatricule != null && !"".equals(tempMatricule)){
            Medecin medecinObj = medecinService.fetchMedecinByMatriculeFiscale(tempMatricule);
            if (medecinObj != null){
                throw new Exception("mdecin avec " + tempMatricule + " est déjà present(e)");
            }
        }
        Medecin medecinObj = null;
        medecinObj = medecinService.addMedecin(medecin);
        return new ResponseEntity<>(medecinObj, HttpStatus.CREATED) ;
    }

/*
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id){
        medecinService.deleteMedecin(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }


 */


    @PutMapping("/updateUser/{id}")
    public Medecin updateUser (@RequestBody Medecin medecin, @PathVariable(name = "id") Long id)  {
        Medecin medecin1 = medecinService.findMedecinById(id);
        if (medecin.getNom() != null){
            medecin1.setNom(medecin.getNom());
        }
        if (medecin.getPrenom() != null){
            medecin1.setPrenom(medecin.getPrenom());
        }
        if (medecin.getType() != null){
            medecin1.setType(medecin.getType());
        }

        if (medecin.getAdresse() != null){
            medecin1.setAdresse(medecin.getAdresse());
        }
        if (medecin.getPhoneNumber() != null){
            medecin1.setPhoneNumber(medecin.getPhoneNumber());
        }
        if (medecin.getMatriculeFiscale() != null){
            medecin1.setMatriculeFiscale(medecin.getMatriculeFiscale());
        }
        if (medecin.getVille() != null){
            medecin1.setVille(medecin.getVille());
        }
        if (medecin.getMatriculeMedecin() != null){
            medecin1.setMatriculeMedecin(medecin.getMatriculeMedecin());
        }

        return medecinService.updateMedecin(medecin1);
    }


    @GetMapping("/existsMedByMat/{matricule}")
    public ResponseEntity<Boolean> existMedByMat(@PathVariable(name = "matricule") String matricule){
        Boolean med = medecinService.existsMatriMed(matricule);
        return new ResponseEntity<>(med,HttpStatus.OK);
    }

    @GetMapping("/existMedByMatFis/{matriFis}")
    public ResponseEntity<Boolean> existMedByMatFis(@PathVariable(name = "matriFis") String matFis){
        Boolean medFis = medecinService.existsMatFisMed(matFis);
        return new ResponseEntity<>(medFis,HttpStatus.OK);
    }
/*
    @GetMapping("/exportPdf")
    public ResponseEntity<InputStreamResource> exportTermsPdf(){
        List<Medecin> medecins = (List<Medecin>) medecinService.findAllMedecins();
        ByteArrayInputStream bais = medecinService.productsPdfReport(medecins);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition","inline; filename=medecins.pdf");
        return ResponseEntity.ok().headers(headers).contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bais));
    }

 */

    @GetMapping("/findActeBSByMat/{matricule}")
    public ResponseEntity<Boolean> findActeBSByMat(@PathVariable(name = "matricule") String matricule){
        if (medecinService.existMedByMatr(matricule) || medecinService.existPraByMatr(matricule)){
            return new ResponseEntity<>(true,HttpStatus.OK);
        }else {
            return new ResponseEntity<>(false,HttpStatus.OK);
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable("id") Long id){
        if ((medecinService.existMedByMatr(medecinService.findMedecinById(id).getMatriculeMedecin())) ||
                (medecinService.existPraByMatr(medecinService.findMedecinById(id).getMatriculeMedecin()))){
            throw new ResourceNotFoundException("désolé ce medecin avec id = " + id + " contient des actes BS");
        }else {
            medecinService.deleteMedecin(id);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }


}
