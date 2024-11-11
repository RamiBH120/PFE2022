import { Component, OnInit} from '@angular/core';
import Chart from 'chart.js';
import {DashboardService} from "../../../../services/dashboard.service";
import {Bulletinsoin} from "../../../../model/bulletinsoin/bulletinsoin";
import {Agents} from "../../../../model/agent/agent";
import {DatePipe} from "@angular/common";
import {bordereauxEnvoi} from "../../../../model/bordereauxEnvoi/bordereauxEnvoi";
import {BordereauxReglement} from "../../../../model/bordereauxReglement/bordereaux-reglement";
import {Visite} from "../../../../model/visite/visite";
import {MedecinModule} from "../../../../model/medecin/medecin.module";
import {Pharmacie} from "../../../../model/pharmacie/pharmacie";
import {Praticien} from "../../../../model/praticien/praticien";
import {Actemedical} from "../../../../model/actemedical/actemedical";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../../../../../assets/scss/paper-dashboard.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private dashService : DashboardService, private datePipe:DatePipe,
              private titleService: Title) { }

  public canvas : any;
  public canvas2 : any ;
  public canvas3 : any ;
  public canvas4 : any ;
  public ctx;
  public chartColor;
  public chartEmail;
  public charEmail2;
  public ctx2 ;
  public charEmail3 ;
  public ctx3 ;
  public chartEmail4;
  public ctx4;
  public chartHours;
  public date : Date = new Date() ;

  ngOnInit() {

    this.titleService.setTitle('Dashboard');
    this.transformDate();
    this.listFullCurentYear = [] ;
    this.listBullAllMonthJanvier = [] ;
    this.listBullAllMonthFevrier = [] ;
    this.listBullAllMonthMars = [] ;
    this.listBullAllMonthAvril = [] ;
    this.listBullAllMonthMai = [] ;
    this.listBullAllMonthJuin = [] ;
    this.listBullAllMonthJuillet = [] ;
    this.listBullAllMonthAout = [] ;
    this.listBullAllMonthSeptembre = [] ;
    this.listBullAllMonthOctobre = [] ;
    this.listBullAllMonthNovembre = [] ;
    this.listBullAllMonthDecembre = [] ;
    this.dashService.getAllBulletinSoins().subscribe(response => {
      this.listFullCurentYear = this.getArrayForFullYear(response);
      this.listBullAllMonthJanvier = this.getArrayForFullCurentYearAndMonthJanvier(response);
      this.listBullAllMonthFevrier = this.getArrayForFullCurentYearAndMonthFevrier(response);
      this.listBullAllMonthMars = this.getArrayForFullCurentYearAndMonthMars(response);
      this.listBullAllMonthAvril = this.getArrayForFullCurentYearAndMonthAvril(response);
      this.listBullAllMonthMai = this.getArrayForFullCurentYearAndMonthMai(response);
      this.listBullAllMonthJuin = this.getArrayForFullCurentYearAndMonthJuin(response);
      this.listBullAllMonthJuillet = this.getArrayForFullCurentYearAndMonthJuillet(response);
      this.listBullAllMonthAout = this.getArrayForFullCurentYearAndMonthAout(response);
      this.listBullAllMonthSeptembre = this.getArrayForFullCurentYearAndMonthSeptem(response);
      this.listBullAllMonthOctobre = this.getArrayForFullCurentYearAndMonthOctobre(response);
      this.listBullAllMonthNovembre = this.getArrayForFullCurentYearAndMonthNovembre(response);
      this.listBullAllMonthDecembre = this.getArrayForFullCurentYearAndMonthDecembre(response);
      let lii = true ;
      if (lii==true){
        this.listFullCurentYear = [] ;
        this.listBullAllMonthJanvierNonRapp = [] ;
        this.listBullAllMonthFevrierNonRapp = [] ;
        this.listBullAllMonthMarsNonRapp = [] ;
        this.listBullAllMonthAvrilNonRapp = [] ;
        this.listBullAllMonthMaiNonRapp = [] ;
        this.listBullAllMonthJuinNonRapp = [] ;
        this.listBullAllMonthJuilletNonRapp = [] ;
        this.listBullAllMonthAoutNonRapp = [] ;
        this.listBullAllMonthSeptembreNonRapp = [] ;
        this.listBullAllMonthOctobreNonRapp = [] ;
        this.listBullAllMonthNovembreNonRapp = [] ;
        this.listBullAllMonthDecembreNonRapp = [] ;
        this.dashService.getAllBulletinSoins().subscribe(response => {
          this.listFullCurentYearNonRapp = this.getArrayForFullYear(response);
          this.listBullAllMonthJanvierNonRapp = this.getArrayForFullCurentYearAndMonthJanvier(response);

          this.listBullAllMonthJanvierNonRapp = this.listBullAllMonthJanvierNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthFevrierNonRapp = this.getArrayForFullCurentYearAndMonthFevrier(response);

          this.listBullAllMonthFevrierNonRapp = this.listBullAllMonthFevrierNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthMarsNonRapp = this.getArrayForFullCurentYearAndMonthMars(response);

          this.listBullAllMonthMarsNonRapp = this.listBullAllMonthMarsNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthAvrilNonRapp = this.getArrayForFullCurentYearAndMonthAvril(response);

          this.listBullAllMonthAvrilNonRapp = this.listBullAllMonthAvrilNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null
            }
          })

          this.listBullAllMonthMaiNonRapp = this.getArrayForFullCurentYearAndMonthMai(response);

          this.listBullAllMonthMaiNonRapp = this.listBullAllMonthMaiNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthJuinNonRapp = this.getArrayForFullCurentYearAndMonthJuin(response);

          this.listBullAllMonthJuinNonRapp = this.listBullAllMonthJuinNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthJuilletNonRapp = this.getArrayForFullCurentYearAndMonthJuillet(response);


          this.listBullAllMonthJuilletNonRapp = this.listBullAllMonthJuilletNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthAoutNonRapp = this.getArrayForFullCurentYearAndMonthAout(response);

          this.listBullAllMonthAoutNonRapp = this.listBullAllMonthAoutNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthSeptembreNonRapp = this.getArrayForFullCurentYearAndMonthSeptem(response);

          this.listBullAllMonthSeptembreNonRapp = this.listBullAllMonthSeptembreNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthOctobreNonRapp = this.getArrayForFullCurentYearAndMonthOctobre(response);

          this.listBullAllMonthOctobreNonRapp = this.listBullAllMonthOctobreNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthNovembreNonRapp = this.getArrayForFullCurentYearAndMonthNovembre(response);

          this.listBullAllMonthNovembreNonRapp = this.listBullAllMonthNovembreNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          this.listBullAllMonthDecembreNonRapp = this.getArrayForFullCurentYearAndMonthDecembre(response);

          this.listBullAllMonthDecembreNonRapp = this.listBullAllMonthDecembreNonRapp.filter(value => {
            if (value.bordereauxReglement == null){
              return value ;
            }
            else {
              return null;
            }
          })

          let loo = true ;
          if (loo==true){
            this.listFullCurentYear = [] ;
            this.listBullAllMonthJanvierRapp = [] ;
            this.listBullAllMonthFevrierRapp = [] ;
            this.listBullAllMonthMarsRapp = [] ;
            this.listBullAllMonthAvrilRapp = [] ;
            this.listBullAllMonthMaiRapp = [] ;
            this.listBullAllMonthJuinRapp = [] ;
            this.listBullAllMonthJuilletRapp = [] ;
            this.listBullAllMonthAoutRapp = [] ;
            this.listBullAllMonthSeptembreRapp = [] ;
            this.listBullAllMonthOctobreRapp = [] ;
            this.listBullAllMonthNovembreRapp = [] ;
            this.listBullAllMonthDecembreRapp = [] ;
            this.dashService.getAllBulletinSoins().subscribe(response => {
              this.listFullCurentYearRapp = this.getArrayForFullYear(response);
              this.listBullAllMonthJanvierRapp = this.getArrayForFullCurentYearAndMonthJanvier(response);

              this.listBullAllMonthJanvierRapp = this.listBullAllMonthJanvierRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthFevrierRapp = this.getArrayForFullCurentYearAndMonthFevrier(response);

              this.listBullAllMonthFevrierRapp = this.listBullAllMonthFevrierRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthMarsRapp = this.getArrayForFullCurentYearAndMonthMars(response);

              this.listBullAllMonthMarsRapp = this.listBullAllMonthMarsRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthAvrilRapp = this.getArrayForFullCurentYearAndMonthAvril(response);

              this.listBullAllMonthAvrilRapp = this.listBullAllMonthAvrilRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthMaiRapp = this.getArrayForFullCurentYearAndMonthMai(response);

              this.listBullAllMonthMaiRapp = this.listBullAllMonthMaiRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthJuinRapp = this.getArrayForFullCurentYearAndMonthJuin(response);

              this.listBullAllMonthJuinRapp = this.listBullAllMonthJuinRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthJuilletRapp = this.getArrayForFullCurentYearAndMonthJuillet(response);


              this.listBullAllMonthJuilletRapp = this.listBullAllMonthJuilletRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthAoutRapp = this.getArrayForFullCurentYearAndMonthAout(response);

              this.listBullAllMonthAoutRapp = this.listBullAllMonthAoutRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthSeptembreRapp = this.getArrayForFullCurentYearAndMonthSeptem(response);

              this.listBullAllMonthSeptembreRapp = this.listBullAllMonthSeptembreRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthOctobreRapp = this.getArrayForFullCurentYearAndMonthOctobre(response);

              this.listBullAllMonthOctobreRapp = this.listBullAllMonthOctobreRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthNovembreRapp = this.getArrayForFullCurentYearAndMonthNovembre(response);

              this.listBullAllMonthNovembreRapp = this.listBullAllMonthNovembreRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              this.listBullAllMonthDecembreRapp = this.getArrayForFullCurentYearAndMonthDecembre(response);

              this.listBullAllMonthDecembreRapp = this.listBullAllMonthDecembreRapp.filter(value => {
                if (value.bordereauxReglement != null){
                  return value ;
                }
                else {
                  return null;
                }
              })

              let lopo = true ;
              if (lopo == true){
                this.listAdmin = [] ;
                this.listExploi = [] ;
                this.listeAgents = 0.0 ;
                this.dashService.getAgents().subscribe(response=>{
                  this.listeAgents = response.length ;
                  this.listAdmin = this.getAgAdmin(response);
                  this.listExploi = this.getAgExploi(response);
                  let ro = true ;
                  if (ro == true){
                    this.listeBord = [];
                    this.dashService.getBordereauxEnvoiall().subscribe(response=>{
                      this.listeBord = this.getBordFullCurentYear(response) ;
                      let yo = true;
                      if (yo==true){
                        this.dashService.getBordereauxReglementall().subscribe(reponse=>{
                          this.listeReg = this.getRegFullCurentYear(reponse) ;
                          this.listeRevenueReg = this.getRevenueReg(reponse);
                          let ee = true ;
                          if (ee==true){
                            this.revenue = 0.0 ;
                            this.dashService.getAllBulletinSoins().subscribe(response=>{
                              this.revenue = this.getArrayRevenue(response);
                              let tt = true ;
                              if (tt == true){
                                this.listAgence = 0.0;
                                this.dashService.getAllAgence().subscribe(response=> {
                                  this.listAgence = response.length;
                                  let gg = true;
                                  if (gg == true) {
                                    this.medecin = 0.0 ;
                                    this.dashService.getMedecinall().subscribe((respo:MedecinModule[])=>{
                                      this.medecin = respo.length ;
                                      let ii = true ;
                                      if (ii == true) {
                                        this.pharmacie = 0.0;
                                        this.dashService.getPharmacies().subscribe((respo: Pharmacie[]) => {
                                          this.pharmacie = respo.length;
                                          let rr = true;
                                          if (rr == true) {
                                            this.praticien = 0.0 ;
                                            this.dashService.getPraticienall().subscribe((respo:Praticien[]) => {
                                              this.praticien = respo.length ;
                                              let kk = true ;
                                              if(kk == true){
                                                this.acteMedical = 0.0 ;
                                                this.dashService.getActemedicals().subscribe((respo : Actemedical[]) => {
                                                  this.acteMedical = respo.length ;
                                                  let uu  = true ;
                                                  if (uu == true){

                                        this.listBullAllMonthJanvierVisite = [];
                                        this.listBullAllMonthFevrierVisite = [];
                                        this.listBullAllMonthMarsVisite = [];
                                        this.listBullAllMonthAvrilVisite = [];
                                        this.listBullAllMonthMaiVisite = [];
                                        this.listBullAllMonthJuinVisite = [];
                                        this.listBullAllMonthJuilletVisite = [];
                                        this.listBullAllMonthAoutVisite = [];
                                        this.listBullAllMonthSeptembreVisite = [];
                                        this.listBullAllMonthOctobreVisite = [];
                                        this.listBullAllMonthNovembreVisite = [];
                                        this.listBullAllMonthDecembreVisite = [];

                                        this.listBullAllMonthJanvierVisite1 = [];
                                        this.listBullAllMonthFevrierVisite1 = [];
                                        this.listBullAllMonthMarsVisite1 = [];
                                        this.listBullAllMonthAvrilVisite1 = [];
                                        this.listBullAllMonthMaiVisite1 = [];
                                        this.listBullAllMonthJuinVisite1 = [];
                                        this.listBullAllMonthJuilletVisite1 = [];
                                        this.listBullAllMonthAoutVisite1 = [];
                                        this.listBullAllMonthSeptembreVisite1 = [];
                                        this.listBullAllMonthOctobreVisite1 = [];
                                        this.listBullAllMonthNovembreVisite1 = [];
                                        this.listBullAllMonthDecembreVisite1 = [];

                                        this.listeNonZoneRouge = [];
                                        this.listZoneRouge = [];

                                        this.listTrueVisite = [];
                                        this.listFalseVisite = [];
                                        this.dashService.getAllVisite().subscribe(response => {
                                          // this.listFullCurentYearVisite = this.getArrayFor(response);
                                          this.listBullAllMonthJanvierVisite = this.getArrayForFullCurentYearAndMonthJanvierVisite(response);
                                          this.listBullAllMonthFevrierVisite = this.getArrayForFullCurentYearAndMonthFevrierVisite(response);
                                          this.listBullAllMonthMarsVisite = this.getArrayForFullCurentYearAndMonthMarsVisite(response);
                                          this.listBullAllMonthAvrilVisite = this.getArrayForFullCurentYearAndMonthAvrilVisite(response);
                                          this.listBullAllMonthMaiVisite = this.getArrayForFullCurentYearAndMonthMaiVisite(response);
                                          this.listBullAllMonthJuinVisite = this.getArrayForFullCurentYearAndMonthJuinVisite(response);
                                          this.listBullAllMonthJuilletVisite = this.getArrayForFullCurentYearAndMonthJuilletVisite(response);
                                          this.listBullAllMonthAoutVisite = this.getArrayForFullCurentYearAndMonthAoutVisite(response);
                                          this.listBullAllMonthSeptembreVisite = this.getArrayForFullCurentYearAndMonthSeptemVisite(response);
                                          this.listBullAllMonthOctobreVisite = this.getArrayForFullCurentYearAndMonthOctobreVisite(response);
                                          this.listBullAllMonthNovembreVisite = this.getArrayForFullCurentYearAndMonthNovembreVisite(response);
                                          this.listBullAllMonthDecembreVisite = this.getArrayForFullCurentYearAndMonthDecembreVisite(response);

                                          this.listBullAllMonthJanvierVisite1 = this.getArrayForFullCurentYearAndMonthJanvierVisite1(response);
                                          this.listBullAllMonthFevrierVisite1 = this.getArrayForFullCurentYearAndMonthFevrierVisite1(response);
                                          this.listBullAllMonthMarsVisite1 = this.getArrayForFullCurentYearAndMonthMarsVisite1(response);
                                          this.listBullAllMonthAvrilVisite1 = this.getArrayForFullCurentYearAndMonthAvrilVisite1(response);
                                          this.listBullAllMonthMaiVisite1 = this.getArrayForFullCurentYearAndMonthMaiVisite1(response);
                                          this.listBullAllMonthJuinVisite1 = this.getArrayForFullCurentYearAndMonthJuinVisite1(response);
                                          this.listBullAllMonthJuilletVisite1 = this.getArrayForFullCurentYearAndMonthJuilletVisite1(response);
                                          this.listBullAllMonthAoutVisite1 = this.getArrayForFullCurentYearAndMonthAoutVisite1(response);
                                          this.listBullAllMonthSeptembreVisite1 = this.getArrayForFullCurentYearAndMonthSeptemVisite1(response);
                                          this.listBullAllMonthOctobreVisite1 = this.getArrayForFullCurentYearAndMonthOctobreVisite1(response);
                                          this.listBullAllMonthNovembreVisite1 = this.getArrayForFullCurentYearAndMonthNovembreVisite1(response);
                                          this.listBullAllMonthDecembreVisite1 = this.getArrayForFullCurentYearAndMonthDecembreVisite1(response);

                                          this.listeNonZoneRouge = this.getAgentNonZoneRouge(response);
                                          this.listZoneRouge = this.getAgentZoneRouge(response);

                                          this.listTrueVisite = this.getVisiteTrue(response);
                                          this.listFalseVisite = this.getVisiteFalse(response);

                                          let tt = true
                                          if (tt == true) {
                                            this.chartColor = "#FFFFFF";

                                            this.canvas = document.getElementById("chartHours");
                                            this.ctx = this.canvas.getContext("2d");

                                            this.chartHours = new Chart(this.ctx, {
                                              type: 'line',

                                              data: {
                                                labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                                                datasets: [{
                                                  borderColor: "#6bd098",
                                                  backgroundColor: "#6bd098",
                                                  pointRadius: 0,
                                                  pointHoverRadius: 0,
                                                  borderWidth: 3,
                                                  data: [this.listBullAllMonthJanvier.length, this.listBullAllMonthFevrier.length
                                                    , this.listBullAllMonthMars.length, this.listBullAllMonthAvril.length, this.listBullAllMonthMai.length,
                                                    this.listBullAllMonthJuin.length, this.listBullAllMonthJuillet.length, this.listBullAllMonthAout.length,
                                                    this.listBullAllMonthSeptembre.length, this.listBullAllMonthOctobre.length, this.listBullAllMonthNovembre.length,
                                                    this.listBullAllMonthDecembre.length]
                                                },
                                                  {
                                                    borderColor: "#f17e5d",
                                                    backgroundColor: "#f17e5d",
                                                    pointRadius: 0,
                                                    pointHoverRadius: 0,
                                                    borderWidth: 3,
                                                    data: []
                                                  },
                                                  {
                                                    borderColor: "#fcc468",
                                                    backgroundColor: "#fcc468",
                                                    pointRadius: 0,
                                                    pointHoverRadius: 0,
                                                    borderWidth: 3,
                                                    data: []
                                                  }
                                                ]
                                              },
                                              options: {
                                                legend: {
                                                  display: false
                                                },

                                                tooltips: {
                                                  enabled: false
                                                },

                                                scales: {
                                                  yAxes: [{

                                                    ticks: {
                                                      fontColor: "#9f9f9f",
                                                      beginAtZero: false,
                                                      maxTicksLimit: 5,
                                                      //padding: 20
                                                    },
                                                    gridLines: {
                                                      drawBorder: false,
                                                      zeroLineColor: "#ccc",
                                                      color: 'rgba(255,255,255,0.05)'
                                                    }

                                                  }],

                                                  xAxes: [{
                                                    barPercentage: 1.6,
                                                    gridLines: {
                                                      drawBorder: false,
                                                      color: 'rgba(255,255,255,0.1)',
                                                      zeroLineColor: "transparent",
                                                      display: false,
                                                    },
                                                    ticks: {
                                                      padding: 20,
                                                      fontColor: "#9f9f9f"
                                                    }
                                                  }]
                                                },
                                              }
                                            });

                                            this.canvas2 = document.getElementById("chartEmail2");
                                            this.ctx2 = this.canvas2.getContext("2d");
                                            this.charEmail2 = new Chart(this.ctx2, {
                                              type: 'pie',
                                              data: {
                                                labels: [1, 2],
                                                datasets: [{
                                                  label: "Bord",
                                                  pointRadius: 0,
                                                  pointHoverRadius: 0,
                                                  backgroundColor: [
                                                    '#e3e3e3',
                                                    '#fcc468',
                                                    '#e3e3e3',
                                                    '#4acccd',
                                                    '#ef8157',
                                                    '#6bd098'
                                                  ],
                                                  borderWidth: 0,
                                                  data: [this.listeBord.length, this.listeReg.length]
                                                }]
                                              },

                                              options: {

                                                legend: {
                                                  display: false
                                                },

                                                pieceLabel: {
                                                  render: 'percentage',
                                                  fontColor: ['white'],
                                                  precision: 2
                                                },

                                                tooltips: {
                                                  enabled: false
                                                },

                                                scales: {
                                                  yAxes: [{

                                                    ticks: {
                                                      display: false
                                                    },
                                                    gridLines: {
                                                      drawBorder: false,
                                                      zeroLineColor: "transparent",
                                                      color: 'rgba(255,255,255,0.05)'
                                                    }

                                                  }],

                                                  xAxes: [{
                                                    barPercentage: 1.6,
                                                    gridLines: {
                                                      drawBorder: false,
                                                      color: 'rgba(255,255,255,0.1)',
                                                      zeroLineColor: "transparent"
                                                    },
                                                    ticks: {
                                                      display: false,
                                                    }
                                                  }]
                                                },
                                              }
                                            });


                                            this.canvas3 = document.getElementById("chartEmail3");
                                            this.ctx3 = this.canvas3.getContext("2d");
                                            this.charEmail3 = new Chart(this.ctx3, {
                                              type: 'pie',
                                              data: {
                                                labels: [1, 2],
                                                datasets: [{
                                                  label: "Bord",
                                                  pointRadius: 0,
                                                  pointHoverRadius: 0,
                                                  backgroundColor: [

                                                    '#e3e3e3',
                                                    '#ef8157',
                                                    '#fcc468',
                                                    '#e3e3e3',
                                                    '#4acccd',
                                                    '#6bd098'
                                                  ],
                                                  borderWidth: 0,
                                                  data: [this.listeNonZoneRouge.length, this.listZoneRouge.length]
                                                }]
                                              },

                                              options: {

                                                legend: {
                                                  display: false
                                                },

                                                pieceLabel: {
                                                  render: 'percentage',
                                                  fontColor: ['white'],
                                                  precision: 2
                                                },

                                                tooltips: {
                                                  enabled: false
                                                },

                                                scales: {
                                                  yAxes: [{

                                                    ticks: {
                                                      display: false
                                                    },
                                                    gridLines: {
                                                      drawBorder: false,
                                                      zeroLineColor: "transparent",
                                                      color: 'rgba(255,255,255,0.05)'
                                                    }

                                                  }],

                                                  xAxes: [{
                                                    barPercentage: 1.6,
                                                    gridLines: {
                                                      drawBorder: false,
                                                      color: 'rgba(255,255,255,0.1)',
                                                      zeroLineColor: "transparent"
                                                    },
                                                    ticks: {
                                                      display: false,
                                                    }
                                                  }]
                                                },
                                              }
                                            });

                                            this.canvas4 = document.getElementById("chartEmail4");
                                            this.ctx4 = this.canvas4.getContext("2d");
                                            this.chartEmail4 = new Chart(this.ctx4, {
                                              type: 'pie',
                                              data: {
                                                labels: [1, 2],
                                                datasets: [{
                                                  label: "Bord",
                                                  pointRadius: 0,
                                                  pointHoverRadius: 0,
                                                  backgroundColor: [

                                                    '#6bd098',
                                                    '#e3e3e3',
                                                    '#ef8157',
                                                    '#fcc468',
                                                    '#e3e3e3',
                                                    '#4acccd',
                                                    '#6bd098'
                                                  ],
                                                  borderWidth: 0,
                                                  data: [this.listTrueVisite.length, this.listFalseVisite.length]
                                                }]
                                              },

                                              options: {

                                                legend: {
                                                  display: false
                                                },

                                                pieceLabel: {
                                                  render: 'percentage',
                                                  fontColor: ['white'],
                                                  precision: 2
                                                },

                                                tooltips: {
                                                  enabled: false
                                                },

                                                scales: {
                                                  yAxes: [{

                                                    ticks: {
                                                      display: false
                                                    },
                                                    gridLines: {
                                                      drawBorder: false,
                                                      zeroLineColor: "transparent",
                                                      color: 'rgba(255,255,255,0.05)'
                                                    }

                                                  }],

                                                  xAxes: [{
                                                    barPercentage: 1.6,
                                                    gridLines: {
                                                      drawBorder: false,
                                                      color: 'rgba(255,255,255,0.1)',
                                                      zeroLineColor: "transparent"
                                                    },
                                                    ticks: {
                                                      display: false,
                                                    }
                                                  }]
                                                },
                                              }
                                            });

                                            var speedCanvas = document.getElementById("speedChart");

                                            var dataFirst = {
                                              data: [this.listBullAllMonthJanvierNonRapp.length, this.listBullAllMonthFevrierNonRapp.length
                                                , this.listBullAllMonthMarsNonRapp.length, this.listBullAllMonthAvrilNonRapp.length, this.listBullAllMonthMaiNonRapp.length,
                                                this.listBullAllMonthJuinNonRapp.length, this.listBullAllMonthJuilletNonRapp.length, this.listBullAllMonthAoutNonRapp.length,
                                                this.listBullAllMonthSeptembreNonRapp.length, this.listBullAllMonthOctobreNonRapp.length, this.listBullAllMonthNovembreNonRapp.length,
                                                this.listBullAllMonthDecembreNonRapp.length],
                                              fill: false,
                                              borderColor: '#fbc658',
                                              backgroundColor: 'transparent',
                                              pointBorderColor: '#fbc658',
                                              pointRadius: 4,
                                              pointHoverRadius: 4,
                                              pointBorderWidth: 8,
                                            };

                                            var dataSecond = {
                                              data: [this.listBullAllMonthJanvierRapp.length, this.listBullAllMonthFevrierRapp.length
                                                , this.listBullAllMonthMarsRapp.length, this.listBullAllMonthAvrilRapp.length, this.listBullAllMonthMaiRapp.length,
                                                this.listBullAllMonthJuinRapp.length, this.listBullAllMonthJuilletRapp.length, this.listBullAllMonthAoutRapp.length,
                                                this.listBullAllMonthSeptembreRapp.length, this.listBullAllMonthOctobreRapp.length, this.listBullAllMonthNovembreRapp.length,
                                                this.listBullAllMonthDecembreRapp.length],
                                              fill: false,
                                              borderColor: '#51CACF',
                                              backgroundColor: 'transparent',
                                              pointBorderColor: '#51CACF',
                                              pointRadius: 4,
                                              pointHoverRadius: 4,
                                              pointBorderWidth: 8
                                            };

                                            var speedData = {
                                              labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                                              datasets: [dataFirst, dataSecond]
                                            };

                                            var chartOptions = {
                                              legend: {
                                                display: false,
                                                position: 'top'
                                              }
                                            };
                                            new Chart(speedCanvas, {
                                              type: 'line',
                                              hover: false,
                                              data: speedData,
                                              options: chartOptions
                                            });
                                            var speedCanvas2 = document.getElementById("speedChart2");

                                            var dataFirst2 = {
                                              data: [this.listBullAllMonthJanvierVisite.length, this.listBullAllMonthFevrierVisite.length
                                                , this.listBullAllMonthMarsVisite.length, this.listBullAllMonthAvrilVisite.length, this.listBullAllMonthMaiVisite.length,
                                                this.listBullAllMonthJuinVisite.length, this.listBullAllMonthJuilletVisite.length, this.listBullAllMonthAoutVisite.length,
                                                this.listBullAllMonthSeptembreVisite.length, this.listBullAllMonthOctobreVisite.length, this.listBullAllMonthNovembreVisite.length,
                                                this.listBullAllMonthDecembreVisite.length],
                                              fill: false,
                                              borderColor: '#6bd098',
                                              backgroundColor: 'transparent',
                                              pointBorderColor: '#6bd098',
                                              pointRadius: 4,
                                              pointHoverRadius: 4,
                                              pointBorderWidth: 8,
                                            };

                                            var dataSecond2 = {
                                              data: [this.listBullAllMonthJanvierVisite1.length, this.listBullAllMonthFevrierVisite1.length
                                                , this.listBullAllMonthMarsVisite1.length, this.listBullAllMonthAvrilVisite1.length, this.listBullAllMonthMaiVisite1.length,
                                                this.listBullAllMonthJuinVisite1.length, this.listBullAllMonthJuilletVisite1.length, this.listBullAllMonthAoutVisite1.length,
                                                this.listBullAllMonthSeptembreVisite1.length, this.listBullAllMonthOctobreVisite1.length, this.listBullAllMonthNovembreVisite1.length,
                                                this.listBullAllMonthDecembreVisite1.length],
                                              fill: false,
                                              borderColor: '#ef8157',
                                              backgroundColor: 'transparent',
                                              pointBorderColor: '#ef8157',
                                              pointRadius: 4,
                                              pointHoverRadius: 4,
                                              pointBorderWidth: 8
                                            };

                                            var speedData2 = {
                                              labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
                                              datasets: [dataFirst2, dataSecond2]
                                            };

                                            var chartOptions2 = {
                                              legend: {
                                                display: false,
                                                position: 'top'
                                              }
                                            };
                                            new Chart(speedCanvas2, {
                                              type: 'line',
                                              hover: false,
                                              data: speedData2,
                                              options: chartOptions2
                                            });
                                          }
                                        })
                                                  }
                                            })
                                          }
                                        })
                                      }
                                      });
                                    }
                                  })
                                }
                                })
                              }

                            })
                          }
                        })
                      }
                    });
                  }
                })
              }
            });
          }
        });
      }
    });

  }



  listBullAllMonthJanvier : Bulletinsoin[] = [] ;
  listBullAllMonthFevrier : Bulletinsoin[] = [] ;
  listBullAllMonthMars : Bulletinsoin[] = [] ;
  listBullAllMonthAvril : Bulletinsoin[] = [] ;
  listBullAllMonthMai : Bulletinsoin[] = [] ;
  listBullAllMonthJuin : Bulletinsoin[] = [] ;
  listBullAllMonthJuillet : Bulletinsoin[] = [] ;
  listBullAllMonthAout : Bulletinsoin[] = [] ;
  listBullAllMonthSeptembre : Bulletinsoin[] = [] ;
  listBullAllMonthOctobre : Bulletinsoin[] = [] ;
  listBullAllMonthNovembre : Bulletinsoin[] = [] ;
  listBullAllMonthDecembre : Bulletinsoin[] = [] ;
  listFullCurentYear : Bulletinsoin[] = [] ;
  lii : boolean = false ;
  getArrayForFullYear(v:Bulletinsoin[]):Bulletinsoin[]{
    let listBullAll : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear()){
        listBullAll.push(value);
      }
    });
    return listBullAll ;
  }


  getArrayForFullCurentYearAndMonthJanvier(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin [] = [];
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 0){
        list.push(value);
      }
    });
      return list ;
  }

  getArrayForFullCurentYearAndMonthFevrier(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 1){
        list.push(value);
      }
    });
      return list ;
  }

  getArrayForFullCurentYearAndMonthMars(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 2){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthAvril(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 3){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthMai(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 4){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthJuin(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 5){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthJuillet(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 6){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthAout(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 7){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthSeptem(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 8){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthOctobre(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 9){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthNovembre(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 10){
        list.push(value);
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthDecembre(v:Bulletinsoin[]):Bulletinsoin[]{
    let list : Bulletinsoin[] = [] ;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear() && (new Date(value.datebs)).getMonth() == 11){
        list.push(value);
      }
    });
    return list ;
  }



  listBullAllMonthJanvierNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthFevrierNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthMarsNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthAvrilNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthMaiNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthJuinNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthJuilletNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthAoutNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthSeptembreNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthOctobreNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthNovembreNonRapp : Bulletinsoin[] = [] ;
  listBullAllMonthDecembreNonRapp : Bulletinsoin[] = [] ;
  listFullCurentYearNonRapp : Bulletinsoin[] = [] ;

  getAllBulletinNonRapp(){
    this.listFullCurentYear = [] ;
    this.listBullAllMonthJanvierNonRapp = [] ;
    this.listBullAllMonthFevrierNonRapp = [] ;
    this.listBullAllMonthMarsNonRapp = [] ;
    this.listBullAllMonthAvrilNonRapp = [] ;
    this.listBullAllMonthMaiNonRapp = [] ;
    this.listBullAllMonthJuinNonRapp = [] ;
    this.listBullAllMonthJuilletNonRapp = [] ;
    this.listBullAllMonthAoutNonRapp = [] ;
    this.listBullAllMonthSeptembreNonRapp = [] ;
    this.listBullAllMonthOctobreNonRapp = [] ;
    this.listBullAllMonthNovembreNonRapp = [] ;
    this.listBullAllMonthDecembreNonRapp = [] ;
    this.dashService.getAllBulletinSoins().subscribe(response => {
      this.listFullCurentYearNonRapp = this.getArrayForFullYear(response);
      this.listBullAllMonthJanvierNonRapp = this.getArrayForFullCurentYearAndMonthJanvier(response);

      this.listBullAllMonthJanvierNonRapp = this.listBullAllMonthJanvierNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthFevrierNonRapp = this.getArrayForFullCurentYearAndMonthFevrier(response);

      this.listBullAllMonthFevrierNonRapp = this.listBullAllMonthFevrierNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthMarsNonRapp = this.getArrayForFullCurentYearAndMonthMars(response);

      this.listBullAllMonthMarsNonRapp = this.listBullAllMonthMarsNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthAvrilNonRapp = this.getArrayForFullCurentYearAndMonthAvril(response);

      this.listBullAllMonthAvrilNonRapp = this.listBullAllMonthAvrilNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthMaiNonRapp = this.getArrayForFullCurentYearAndMonthMai(response);

      this.listBullAllMonthMaiNonRapp = this.listBullAllMonthMaiNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthJuinNonRapp = this.getArrayForFullCurentYearAndMonthJuin(response);

      this.listBullAllMonthJuinNonRapp = this.listBullAllMonthJuinNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthJuilletNonRapp = this.getArrayForFullCurentYearAndMonthJuillet(response);


      this.listBullAllMonthJuilletNonRapp = this.listBullAllMonthJuilletNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthAoutNonRapp = this.getArrayForFullCurentYearAndMonthAout(response);

      this.listBullAllMonthAoutNonRapp = this.listBullAllMonthAoutNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthSeptembreNonRapp = this.getArrayForFullCurentYearAndMonthSeptem(response);

      this.listBullAllMonthSeptembreNonRapp = this.listBullAllMonthSeptembreNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthOctobreNonRapp = this.getArrayForFullCurentYearAndMonthOctobre(response);

      this.listBullAllMonthOctobreNonRapp = this.listBullAllMonthOctobreNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthNovembreNonRapp = this.getArrayForFullCurentYearAndMonthNovembre(response);

      this.listBullAllMonthNovembreNonRapp = this.listBullAllMonthNovembreNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthDecembreNonRapp = this.getArrayForFullCurentYearAndMonthDecembre(response);

      this.listBullAllMonthDecembreNonRapp = this.listBullAllMonthDecembreNonRapp.filter(value => {
        if (value.bordereauxReglement == null){
          return value ;
        }
        else {
          return null
        }
      })
    });
  }




  listBullAllMonthJanvierRapp : Bulletinsoin[] = [] ;
  listBullAllMonthFevrierRapp : Bulletinsoin[] = [] ;
  listBullAllMonthMarsRapp : Bulletinsoin[] = [] ;
  listBullAllMonthAvrilRapp : Bulletinsoin[] = [] ;
  listBullAllMonthMaiRapp : Bulletinsoin[] = [] ;
  listBullAllMonthJuinRapp : Bulletinsoin[] = [] ;
  listBullAllMonthJuilletRapp : Bulletinsoin[] = [] ;
  listBullAllMonthAoutRapp : Bulletinsoin[] = [] ;
  listBullAllMonthSeptembreRapp : Bulletinsoin[] = [] ;
  listBullAllMonthOctobreRapp : Bulletinsoin[] = [] ;
  listBullAllMonthNovembreRapp : Bulletinsoin[] = [] ;
  listBullAllMonthDecembreRapp : Bulletinsoin[] = [] ;
  listFullCurentYearRapp : Bulletinsoin[] = [] ;


  getAllBulletinRapp(){
    this.listFullCurentYear = [] ;
    this.listBullAllMonthJanvierRapp = [] ;
    this.listBullAllMonthFevrierRapp = [] ;
    this.listBullAllMonthMarsRapp = [] ;
    this.listBullAllMonthAvrilRapp = [] ;
    this.listBullAllMonthMaiRapp = [] ;
    this.listBullAllMonthJuinRapp = [] ;
    this.listBullAllMonthJuilletRapp = [] ;
    this.listBullAllMonthAoutRapp = [] ;
    this.listBullAllMonthSeptembreRapp = [] ;
    this.listBullAllMonthOctobreRapp = [] ;
    this.listBullAllMonthNovembreRapp = [] ;
    this.listBullAllMonthDecembreRapp = [] ;
    this.dashService.getAllBulletinSoins().subscribe(response => {
      this.listFullCurentYearRapp = this.getArrayForFullYear(response);
      this.listBullAllMonthJanvierRapp = this.getArrayForFullCurentYearAndMonthJanvier(response);

      this.listBullAllMonthJanvierRapp = this.listBullAllMonthJanvierRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthFevrierRapp = this.getArrayForFullCurentYearAndMonthFevrier(response);

      this.listBullAllMonthFevrierRapp = this.listBullAllMonthFevrierRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthMarsRapp = this.getArrayForFullCurentYearAndMonthMars(response);

      this.listBullAllMonthMarsRapp = this.listBullAllMonthMarsRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthAvrilRapp = this.getArrayForFullCurentYearAndMonthAvril(response);

      this.listBullAllMonthAvrilRapp = this.listBullAllMonthAvrilRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthMaiRapp = this.getArrayForFullCurentYearAndMonthMai(response);

      this.listBullAllMonthMaiRapp = this.listBullAllMonthMaiRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthJuinRapp = this.getArrayForFullCurentYearAndMonthJuin(response);

      this.listBullAllMonthJuinRapp = this.listBullAllMonthJuinRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthJuilletRapp = this.getArrayForFullCurentYearAndMonthJuillet(response);


      this.listBullAllMonthJuilletRapp = this.listBullAllMonthJuilletRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthAoutRapp = this.getArrayForFullCurentYearAndMonthAout(response);

      this.listBullAllMonthAoutRapp = this.listBullAllMonthAoutRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthSeptembreRapp = this.getArrayForFullCurentYearAndMonthSeptem(response);

      this.listBullAllMonthSeptembreRapp = this.listBullAllMonthSeptembreRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthOctobreRapp = this.getArrayForFullCurentYearAndMonthOctobre(response);

      this.listBullAllMonthOctobreRapp = this.listBullAllMonthOctobreRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthNovembreRapp = this.getArrayForFullCurentYearAndMonthNovembre(response);

      this.listBullAllMonthNovembreRapp = this.listBullAllMonthNovembreRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

      this.listBullAllMonthDecembreRapp = this.getArrayForFullCurentYearAndMonthDecembre(response);

      this.listBullAllMonthDecembreRapp = this.listBullAllMonthDecembreRapp.filter(value => {
        if (value.bordereauxReglement != null){
          return value ;
        }
        else {
          return null
        }
      })

    });
  }


  listAdmin : Agents[] =[];
  listExploi : Agents [] = [] ;
  listeAgents:number=0.0;
  getAllAgents(){
    this.listAdmin = [] ;
    this.listExploi = [] ;
    this.listeAgents = 0.0 ;
    this.dashService.getAgents().subscribe(response=>{
      this.listeAgents = response.length ;
      this.listAdmin = this.getAgAdmin(response);
      this.listExploi = this.getAgExploi(response);
    })
  }


  getAgAdmin(v:Agents[]):Agents[]{
    let list : Agents[] = [] ;
    v.forEach(value => {
      if (value.direction == 'Administration'){
        list.push(value);
      }
    });
    return list ;
  }

  getAgExploi(v:Agents[]):Agents[]{
    let list : Agents[] = [] ;
    v.forEach(value => {
      if (value.direction == 'Exploitation'){
        list.push(value);
      }
    });
    return list ;
  }

  revenue : number = 0.0 ;
  getArrayRevenue(v:Bulletinsoin[]):number{
    let list : number = 0.0;
    v.forEach(value => {
      if ((new Date(value.datebs)).getFullYear() == (new Date()).getFullYear()) {
        list += value.sommeTotBull;
      }
    });
    list = Math.round(list*1000)/1000;
    return list ;
  }

  listAgence:number=0.0 ;
  getAllAgence(){
    this.listAgence = 0.0;
    this.dashService.getAllAgence().subscribe(response=>{
      this.listAgence = response.length ;
    })
  }

  dateTransform : string ;
  transformDate():string{
    this.dateTransform = this.datePipe.transform(this.date,'yyyy-MM-dd , H:mm:ss');
    return this.dateTransform ;
  }

  listeBord:bordereauxEnvoi[]=[];
  getBordFullCurentYear(v:bordereauxEnvoi[]):bordereauxEnvoi[]{
    let list : bordereauxEnvoi[] = [] ;
    v.forEach(value => {
      if ((new Date(value.dateDebut)).getFullYear() == (new Date()).getFullYear()){
        list.push(value);
      }
    });
    return list ;
  }

  listeReg:BordereauxReglement[]=[];
  listeRevenueReg : number = 0.0 ;
  getRevenueReg(v:BordereauxReglement[]):number{
    let list : number = 0.0 ;
    v.forEach(value => {
      if ((new Date(value.date)).getFullYear() == (new Date()).getFullYear()){
        list += value.montantreg ;
      }
    });
    list = Math.round(list*1000)/1000;
    return list ;
  }

  getRegFullCurentYear(v:BordereauxReglement[]):BordereauxReglement[]{
    let list : BordereauxReglement[] = [] ;
    v.forEach(value => {
      if ((new Date(value.date)).getFullYear() == (new Date()).getFullYear()){
        list.push(value);
      }
    });
    return list ;
  }

  PorcentageBord():number{
    let nombr : number = 0.0 ;
    nombr = ((this.listeBord.length)/(this.listeBord.length + this.listeReg.length))*100 ;
    nombr = Math.round(nombr*100)/100;
    if (isNaN(nombr)){
      nombr=0.0;
    }
    return nombr ;
  }

  PorcentageBordReg():number{
    let nombr : number = 0.0 ;
    nombr = ((this.listeReg.length)/(this.listeBord.length + this.listeReg.length))*100 ;
    nombr = Math.round(nombr*100)/100;
    if (isNaN(nombr)){
      nombr=0.0;
    }
    return nombr ;
  }
  listBullAllMonthJanvierVisite : Visite[] = [] ;
  listBullAllMonthFevrierVisite : Visite[] = [] ;
  listBullAllMonthMarsVisite : Visite[] = [] ;
  listBullAllMonthAvrilVisite : Visite[] = [] ;
  listBullAllMonthMaiVisite : Visite[] = [] ;
  listBullAllMonthJuinVisite : Visite[] = [] ;
  listBullAllMonthJuilletVisite : Visite[] = [] ;
  listBullAllMonthAoutVisite : Visite[] = [] ;
  listBullAllMonthSeptembreVisite : Visite[] = [] ;
  listBullAllMonthOctobreVisite : Visite[] = [] ;
  listBullAllMonthNovembreVisite : Visite[] = [] ;
  listBullAllMonthDecembreVisite : Visite[] = [] ;
  listFullCurentYearVisite : Visite[] = [] ;

  listBullAllMonthJanvierVisite1 : Visite[] = [] ;
  listBullAllMonthFevrierVisite1 : Visite[] = [] ;
  listBullAllMonthMarsVisite1 : Visite[] = [] ;
  listBullAllMonthAvrilVisite1 : Visite[] = [] ;
  listBullAllMonthMaiVisite1 : Visite[] = [] ;
  listBullAllMonthJuinVisite1 : Visite[] = [] ;
  listBullAllMonthJuilletVisite1 : Visite[] = [] ;
  listBullAllMonthAoutVisite1 : Visite[] = [] ;
  listBullAllMonthSeptembreVisite1 : Visite[] = [] ;
  listBullAllMonthOctobreVisite1 : Visite[] = [] ;
  listBullAllMonthNovembreVisite1 : Visite[] = [] ;
  listBullAllMonthDecembreVisite1 : Visite[] = [] ;
  getArrayForFullCurentYearAndMonthJanvierVisite(v:Visite[]):Visite[]{
    let list : Visite [] = [];
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 0))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthFevrierVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 1))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthMarsVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 2))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthAvrilVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 3))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthMaiVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 4))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthJuinVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 5))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthJuilletVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 6))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthAoutVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 7))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthSeptemVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 8))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthOctobreVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 9))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthNovembreVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 10))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthDecembreVisite(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent==null && value.event!=null) {
        if ((((new Date(value.event)).getFullYear() == (new Date()).getFullYear() && (new Date(value.event)).getMonth() == 11))) {
          list.push(value);
        }
      }
    });
    return list ;
  }




  getArrayForFullCurentYearAndMonthJanvierVisite1(v:Visite[]):Visite[]{
    let list : Visite [] = [];
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 0))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthFevrierVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 1))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthMarsVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 2))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthAvrilVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 3))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthMaiVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 4))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthJuinVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 5))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthJuilletVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 6))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthAoutVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 7))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthSeptemVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 8))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthOctobreVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 9))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthNovembreVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 10))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  getArrayForFullCurentYearAndMonthDecembreVisite1(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.nextEvent!=null && value.event!=null) {
        if ((((new Date(value.nextEvent)).getFullYear() == (new Date()).getFullYear() && (new Date(value.nextEvent)).getMonth() == 11))) {
          list.push(value);
        }
      }
    });
    return list ;
  }

  listZoneRouge : Visite[] = [] ;
  listeNonZoneRouge : Visite[] = [] ;

  getAgentZoneRouge(v:Visite[]):Visite[]{
    let list : Visite[]=[];
    v.forEach(value => {
      if (value.event != null && value.nextEvent!=null){
        var dt = new Date(value.event);
        var month = dt.getMonth();
        var year = dt.getFullYear();
        new Date(year, month, 0).getDate();
        var Difference_In_Time = new Date(value.nextEvent).getTime() - new Date(value.event).getTime() ;
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days > 30){
          list.push(value);
        }
      }
    });
    return list ;
  }

  getAgentNonZoneRouge(v:Visite[]):Visite[]{
    let list : Visite[]=[];
    v.forEach(value => {
      if (value.event != null && value.nextEvent!=null){
        var dt = new Date(value.event);
        var month = dt.getMonth();
        var year = dt.getFullYear();
        new Date(year, month, 0).getDate();
        var Difference_In_Time = new Date(value.nextEvent).getTime() - new Date(value.event).getTime() ;
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (Difference_In_Days <= 30){
          list.push(value);
        }
      }
    });
    return list ;
  }

  listTrueVisite : Visite[] = [] ;
  listFalseVisite : Visite [] = [] ;
  getVisiteTrue(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.visited == true){
        list.push(value);
      }
    });
    return list ;
  }

  getVisiteFalse(v:Visite[]):Visite[]{
    let list : Visite[] = [] ;
    v.forEach(value => {
      if (value.visited == false){
        list.push(value);
      }
    });
    return list ;
  }


  PorcentageRouge():number{
    let nombr : number = 0.0 ;
    nombr = ((this.listZoneRouge.length)/(this.listZoneRouge.length + this.listeNonZoneRouge.length))*100 ;
    nombr = Math.round(nombr*100)/100;
    if (isNaN(nombr)){
      nombr=0.0;
    }
    return nombr ;
  }
  PorcentageNonRouge():number{
    let nombr : number = 0.0 ;
    nombr = ((this.listeNonZoneRouge.length)/(this.listeNonZoneRouge.length + this.listZoneRouge.length))*100 ;
    nombr = Math.round(nombr*100)/100;
    if (isNaN(nombr)){
      nombr = 0.0 ;
    }

    return nombr ;
  }



  PorcentageTrueVisite():number{
    let nombr : number = 0.0 ;
    nombr = ((this.listTrueVisite.length)/(this.listTrueVisite.length + this.listFalseVisite.length))*100 ;
    nombr = Math.round(nombr*100)/100;
    if (isNaN(nombr)){
      nombr=0.0;
    }
    return nombr ;
  }
  PorcentageFalseVisite():number{
    let nombr : number = 0.0 ;
    nombr = ((this.listFalseVisite.length)/(this.listFalseVisite.length + this.listTrueVisite.length))*100 ;
    nombr = Math.round(nombr*100)/100;
    if (isNaN(nombr)){
      nombr = 0.0 ;
    }

    return nombr ;
  }

  medecin : number ;
  pharmacie :number ;
  getAllPharmacie(){
    this.pharmacie = 0.0 ;
    this.dashService.getPharmacies().subscribe((respo : Pharmacie[]) => {
      this.pharmacie = respo.length ;
    });
  }

  praticien : number ;
  acteMedical : number ;
  getAllActeMedical(){
    this.acteMedical = 0.0 ;
    this.dashService.getActemedicals().subscribe((respo : Actemedical[]) => {
      this.acteMedical = respo.length ;
    });
  }
}

