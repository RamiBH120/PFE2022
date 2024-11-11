package com.example.projetpfesrtb2.GestionBordereauxReglement.repo;

import com.example.projetpfesrtb2.GestionBordereauxReglement.model.FileDB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FileDBRepo extends JpaRepository<FileDB, Long> {
    Optional<FileDB> findFileById(Long id);

    Boolean existsFileDBById(Long id);

    void deleteFileDBById(Long id) ;

    FileDB findFileDBById(Long id) ;
}
