'use strict';

const ouibus_token = 'W9JdZqSu8EAzM5XSf8fCgw';

//on définit ici toutes nos fonctions utiles dans une "boîte à outils"
var outils = {
        //renvoi une promesse qui résoud l'identifiant d'une ville passé en paramètres, en nom de ville
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

         //renvoi une promesse qui résoud l'identifiant d'une ville passé en paramètres, en temps de la ville
        getTempsOfCity: function (city){
            return new Promise(function (resolve, reject) {
                console.log(city);
                var cityString = city.split(" ");
                var citySplit = cityString[0];
                console.log(citySplit);
                var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + citySplit + '&appid=7b2f43782488800965332811d430c186&lang=fr';

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
                            console.log(result);
                            console.log(result.weather[0].description);
                            resolve(result.weather[0].description);
                        }
                    }
                };
            });
        },

        //renvoi une promesse qui résoud l'identifiant d'une ville passé en paramètres, en température de la ville
        getTemperatureOfCity: function (city){
            return new Promise(function (resolve, reject) {
                console.log(city);
                var cityString = city.split(" ");
                var citySplit = cityString[0];
                console.log(citySplit);
                var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + citySplit + '&appid=7b2f43782488800965332811d430c186&lang=fr';

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
                            console.log(result);
                            console.log(result.main.temp);
                            resolve((result.main.temp)-273.15);
                        }
                    }
                };
            });
        },

        executeAsyncFunc: function executeAsyncFunc(d, param) {
            outils.getNomVilleParID(param).then(function(result){
			 d.innerHTML = result;
		  });
		},

        executeAsyncFunc2: function executeAsyncFunc2(d, city) {
            outils.getTempsOfCity(city).then(function(result){
                console.log('executeAsyncFunc2 ' + result);
                document.getElementById(d).textContent = "Temps : " + result;
            });
		},

        executeAsyncFunc3: function executeAsyncFunc3(d, city) {
            outils.getTemperatureOfCity(city).then(function(result){
                console.log('executeAsyncFunc3 ' + result);
<<<<<<< HEAD
                document.getElementById(d).textContent = "Température : " + Math.round(result) + "°C";
=======
                document.getElementById(d).textContent = Math.round(result) + "°C";
>>>>>>> d847b0f3a390bbc19f54cd3ed47ed4e6f5139938
            });
		},

        //fonction qui permet de ne pas afficher 2 fois le même trajet (l'APi fournit un même numéro de bus pour un "Paris-Nice" que pour un "Paris-Lyon-Nice")
        comparerTab: function (numBus, tab) {
<<<<<<< HEAD
            var i;
            var longueurTab = tab.length;
            for (i = 0; i < longueurTab; i++) {
                if (tab[i] == numBus) {
                    return false;
                }
=======
        var i;
        var longueurTab = tab.length;
        for (i = 0; i < longueurTab; i++) {
            if (tab[i] == numBus) {
                return false;
>>>>>>> d847b0f3a390bbc19f54cd3ed47ed4e6f5139938
            }
            return true;
    },

        //fonction qui éfface le tableau de la page 3 
        //on l'appelle quand on veut chercher un autre trajet (bouton de la page4) et quand on fait "backbutton" sur la page3
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
            $.mobile.changePage('#page1');
            location.reload();

        },


};

