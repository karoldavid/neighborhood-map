 //@ http://www.latlong.net/

 var neighborhood = {
		region: {
			center: {
				"name": "Warsaw",
			    "address": "Warszawa, Polska",
			    "coord": {lat: 52.231778, lng: 21.006162}
			},
			zoom: {initial: 14, min: 12, max: 20}, 
			bounds: [52.152227, 20.955794, 52.283899, 21.157324]
		},
	    locations: [
	    {   
	    	name: "Muzeum Narodowe",
	        address: "Aleje Jerozolimskie 3, 00-495 Warszawa - Polska",
	        coord: {lat: 52.231585, lng: 21.024704},
	        website: "http://www.mnw.art.pl/en/",
	        tag: "Museum"

	    },
	    {
	    	name: "Hilton Warsaw Hotel and Convention Centre",
	    	address: "Grzybowska 63, 00-844 Warszawa - Polska",
            coord: {lat: 52.233893, lng: 20.986264},
            website: "http://www3.hilton.com/en/hotels/poland/hilton-warsaw-hotel-and-convention-centre-WAWHIHI/index.html",
            tag: "Hotel"
	    },
	    {
	    	name: "Sheraton Warsaw Hotel",
	    	address: " Bolesława Prusa 2, 00-493 Warszawa - Polska",
	    	coord: {lat: 52.227926, lng: 21.024925},
	    	website: "http://www.sheraton.pl/en/",
	    	tag: "Hotel"

	    },
	    {
	    	name: "InterContinental Warsaw",
	    	address: "Emilii Plater 49, 00-125 Warszawa - Polska",
	    	coord: {lat: 52.232408, lng: 21.002608},
	    	website: "http://warsaw.intercontinental.com/",
	    	tag: "Hotel"

	    },
	    {
	    	name: "RADISSON BLU SOBIESKI HOTEL",
	    	address: "plac Zawiszy 1, 02-025 Warszawa - Polska",
	    	coord: {lat: 52.224420, lng: 20.989001},
	    	website: "http://www.radissonblu.com/sobieski-warsaw",
            tag: "Hotel"
	    },
	    {
	    	name: "Biblioteka Narodowa",
	    	address: "Aleja Niepodległości 213, 02-086 Warszawa - Polska",
	    	coord: {lat: 52.213878, lng: 21.004422},
	    	website: "http://www.bn.org.pl/",
	    	tag: "Library"

	    },
	    {
	    	name: "Kino Femina",
	        address: "Aleja Solidarności 115 Warszawa - Polska",
	        coord: {lat: 52.241984, lng: 20.994493},
	        website: "#",
	        tag: "Cinema"

	    },
        {   name: "Centrum",
            address:"Warszawa - Polska",
            coord: {lat: 52.231778, lng: 21.006162},
            website: "#",
            tag:"City Center"
        },
        {   name: "Pałac Kultury i Nauki",
            address:"Plac Defilad 1, 00-901 Warszawa - Polska",
            coord: {lat: 52.231778, lng: 21.006162},
            website: "http://www.pkin.pl/",
            tag:"Cultural Center"
        },
        {   name: "Stare Miasto",
            address: "Warszawa - Polska",
            coord: {lat: 52.247733, lng:  21.013608},
            website: "#",
            tag: "Historic Center"
        },
        {   name: "Centrum Kultury Nowy Wspaniały Świat",
            address: "Świętokrzyska 63, Warszawa - Polska",
            coord: {lat: 52.233839, lng:  21.001905},
            website: "http://www.nowywspanialyswiat.pl/",
            website: "#",
            tag: "Cultural Center"
        },
        {   name: "Tygmont Jazz Club",
            address: "Mazowiecka 6/8, Warszawa, Polska",
            coord: {lat: 52.237082, lng: 21.013234},
            website: "http://www.tygmont.com.pl/",
            tag: "Club"
        },
        {
            name: "Familijny Bar Mleczny",
            address: "Nowy Świat 39, 00-029 Warszawa - Polska",
            coord: {lat : 52.234173, lng: 21.018673},
            options: "Lunch",
            video: "http://news.bbc.co.uk/1/hi/programmes/fast_track/9714943.stm",
            website: "#",
            tag: "Restaurant"
        },
        {
            name: "Restauracja Polska Rozana",
            address: "Chocimska 7, Warszawa - Polska",
            coord: {lat: 52.2083889, lng: 21.023467900000014},
            options: "Lunch, Dinner, Dessert",
            website: "#",
            tag: "Restaurant"
        },
        {
            name: "Stara Kamienica",
            address: "Str. Widok 8, Warszawa - Polska",
            coord: {lat: 52.2315629, lng: 21.0151429},
            options: "Brunch, Lunch, Dinner, Dessert",
            website: "#",
            tag: "Restaurant"
        },
        {
            name: "U Kucharzy",
            address: "Długa 52, Warszawa - Polska",
            coord: {lat: 52.2456709, lng: 21.001365899999996},
            options: "Dinner, Dessert",
            website: "#",
            tag: "Restaurant"
        },
        {
        	name: "Teatr Dramatyczny im. G. Holoubka",
        	address: "Plac Defilad 1, Warszawa - Polska",
        	coord: {lat: 52.231755, lng: 21.006482},
        	website: "http://teatrdramatyczny.pl/",
        	tag: "Performing Arts"
        },
        {   name: "Łazienki Królewskie w Warszawie",
            address: "Ujazdów, 01-999, Warszawa - Polska",
            coord: {lat: 52.2152, lng: 21.035},
            website: "#",
            tag:"Park"
        },
        {   name: "Lotnisko Chopina",
            address: "Żwirki i Wigury 1, Warszawa - Polska",
            coord: {lat: 52.167232, lng: 20.967891},
            website: "#",
            tag: "Airport"
        },
        {   name: "Warszawa Centralna",
            address: "00-844, Warszawa - Polska",
            coord: {lat:52.228729, lng: 21.003268},
            website: "#",
            tag: "Train Station"
        },
        {
        	name: "Warszawa Wschodnia",
        	address: "03-802, Warszawa - Polska",
        	coord: {lat: 52.251697, lng: 21.054861},
        	website: "#",
        	tag: "Train Station"

        },
        {
        	name: "Polonia Palace Hotel",
        	address: "Aleje Jerozolimskie 45, 00-692, Warszawa - Polska",
        	coord: {lat: 52.229239, lng: 21.010275},
        	website: "#",
        	tag: "Hotel"

        },
        {
        	name: "Muzeum Powstania Warszawskiego",
        	address: "Grzybowska 79, Warszawa - Polska",
        	coord: {lat: 52.232841, lng: 20.980982},
        	website: "http://www.1944.pl/",
        	tag: "Museum"
        },
        {
            name: "Plan B",
            address: "Aleja Wyzwolenia 18, 00-999 Warszawa - Polska",
            coord: {lat: 52.219978, lng: 21.018735},
            website: "#",
            tag: "Club",
        },
        {
        	name: "Filharmonia Narodowa",
        	address: "Jasna 5, 00-950, Warszawa - Polska",
        	coord: {lat: 52.234445, lng: 21.011390},
        	website: "http://www.filharmonia.pl/",
        	tag: "Performing Arts"
        },
        {
            name: "Arkadia",
            address: "Aleja Jana Pawła II 82, 00-175 Warszawa Polska",
            coord: {lat: 52.257119, lng: 20.984434},
            website: "http://www.arkadia.com.pl/W/do/centre/strona-glowna",
            tag: "Shopping Center"
        },
        {
        	name: "Park Świętokrzyski",
        	address: "Świętokrzyska, Warszawa - Polska",
        	coord: {lat: 52.233889, lng: 21.005366},
        	website: "http://zielona.um.warszawa.pl/tereny-zielone/parki/park-swietokrzyski",
        	tag: "Park"

        },
        {
        	name: "Teatr Wielki Opera Narodowa",
        	address: "Plac Teatralny 1, 00-950 Warszawa - Polska",
        	coord: {lat: 52.243516, lng: 21.010438},
        	website: "http://teatrwielki.pl/",
        	tag: "Performing Arts"
        },
        {
        	name: "Biblioteka Uniwersytecka",
        	address: "Dobra 56/66, Warszawa - Polska",
        	coord: {lat: 52.242642, lng: 21.024870},
        	website: "http://www.buw.uw.edu.pl/en/",
        	tag: "Library"

        },
        {
            name: "Zachęta – Narodowa Galeria Sztuki",
            address: "Plac Małachowskiego 3, 00-916 Warszawa - Polska",
            coord: {lat: 52.239318, lng: 21.011531},
            website: "http://www.zacheta.art.pl/",
            tag: "Arts Gallery"
        },
        {
        	name: "Parfois-Złote Tarasy",
        	address: "Ulica Złota 59, 00-120 Warszawa",
        	coord: {lat: 52.230035, lng: 21.002501},
        	website: "#",
        	tag: "Shopping Center"
        }
        ]};

/*var locations = [
        ["Bar mleczny", "Marymoncka 49, Warszawa - Polska"],
        ["Restauracja Polska Rozana", "Chocimska 7, Warszawa - Polska"],
        ["Stara Kamienica", "Str. Widok 8, Warszawa - Polska"],
        ["U Kucharzy","Długa 52, Warszawa - Polska"]
    ];*/
