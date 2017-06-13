(function(window) {

	// Service UUID
	var service_uuid = "19B10000-E8F2-537E-4F6C-D104768A1214";

	var auxDev = "";
	var device_Id;

	var peripheralConneted = false;
	var BTenabled = false;
	
	var pinArray = new Array(20);
	
	var beep = true;
	
	var listIndex = 0;

	document.addEventListener('deviceready', onStart, false);
	document.addEventListener("backbutton", onBackKeyDown, false);
	
	// ----------- On start function ------------------->
	function onStart() {
		checkBT();
		createPinArray();
	}
	
	function createPinArray(){
		for(var i = 0; i<14; i++){
			var nameAux = "Pin " + i;
			var pinAux = "D" + i;
			var idAux = "dPin" + i;
			var uuidAux = "";
			if(i<=9){
				uuidAux = "19B1000" + i + "-E8F2-537E-4F6C-D104768A1214";
			}else{
				uuidAux = "19B100" + i + "-E8F2-537E-4F6C-D104768A1214";
			}
			var pin = {name: nameAux, pin: pinAux, id: idAux, active: false, type: "digital", mode:"input", value: "0", c_uuid: uuidAux, pwm: "0"};
			pinArray[i] = pin;
		}
		pinArray[3].pwm = "19B10103-E8F2-537E-4F6C-D104768A1214";
		pinArray[5].pwm = "19B10105-E8F2-537E-4F6C-D104768A1214";
		pinArray[6].pwm = "19B10106-E8F2-537E-4F6C-D104768A1214";
		pinArray[9].pwm = "19B10109-E8F2-537E-4F6C-D104768A1214";
		pinArray[0].type = "deactivated";
		pinArray[1].type = "deactivated";
		
		for(var i = 14; i<20; i++){
			var nameAux = "Pin A" + (i-14);
			var pinAux = "A" + (i-14);
			var idAux = "aPin" + (i-14);
			var uuidAux = "19B1020"+(i-14)+"-E8F2-537E-4F6C-D104768A1214";
			var pin = {name: nameAux, pin: pinAux, id: idAux, active: false, type: "analog", mode:"input", value: "0", c_uuid: uuidAux, pwm: "0"};
			pinArray[i] = pin;
		}
		
	//	for(var i = 0; i<20; i++){
	//		str = JSON.stringify(pinArray[i]);
	//		console.log(str);
	//	}
		
	}
	
	// ----------- Check/Enable BT functions ------------------->
	function checkBT() {
		ble.startStateNotifications(function(state) {
			switch (state) {
			case "on":
				BTenabled = true;
				break;
			case "off":
				BTenabled = false;
				break;
			}

		}, function() {
			alert("faild BT check");
		});
	}
	

	// ----------- Peripheral search and connection ------------------->
	$('#connectionBtn').click(function() {
		if(BTenabled && !peripheralConneted){
			$('#connectionMenu').modal('show'); 
			$('#connectionBtn').attr("disabled", true);
			setTimeout(function() {
				$('#connectionBtn').attr("disabled", false);
				}, 5000);
			
			ble.scan([], 5, discoveredDevices, scanFailure);
		}else if(peripheralConneted){
			$('#desConnectionMenu').modal('show'); 
			
		}else{
			ble.enable(function() {
				}, function() {
			});
		}
	});

	function discoveredDevices(device) {

		if (auxDev == device.id) {
		} else {
			auxDev = device.id;
			var listItem = document.createElement('li'), html = '<b> Name: ' + device.name + '</b>' + 'ID: ' + device.id + '</b><br/>';
			
			listItem.dataset.deviceId = device.id;
			listItem.innerHTML = html;
			deviceList.appendChild(listItem);
			deviceList.addEventListener('click', connect, false);
		}
	}

	function scanFailure(reason) {
		alert("Busqueda de dispositivos fallo: " + reason);
	}

	function connect(e) {
		document.getElementById("deviceList").innerHTML = "";
		device_Id = e.target.dataset.deviceId;
		ble.connect(device_Id, onConnect, onDisconnect);
	}

	function onConnect(peripheral) {
		auxDev = null;
		peripheralConneted = true;
		$('#connectionMenu').modal('hide'); 
		
		$("#connectionItem").attr("src","img/bt_on.png");
		
		digitalRead();
		analogRead();
	}

	function onDisconnect(reason) {
		peripheralConneted = false;
		auxDev = null;
		$('#desConnectionMenu').modal('hide'); 
		$("#connectionItem").attr("src","img/bt_off.png");
	}

	$('#disconnect').click(function() {
		if(peripheralConneted){
			disconnectPeripheral();			
		}});
	
	function disconnectPeripheral() {
		ble.disconnect(device_Id, onDisconnect, discFailure);
	}

	function discFailure(reason) {
		alert("discFailure: " + reason);
	}

	// ----------- Navigation Functions ------------------->

	function onBackKeyDown(e) {
		$('#exitAppMenu').modal('show'); 		
	}
	
	$('#exitBtn').click(function() {
		if(peripheralConneted){
			disconnectPeripheral();			
	}
		exitApp();
	});
	
	$('#exitBtnMainMenu').click(function() {
		$('#exitAppMenu').modal('show'); 
	});
	
	$('#proyectoBtnMainMenu').click(function() {
		$('#verProyectoMenu').modal('show'); 
		
	});
	
	function exitApp(){
		navigator.app.exitApp();		
	}

	
	// ----------- Settings Functions --------------------->
	var selectedType;
	var selectedMode;
	var selectedPin;
	
	$('#createPinMenuBtn').click(function() {
		$('#createPinBtn').hide();
		$('#nextBtn').hide();
		document.getElementById("createPinContent").innerHTML = "";
		document.getElementById("createPinHeading").innerHTML = "Seleccione Modo:";
		
		var dig = document.createElement('li'), 
		html = '<a id="createDigPinBtn" class="btn btn-flat btn-brand-accent waves-attach">Digital</a>'; 
		dig.innerHTML = html;
		createPinContent.appendChild(dig);
		createDigPinBtn.addEventListener('click', createDigPin, false);
		
		var ana = document.createElement('li'), 
		html = '<a id="createAnaPinBtn" class="btn btn-flat btn-brand waves-attach">Analogico</a>';    
		ana.innerHTML = html;
		createPinContent.appendChild(ana);
		createAnaPinBtn.addEventListener('click', createAnaPin, false);
	});
	
	function createDigPin() {
		selectedType = "digital";
		document.getElementById("createPinContent").innerHTML = "";
		document.getElementById("createPinHeading").innerHTML = "Seleccione Modo:";
		selectPinMode();
	}
	
	function createAnaPin() {
		selectedType = "analog";
		document.getElementById("createPinContent").innerHTML = "";
		document.getElementById("createPinHeading").innerHTML = "Seleccione Modo:";
		selectPinMode();
	}
	
	function selectPinMode(){
		
		var inputOpt = document.createElement('li'), 
		html = '<a id="inputMode" class="btn btn-flat btn-brand-accent waves-attach">Entrada</a>';    
		inputOpt.innerHTML = html;
		createPinContent.appendChild(inputOpt);
		inputMode.addEventListener('click', inputSelected, false);
		
		var outputOpt = document.createElement('li'), 
		html = '<a id="outputMode" class="btn btn-flat btn-brand waves-attach">Salida</a>'; 
		outputOpt.innerHTML = html;
		createPinContent.appendChild(outputOpt);
		outputMode.addEventListener('click', outputSelected, false);
	}
	
	function inputSelected() {
		selectedMode = "input";
		document.getElementById("createPinContent").innerHTML = "";
		document.getElementById("createPinHeading").innerHTML = "Seleccione Pin:";
		createPinList();
	}
	
	function outputSelected() {
		selectedMode = "output";
		document.getElementById("createPinContent").innerHTML = "";
		document.getElementById("createPinHeading").innerHTML = "Seleccione Pin:";
		createPinList();
	}
	
	function createPinList(){
		var checked = "checked";
		for(var i = 0; i<20; i++){
			if(selectedType === "digital" && !pinArray[i].active && pinArray[i].type != "deactivated" && i<14){
				var listItemPin = document.createElement('li'), 
				html = '<div class="margin-left-lg radiobtn radiobtn-adv"><label><input class="access-hide" type="radio" value="'+ i +'" ' + checked + ' id="' + pinArray[i].id + '" name="pinRadio">' + 'Pin ' 
				+ pinArray[i].pin + ' <span class="radiobtn-circle"></span><span class="radiobtn-circle-check"></span></label></div>';    
				
				listItemPin.innerHTML = html;
				createPinContent.appendChild(listItemPin);
				checked = "";
				
			}else if(selectedType === "analog" && selectedMode === "input" && !pinArray[i].active && pinArray[i].type != "deactivated" && i>13){
				var listItemPin = document.createElement('li'), 
				html = '<div class="margin-left-lg radiobtn radiobtn-adv"><label><input class="access-hide" type="radio" value="'+ i +'" ' + checked + ' id="' + pinArray[i].id + '" name="pinRadio">' + 'Pin ' 
				+ pinArray[i].pin + ' <span class="radiobtn-circle"></span><span class="radiobtn-circle-check"></span></label></div>';    
				
				listItemPin.innerHTML = html;
				createPinContent.appendChild(listItemPin);
				checked = "";
				
			}else if(selectedType === "analog" && selectedMode === "output" && pinArray[i].pwm != "0" && !pinArray[i].active && pinArray[i].type != "deactivated"){
				
				var listItemPin = document.createElement('li'), 
				html = '<div class="margin-left-lg radiobtn radiobtn-adv"><label><input class="access-hide" type="radio" value="'+ i +'" ' + checked + ' id="' + pinArray[i].id + '" name="pinRadio">' + 'Pin ' 
				+ pinArray[i].pin + ' <span class="radiobtn-circle"></span><span class="radiobtn-circle-check"></span></label></div>'; 
				listItemPin.innerHTML = html;
				createPinContent.appendChild(listItemPin);
				checked = "";
			}			
		}
		$('#nextBtn').show();
		
	}
	
	$('#nextBtn').click(function(){
		selectedPin =  $('input:radio[name=pinRadio]:checked').val();
		document.getElementById("createPinContent").innerHTML = "";
		document.getElementById("createPinHeading").innerHTML = "Elija un Nombre:";
		
		var listPinName = document.createElement('li'), 
		html ='<div class="form-group form-group-label"> <label class="floating-label">Nombre</label> <input class="form-control" type="text" name="pinName" value=""> </div>';
		listPinName.setAttribute('id','pinName');
		listPinName.innerHTML = html;
		createPinContent.appendChild(listPinName);
		$('#createPinBtn').show();
		$('#nextBtn').hide();
		
	});
	
	$('#createPinBtn').click(function(){
	var auxName = $('input:text[name=pinName]').val();
	
	pinArray[selectedPin].active = true;
	pinArray[selectedPin].type = selectedType;
	pinArray[selectedPin].mode = selectedMode;
	
	if(auxName.length > 0){
		pinArray[selectedPin].name = auxName;
	}
	createPinCards();
	});
	
	$('#cancelBtn').click(function(){
		document.getElementById("createPinContent").innerHTML = "";
	});
	
	function createPinCards(){
		listIndex++;
		document.getElementById("pinCards").innerHTML = "";
		for(var i = 0; i<pinArray.length; i++){
			if(pinArray[i].type === "digital" && pinArray[i].mode === "output" && pinArray[i].active){
				var listItem = document.createElement('li'), 
				html =	'<div class="card">' + 
							'<div class="card-main">' +
								'<div class="card-header">' +
									'<div class="card-inner">' +
										'<h3 class="h5 margin-bottom-no margin-top-no"><b>'+pinArray[i].name+'</b>&nbsp;<sub>' + pinArray[i].pin + '</sub><span id="'+ pinArray[i].id +'delete" class="icon icon-lg pull-right">clear</span></h3>' +
									'</div>' +
								'</div>' +
								'<div class="card-inner">' +
									'<div class="row">' +
										'<div class="col-xx-4">' +
											'On / Off' +
										'</div>' +
										'<div class="col-xx-4">' +
										'</div>' +
										'<div class="text-right col-xx-4">' +
											'<div class="checkbox switch">' +
										    	'<label>' +
											        '<input class="access-hide" id="'+ pinArray[i].id +'" name="'+ pinArray[i].id +'" type="checkbox"><span class="switch-toggle"></span>' +
											    '</label>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>';
				listItem.setAttribute("id", listIndex);
				listItem.innerHTML = html;
				pinCards.appendChild(listItem);
			}
			if(pinArray[i].type === "digital" && pinArray[i].mode === "input" && pinArray[i].active){
				var listItem = document.createElement('li'), 
				html = 	'<div class="card">' +
							'<div class="card-main">' +
								'<div class="card-header">' +
									'<div class="card-inner">' +
										'<h3 class="h5 margin-bottom-no margin-top-no"><b>'+ pinArray[i].name +'</b>&nbsp;<sub>' + pinArray[i].pin + '</sub><span id="'+ pinArray[i].id +'delete" class="icon icon-lg pull-right">clear</span></h3>' +
									'</div>' +
								'</div>' +
							'<div class="card-inner">' +
								'<div class="row">' +
									'<div class="col-xx-6">' +
										'Notificaciones: ' +
									'</div>' +
									'<div class="text-right col-xx-6">' +
										'<span id="'+ pinArray[i].id + '" class="icon icon-lg">warning</span>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' +
					'</div>' ;
				listItem.setAttribute("id", listIndex);
				listItem.innerHTML = html;
				pinCards.appendChild(listItem);
			}
			if(pinArray[i].type === "analog" && pinArray[i].mode === "output" && pinArray[i].active){
				var listItem = document.createElement('li'), 
				html = '<div class="card">' +
							'<div class="card-main">' +
								'<div class="card-header">' +
									'<div class="card-inner">' +
										'<h3 class="h5 margin-bottom-no margin-top-no"><b>'+pinArray[i].name+'</b>&nbsp;<sub>'+ pinArray[i].pin +' - PWM</sub><span id="'+ pinArray[i].id +'delete" class="icon icon-lg pull-right">clear</span></h3>' +
									'</div>' +
								'</div>' +
								'<div class="card-inner">' +
									'<div class="row">' +
										'<div class="col-xx-12">' +
											'<div class="range range-primary">' +
												'<input class="analogOut" id="'+ pinArray[i].id +'pwm" type="range" name="' + pinArray[i].id+'pwm" min="0" max="255" value="0">' +
												'<output id="'+ pinArray[i].id +'2">0</output>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' ;
				listItem.setAttribute("id", listIndex);
				listItem.innerHTML = html;
				pinCards.appendChild(listItem);
			}
			if(pinArray[i].type === "analog" && pinArray[i].mode === "input" && pinArray[i].active){
				var listItem = document.createElement('li'), 
				html = 	'<div class="card">' +
							'<div class="card-main">' +
								'<div class="card-header">' +
									'<div class="card-inner">' +
										'<h3 class="h5 margin-bottom-no margin-top-no"><b>'+ pinArray[i].name +'</b>&nbsp;<sub>'+ pinArray[i].pin +'</sub><span id="'+ pinArray[i].id +'delete" class="icon icon-lg pull-right">clear</span></h3>' +
									'</div>' +
								'</div>' +
								'<div class="card-inner">' +
									'<div class="row">' +
										'<div class="col-xx-12">' +
											'<div id="' + pinArray[i].id + 'val" >0</div>' +
												
											'<div class="progress progress-brand">' +
												'<div id="' + pinArray[i].id + '" class="progress-bar" style="width: 0%"></div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>' ;
				listItem.setAttribute("id", listIndex);
				listItem.innerHTML = html;
				pinCards.appendChild(listItem);
			}
		}
		
		sortList("pinCards");
		
		digitalRead();
		analogRead();
	}
	
	function sortList(ul) {
		  if(typeof ul == "string")
		    ul = document.getElementById(ul);
		  if(!ul) {
		    return;
		  }
		  var lis = ul.getElementsByTagName("LI");
		  var vals = [];
		  for(var i = 0, l = lis.length; i < l; i++)
		    vals.push(lis[i].innerHTML);
		  vals.sort();
		  //  DESC
		  //  vals.reverse();
		  for(var i = 0, l = lis.length; i < l; i++)
		    lis[i].innerHTML = vals[i];
		}
	
	pinCards.addEventListener('click', function(e) {
		switch ($(e.target).attr("id")) {
		case "dPin2delete":
			pinArray[2].active = false;
			pinArray[2].name = "Pin 2";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin3delete":
			pinArray[3].active = false;
			pinArray[3].name = "Pin 3";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin4delete":
			pinArray[4].active = false;
			pinArray[4].name = "Pin 4";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin5delete":
			pinArray[5].active = false;
			pinArray[5].name = "Pin 5";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin6delete":
			pinArray[6].active = false;
			pinArray[6].name = "Pin 6";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin7delete":
			pinArray[7].active = false;
			pinArray[7].name = "Pin 7";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin8delete":
			pinArray[8].active = false;
			pinArray[8].name = "Pin 8";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin9delete":
			pinArray[9].active = false;
			pinArray[9].name = "Pin 9";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin10delete":
			pinArray[10].active = false;
			pinArray[10].name = "Pin 10";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin11delete":
			pinArray[11].active = false;
			pinArray[11].name = "Pin 11";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin12delete":
			pinArray[12].active = false;
			pinArray[12].name = "Pin 12";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "dPin13delete":
			pinArray[13].active = false;
			pinArray[13].name = "Pin 13";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
			
		case "aPin0delete":
			pinArray[14].active = false;
			pinArray[14].name = "Pin A0";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "aPin1delete":
			pinArray[15].active = false;
			pinArray[15].name = "Pin A1";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "aPin2delete":
			pinArray[16].active = false;
			pinArray[16].name = "Pin A2";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "aPin3delete":
			pinArray[17].active = false;
			pinArray[17].name = "Pin A3";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "aPin4delete":
			pinArray[18].active = false;
			pinArray[18].name = "Pin A4";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;
		case "aPin5delete":
			pinArray[19].active = false;
			pinArray[19].name = "Pin A5";
			document.getElementById("pinCards").innerHTML = "";
			createPinCards();
			break;

		}
	});
	
	// ----------- Digital Read functions ------------------->
	function digitalRead(){
		if(peripheralConneted){
			for(var i = 0; i<14; i++){
				if(pinArray[i].active && pinArray[i].type === "digital" && pinArray[i].mode === "input"){
					digNotification(i);
				}
			}
		}
	}
	
	function digNotification(index){
		ble.startNotification(device_Id, service_uuid, pinArray[index].c_uuid, onData, failure);
		
		var strg = "";
		function onData(buffer) {
			
			var data = new Uint8Array(buffer);
			strg = "";
			for (var i = 0; i < data.length; i++) {
				strg = strg.concat(data[i])
			}
			if(strg === "1"){

				$('#'+ pinArray[index].id).attr({"style" : 'color: green'});
			}else{
				
				$('#'+ pinArray[index].id).attr({"style" : 'color: black'});
			}
		}

		function failure(reason) {
			alert("dig Noti fail. reason: " + reason);
		}
	}
	
	// ----------- Digital Write functions ------------------->
	pinCards.addEventListener('change', function(e) {
		
		switch ($(e.target).attr("id")) {
		case "dPin2":
			var value = $('input:checkbox[name=dPin2]').is(':checked');
			if(value){
				sendData(1, pinArray[2].c_uuid);
			}else{
				sendData(0, pinArray[2].c_uuid);
			}
			
			break;
		case "dPin3":
			var value = $('input:checkbox[name=dPin3]').is(':checked');
			if(value){
				sendData(1, pinArray[3].c_uuid);
			}else{
				sendData(0, pinArray[3].c_uuid);
			}			
			break;
		case "dPin4":
			var value = $('input:checkbox[name=dPin4]').is(':checked');
			if(value){
				sendData(1, pinArray[4].c_uuid);
			}else{
				sendData(0, pinArray[4].c_uuid);
			}			
			break;
		case "dPin5":
			var value = $('input:checkbox[name=dPin5]').is(':checked');
			if(value){
				sendData(1, pinArray[5].c_uuid);
			}else{
				sendData(0, pinArray[5].c_uuid);
			}			
			break;
		case "dPin6":
			var value = $('input:checkbox[name=dPin6]').is(':checked');
			if(value){
				sendData(1, pinArray[6].c_uuid);
			}else{
				sendData(0, pinArray[6].c_uuid);
			}			
			break;
		case "dPin7":
			var value = $('input:checkbox[name=dPin7]').is(':checked');
			if(value){
				sendData(1, pinArray[7].c_uuid);
			}else{
				sendData(0, pinArray[7].c_uuid);
			}			
			break;
		case "dPin8":
			var value = $('input:checkbox[name=dPin8]').is(':checked');
			if(value){
				sendData(1, pinArray[8].c_uuid);
			}else{
				sendData(0, pinArray[8].c_uuid);
			}			
			break;
		case "dPin9":
			var value = $('input:checkbox[name=dPin9]').is(':checked');
			if(value){
				sendData(1, pinArray[9].c_uuid);
			}else{
				sendData(0, pinArray[9].c_uuid);
			}			
			break;
		case "dPin10":
			var value = $('input:checkbox[name=dPin10]').is(':checked');
			if(value){
				sendData(1, pinArray[10].c_uuid);
			}else{
				sendData(0, pinArray[10].c_uuid);
			}			
			break;
		case "dPin11":
			var value = $('input:checkbox[name=dPin11]').is(':checked');
			if(value){
				sendData(1, pinArray[11].c_uuid);
			}else{
				sendData(0, pinArray[11].c_uuid);
			}			
			break;
		case "dPin12":
			var value = $('input:checkbox[name=dPin12]').is(':checked');
			if(value){
				sendData(1, pinArray[12].c_uuid);
			}else{
				sendData(0, pinArray[12].c_uuid);
			}			
			break;
		case "dPin13":
			var value = $('input:checkbox[name=dPin13]').is(':checked');
			if(value){
				sendData(1, pinArray[13].c_uuid);
			}else{
				sendData(0, pinArray[13].c_uuid);
			}
			break;
		}
	});

	function sendData(value, UUID) {
		if(peripheralConneted){
		var data = new Uint8Array(1);
		data[0] = value;
		ble.write(device_Id, service_uuid, UUID, data.buffer, onSuccess, onFailure);
		}
	}

	function onSuccess(peripheral) {
	}

	function onFailure(reason) {
		alert("No enviado: " + reason);
	}
	
	// ----------- Analog Read functions ------------------->
	function analogRead(){
		if(peripheralConneted){
			for(var i = 14; i<20; i++){
				if(pinArray[i].active && pinArray[i].type === "analog" && pinArray[i].mode === "input"){
					anaNotification(i);
				}
			}
		}
	}
	
	function anaNotification(index) {
		ble.startNotification(device_Id, service_uuid, pinArray[index].c_uuid, onData, failure);
		var strg = "";

		function onData(buffer) {
			var data = new Uint8Array(buffer);
			strg = "";
			for (var i = 0; i < data.length; i++) {
				strg = strg.concat(data[i])

			}
			$('#'+ pinArray[index].id).css('width', strg + '%');
			$('#'+ pinArray[index].id + 'val').text(strg + '%');
		}

		function failure(reason) {
			alert(reason);
		}
	}
	
	// ----------- Analog Write functions ------------------->
	pinCards.addEventListener('change', function(e) {
			switch ($(e.target).attr("id")) {
			case "dPin3pwm":
				var value = $('#dPin3pwm').val();
				$('#dPin32').val(value);
				sendPWMData(value, pinArray[3].pwm);
				break;
			case "dPin5pwm":
				var value = $('#dPin5pwm').val();
				$('#dPin52').val(value);
				sendPWMData(value, pinArray[5].pwm);
				break;
			case "dPin6pwm":
				var value = $('#dPin6pwm').val();
				$('#dPin62').val(value);
				sendPWMData(value, pinArray[6].pwm);
				break;
			case "dPin9pwm":
				var value = $('#dPin9pwm').val();
				$('#dPin92').val(value);
				sendPWMData(value, pinArray[9].pwm);
				break;
			}
		});
	
	function sendPWMData(value, UUID){
		if(peripheralConneted){
			var data = new Uint8Array(1);
			data[0] = value;
			ble.write(device_Id, service_uuid, UUID, data.buffer, onSuccess, onFailure);
		}
	}

})(window);
