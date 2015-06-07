/*
  All events are bubbled up to the root svg element and to listen to events, 
  use the done callback.
*/
var map = new Datamap({
    element: document.getElementById('sdmap'),
    done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                var id = geography.id;
                var name = geography.properties.name;
                console.log("The id: " + id);
                console.log("The name: " + name);
                //testcolor('#000000', id);
                //updateLabel('neighborhood', geography.properties.name);
            });
        },
    geographyConfig: {
      dataUrl: 'maps/sdcounty.topo.json',
      highlightFillColor: '#8066ff',
      highlightBorderColor: '#'
    },

    popupOnHover: true, //disable the popup while hovering
    
    scope: 'sdcounty',
    fills: {
      defaultFill: '#008000',
      someKey: '#008000'
    },

    /*
    data: {
      '1': {fillKey: 'someKey'},
      '2': {fillKey: 'someKey'}
    },
    */
    /*
      By specifying a dataUrl, Datamaps will attempt to fetch that resource as TopoJSON.
      For custom map, you'll probably want to specify your own setProjection method as 
      well.

      setProjection takes 2 arguments, element as a DOM element, options as the original 
      options you passed in. It should return an object with two properties: path as a 
      d3.geo.path, projection as a d3.geo.projection
    */
    setProjection: function(element) {

      var ele = element;
      console.log("ele " + ele);
      /*
        projection(location)

        Projects forward from spherical coordinates (in degrees) to Cartesian 
        coordinates (in pixels). Returns an array [x, y] given the input array 
        [longitude, latitude]. May return null if the specified location has no defined 
        projected position, such as when the location is outside the clipping bounds of 
        the projection.
      */
      var projection = d3.geo.mercator()
        /*
          projection.center([location])

          If center is specified, sets the projection’s center to the specified 
          location, a two-element array of longitude and latitude in degrees and 
          returns the projection. If center is not specified, returns the current 
          center which defaults to ⟨0°,0°⟩.
        */
        //.center([-116.746, 33.004])
        .center([-116.540222, 32.872667])
        /*
          projection.scale([scale])

          If scale is specified, sets the projection’s scale factor to the specified 
          value and returns the projection. If scale is not specified, returns the 
          current scale factor which defaults to 150. The scale factor corresponds 
          linearly to the distance between projected points. However, scale factors are 
          not consistent across projections.
        */
        .scale(23000)
        /*
          projection.translate([point])

          If point is specified, sets the projection’s translation offset to the 
          specified two-element array [x, y] and returns the projection. If point 
          is not specified, returns the current translation offset which defaults 
          to [480, 250]. The translation offset determines the pixel coordinates 
          of the projection’s center. The default translation offset places ⟨0°,0°⟩ 
          at the center of a 960×500 area.
        */
        //.translate([element.offsetWidth / 2, element.offsetHeight / 2]);

       var path = d3.geo.path().projection(projection);
       console.log("$$$$ Inside setProjection -- PATH = " + path);
       return {path: path, projection: projection};
    }
  });

/*
function testcolor(color, id){
  console.log("id: " + id + " color: " + color);
  map.updateChoropleth({
    id: color
  });
}

function updateLabel(label, field) {
  var element = document.getElementById(label);
  console.log("chosen: " + field);
  element.innerHTML = field;
}
*/














