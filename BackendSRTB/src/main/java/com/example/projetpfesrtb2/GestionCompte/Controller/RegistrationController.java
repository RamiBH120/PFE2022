package com.example.projetpfesrtb2.GestionCompte.Controller;


import com.example.projetpfesrtb2.GestionCompte.Exception.InvalidMatriculeException;
import com.example.projetpfesrtb2.GestionCompte.Repository.ImageRepo;
import com.example.projetpfesrtb2.GestionCompte.Repository.RegistrationRepository;
import com.example.projetpfesrtb2.GestionCompte.Service.RegistrationService;
import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService ;

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private ImageRepo imageRepo;


    @Autowired
    private PasswordEncoder bcryptEncoder;

    @PostMapping("/registerUser")
    public UserDB registerUser (@RequestBody UserDB userDB) throws Exception {
        String tempMatricule = userDB.getMatricule();
        if(tempMatricule != null && !"".equals(tempMatricule)){
            UserDB userDBObj = registrationService.fetchUserByMatricule(tempMatricule);
            if(userDBObj != null){
                throw new Exception("user with " + tempMatricule + "is already exist");
            }
        }
        UserDB userDBObj;
        userDBObj = registrationService.saveUser(userDB);
        return userDBObj;
    }


    @PostMapping("/login")
    public UserDB loginUser (@RequestBody UserDB userDB) throws Exception {
        String tempMatricule = userDB.getMatricule() ;
        String tempPassword = userDB.getPassword() ;
        UserDB userDBObj = null;
        if (tempMatricule != null && tempPassword != null){
             userDBObj = registrationService.fetchUserByMatriculeAndPassword(tempMatricule , tempPassword);
        }
        if (userDBObj == null){
            throw new Exception("Bad Credential");
        }
        return userDBObj;
    }


    @PutMapping("/updateUser")
    public UserDB updateUser (@RequestBody UserDB userDB, @RequestParam(name = "matricule") String matricule) throws Exception {
        UserDB userDB1 = registrationRepository.findByMatricule(matricule);
        if (userDB.getUsername() != null){
            userDB1.setUsername(userDB.getUsername());
        }
        if (userDB.getMatricule() != null){
            userDB1.setMatricule(userDB.getMatricule());
        }
        if (userDB.getPassword() != null){
            userDB1.setPassword(bcryptEncoder.encode(userDB.getPassword()));
        }

        if (userDB.getType() != null){
            userDB1.setType(userDB.getType());
        }
        if (userDB.getPhoneNumber() != null){
            userDB1.setPhoneNumber(userDB.getPhoneNumber());
        }
        if (userDB.getLastname() != null){
            userDB1.setLastname(userDB.getLastname());
        }
        if (userDB.getFirstname() != null){
            userDB1.setFirstname(userDB.getFirstname());
        }
        if (userDB.getAdresse() != null){
            userDB1.setAdresse(userDB.getAdresse());
        }
        if (userDB.getDateNaiss() != null){
            userDB1.setDateNaiss(userDB.getDateNaiss());
        }
        return registrationRepository.save(userDB1);
    }

    @PutMapping("/updateUserImg")
    public UserDB updateUserImg (@RequestBody UserDB userDB, @RequestParam(name = "matricule") String matricule, @RequestParam(name = "imgId") Long imgId) throws Exception {

        if(!imageRepo.existsImageById(imgId)){
            throw new ResourceNotFoundException("image" + imgId + "not found");
        }

        UserDB userDB11 = registrationRepository.findByMatricule(matricule);
        if (userDB.getUsername() != null){
            userDB11.setUsername(userDB.getUsername());
        }
        if (userDB.getMatricule() != null){
            userDB11.setMatricule(userDB.getMatricule());
        }
        if (userDB.getPassword() != null){
            userDB11.setPassword(bcryptEncoder.encode(userDB.getPassword()));
        }

        if (userDB.getType() != null){
            userDB11.setType(userDB.getType());
        }
        if (userDB.getPhoneNumber() != null){
            userDB11.setPhoneNumber(userDB.getPhoneNumber());
        }
        if (userDB.getLastname() != null){
            userDB11.setLastname(userDB.getLastname());
        }
        if (userDB.getFirstname() != null){
            userDB11.setFirstname(userDB.getFirstname());
        }
        if (userDB.getAdresse() != null){
            userDB11.setAdresse(userDB.getAdresse());
        }
        if (userDB.getDateNaiss() != null){
            userDB11.setDateNaiss(userDB.getDateNaiss());
        }
            return imageRepo.findImageFileById(imgId).map(image -> {
                userDB11.setImage(image);
                return registrationService.saveUser(userDB11);
            }).orElseThrow(() -> new ResourceNotFoundException(""));
    }

    @GetMapping("/users")
    public List<UserDB> getAll() {
          return registrationRepository.findAll();
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<UserDB> getUserById(@PathVariable(value = "id") Long id)
            throws ResourceNotFoundException {
        UserDB userDB = registrationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for this id :: " + id));
        return ResponseEntity.ok().body(userDB);
    }

    @GetMapping("/getUserByMatricule")
    public UserDB findByMatricule (@RequestParam(name = "matricule") String matricule){
        return registrationService.fetchUserByMatricule(matricule);
    }
    @GetMapping("/getUserByToken")
    public UserDB findByToken (@RequestParam(name = "token") String token){
        return registrationService.fetchUserByToken(token);
    }
    @PostMapping("/resetToken")
    public UserDB resetToken (@RequestParam(name = "token") String token) throws InvalidMatriculeException {
        return registrationService.resetToken(token);
    }
    @GetMapping("/existUserByMatricule")
    public Boolean ExistUserByMatricule (@RequestParam(name = "matricule") String matricule){
        return registrationService.existUser(matricule);
    }

    @GetMapping("/existUserByToken")
    public Boolean ExistUserByToken (@RequestParam(name = "token") String token){
        return registrationService.existUserByToken(token);
    }


    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam(name = "matricule") String matricule,
                                 @RequestParam(name = "password") String password) throws Exception {
        String fin="";
        try {
            String response = registrationService.forgotPasswordwithPassword(matricule,password);
            fin = "http://localhost:8081/reset-password?token=" + response;
        }
        catch (InvalidMatriculeException exception){
            fin= exception.toString();
        }
        return fin;
    }

    @PutMapping("/reset-password")
    public String resetPassword(@RequestParam(name = "token") String token,
                                @RequestParam(name = "password") String password) {

        return registrationService.resetPassword(token, password);
    }
}
