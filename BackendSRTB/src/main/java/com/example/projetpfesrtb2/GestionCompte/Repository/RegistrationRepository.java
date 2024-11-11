package com.example.projetpfesrtb2.GestionCompte.Repository;


import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegistrationRepository extends JpaRepository<UserDB,Long> {
    UserDB findByMatricule(String Matricule);
    UserDB findByToken(String token);
    Optional<UserDB> findUserDBByMatricule(String Matricule);
    UserDB findByMatriculeAndPassword(String Matricule, String password);
    Boolean existsUserDBByMatricule(String Matricule);
    Boolean existsUserDBByToken(String Token);
}
