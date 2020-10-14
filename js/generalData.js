firstTime = true;

let readFile = () => {
	let generalData = [];
	return $.getJSON( "data/data.json").then(data => {
		$.each(data, (key, value) => {
    		generalData.push(value);
    	});
    	return generalData;
	});
}

let listData = () => {

    let city   = [];
    let type   = [];
    let result = [];

    let content = "";

    readFile().then((response) => {

        let cityCondition  = $("#selectCiudad option:selected").text().trim();
        let typeCondition  = $("#selectTipo option:selected").text().trim();
        let rangeCondition = $("#rangoPrecio").val().split(';');

    	$.each(response, (key, value) => {

            if(!city.includes(value.Ciudad))
                city.push(value.Ciudad);

            if(!type.includes(value.Tipo))
                type.push(value.Tipo);

            if(cityCondition != "Elige una ciudad" && typeCondition != "Elige un tipo"){
                if(cityCondition == value.Ciudad && typeCondition == value.Tipo)
                    result.push(value);
            }else if(cityCondition == "Elige una ciudad" && typeCondition != "Elige un tipo"){
                if(typeCondition == value.Tipo)
                    result.push(value);
            }else if(cityCondition != "Elige una ciudad" && typeCondition == "Elige un tipo"){
                if(cityCondition == value.Ciudad)
                    result.push(value);
            }else{
                result.push(value);
            }

    	});

        setCity(city, cityCondition);
        setType(type, typeCondition);
        setResult(result, 'main');
        setQuery();

    });
}

let setCity = (city, cityCondition) => {
    if(firstTime){
        $.each(city, (key, value) => {
            $("#selectCiudad").append(new Option(value, value));
        });
    }
    if(cityCondition != "Elige una ciudad")
        $("#selectCiudad").val(cityCondition);
}

let setType = (type, typeCondition) => {
    if(firstTime){
        $.each(type, (key, value) => {
            $("#selectTipo").append(new Option(value, value));
        });
    }
    if(typeCondition != "Elige un tipo")
        $("#selectTipo").val(typeCondition);
}

let setResult = (result, tab) => {
    if(tab == "main"){
        aux = $('#busqueda');
        message = "Resultados de la búsqueda";
    }else{
        aux = $('#resultado');
        message = "Mis Bienes";
    }
    aux.empty();
    aux.append(`<h5>${message} ${result.length}:</h5>`);
    $.each(result, (key, value) => {
        buttonCondition = "";
        if(tab == "main"){
            buttonCondition = `
            <tr>
                <td>&nbsp;</td>
                <td> <input type="button" class="btn green" value="Guardar" onClick="saveFunction(${value.Id})"> </td>
            </tr>`;
        }
        aux.append(`
        <div class="divider"></div>
        <table class="striped">
            <tr>
                <td width="35%"> <img src="img/home.jpg" style="width:100%;height:100%;"> </td>
                <td>
                    <strong>Direccion</strong> : ${value.Direccion}<br>
                    <strong>Ciudad</strong> : ${value.Ciudad}<br>
                    <strong>Telefono</strong> : ${value.Telefono}<br>
                    <strong>Codigo Postal</strong> : ${value.Codigo_Postal}<br>
                    <strong>Tipo</strong> : ${value.Tipo}<br>
                    <strong>Precio</strong> : ${value.Precio}<br>
                </td>
            </tr>
            ${buttonCondition}
        </table>`);
    });
    firstTime = false;
}

//Mejora con el change*
$("#selectTipo").change(() => {
    listData();
}); 
$("#selectCiudad").change(() => {
    listData();
});

$("#submitButton").click(() => {
    listData();
})

let saveFunction = (id) => {
    $.ajax({
        type:"post",
        dataType: "json",
        url:"scripts/handler.php",
        data:{
            id,
            action: "add"
        },
        success:function(response){
            if(response.code == "success")
                alert("Guardado con exito");
            else
                alert("Error");

            listData();
        }
    });
}

let setQuery = () =>{
    $.ajax({
        type:"post",
        dataType: "json",
        url:"scripts/handler.php",
        data:{
            action: "read"
        },
        success:function(response){
            setResult(response, 'second');
        }
    });
}
