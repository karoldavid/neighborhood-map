function makeDrawers () {
    /**
     *
     * Toggle, hide and show DOM elements
     *
     */

    function toggleVisibility(id) {
        var elem = document.getElementById(id);
    	  elem.style.display = ((elem.style.display!='none') ? 'none' : 'block');
    }

    function hideElement(id) {
      	var elem = document.getElementById(id);
        elem.style.display = ('none');
    }

    function showElement(id) {
        var elem = document.getElementById(id);
        elem.style.display = ('block');
    }

    /**
     *
     * DRAWERS:
     * - left Locations Search List drawer
     * - left POI FourSquare drawer
     * - left Main Menu drawer
     * - left Sub Info drawer
     */

    var menu = document.querySelector('#menu'),
        hideList = document.querySelector('#hide-list'),
        showList = document.querySelector('#show-list'),
        hidePoiDrawer = document.querySelector('#hide-poi'),
        resetButton = document.querySelector('#resetButton'),
        main = document.querySelector('main'),
        listDrawer = document.querySelector('.col-1');

    /* Hide the left location search list drawer when the hide icon '<<' is clicked */
    hideList.addEventListener('click', function(e) {
        listDrawer.classList.remove('open');
        showElement('show-list');
        e.stopPropagation();
    });

    /* Show the left location search list drawer when the hide icon '<<' is clicked */
    showList.addEventListener('click', function(e) {
      	listDrawer.classList.add('open');
      	hideElement('show-list');
        e.stopPropagation();
    });

    var poi = document.getElementsByClassName("POI"),
        poiDrawer = document.querySelector('.col-2');

    /* Open the left POI FourSquare drawer when a POI list item is clicked */
    for(var i = 0; i < poi.length; i++){
      	poi[i].addEventListener('click', function(e) {
           	showElement("fs-all");
            var selected = document.querySelector('#locList > li.selected');
            if (selected && !poiDrawer.classList.contains('open')) {
        		    poiDrawer.classList.add('open');
                listDrawer.classList.remove('open');
                hideElement('show-list');
        	  }
            e.stopPropagation();
        });
    }

    /* Hide the left POI FourSquare drawer */
    hidePoiDrawer.addEventListener('click', function(e) {
        poiDrawer.classList.remove('open');
        showElement('show-list');
        e.stopPropagation();
    });

    listDrawer.addEventListener('click', function(e) {
        var selected = document.querySelector('#locList > li.selected');
        if (selected && listDrawer.classList.contains('open')) {
            listDrawer.classList.remove('open');
            showElement('show-list');
        }
        e.stopPropagation();
    });

    var menuDrawer = document.querySelector('.col-3'),
        subInfoDrawer = document.querySelector('.col-4'),
        subInfos = document.getElementsByClassName('sub-info'),
        subInfoId = [];

    $(".col-4 div").each( function() {
      	subInfoId.push($(this).attr("id"));
    });

    /* Open left Sub Info Drawer with according information when Menu Item on left Main Menu drawer is clicked */
    for(var i = 0; i < subInfos.length; i++){
       	subInfos[i].addEventListener('click', function(e) {
      	    var currentElem = e.srcElement.id;
        	  for (var x = 0; x < subInfoId.length; x++) {
        		    if (x != currentElem) {
        			      hideElement(subInfoId[x]);
        		    } else {
        		  	    showElement(subInfoId[currentElem]);
        		    }
            }
        	  if (!subInfoDrawer.classList.contains('open')) {
        		    subInfoDrawer.classList.add('open');
        	  }
            e.stopPropagation();
        });
    }

    /* Open/ close the left Main Menu drawer when hamburger menu icon is clicked
       Close left Locations Search List drawer when left Main Menu drawer opens
       Close left Sub Info drawer when left Main Menu drawer opens */

    menu.addEventListener('click', function(e) {
      	menuDrawer.classList.toggle('open');
      	if (subInfoDrawer.classList.contains('open')) {
          	subInfoDrawer.classList.remove('open');
      	}
        if (menuDrawer.classList.contains('open')) {
            poiDrawer.classList.remove('open');
        }
        if (menuDrawer.classList.contains('open')) {
      	    listDrawer.classList.remove('open');
            hideElement('show-list');
        } else {
      	    listDrawer.classList.add('open');
            hideElement('show-list');
        }
        e.stopPropagation();
    });

    /* Close the left Main Menu drawer and the Sub Info drawer when meain element is clicked */
    main.addEventListener('click', function() {
        menuDrawer.classList.remove('open');
        subInfoDrawer.classList.remove('open');
        if (!listDrawer.classList.contains('open')) {
            showElement('show-list');
        }
    });

    /* Reset all drawers to default when header Reset button is clicked */
    resetButton.addEventListener('click', function() {
      	listDrawer.classList.remove('open');
        poiDrawer.classList.remove('open');
        menuDrawer.classList.remove('open');
        subInfoDrawer.classList.remove('open');
        showElement('show-list');
    });

    // Hide left POI drawer and left Main Menu drawer if selected location list item is not active anymore
    function checkListItemSelected() {
        var selected = document.querySelector('#locList > li.selected');
        if (!selected) {
            if (poiDrawer.classList.contains('open')) {
                poiDrawer.classList.remove('open');
                showElement('show-list');
            }
            if (menuDrawer.classList.contains('open')) {
                menuDrawer.classList.remove('open');
                showElement('show-list');
            }
        }
    }

    // TODO: Scroll to active location list item
    /*var selected = $('ul #locList > li.selected');
        console.log(selected); */
    window.onclick = checkListItemSelected;

}