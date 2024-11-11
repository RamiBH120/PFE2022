package com.example.projetpfesrtb2.GestionBordereauxReglement.model;

import java.time.LocalDate;

public class Reglement {
    private String codePrest,codeActe,refBord,motifLitige,msg;
    private Double codeAff,montActe,montRemb,refBS,tauxRembEnv,tauxRembRecep;
    private LocalDate dateBs,dateRemb ;


    public Reglement(Double codeAff, String codePrest, LocalDate dateBs, String codeActe, Double refBS, String refBord, Double tauxRembEnv,Double tauxRembRecep, String motifLtige, Double montActe, Double montRemb, LocalDate dateRemb, String msg) {
        this.codeAff = codeAff;
        this.codePrest = codePrest;
        this.dateBs = dateBs;
        this.codeActe = codeActe;
        this.refBS = refBS;
        this.refBord = refBord;
        this.tauxRembEnv = tauxRembEnv;
        this.tauxRembRecep = tauxRembRecep;
        this.motifLitige = motifLtige;
        this.montActe = montActe;
        this.montRemb = montRemb;
        this.dateRemb = dateRemb;
        this.msg=msg;
    }

    public Double getCodeAff() {
        return codeAff;
    }

    public void setCodeAff(Double codeAff) {
        this.codeAff = codeAff;
    }

    public String getCodePrest() {
        return codePrest;
    }

    public void setCodePrest(String codePrest) {
        this.codePrest = codePrest;
    }

    public String getCodeActe() {
        return codeActe;
    }

    public void setCodeActe(String codeActe) {
        this.codeActe = codeActe;
    }

    public String getRefBord() {
        return refBord;
    }

    public void setRefBord(String refBord) {
        this.refBord = refBord;
    }

    public String getMotifLitige() {
        return motifLitige;
    }

    public void setMotifLitige(String motifLitige) {
        this.motifLitige = motifLitige;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public Double getMontActe() {
        return montActe;
    }

    public void setMontActe(Double montActe) {
        this.montActe = montActe;
    }

    public Double getMontRemb() {
        return montRemb;
    }

    public void setMontRemb(Double montRemb) {
        this.montRemb = montRemb;
    }

    public Double getRefBS() {
        return refBS;
    }

    public void setRefBS(Double refBS) {
        this.refBS = refBS;
    }

    public Double getTauxRembEnv() {
        return tauxRembEnv;
    }

    public void setTauxRembEnv(Double tauxRembEnv) {
        this.tauxRembEnv = tauxRembEnv;
    }

    public Double getTauxRembRecep() {
        return tauxRembRecep;
    }

    public void setTauxRembRecep(Double tauxRembRecep) {
        this.tauxRembRecep = tauxRembRecep;
    }

    public LocalDate getDateBs() {
        return dateBs;
    }

    public void setDateBs(LocalDate dateBs) {
        this.dateBs = dateBs;
    }

    public LocalDate getDateRemb() {
        return dateRemb;
    }

    public void setDateRemb(LocalDate dateRemb) {
        this.dateRemb = dateRemb;
    }
}
