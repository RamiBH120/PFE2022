package com.example.projetpfesrtb2.GestionCompte.Repository;

import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailRepository extends JpaRepository<UserDB,Long> {

    Optional<UserDB> findByToken(String token);
    Optional<UserDB> findByEmail(String email);
}
