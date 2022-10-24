$().ready(function () {
	window.ubicaciones=[];
	var map=[];
  arbol();
  

});//ready
    


  function initMap(ubicaciones) {


    var locations = ubicaciones;
    console.log(locations);
    if(locations.length > 1){
      var zoom_map=10;
    }else{
      var zoom_map=20;
    }
    console.log(zoom_map)


    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: zoom_map,
      center: new google.maps.LatLng(locations[0][1], locations[0][2]),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) { 
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i][1], locations[i][2]),
        center: new google.maps.LatLng(locations[i][1], locations[i][2]),
        map: map,
        icon: locations[i][3]
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent(locations[i][0]);
          infowindow.open(map, marker);
        }
      })(marker, i));
}


      }

function carros(id_carro) {
   var image = {
        url: '/OCD/OCD2/img/cartop_verde.png',
        scaledSize: new google.maps.Size(35, 18),     
    }; 

    peticion("rastreo", "vehiculos", "&c_id=" +id_carro, "").done(function(result) {
       if (result.code == "OK") {
       	var ubicaciones = [];
       	$.each(result['data'], function(){
       		var coordenadas = this.final.split(",");
       		ubicaciones.push([this.nick,coordenadas[0],coordenadas[1], image])
       	})
        //console.log(ubicaciones);
       	initMap(ubicaciones);
        } else {
        	alert("No hay registros.");
        }
    });
}

function arbol() {
  //console.log($("#car_path").val());
   peticion("rastreo", "arbol", "&car_path="+$("#car_path").val()+"&car_path="+$("#car_path").val()+"&id_usuario="+$("#id_usuario").val(), "").done(function(result) {
    if(result.code=="OK"){
      var datos = result.data;
      console.log(datos);
      
     	/*var treeData = [
			    {title: "Document with some children (expanded on init)",
			      children: [
			        {title: "Sub-item 4.1", expand: true,
			          children: [
			            {title: "Sub-item 4.1", expand: true,
			          children: [
			            {title: "Sub-item 4.1.1", key: "id4.1.1" },
			            {title: "Sub-item 4.1.2", key: "id4.1.2" }
			          ]
			        }
			          ]
			        }
			      ]
			    }
			  ];*/
			 var treeData = datos;

		//console.log(treeData);
       $("#tree").dynatree({
      checkbox: true,
      selectMode: 3,
      children: treeData,
      onSelect: function(select, node) {
        // trae el valor del ID
        var selKeys = $.map(node.tree.getSelectedNodes(), function(node){
          return node.data.key;
        });
        //console.log(selKeys);
        carros(selKeys);
        tabla(selKeys);
        alertas(selKeys);
         
      },
      onDblClick: function(node, event) {
        node.toggleSelect();
      },
      onKeydown: function(node, event) {
        if( event.which == 32 ) {
          node.toggleSelect();
          return false;
        }
      }
    });
      
      
      }//code ok
      else{
      }

                
});
}

function tabla(id_carro) {
    peticion("rastreo", "tabla", "&c_id=" +id_carro, "").done(function(result) {
    	if(result.code=="OK"){
      var datos = result.data;
      console.log(datos);
        
       $(document).ready(function () {
            
      var datos = result.data;
        
      var camposType=[
            { name: 'c_id', type: 'number'  },
            { name: 'c_vehicleNO', type: 'string'  },
            { name: 'o_name', type: 'string' },
            { name: 'final', type: 'string' },
            { name: 'end_addr', type: 'string' },
            { name: 'status', type: 'string' },
            { name: "direccion", type: 'string' },
            { name: "speed", type: 'string' }
          ];
          
      var source =
      {
        localdata: result.data,
        datatype: "array",
        datafields:camposType
      };
      var dataAdapter = new $.jqx.dataAdapter(source);
            // initialize jqxGrid
            $("#jqxWidget").jqxGrid(
            {
                width: "100%",
                source: dataAdapter, 
                theme: 'metro',               
                pageable: false,
                autoheight: true,
                sortable: true,
                altrows: true,
                groupable: true,
                enabletooltips: false,
                editable: false,
                selectionmode: 'singlerows',
                columns: [
                  { text: 'GRUPO', datafield: 'o_name', width: "10%" },
                  { text: 'ID AUTO', datafield: 'c_id', width: "10%" },
                  { text: 'VEHICULO MATRICULA', datafield: 'c_vehicleNO', width: "10%" },
                  { text: 'ULTIMO REGISTRO', datafield: 'final', width: "15%" },
                  { text: 'DOMICILIO', datafield: 'end_addr', width: "25%" },
                  { text: 'ESTADO', datafield: 'status', width: "10%" },
                  { text: 'VELOCIDAD', datafield: 'speed', width: "10%" },
                  { text: 'DIRECCION', datafield: 'direccion', width: "10%" }
                ]
            });
            $('#jqxWidget').jqxGrid('addgroup', 'o_name');
            $('#jqxWidget').on('rowselect', function (event) {
     //alert("Row with bound index: " + event.args.rowindex + " has been selected");
     var id_auto_selecccionado=event.args.row.c_id;
     carros(id_auto_selecccionado);
 });
        });
      }//code ok                
	});
}

function alertas(id_carro) {
    peticion("rastreo", "tabla_alertas", "&c_id=" +id_carro+"&time_offset="+$("#time_offset").val(), "").done(function(result) {
     if(result.code=="OK"){
      var datos = result.data;
      console.log(datos);
        
      $(document).ready(function () {
            
      var datos = result.data;
        
      var camposType=[
            { name: 'car_id', type: 'number'  },
            { name: 'c_vehicleNO', type: 'string'  },
            { name: 'd_time_d', type: 'string' },
            { name: 'acceleration', type: 'string' },
            { name: 'braking', type: 'string' },
            { name: 'rpm', type: 'string' },
            { name: "speeding", type: 'string' }
          ];
          
      var source =
      {
        localdata: result.data,
        datatype: "array",
        datafields:camposType
      };
      var dataAdapter = new $.jqx.dataAdapter(source);
            // initialize jqxGrid
            $("#jqxWidget_alerta").jqxGrid(
            {
                width: "100%",
                source: dataAdapter, 
                theme: 'metro',               
                pageable: false,
                autoheight: true,
                sortable: true,
                altrows: true,
                groupable: true,
                enabletooltips: false,
                editable: false,
                selectionmode: 'singlerows',
                columns: [
                  { text: 'ID AUTO', datafield: 'c_id', width: "20%" },
                  { text: 'VEHICULO MATRICULA', datafield: 'c_vehicleNO', width: "20%" },
                  { text: 'FECHA', datafield: 'd_time_d', width: "20%" },
                  { text: 'ACELERACION', datafield: 'acceleration', width: "10%" },
                  { text: 'BRAKING', datafield: 'braking', width: "10%" },
                  { text: 'RPM', datafield: 'rpm', width: "10%" },
                  { text: 'SPEEDING', datafield: 'speeding', width: "10%" }
                ]
            });
        }); 
      }//code ok             
  });
}


