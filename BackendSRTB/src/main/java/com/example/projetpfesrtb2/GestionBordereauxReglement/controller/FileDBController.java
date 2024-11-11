package com.example.projetpfesrtb2.GestionBordereauxReglement.controller;

import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileDB;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileResponse;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.Reglement;
import com.example.projetpfesrtb2.GestionBordereauxReglement.service.FileDBService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("file")
public class FileDBController {

    @Autowired
    private FileDBService fileDbService;

    @PostMapping
    public FileResponse uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return fileDbService.store(file);
    }

    @GetMapping("/getFile/{id}")
    public FileDB getFile(@PathVariable Long id) {

        return fileDbService.getFileById(id);

    }


    @GetMapping("/getFileAll")
    public ResponseEntity<List<FileDB>> getFileAll() {
        List<FileDB> fileDBS =  fileDbService.getAllFile();
        return new ResponseEntity<>(fileDBS, HttpStatus.OK);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable(name = "id") Long id){
        fileDbService.deleteFile(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getData/{id}")
    public String getFileContent(@PathVariable Long id) {
        return new String(fileDbService.getFileById(id).getData(), StandardCharsets.UTF_8);
    }

    private long numLines(String fileName){
        int i=0,k=0;
        while(i<fileName.length()){
            i++;
            if(i%92==0) k++;
        }
        return k;
    }

    @GetMapping("/getJson/{id}")
    public List<Reglement> getJsonContent(@PathVariable Long id) {
        List<Reglement> list=new ArrayList<>();
        String file=new String(fileDbService.getFileById(id).getData(), StandardCharsets.UTF_8);
        int j=0,i=0;
        final long line=numLines(file);
        while(i<line) {
            char c = file.toUpperCase().charAt(30 + j);
            double codeAff = Double.parseDouble(file.substring(j, 6 + j));
            String codePrest = file.substring(6 + j, 8 + j);
            String codeActe = file.substring(16 + j, 19 + j).trim();
            double refBS = Double.parseDouble(file.substring(19 + j, 27 + j));
            String refBord = file.substring(27 + j, 30 + j);
            LocalDate dateBs=LocalDate.parse(file.substring(8 + j, 12 + j)+'-'+file.substring(12 + j, 14 + j)+'-'+file.substring(14 + j, 16 + j));
            LocalDate dateRemb=LocalDate.parse(file.substring(82 + j, 86 + j)+'-'+file.substring(86 + j, 88 + j)+'-'+file.substring(88 + j, 90 + j));
            Reglement rg;

            if(c >='A'&& c <='Z') {
                rg = new Reglement(codeAff, codePrest, dateBs, codeActe, refBS, refBord, 0.0, 0.0, "Litige", 0.0, 0.0, dateRemb, file.substring(30 + j, 82 + j));
            }
            else {
                rg = new Reglement(codeAff, codePrest, dateBs, codeActe, refBS, refBord, Double.parseDouble(file.substring(30 + j, 33 + j)), Double.parseDouble(file.substring(33 + j, 36 + j)), "Décompte", Double.parseDouble(file.substring(36 + j, 45 + j))/1000, Double.parseDouble(file.substring(45 + j, 54 + j))/1000, dateRemb, "");
            }
            list.add(rg);
            j+=92;
            i++;
        }
        return list;
    }

    @GetMapping("/getRegSum/{id}")
    public double getSommeReglement(@PathVariable Long id) {
        double sum=0.0;
        List<Reglement> list=getJsonContent(id);
        for(Reglement reglement:list){
            sum+=reglement.getMontRemb();
        }
        return Math.round(sum*100.0)/100.0;
    }

    @GetMapping("/listAll")
    public List<FileResponse> getFileList(){
        return fileDbService.getFileList();
    }

    @DeleteMapping("/deleteFileById/{id}")
    public ResponseEntity<?> deleteFileById(@PathVariable("id") Long id){
        fileDbService.deleteFileById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
