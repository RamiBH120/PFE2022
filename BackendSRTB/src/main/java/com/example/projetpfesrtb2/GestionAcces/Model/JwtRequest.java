package com.example.projetpfesrtb2.GestionAcces.Model;
import java.io.Serializable;
public class JwtRequest implements Serializable{
    private static final long serialVersionUID = 5926468583005150707L;

    private String matricule;
    private String password;

    //need default constructor for JSON Parsing
    public JwtRequest()
    {

    }

    public JwtRequest(String matricule, String password) {
        this.setMatricule(matricule);
        this.setPassword(password);
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
