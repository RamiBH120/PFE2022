package com.example.projetpfesrtb2.GestionAcces.Service;

import java.util.ArrayList;

import com.example.projetpfesrtb2.GestionCompte.Repository.RegistrationRepository;
import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import com.example.projetpfesrtb2.GestionCompte.model.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class JwtUserDetailsService implements UserDetailsService{
    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private PasswordEncoder bcryptEncoder;

    @Override
    public UserDetails loadUserByUsername(String matricule) throws UsernameNotFoundException {
        UserDB userDB = registrationRepository.findByMatricule(matricule);
        if (userDB == null) {
            throw new UsernameNotFoundException("User not found with matricule: " + matricule);
        }
        return new User(userDB.getMatricule(), userDB.getPassword(),
                new ArrayList<>());
    }

    public UserDB save(UserDTO user) {
        UserDB newUser = new UserDB();
        newUser.setMatricule(user.getMatricule());
        newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
        return registrationRepository.save(newUser);
    }
}
