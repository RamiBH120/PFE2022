package com.example.projetpfesrtb2.GestionBordereauxReglement.service;

import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileDB;
import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileResponse;

import com.example.projetpfesrtb2.GestionBordereauxReglement.repo.FileDBRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class FileDBService {
    @Autowired
    private FileDBRepo fileDBRepo;


    public FileResponse store(MultipartFile file) throws IOException {
        String fileName = file.getOriginalFilename();
        FileDB fileDb = new FileDB(null, fileName, file.getContentType(), file.getBytes());
        fileDBRepo.save(fileDb);
        return  mapToFileResponse(fileDb);
    }

    public FileDB getFileById(Long id) {

        Optional<FileDB> fileOptional = fileDBRepo.findById(id);

        return fileOptional.orElse(null);
    }

    public List<FileResponse> getFileList(){
        return fileDBRepo.findAll().stream().map(this::mapToFileResponse).collect(Collectors.toList());
    }

    public List<FileDB> getAllFile(){
        return fileDBRepo.findAll();
    }

    private FileResponse mapToFileResponse(FileDB fileDb) {
        return new FileResponse(fileDb.getId(), fileDb.getType(), fileDb.getName());
    }

    public void deleteFileById(Long id){
        fileDBRepo.deleteFileDBById(id);
    }
    public void deleteFile(Long id) { fileDBRepo.deleteFileDBById(id);}

    public FileDB updateFile(FileDB fileDB) { return fileDBRepo.save(fileDB); }

    public FileDB findFileById(Long id) { return fileDBRepo.findFileDBById(id); }
}
