import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import "~bootstrap/dist/css/bootstrap.css";

interface Carburant {
  id: string;
  fields: {
    code_region: string;
    ville: string;
    prix: any;
    departement: string;
    adresse: any;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  carburants: Carburant[] = [];
  villesDisponibles: string[] = [];
  selectedVille: string = '';
  prixParVille: Carburant[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    const url = 'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-des-carburants-en-france-flux-instantane-v2';

    // Récupération de la liste des villes disponibles
    this.http.get<any>(url).subscribe(response => {
      this.villesDisponibles = response.records.map((record: Carburant) => record.fields.ville);
    });
  }

  getCarburantsByVille(event: any) {
    const ville = event.target.value;
    const url = 'https://data.economie.gouv.fr/api/records/1.0/search/?dataset=prix-des-carburants-en-france-flux-instantane-v2';

    // Utilisation de la requête pour récupérer les données par localisation
    const params = { 'refine.nom_commune': ville };

    this.http.get<any>(url, { params }).subscribe(response => {
      this.carburants = response.records.filter((record: Carburant) => record.fields.ville === ville);
    });
  }

  filtrerPrixParVille() {
    this.prixParVille = this.carburants.filter((record: Carburant) => record.fields.ville === this.selectedVille);
  }
}
