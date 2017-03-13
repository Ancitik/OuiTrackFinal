/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
'use strict';

const ouibus_token = 'W9JdZqSu8EAzM5XSf8fCgw';

var outils = {
        getNomVilleParID: function(iden){
            // On renvoie une promesse qui prend en paramettre une fonction
            // avec 2 paramètres, le callback de succès et d'erreur
            return new Promise(function (resolve, reject) {
                // Le reste du code ressemble à une méthode AJAX
                $.ajax({
                    type: 'GET',
                    url: 'https://api.idbus.com/v1/stops',
                    dataType: 'json',
                    headers: {
                        'Authorization': ouibus_token ? `Token ${ouibus_token}` : null,
                        'Content-Type': 'application/json'
                    },
                    success: function (result) {
                        var i;
                        for (i = 0; i < result.stops.length; i++){
                            if (iden == result.stops[i].id){
                                resolve(result.stops[i].long_name);
                            }
                        }
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log('Error: ' + textStatus + ' ' + errorThrown);
                    }
                });
              });
        },

        executeAsyncFunc: function executeAsyncFunc(d, param) {
        outils.getNomVilleParID(param).then(function(result){
			d.innerHTML = result;
		});
		},

        comparerTab: function (numBus, tab) {
            //FIXME: effacement du mauvais doublon
        var i;
        var longueurTab = tab.length;
        for (i = 0; i < longueurTab; i++) {
            if (tab[i] == numBus) {
                return false;
            }
        }
        return true;
    },

        effacerTableau: function () {
        var i = 0;

        var lignes = document.getElementById("table").rows;
        var nbLignes = lignes.length - 1;
        console.log(lignes);
        console.log(nbLignes);

        if (nbLignes > 1) {
            //a l'envers
            for (i = nbLignes; i > 0; i--) {
                document.getElementById("table").deleteRow(i);
            }
        }
        //refresh page 1 et redirection
        $.mobile.changePage('#page1', {
            allowSamePageTransition: true,
            transition: 'none',
            reloadPage: true
        });
    }
};

