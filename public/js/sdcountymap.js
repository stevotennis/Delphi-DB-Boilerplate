var map = new Datamap({
    element: document.getElementById('sdmap'),
    done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                var id = geography.id;
                console.log("id: " + id);
                testcolor('#000000', id);
                updateLabel('neighborhood', geography.properties.name);
            });
        },
    geographyConfig: {
      dataUrl: 'maps/sdcounty.topo.json',
      highlightFillColor: '#008000',
      highlightBorderColor: '#'
    },
    scope: 'sdcounty',
    fills: {
      defaultFill: '#8066ff',
      someKey: '#8066ff'
    },
    data: {
      '1': {fillKey: 'someKey'},
      '2': {fillKey: 'someKey'}
    },
    setProjection: function(element) {

      var projection = d3.geo.mercator()

        .center([-116.746, 33.004])
        .scale(20000)
        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);

       var path = d3.geo.path().projection(projection);
       return {path: path, projection: projection};
    }
  });

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