package com.example.projetpfesrtb2.GestionCompte.Controller;

import com.example.projetpfesrtb2.GestionCompte.Service.EmailService;
import com.example.projetpfesrtb2.GestionCompte.Service.RegistrationService;
import com.example.projetpfesrtb2.GestionCompte.model.UserDB;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
public class EmailController {
    private static final long EXPIRE_TOKEN_AFTER_MINUTES = 15;

    @Autowired
    private EmailService emailService ;

    @Autowired
    private RegistrationService registrationService ;

    @Autowired
    private PasswordEncoder bcryptEncoder;

    String loginurl="http://localhost:4200/loginPage";

    // Display forgotPassword page
    @RequestMapping(value = "/forgot", method = RequestMethod.GET)
    public ModelAndView displayForgotPasswordPage() {
        return new ModelAndView("forgotPassword");
    }

    // Process form submission from forgotPassword page
    @RequestMapping(value = "/forgot", method = RequestMethod.POST)
    public String processForgotPasswordForm( @RequestParam("email") String userEmail, HttpServletRequest request) {

        // Lookup user in database by e-mail
        Optional<UserDB> optional = emailService.findUserByEmail(userEmail);

        String status="";
        if (!optional.isPresent()) {
            status="Il n'y a pas de compte pour ce e-mail address.";
        } else {

            // Generate random 36-character string token for reset password
            UserDB user = optional.get();
            user.setToken(UUID.randomUUID().toString());
            user.setTokenCreationDate(LocalDateTime.now());

            // Save token to database
            registrationService.saveUser(user);

            // Email message
            String appUrl = request.getScheme() + "://" + request.getServerName()+":4200";

            String MsgBody="Salutations, ici l'équipe S.R.T.B!.\n Vous avez envoyé une requête de récupération ou bien, changement de votre mot de passe pour l'application A.G.B.S.\n Pour changer votre mot de passe, veuillez cliquer sur le lien ci-dessous:\n" + appUrl
                    + "/resetPage?token=" + user.getToken()+"\n\n Si vous n'avez pas envoyé cette requête alors, veuillez ignorer ce message.\n\n Cher utilisateur, à nos sentiments cordiaux.";
            String Subject="changement de mot de passe";
            status = emailService.sendSimpleMail(user.getEmail(),MsgBody,Subject);

        }
        return status;

    }

    // Display form to reset password
    @RequestMapping(value = "/reset", method = RequestMethod.GET)
    public ModelAndView displayResetPasswordPage(ModelAndView modelAndView, @RequestParam("token") String token) {

        Optional<UserDB> user = emailService.fetchUserByOptToken(token);

        if (user.isPresent()) { // Token found in DB
            modelAndView.addObject("resetToken", token);
        } else { // Token not found in DB
            modelAndView.addObject("errorMessage", "Oops!  This is an invalid password reset link.");
        }

        modelAndView.setViewName("resetPassword");
        return modelAndView;
    }

    // Process reset password form
    @RequestMapping(value = "/reset", method = RequestMethod.POST)
    public String setNewPassword( @RequestParam Map<String, String> requestParams) {

        // Find the user associated with the reset token
        Optional<UserDB> user = emailService.fetchUserByOptToken(requestParams.get("token"));

        String status="";
        // This should always be non-null but we check just in case
        if (user.isPresent()) {

            UserDB resetUser = user.get();

            LocalDateTime tokenCreationDate = user.get().getTokenCreationDate();
            if (isTokenExpired(tokenCreationDate)) {
                status="Oops! Token Expired.";
                return status;

            }

            // Set new password
            resetUser.setPassword(bcryptEncoder.encode(requestParams.get("password")));

            // Set the reset token to null so it cannot be used again
            resetUser.setToken(null);
            resetUser.setTokenCreationDate(null);

            // Save user
            registrationService.saveUser(resetUser);
            status="You have successfully reset your password.  You may now login.";
            return status;

        } else {
            status="Oops!  This is an invalid password reset link.";
        }

        return status;
    }

    // Going to reset page without a token redirects to login page
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ModelAndView handleMissingParams(MissingServletRequestParameterException ex) {
        return new ModelAndView("redirect:"+loginurl);
    }

    private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

        LocalDateTime now = LocalDateTime.now();
        Duration diff = Duration.between(tokenCreationDate, now);

        return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES;
    }
}