var app = {
    //Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Deviceready Event Handler
    onDeviceReady: function() {
        //TODO : tester connexion wifi ou 3g

        //lancer ici le spinner 1
        var options = { dimBackground: true };
        SpinnerPlugin.activityStart("Chargement...", options);

        document.getElementById('btnRechercherAvecVilles').addEventListener('click', this.recupererInfoBillet.bind(this), false);

        document.getElementById('btnRechercherNouveauTrajet').addEventListener('click', outils.effacerTableau.bind(this), false);

        /*Récupérer les villes dans les selects*/
        var selectVilleDepart = document.getElementById('selectVilleDepart');
        var selectVilleArrivee = document.getElementById('selectVilleArrivee');

        $.ajax({
            type: 'GET',
            url: 'https://api.idbus.com/v1/stops',
            dataType: 'json',
            headers: {
                'Authorization': ouibus_token ? `Token ${ouibus_token}` : null,
                'Content-Type': 'application/json'
            },
            success: function (result) {
                var i = 0;
                for (i = 0; i < result.stops.length; i++){
                    var option = document.createElement('option');
                    option.text = result.stops[i].long_name;
                    option.value = result.stops[i].id;
                    selectVilleDepart.add(option);
                }
                for (i = 0; i < result.stops.length; i++){
                    var option = document.createElement('option');
                    option.text = result.stops[i].long_name;
                    option.value = result.stops[i].id;
                    selectVilleArrivee.add(option);
                }
                //arreter spinner 1
                SpinnerPlugin.activityStop();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ' ' + errorThrown);
            }
        });
    },

    //Click btnRechercherAvecVilles Event Handler
    recupererInfoBillet: function () {
        var villeDepart = $('#selectVilleDepart').val();
        var villeArrivee = $('#selectVilleArrivee').val();
        var dateDepart = $('#dateDepart').val();

        if ( villeDepart === '' || villeArrivee === '' || dateDepart === ''){
            alert('Remplissez tous les champs !');
            return;
        }

        //spinner loading pendant le chergement du tableau des trajets
        var options = { dimBackground: true };
        SpinnerPlugin.activityStart("Chargement...", options);

        $.ajax({
            type: 'GET',
            url: 'https://api.idbus.com/v1/fares?origin_id='+villeDepart+'&destination_id='+villeArrivee+'&date='+dateDepart,
            dataType: 'json',
            headers: {
                'Authorization': ouibus_token ? `Token ${ouibus_token}` : null,
                'Content-Type': 'application/json'
            },
            success: function (result) {
                var i = 0;

                if (result.fares.length === 0) {
                    alert('aucuns bilets disponibles pour ce trajet ou cette date'); //TODO : remplacer par un spinner loading
                } else {
                    var i;
                    var j;
                    var tab = [];
                    var ligneActuelle = 1;

                    for (i = 0; i < result.fares.length; i++) {
                        if (result.fares[i].available === true) {
                            if (outils.comparerTab(result.fares[i].legs[0].bus_number, tab) == true) {

                                var table = document.getElementById('table');
                                var ligne = table.insertRow(ligneActuelle);
                                ligneActuelle++;

                                var num = ligne.insertCell(0);
                                var dep = ligne.insertCell(1);
                                var arr = ligne.insertCell(2);
                                var date = ligne.insertCell(3);
                                var etape = ligne.insertCell(4);

                                tab.push(result.fares[i].legs[0].bus_number);
                                console.log(tab);

                                dep.innerHTML = result.fares[i].origin_id;
                                num.innerHTML = result.fares[i].legs[0].bus_number;
                                arr.innerHTML = result.fares[i].destination_id;
                                date.innerHTML = result.fares[i].departure; //TODO : convertir en heure

                                num.innerHTML = '<a href="#page4">' + result.fares[i].legs[0].bus_number + '</a>';

                                //Invoke executeAsyncFunc to edit dep & arr innerHTML
                                outils.executeAsyncFunc(dep, result.fares[i].origin_id);
                                outils.executeAsyncFunc(arr, result.fares[i].destination_id);

                                var etapes = '';
                                for (j = 0; j < result.fares[i].legs.length; j++) {
                                    etapes = etapes + result.fares[i].legs[j].destination_id + "-";
                                }
                                etape.innerHTML = etapes;

                                var heureDep = result.fares[i].departure;
                                var heureDepSplit = heureDep.split("T");
                                var heureDepSplit2 = heureDepSplit[1];
                                var heureDepSplit3 = heureDepSplit2[0] + heureDepSplit2[1] + ":" + heureDepSplit2[3] + heureDepSplit2[4];
                                date.innerHTML = heureDepSplit3;
                            }

                            //ville depart
                            document.getElementById("labelVilleDepart").textContent = villeDepart;
                            document.getElementById("labelDateDepart").textContent = dateDepart;

                            //ville arrivée
                            document.getElementById("labelVilleArrivee").textContent = villeArrivee;
                            //todo : recupérer la date arrivée
                            //todo : effacer la page pour que ca fonctionne avec le bouton "chercher un autre trajet"
                            //document.getElementById("labelDateArrivee").textContent=dateArrivee;

                            //TODO : afficher aussi la liste des étapes
                            //document.getElementById("labelVilleDepart").setAttribute("src","img/img2.jpg");
                        }
                    }
                    $.mobile.changePage('#page3');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ' ' + errorThrown);
            }
        });
        //FIXME: arreter spinner  quand la page est affiché
        SpinnerPlugin.activityStop();
    },


    //Simple methode invoked to build page4
    getMeteoOfCity: function () {
        var city = document.getElementById('txtCity').value;
        var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=7b2f43782488800965332811d430c186';

        /*Initialisation*/
        var myRequest = new XMLHttpRequest();
        myRequest.open('GET', url, true);

        /*Envoie des données au script*/
        myRequest.send();

        /*Attente de la réponse*/
        myRequest.onreadystatechange = function (aEvt) {
            if (myRequest.readyState == 4) { // la requête est terminée
                if (myRequest.status == 200) { // Code HTTP 200 OK
                    var result = JSON.parse(myRequest.responseText);
                    document.getElementById('weather_result').textContent = result.weather[0].description;
                }
            }
        };
    }
};

app.initialize();