var app = {
    //Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Deviceready Event Handler
    onDeviceReady: function() {
        document.addEventListener("online", this.onOnline, false);
        document.addEventListener("offline", this.onOffline, false);
        document.addEventListener("backbutton",this.onBackButton,false);
        

        //lancer ici le spinner 1
        var options = { dimBackground: true };
        SpinnerPlugin.activityStart("Chargement...", options);
        document.getElementById('btnRechercherAvecNum').addEventListener('click', this.recupererInfoBillet.bind(this), false);
        document.getElementById('btnRechercherAvecVilles').addEventListener('click', this.recupererTrajets.bind(this), false);
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
            //ici on va remplir les deux listes déroulantes de le page2
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
                //arreter spinner
                SpinnerPlugin.activityStop();
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ' ' + errorThrown);
            }
        });
    },

    //La fonction qui se lance quand une recherche par numéro de bus et date
    recupererInfoBillet: function () {
        //on récupère les inputs de l'utilisateur
        var numBus = $('#txtNumBus').val();
        var dateBus = $('#dateDepart1').val();
        //on test si les champs sont remplis
        if (numBus === '' || dateBus === ''){
            alert('Remplissez tous les champs !');
            return;
        }

        var options = { dimBackground: true };
        SpinnerPlugin.activityStart("Chargement des informations du billet", options);

        $.ajax({
            type: 'GET',
            url: 'https://api.idbus.com/v1/fares?date=' + dateBus,
            dataType: 'json',
            headers: {
                'Authorization': ouibus_token ? `Token ${ouibus_token}` : null,
                'Content-Type': 'application/json'
            },
            success: function (result) {
                //Recherche du billet
                var i = 0;
                for (i = 0; i < result.fares.length; i++){
                    if (result.fares[i].legs[0].bus_number == numBus){
                        //Numero trouvé
                        //Modification du DOM de la page 4 (info billets)
                        //Depart
                        outils.executeAsyncFunc(document.getElementById("labelVilleDepart"), result.fares[i].origin_id);
                        console.log(result.fares[i].departure);
                        var heureDep = result.fares[i].departure;
                                var heureDepSplit = heureDep.split("T");
                                var heureDepSplit2 = heureDepSplit[1];
                                var heureDepSplit3 = heureDepSplit2[0] + heureDepSplit2[1] + ":" + heureDepSplit2[3] + heureDepSplit2[4];
                        document.getElementById("labelDateDepart").textContent = heureDepSplit[0] + ' : ' + heureDepSplit3;
                        //Arrivée
                        outils.executeAsyncFunc(document.getElementById("labelVilleArrivee"), result.fares[i].destination_id);
                        var heureDep = result.fares[i].arrival;
                                var heureDepSplit = heureDep.split("T");
                                var heureDepSplit2 = heureDepSplit[1];
                                var heureDepSplit3 = heureDepSplit2[0] + heureDepSplit2[1] + ":" + heureDepSplit2[3] + heureDepSplit2[4];
                        document.getElementById("labelDateArrivee").textContent = heureDepSplit[0] + ' : ' + heureDepSplit3;

                     
                        outils.getNomVilleParID(result.fares[i].origin_id).then(function(result){
                            var villeDepartPage4 = result;
                            outils.executeAsyncFunc2('labelTempsDepart', villeDepartPage4);
                            outils.executeAsyncFunc3('labelTemperatureDepart', villeDepartPage4);
                        });

                        outils.getNomVilleParID(result.fares[i].destination_id).then(function(result){
                            var villeDepartPage4 = result;
                            outils.executeAsyncFunc2('labelTempsArrivee', villeDepartPage4);
                            outils.executeAsyncFunc3('labelTemperatureArrivee', villeDepartPage4);
                            SpinnerPlugin.activityStop();
                        });

                        //Afficher la page 4
                        $.mobile.changePage('#page4');
                        //On arrête dès qu'on a trouvé
                        break;
                    }
                    //message d'erreur si trajet n'a pas été trouvé
                    if (i == result.fares.length-1){
                        alert('Aucun billet disponible pour ce numero de bus');
                    }
                    SpinnerPlugin.activityStop();
                }
                
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Error: ' + textStatus + ' ' + errorThrown);
            }
        });

        
    },

    //La fonction qui se lance quand une recherche par villes et date
    recupererTrajets: function () {
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
                    alert('Aucun billet disponible pour ce trajet');
                    SpinnerPlugin.activityStop();
                } else {
                    var i;
                    var j;
                    var tab = [];
                    var ligneActuelle = 1;
<<<<<<< HEAD
                    //pour chaque trajet trouvé
=======
>>>>>>> d847b0f3a390bbc19f54cd3ed47ed4e6f5139938
                    for (i = 0; i < result.fares.length; i++) {
                        //si le trajet est encore valable (pas dépassé)
                        if (result.fares[i].available === true) {
                            // et si le numéro de bus n'est pas en doublon
                            if (outils.comparerTab(result.fares[i].legs[0].bus_number, tab) === true) {

                                var table = document.getElementById('table');
                                var ligne = table.insertRow(ligneActuelle);
                                ligneActuelle++;
                                //on rajoute une ligne au tableau de la page3
                                var num = ligne.insertCell(0);
                                var dep = ligne.insertCell(1);
                                var arr = ligne.insertCell(2);
                                var date = ligne.insertCell(3);

                                tab.push(result.fares[i].legs[0].bus_number);
                                dep.innerHTML = result.fares[i].origin_id;
                                num.innerHTML = result.fares[i].legs[0].bus_number;
                                arr.innerHTML = result.fares[i].destination_id;
                                date.innerHTML = result.fares[i].departure;

                                //on affecte au numéro un lien pour accéder à la page 4
                                num.innerHTML = '<a href="#page4">' + result.fares[i].legs[0].bus_number + '</a>';

                                //Exécuter la requete executeAsyncFunc pour éditer le DOM de la page 4
                                outils.executeAsyncFunc(dep, result.fares[i].origin_id);
                                outils.executeAsyncFunc(arr, result.fares[i].destination_id);
<<<<<<< HEAD
                                
                                //on fait un travail de découpage sur la date récupéré
=======

>>>>>>> d847b0f3a390bbc19f54cd3ed47ed4e6f5139938
                                var heureDep = result.fares[i].departure;
                                var heureDepSplit = heureDep.split("T");
                                var heureDepSplit2 = heureDepSplit[1];
                                var heureDepSplit3 = heureDepSplit2[0] + heureDepSplit2[1] + ":" + heureDepSplit2[3] + heureDepSplit2[4];
                                date.innerHTML = heureDepSplit3;
                            }
                        }
                    }
                    //ville depart
                    outils.getNomVilleParID(villeDepart).then(function(result){
                        var villeDepartPage4 = result;
                        console.log("villeDepPage4" + villeDepartPage4);
                        document.getElementById('labelVilleDepart').textContent = villeDepartPage4;
                        outils.executeAsyncFunc2('labelTempsDepart', villeDepartPage4);
                        outils.executeAsyncFunc3('labelTemperatureDepart', villeDepartPage4);
                        document.getElementById("labelDateDepart").textContent = dateDepart;
                    });

<<<<<<< HEAD
=======
                    //document.getElementById("labelVilleDepart").textContent = villeDepart;

>>>>>>> d847b0f3a390bbc19f54cd3ed47ed4e6f5139938
                    //ville arrivée
                    outils.getNomVilleParID(villeArrivee).then(function(result){
                        var villeArriveePage4 = result;
                        document.getElementById('labelVilleArrivee').textContent = villeArriveePage4;
                        outils.executeAsyncFunc2('labelTempsArrivee', villeArriveePage4);
                        outils.executeAsyncFunc3('labelTemperatureArrivee', villeArriveePage4);
                        document.getElementById("labelDateArrivee").textContent = dateDepart;
<<<<<<< HEAD
=======
                        //FIXME: arreter spinner  quand la page est affiché
>>>>>>> d847b0f3a390bbc19f54cd3ed47ed4e6f5139938
                        SpinnerPlugin.activityStop();
                    });

                    $.mobile.changePage('#page3');
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log('Error: ' + textStatus + ' ' + errorThrown);
            }
        });
        
    },

    //onOnline Event Handler
    onOnline: function () {
        //onOnline
        console.log('Online');
    },

    //onOffline Event Handler
    onOffline: function () {
        console.log('Offline');
        alert('Vous êtes hors connexion ! Ressayez plus tard.');
        navigator.app.exitApp();
    },

    //on gére ici tout les "backbutton"
    onBackButton: function() {
        console.log($.mobile.activePage.attr('id'));
        if ($.mobile.activePage.attr('id')=='page1'){
            navigator.app.exitApp();
        }
        else if ($.mobile.activePage.attr('id')=='page2'){
            $.mobile.changePage('#page1');
            location.reload();
        }
        else if ($.mobile.activePage.attr('id')=='page3'){
            outils.effacerTableau();
            $.mobile.changePage('#page2');
        }
        else if ($.mobile.activePage.attr('id')=='page4'){
            //pour gérer le fait que un backbutton sur la page4 peut revenir soit a la page 1 soit a la page 3
            window.history.back();
        }
    }

};

app.initialize();
