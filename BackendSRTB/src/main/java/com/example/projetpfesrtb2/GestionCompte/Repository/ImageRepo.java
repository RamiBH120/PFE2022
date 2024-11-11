package com.example.projetpfesrtb2.GestionCompte.Repository;

import com.example.projetpfesrtb2.GestionCompte.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ImageRepo extends JpaRepository<Image,Long> {
    Optional<Image> findById(Long id);
    Optional<Image> findImageFileById(Long id);
    Boolean existsImageById(Long id);
    void deleteImageById(Long id) ;
}
