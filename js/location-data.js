 //@ http://www.latlong.net/

 var neighborhood = {
		region: {
			center: {
				"name": "Warsaw",
			    "address": "Warszawa - Polska",
			    "coord": {lat: 52.231778, lng: 21.006162}
			},
			zoom: {initial: 14, min: 12, max: 20},
			bounds: [52.152227, 20.955794, 52.283899, 21.157324]
		},
        focus: {
            "Transportation" : ["Airport", "Train Station"],
            "City" : ["City Center", "Historic Center", "Cultural Center", "Museum", "Park", "Library", "Arts Gallery", "Mall"],
            "Recommended" : ["Club", "Restaurant", "Hotel", "Cinema"],
            "POI" : ["Performing Arts"]
        },
	    locations: [
	    {
	    	name: "Muzeum Narodowe",
	        address: "Aleje Jerozolimskie 3, 00-495 Warszawa - Polska",
	        coord: {lat: 52.231919, lng: 21.024654},
	        website: "http://www.mnw.art.pl/en/",
	        tag: "Museum"
	    },
        {
            name: "Warszawska Wytwórnia Wódek KONESER",
            address: "Ząbkowska 27, 03-735 Warszawa - Polska",
            coord: {lat: 52.254405, lng: 21.044190},
            website: "http://koneser.eu/",
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
	    	address: "Plac Zawiszy 1, 02-025 Warszawa - Polska",
	    	coord: {lat: 52.224420, lng: 20.989001},
	    	website: "http://www.radissonblu.com/sobieski-warsaw",
            tag: "Hotel"
	    },
	    {
	    	name: "Biblioteka Narodowa",
	    	address: "Aleja Niepodległości 213, 02-086 Warszawa - Polska",
	    	coord: {lat: 52.214485, lng: 21.005539},
	    	website: "http://www.bn.org.pl/",
	    	tag: "Library"
	    },
	    {
	    	name: "Kino Femina",
	        address: "Aleja Solidarności 115 Warszawa - Polska",
	        coord: {lat: 52.241984, lng: 20.994493},
	        website: "",
	        tag: "Cinema"

	    },
        {   name: "Centrum",
            address:"Aleje Jerozolimskie, Warszawa - Polska",
            coord: {lat: 52.231778, lng: 21.006162},
            website: "https://www.google.pl/?gws_rd=ssl#safe=strict&q=centrum+Warszawy",
            tag:"City Center"
        },
        {   name: "Pałac Kultury i Nauki",
            address:"Plac Defilad 1, 00-901 Warszawa - Polska",
            coord: {lat: 52.231778, lng: 21.006162},
            website: "http://www.pkin.pl/",
            tag:"Cultural Center"
        },
        {   name: "Stare Miasto w Warszawie",
            address: "Plac Zamkowy, Warszawa - Polska",
            coord: {lat: 52.247733, lng:  21.013608},
            website: "http://www.stare-miasto.com/",
            tag: "Historic Center"
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
            website: "",
            tag: "Restaurant"
        },
        {
            name: "Restauracja Polska Rozana",
            address: "Chocimska 7, Warszawa - Polska",
            coord: {lat: 52.2083889, lng: 21.023467900000014},
            options: "Lunch, Dinner, Dessert",
            website: "http://restauracjarozana.com.pl/",
            tag: "Restaurant"
        },
        {
            name: "Stara Kamienica",
            address: "Str. Widok 8, Warszawa - Polska",
            coord: {lat: 52.2315629, lng: 21.0151429},
            options: "Brunch, Lunch, Dinner, Dessert",
            website: "http://www.stara-kamienica.com.pl/",
            tag: "Restaurant"
        },
        {
            name: "U Kucharzy",
            address: "Długa 52, Warszawa - Polska",
            coord: {lat: 52.2456709, lng: 21.001365899999996},
            options: "Dinner, Dessert",
            website: "http://www.gessler.pl/",
            tag: "Restaurant"
        },
        {
        	name: "Teatr Dramatyczny",
        	address: "Plac Defilad 1, Warszawa - Polska",
        	coord: {lat: 52.231755, lng: 21.006482},
        	website: "http://teatrdramatyczny.pl/",
        	tag: "Performing Arts"
        },
        {
            name: "Warszawska Opera Kameralna",
            address: "Aleja Solidarności 76b, Warszawa - Polska",
            coord: {lat: 52.243887, lng: 20.997488},
            website: "http://www.operakameralna.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Teatr Narodowy",
            address: "Plac Teatralny 3, Warszawa - Polska",
            coord: {lat: 52.243349, lng: 21.009372},
            website: "http://www.narodowy.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Łazienki Królewskie w Warszawie",
            address: "Ujazdów, 01-999, Warszawa - Polska",
            coord: {lat: 52.2152, lng: 21.035},
            website: "http://www.lazienki-krolewskie.pl/pl",
            tag:"Park"
        },
        {
            name: "Fryderyk Chopin Museum",
            address: "Okólnik 1, Warszawa - Polska",
            coord: {lat: 52.236468, lng: 21.023129},
            website: "http://chopin.museum/en",
            tag: "Museum"

        },
        {
            name: "Lotnisko Chopina",
            address: "Żwirki i Wigury 1, Warszawa - Polska",
            coord: {lat: 52.171799, lng: 20.973210},
            website: "http://www.lotnisko-chopina.pl/en/index.html",
            tag: "Airport"
        },
        {
            name: "Lotnisko Warszawa-Babice",
            address: "Gen. Bryg. Sylwestra Kaliskiego 57, 01-476 Warszawa - Polska",
            coord: {lat: 52.270079, lng: 20.907559},
            website: "http://www.lotnisko-babice.pl/",
            tag: "Airport"
        },
        {   name: "Warszawa Centralna",
            address: "Dworzec, 00-844 Warszawa - Polska",
            coord: {lat: 52.228336, lng: 21.003576},
            website: "http://intercity.pl/pl/",
            tag: "Train Station"
        },
        {
        	name: "Warszawa Wschodnia",
        	address: "Ul. Kijowska 16, 03-802 Warszawa - Polska",
        	coord: {lat: 52.252518, lng: 21.051078},
        	website: "http://rozklad-pkp.pl/en/terminal/warszawa-wschodnia",
        	tag: "Train Station"
        },
        {
        	name: "Polonia Palace Hotel",
        	address: "Aleje Jerozolimskie 45, 00-692 Warszawa - Polska",
        	coord: {lat: 52.229239, lng: 21.010275},
        	website: "http://www.poloniapalace.com/default-en.html",
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
            website: "https://pl-pl.facebook.com/pages/Plan-B/200377996747550",
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
            name: "Teatr Żydowski",
            address: "Plac Grzybowski 12/16, 00-104 Warszawa - Polska",
            coord: {lat: 52.235887, lng: 21.002230},
            website: "http://www.teatr-zydowski.art.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Och-Teatr",
            address: "Grójecka 65, Warszawa - Polska",
            coord: {lat: 52.214188, lng: 20.979965},
            website: "http://ochteatr.com.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Arkadia",
            address: "Aleja Jana Pawła II 82, 00-175 Warszawa Polska",
            coord: {lat: 52.256251, lng: 20.983644},
            website: "http://www.arkadia.com.pl/W/do/centre/strona-glowna",
            tag: "Mall"
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
            name: "Teatr Studio",
            address: "Plac Defilad 1, Warszawa - Polska",
            coord: {lat: 52.231832, lng: 21.005982},
            website: "http://www.teatrstudio.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Teatr Polski",
            address: "Kazimierza Karasia 2, Warszawa - Polska",
            coord: {lat: 52.238474, lng: 21.019542},
            website: "http://www.teatrpolski.waw.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Capitol",
            address: "Marszałkowska 115, Warszawa - Polska",
            coord: {lat: 52.241321, lng: 21.003455},
            website: "http://www.scenacapitol.pl/teatr/",
            tag: "Performing Arts"
        },
        {
           name: "Teatr Ateneum",
           address: "Stefana Jaracza 2, Warszawa - Polska",
           coord: {lat: 52.237316, lng: 21.032791},
           website: "http://teatrateneum.pl/",
           tag: "Performing Arts"
        },
        {
            name: "Teatr Sabat Małgorzaty Potockiej",
            address: "Foksal 16, 00-372 Warszawa - Polska",
            coord: {lat: 52.233873, lng: 21.021230},
            website: "http://teatr-sabat.pl/",
            tag: "Performing Arts"
        },
        {
            name: "Studio Buffo",
            address: "Marii Konopnickiej 6, Warszawa - Polska",
            coord: {lat: 52.228151, lng: 21.026095},
            website: "http://studiobuffo.com.pl/",
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
            coord: {lat: 52.239336, lng: 21.011535},
            website: "http://www.zacheta.art.pl/",
            tag: "Arts Gallery"
        },
        {
        	name: "Parfois-Złote Tarasy",
        	address: "Ulica Złota 59, 00-120 Warszawa",
        	coord: {lat: 52.230035, lng: 21.002501},
        	website: "http://zlotetarasy.pl/",
        	tag: "Mall"
        }
        ]};
