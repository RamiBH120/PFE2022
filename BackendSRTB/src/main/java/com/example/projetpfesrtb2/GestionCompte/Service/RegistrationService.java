package com.example.projetpfesrtb2.GestionCompte.Service;


import com.example.projetpfesrtb2.GestionCompte.Exception.InvalidMatriculeException;
import com.example.projetpfesrtb2.GestionCompte.Repository.RegistrationRepository;
import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.*;
@Service
public class RegistrationService {

    private static final long EXPIRE_TOKEN_AFTER_MINUTES = 15;
    @Autowired
    private RegistrationRepository registrationRepository ;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder bcryptEncoder;

    public UserDB saveUser (UserDB userDB){
       return registrationRepository.save(userDB);
    }

    public UserDB fetchUserByMatricule(String Matricule){
        return registrationRepository.findByMatricule(Matricule);
    }
    public UserDB fetchUserByToken(String Token){
        return registrationRepository.findByToken(Token);
    }

    public UserDB fetchUserByMatriculeAndPassword(String Matricule , String password){
        return registrationRepository.findByMatriculeAndPassword(Matricule , password);
    }

    public Optional<UserDB> findUserByMatricule (String Matricule){
        return registrationRepository.findUserDBByMatricule(Matricule);
    }

    public Boolean existUser (String matricule) {return registrationRepository.existsUserDBByMatricule(matricule); }

    public Boolean existUserByToken (String token) {return registrationRepository.existsUserDBByToken(token); }

    /*public String forgotPassword(String matricule) {

        Optional<UserDB> userOptional = Optional
                .ofNullable(registrationRepository.findByMatricule(matricule));

        if (!userOptional.isPresent()) {
            return "Invalid matricule id.";
        }

        UserDB user = userOptional.get();
        user.setToken(generateToken());
        user.setTokenCreationDate(LocalDateTime.now());

        user = registrationRepository.save(user);

        return user.getToken();
    }*/
    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
    public String forgotPasswordwithPassword(String matricule,String password)throws Exception {
            authenticate(matricule, password);

            Optional<UserDB> userOptional = Optional
                    .ofNullable(registrationRepository.findByMatricule(matricule));

            if (!userOptional.isPresent()) {
                throw new InvalidMatriculeException("Invalid matricule id.");
            }

            UserDB user = userOptional.get();
            user.setToken(generateToken());
            user.setTokenCreationDate(LocalDateTime.now());

            user = registrationRepository.save(user);

            return user.getToken();

    }

    public String resetPassword(String token, String password) {

        Optional<UserDB> userOptional = Optional
                .ofNullable(registrationRepository.findByToken(token));

        if (!userOptional.isPresent()) {
            return "Invalid token.";
        }

        LocalDateTime tokenCreationDate = userOptional.get().getTokenCreationDate();

        if (isTokenExpired(tokenCreationDate)) {
            return "Token expired.";

        }

        UserDB user = userOptional.get();

        user.setPassword(bcryptEncoder.encode(password));
        user.setToken(null);
        user.setTokenCreationDate(null);

        registrationRepository.save(user);

        return "Your password successfully updated.";
    }

    public UserDB resetToken(String token) throws InvalidMatriculeException {

        Optional<UserDB> userOptional = Optional
                .ofNullable(registrationRepository.findByToken(token));

        if (!userOptional.isPresent()) {
            throw new InvalidMatriculeException( "Invalid token.");
        }

        UserDB user = userOptional.get();

        user.setToken(null);
        user.setTokenCreationDate(null);

        return registrationRepository.save(user);

    }

    private String generateToken() {
        StringBuilder token = new StringBuilder();

        return token.append(UUID.randomUUID())
                .append(UUID.randomUUID()).toString();
    }

    private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

        LocalDateTime now = LocalDateTime.now();
        Duration diff = Duration.between(tokenCreationDate, now);

        return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES;
    }
}
