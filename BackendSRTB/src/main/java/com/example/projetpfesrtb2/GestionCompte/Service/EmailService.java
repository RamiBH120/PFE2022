package com.example.projetpfesrtb2.GestionCompte.Service;

import com.example.projetpfesrtb2.GestionCompte.Repository.EmailRepository;
import com.example.projetpfesrtb2.GestionCompte.Repository.RegistrationRepository;
import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EmailService {

    @Autowired
    private EmailRepository emailRepository;
    @Autowired private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}") private String sender;

    // Method 1
    // To send a simple email
    public String sendSimpleMail(String Recipient,String MsgBody,String Subject)
    {

        // Try block to check for exceptions
        try {

            // Creating a simple mail message
            SimpleMailMessage mailMessage
                    = new SimpleMailMessage();

            // Setting up necessary details
            mailMessage.setFrom(sender);
            mailMessage.setTo(Recipient);
            mailMessage.setText(MsgBody);
            mailMessage.setSubject(Subject);

            // Sending the mail
            javaMailSender.send(mailMessage);
            return "Mail Sent Successfully...";
        }

        // Catch block to handle the exceptions
        catch (Exception e) {
            return "Error while Sending Mail";
        }
    }

    public Optional<UserDB> findUserByEmail(String email){
        return emailRepository.findByEmail(email);
    }
    public Optional<UserDB> fetchUserByOptToken(String token){
        return emailRepository.findByToken(token);
    }
}
