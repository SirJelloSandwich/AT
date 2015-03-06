//JS FUNCTIONS
var highFlowPsi;

function $$(id){ return document.getElementById(id); }

function Round2(Numb,Digit)
{
	var Mult= Math.pow(10, Digit); 
	Numb *= Mult;        
	return Math.round(Numb)/Mult;
}


				
var RefreshRate=2000;//2000;

var mainPowerGauge;    
var mainPowerSlider;

var Energy = {
				W:    50.0,//Math.round((Math.random() * 300 + 1) * 10) / 10,
				kW:   100,
				kWpT: 100,
				EER:  6,
				COP: 3.5};
			
var Cooling= {
				BTUH: 50.0,//Math.round((Math.random() * 300 + 1) * 10) / 10,
				tons: 100,
				Evap: 100,
				MFPM: 100, 
				hliq: 100,
				hvap: 100,
				Dh:   100,
				Rho:  100,
				Flow: 100,
				dP:   10};
			
var AIR = {
			SAT: 50.0,//Math.round((Math.random() * 300 + 1) * 10) / 10,
			OAT: 100,
			EAT: 100,
			ERH: 80,
			LAT: 100,
			CS:  100,
			ES:  100, 
			CFS: 100,
			EFS:  100};


var mainCapacityGauge;    
var mainCapacitySlider;

var mainAirTempsGauge;   
var mainEATSlider;
var mainSATSlider;


var refrigerantLowPressureGauge;  
var refrigerantLowPressureSlider;



var refrigerantHighPressureGauge;  
var refrigerantHighPressureSlider;
var refrigerantLowTempGauge;  
var refrigerantLowTempSlider;
var RefLo = {
					Pres: 50.0, //Math.round((Math.random() * 300 + 1) * 10) / 10,
				SatT: 0,
				FloT: 0,
				SHSC: 0,
								Trgt: 0,
};
		
var refrigerantHighPressureGauge;  
var refrigerantHighPressureSlider;
var refrigerantHighTempGauge;  
var refrigerantHighTempSlider;
var RefHi = {
				Pres: 50.0, //Math.round((Math.random() * 600 + 1) * 10) / 10,
				SatT: 0,
				FloT: 0,
				SHSC: 0,
								Trgt: 0
};

var effLineGauge;  
var effIEERSlider;
var effEERSlider;
 
 
var blowerSpeed; 
var blowerSpeedSlider;

var fanSpeed;  
var fanSpeedSlider;

var bpDamper;  
var bpdamperSlider;

var chargeSwitch;  
var chargeSwitchSlider;

var multiGauge;  
var multiGaugeSlider;

var Set=1;




function FTOR(T_F) { return T_F+459.67; }              /* exact */
function GetSatVapPres(TDryBulb)
{ var LnPws, T;

T = FTOR(TDryBulb);
if (TDryBulb >= -148. && TDryBulb <= 32.){
LnPws = (-1.0214165E+04/T - 4.8932428 - 5.3765794E-03*T + 1.9202377E-07*T*T
	+ 3.5575832E-10*T*T*T - 9.0344688E-14*T*T*T*T + 4.1635019*Math.log(T));}
else if (TDryBulb > 32. && TDryBulb <= 392. ){
LnPws = -1.0440397E+04/T - 1.1294650E+01 - 2.7022355E-02*T + 1.2890360E-05*T*T
- 2.4780681E-09*Math.pow(T, 3) + 6.5459673*Math.log(T);}
else{return INVALID; }            // TDryBulb is out of range [-100, 200]
return Math.exp(LnPws);
}

var HumRatio, TDewPoint, TWetBulb;

function PSY(TDryBulb, Pressure, RelHum)
{ var VapPres;
//-----VapPress------------
VapPres = RelHum*GetSatVapPres(TDryBulb);
//-----HumRatio------------
HumRatio = 0.621945*VapPres/(Pressure-VapPres);
//-----TWetBulb------------


// Declarations
var Wstar;
var Wsstar;
var SatVaporPres;
var TWetBulbSup, TWetBulbInf;


var alpha, VP;
VP = VapPres;
alpha = Math.log(VP);
if (TDryBulb >= 32 && TDryBulb <= 200){//alert("TDryBulb >= 32 && TDryBulb <= 200");
TDewPoint = 100.45+33.193*alpha+2.319*alpha*alpha+0.17074*Math.pow(alpha,3)+1.2063*Math.pow(VP, 0.1984);
//alert("TDewPoint"+TDewPoint);
}                         // (39)
else if (TDryBulb < 32){//alert("TDryBulb < 32");
TDewPoint = 90.12+26.142*alpha+0.8927*alpha*alpha; }    // (40)
else{TDewPoint = INVALID; alert("invalid");}                              // Invalid value

TDewPoint= Math.min(TDewPoint, TDryBulb);

// Initial guesses
TWetBulbSup = TDryBulb;
TWetBulbInf = TDewPoint;
TWetBulb = (TWetBulbInf + TWetBulbSup)/2.;

// Bisection loop
while(TWetBulbSup - TWetBulbInf > 0.001)
{
// Compute humidity ratio at temperature Tstar

SatVaporPres = GetSatVapPres(TWetBulb);
Wsstar = 0.621945*SatVaporPres/(Pressure-SatVaporPres);
Wstar =((1093 - 0.556*TWetBulb)*Wsstar - 0.240*(TDryBulb - TWetBulb))/ (1093 + 0.444*TDryBulb - TWetBulb);

// Get new bounds
if (Wstar > HumRatio){TWetBulbSup = TWetBulb;}
else{TWetBulbInf = TWetBulb;}

// New guess of wet bulb temperature
TWetBulb = (TWetBulbSup+TWetBulbInf)/2.;
}
//alert("exited function");
}



	
	mainPowerGauge = new PerfectWidgets.Widget("main-power-gauge", mainPowerModel35);
	mainPowerSlider = mainPowerGauge.getByName("mainPowerSlider");
	mainCapacityGauge = new PerfectWidgets.Widget("main-capacity-gauge", mainCapacityModel35);
	mainCapacitySlider = mainCapacityGauge.getByName("mainCapacitySlider"); 
	mainAirTempsGauge = new PerfectWidgets.Widget("main-air-temps-gauge", mainAirTempsModel);
	mainEATSlider = mainAirTempsGauge.getByName("mainEATSlider");
	mainSATSlider = mainAirTempsGauge.getByName("mainSATSlider");  
	
	//Slider1 = EAT = yellow
	//Slider2 = SAT = blue
	
	refrigerantLowPressureGauge = new PerfectWidgets.Widget("low-pressure-gauge", refrigerantLowPressureModel);
	refrigerantLowPressureSlider = refrigerantLowPressureGauge.getByName("lowPressureSlider"); 
	refrigerantHighPressureGauge = new PerfectWidgets.Widget("high-pressure-gauge", refrigerantHighPressureModel);
	refrigerantHighPressureSlider = refrigerantHighPressureGauge.getByName("highPressureSlider");    
	
	refrigerantLowTempGauge = new PerfectWidgets.Widget("low-flow-temp-gauge", refrigerantLowTempModel);
	refrigerantLowTempSlider = refrigerantLowTempGauge.getByName("lowTempSlider"); 
	refrigerantHighTempGauge = new PerfectWidgets.Widget("high-flow-temp-gauge", refrigerantHighTempModel);
	refrigerantHighTempSlider = refrigerantHighTempGauge.getByName("highTempSlider"); 
	
	c2RefrigerantLowTempGauge = new PerfectWidgets.Widget("c2-low-flow-temp-gauge", c2RefrigerantLowTempModel);
	c2RefrigerantLowTempSlider = c2RefrigerantLowTempGauge.getByName("c2LowTempSlider"); 
	c2RefrigerantHighTempGauge = new PerfectWidgets.Widget("c2-high-flow-temp-gauge", c2RefrigerantHighTempModel);
	c2RefrigerantHighTempSlider = c2RefrigerantHighTempGauge.getByName("c2HighTempSlider");
	
	c2RefrigerantLowPressureGauge = new PerfectWidgets.Widget("c2-low-pressure-gauge", c2RefrigerantLowPressureModel);
	c2RefrigerantLowPressureSlider = c2RefrigerantLowPressureGauge.getByName("c2LowPressureSlider"); 
	c2RefrigerantHighPressureGauge = new PerfectWidgets.Widget("c2-high-pressure-gauge", c2RefrigerantHighPressureModel);
	c2RefrigerantHighPressureSlider = c2RefrigerantHighPressureGauge.getByName("c2HighPressureSlider");
	
	effLineGauge = new PerfectWidgets.Widget("efficiency-line-gauge", effLineGaugeModel);
	effIEERSlider = effLineGauge.getByName("ieerSlider");  
	effEERSlider = effLineGauge.getByName("eerSlider");  
	
	blowerSpeed = new PerfectWidgets.Widget("control-blower-speed", blowerSpeedModel);
	blowerSpeedSlider = blowerSpeed.getByName("blowerSpeedSlider"); 
	fanSpeed = new PerfectWidgets.Widget("control-fan-speed", fanSpeedModel);
	fanSpeedSlider = fanSpeed.getByName("fanSpeedSlider"); 
	bpDamper = new PerfectWidgets.Widget("control-bp-damper", damperModel);
	bpDamperSlider = bpDamper.getByName("damperSlider"); 
	chargeSwitch = new PerfectWidgets.Widget("control-charge-switch", chargeSwitchModel);
	chargeSwitchSlider = chargeSwitch.getByName("chargeSlider");
	chargeSwitchSlider.setValue(0);
	multiGauge = new PerfectWidgets.Widget("control-multi-gauge", multiGaugeModel);
	multiGaugeEERSlider = multiGauge.getByName("eerSlider"); 
	multiGaugeCapacitySlider = multiGauge.getByName("capacitySlider"); 
	multiGaugePowerSlider = multiGauge.getByName("powerSlider");
	
	c2ChargeSwitch = new PerfectWidgets.Widget("c2-control-charge-switch", c2ChargeSwitchModel);
	c2ChargeSwitchSlider = c2ChargeSwitch.getByName("c2ChargeSlider");
	c2ChargeSwitchSlider.setValue(0);
	c2MultiGauge = new PerfectWidgets.Widget("c2-control-multi-gauge", c2MultiGaugeModel);
	c2MultiGaugeEERSlider = c2MultiGauge.getByName("c2EerSlider"); 
	c2MultiGaugeCapacitySlider = c2MultiGauge.getByName("C2CapacitySlider"); 
	c2MultiGaugePowerSlider = c2MultiGauge.getByName("c2PowerSlider"); 

	blowerSpeedSlider.setValue(100);
		fanSpeedSlider.setValue(100);
	bpDamperSlider.setValue(0);
				 


function updateGaugeValues() {
	
	// Start Main page Gauges
		
	mainPowerSlider.setValue(Energy.kW);  
	 
	
	mainEATSlider.setValue(AIR.EAT);//need to have pdq output
	mainSATSlider.setValue(AIR.SAT);//need to have pdq output
	// End Main page Gauges
	
	
	// $$().innerHTML=;
	// Start Refrigerant page Gauges/Values
//		var refrigLowPressureValue = Math.round((Math.random() * 500 + 1) * 10) / 10; 
	refrigerantLowPressureSlider.setValue(RefLo.Pres);
	$('#low-pressure-readout').html(RefLo.Pres);
	$$("low-psig").innerHTML=RefLo.Pres;
	//var refrigHighPressureValue = Math.round(Math.random() * 500 + 1);
	refrigerantHighPressureSlider.setValue(RefHi.Pres);
	$('#high-pressure-readout').html(RefHi.Pres);
	$$("high-psig").innerHTML=RefHi.Pres;
	 
	refrigerantLowTempSlider.setValue(RefLo.FloT);
	$$("cs-low-temp").innerHTML=RefLo.FloT;
	
	refrigerantHighTempSlider.setValue(RefHi.FloT);
	$$("cs-high-temp").innerHTML=RefHi.FloT;
	
	$('#low-sat-temp').html(RefLo.SatT);
	$$("low-sst").innerHTML=RefLo.SatT;
	
	$('#high-sat-temp').html(RefHi.SatT);
	$$("high-slt").innerHTML=RefHi.SatT;
	
	$('#low-superheat').html(RefLo.SHSC);
	$$("cs-low-sh").innerHTML=RefLo.SHSC;
	$('#high-subcool').html(RefHi.SHSC);
	$$("cs-high-sc").innerHTML=RefHi.SHSC;
	
	
	RefHi.Trgt=0.366942*RefHi.Pres-.000208*RefHi.Pres*RefHi.Pres-6.878337;
	RefHi.Trgt=Round2(RefHi.Trgt,1);
	RefLo.Trgt=RefLo.SatT+4;
	RefLo.Trgt=Round2(RefLo.Trgt,1);
	$('#low-target-temp').html(RefLo.Trgt);
	$('#high-target-temp').html(RefHi.Trgt);
	$$('high-flow-psi').innerHTML  = highFlowPsi;
	$$('low-flow-delta').innerHTML = Round2((RefHi.Pres - highFlowPsi), 1);
	// End Refrigerant page Gauges/Values
	
	$$("cs-high-btu").innerHTML=Cooling.hliq;
	$$("cs-low-btu").innerHTML =Cooling.hvap;
	
	$$("cs-high-gal").innerHTML=Cooling.Rho;
	
	
	$$("cs-low-lat").innerHTML=AIR.LAT;
	$$("erh").innerHTML=AIR.ERH;
	
	// Start Energy page Gauges
	
	
	
	//var eerVal = Math.round((Math.random() * 100 + 1) * 10) / 10;
	
	// End Energy page gauges
	//refrigerantLowPressureSlider.value;
	// Start Control page gauges
	if(Set==2){
		Ctrl.CFS=blowerSpeedSlider.getValue();
		Long_To_Controller('CFhtml', Ctrl.CFS);				
		//Log("Blower:"+Ctrl.EFS);
		
		Ctrl.EFS=fanSpeedSlider.getValue();
		Long_To_Controller('EFhtml', Ctrl.EFS);
		//Log("Condenser:"+Ctrl.CFS);
		//alert(Ctrl.CFS);
		Ctrl.DS=bpDamperSlider.getValue();
		Long_To_Controller('DShtml', Ctrl.DS);
	}else
			{
					blowerSpeedSlider.setValue(Ctrl.BLOWER);
				fanSpeedSlider.setValue(Ctrl.FAN);
			bpDamperSlider.setValue(Ctrl.DAMPER);
			}
	//multiGauge line gauge 
	
	multiGaugePowerSlider.setValue(Energy.kW);
	$$("PWR").innerHTML=Energy.kW;
	
	if(!Energy.kW>0.15){
	
	
		mainCapacitySlider.setValue(0);  
		$$("cs-high-gpm").innerHTML=0;//pdq var= GPM
		
		effEERSlider.setValue(0);
		$('#eer-btuh-watt').html(0);
		multiGaugeEERSlider.setValue(0);
		$$("EER").innerHTML=0;
		
		
		
		
		 
		
		// End Control page gauges
		multiGaugeCapacitySlider.setValue(0);
		
		
		$$("COP").innerHTML=0;
		$$("kW/T").innerHTML=0;
		
		$$("oat").innerHTML=AIR.OAT;
		$$("high-cs").innerHTML=Round2(RefHi.SatT-AIR.OAT,1);
		
		$$("sat").innerHTML=AIR.SAT;
		$$("low-es").innerHTML=Round2(AIR.LAT-RefLo.SatT,1);
		$$("cap").innerHTML=0;
		
		
	
	}else{
		mainCapacitySlider.setValue(Cooling.tons);  
		$$("cs-high-gpm").innerHTML=Cooling.Flow;//pdq var= GPM
		
		
		$$("stats-tod-eer").innerHTML=PHPval.EER2D;
		effEERSlider.setValue(Energy.EER);
		$('#eer-btuh-watt').html(Energy.EER);
		multiGaugeEERSlider.setValue(Energy.EER);
		$$("EER").innerHTML=Energy.EER;
		
		if(Number($$("stats-low-eer").innerHTML)>Energy.EER)
		{ $$("stats-low-eer").innerHTML=Energy.EER;}
		if(Number($$("stats-high-eer").innerHTML)<Energy.EER)
		{ $$("stats-high-eer").innerHTML=Energy.EER;}
		
		if(Number($$("stats-low-ieer").innerHTML)>PHPval.IEER)
		{ $$("stats-low-ieer").innerHTML=OEM_limits(PHPval.IEER,"stats-oem-ieer");}
		if(Number($$("stats-high-ieer").innerHTML)<PHPval.IEER)
		{ $$("stats-high-ieer").innerHTML=OEM_limits(PHPval.IEER,"stats-oem-ieer");}
		
		
		 
		if(Number($$("stats-low-kwt").innerHTML)>Round2(PHPval.kWpT2D(),2))
		{ $$("stats-low-kwt").innerHTML=Round2(OEM_limits(PHPval.kWpT2D(),"stats-oem-kwt"),2);}
		if(Number($$("stats-high-kwt").innerHTML)<Round2(PHPval.kWpT2D(),2))
		{ $$("stats-high-kwt").innerHTML=Round2(OEM_limits(PHPval.kWpT2D(),"stats-oem-kwt"),2);}
		
		
		
		
		
		effIEERSlider.setValue(PHPval.IEER);
		$('#ieer-btuh-watt').html(PHPval.IEER);
		 
		
		// End Control page gauges
		multiGaugeCapacitySlider.setValue(Cooling.tons);
		
		
		$$("COP").innerHTML=Energy.COP;
		$$("kW/T").innerHTML=Energy.kWpT;
		
		$$("oat").innerHTML=AIR.OAT;
		$$("high-cs").innerHTML=Round2(RefHi.SatT-AIR.OAT,1);
		
		$$("sat").innerHTML=AIR.SAT;
		$$("low-es").innerHTML=Round2(AIR.LAT-RefLo.SatT,1);//Round2(AIR.SAT-RefLo.SatT,1);
		$$("cap").innerHTML=Cooling.tons;
		
		
	
	}
	
	
	$$("stats-tod-ieer").innerHTML=PHPval.IEER2D;
	$$("stats-tod-kwt").innerHTML=Round2(PHPval.kWpT2D(),2);
	$$("savings-energy-savings").innerHTML=Round2(PHPval.EnSavings(), 1);
	$$("savings-cost-savings").innerHTML=Round2(PHPval.$Savings(),2);
	$$("savings-efficiency-increase").innerHTML=Round2(PHPval.EffIncr(),1);
	
	PSY(AIR.EAT, 14.6959488, AIR.ERH/100);
	
	$$("eat").innerHTML=AIR.EAT;
	TWetBulb=Round2(TWetBulb,1);
	$$("ewb").innerHTML=TWetBulb;
	TDewPoint=Round2(TDewPoint,1);
	$$("edp").innerHTML=TDewPoint;
	HumRatio=HumRatio*7000;
	$$("egr").innerHTML=Round2(HumRatio,1);//need to fix, wrong variable
	
	$$("control-stats-h-psi").innerHTML=RefHi.Pres;
	$$("control-stats-l-psi").innerHTML=RefLo.Pres;
	
	$$("control-stats-h-slt").innerHTML=RefHi.SatT;
	$$("control-stats-l-sst").innerHTML=RefLo.SatT;
	
	$$("control-stats-h-sc").innerHTML=RefHi.SHSC;
	$$("control-stats-l-sh").innerHTML=RefLo.SHSC;
	
	$$("control-stats-h-cs").innerHTML=$$("high-cs").innerHTML;
	$$("control-stats-l-es").innerHTML=$$("low-es").innerHTML;
					
					// Setting the damper fan and blower
					
					
					
					
}setInterval(function (){updateGaugeValues();}, RefreshRate);


		function UpdateControlStates()
		{    $$("cfs").innerHTML=Ctrl.FAN;
		     $$("efs").innerHTML=Ctrl.BLOWER;
			 $$("dpr").innerHTML=Ctrl.DAMPER;	
		}setInterval(function (){UpdateControlStates();}, 500);

/*
	function updateGaugeValues() {
	
	// Start Main page Gauges
		
	mainPowerSlider.setValue(Energy.kW);  
	 
	
	mainEATSlider.setValue(AIR.EAT);//need to have pdq output
	mainSATSlider.setValue(AIR.SAT);//need to have pdq output
	// End Main page Gauges
	
	
	// $$().innerHTML=;
	// Start Refrigerant page Gauges/Values
//		var refrigLowPressureValue = Math.round((Math.random() * 500 + 1) * 10) / 10; 
	refrigerantLowPressureSlider.setValue(RefLo.Pres);
	$('#low-pressure-readout').html(RefLo.Pres);
	$$("low-psig").innerHTML=RefLo.Pres;
	//var refrigHighPressureValue = Math.round(Math.random() * 500 + 1);
	refrigerantHighPressureSlider.setValue(RefHi.Pres);
	$('#high-pressure-readout').html(RefHi.Pres);
	$$("high-psig").innerHTML=RefHi.Pres;
	 
	refrigerantLowTempSlider.setValue(RefLo.FloT);
	$$("cs-low-temp").innerHTML=RefLo.FloT;
	
	refrigerantHighTempSlider.setValue(RefHi.FloT);
	$$("cs-high-temp").innerHTML=RefHi.FloT;
	
	$('#low-sat-temp').html(RefLo.SatT);
	$$("low-sst").innerHTML=RefLo.SatT;
	
	$('#high-sat-temp').html(RefHi.SatT);
	$$("high-slt").innerHTML=RefHi.SatT;
	
	$('#low-superheat').html(RefLo.SHSC);
	$$("cs-low-sh").innerHTML=RefLo.SHSC;
	$('#high-subcool').html(RefHi.SHSC);
	$$("cs-high-sc").innerHTML=RefHi.SHSC;
	
	$('#low-target-temp').html(50);
	$('#high-target-temp').html(50);
	// End Refrigerant page Gauges/Values
	
	$$("cs-high-btu").innerHTML=Cooling.hliq;
	$$("cs-low-btu").innerHTML =Cooling.hvap;
	
	$$("cs-high-gal").innerHTML=Cooling.Rho;
	
	
	// Start Energy page Gauges
	
	
	
	//var eerVal = Math.round((Math.random() * 100 + 1) * 10) / 10;
	
	// End Energy page gauges
	//refrigerantLowPressureSlider.value;
	// Start Control page gauges
	if(Set==2){
		Ctrl.EFS=blowerSpeedSlider.getValue();
		Long_To_Controller('EFhtml', Ctrl.EFS);				
		Log("Blower:"+Ctrl.EFS);
		
		Ctrl.CFS=fanSpeedSlider.getValue();
		Long_To_Controller('CFhtml', Ctrl.CFS);
		Log("Condenser:"+Ctrl.CFS);
		//alert(Ctrl.CFS);
		Ctrl.DS=bpDamperSlider.getValue();
		Long_To_Controller('DShtml', Ctrl.DS);
	}
	//multiGauge line gauge 
	
	multiGaugePowerSlider.setValue(Energy.kW);
	$$("PWR").innerHTML=Energy.kW;
	
	if(!Energy.kW>0.15){
	
	
		mainCapacitySlider.setValue(0);  
		$$("cs-high-gpm").innerHTML=0;//pdq var= GPM
		
		effEERSlider.setValue(0);
		$('#eer-btuh-watt').html(0);
		multiGaugeEERSlider.setValue(0);
		$$("EER").innerHTML=0;
		
		
		
		
		 
		
		// End Control page gauges
		multiGaugeCapacitySlider.setValue(0);
		
		
		$$("COP").innerHTML=0;
		$$("kW/T").innerHTML=0;
		
		$$("oat").innerHTML=AIR.OAT;
		$$("cs").innerHTML=Round2(RefHi.SatT-AIR.OAT,1);
		
		$$("sat").innerHTML=AIR.SAT;
		$$("es").innerHTML=Round2(AIR.SAT-RefLo.SatT,1);
		$$("cap").innerHTML=0;
	
	}else{
		mainCapacitySlider.setValue(Cooling.tons);  
		$$("cs-high-gpm").innerHTML=Cooling.Flow;//pdq var= GPM
		
		
		$$("stats-tod-eer").innerHTML=PHPval.EER2D;
		effEERSlider.setValue(Energy.EER);
		$('#eer-btuh-watt').html(Energy.EER);
		multiGaugeEERSlider.setValue(Energy.EER);
		$$("EER").innerHTML=Energy.EER;
		
		if(Number($$("stats-low-eer").innerHTML)>Energy.EER)
		{ $$("stats-low-eer").innerHTML=Energy.EER;}
		if(Number($$("stats-high-eer").innerHTML)<Energy.EER)
		{ $$("stats-high-eer").innerHTML=Energy.EER;}
		
		if(Number($$("stats-low-ieer").innerHTML)>PHPval.IEER)
		{ $$("stats-low-ieer").innerHTML=PHPval.IEER;}
		if(Number($$("stats-high-ieer").innerHTML)<PHPval.IEER)
		{ $$("stats-high-ieer").innerHTML=PHPval.IEER;}
		
		
		 
		if(Number($$("stats-low-kwt").innerHTML)>Round2(PHPval.kWpT2D(),2))
		{ $$("stats-low-kwt").innerHTML=Round2(PHPval.kWpT2D(),2);}
		if(Number($$("stats-high-kwt").innerHTML)<Round2(PHPval.kWpT2D(),2))
		{ $$("stats-high-kwt").innerHTML=Round2(PHPval.kWpT2D(),2);}
		
		
		
		
		
		effIEERSlider.setValue(PHPval.IEER);
		$('#ieer-btuh-watt').html(PHPval.IEER);
		 
		
		// End Control page gauges
		multiGaugeCapacitySlider.setValue(Cooling.tons);
		
		
		$$("COP").innerHTML=Energy.COP;
		$$("kW/T").innerHTML=Energy.kWpT;
		
		$$("oat").innerHTML=AIR.OAT;
		$$("cs").innerHTML=Round2(RefHi.SatT-AIR.OAT,1);
		
		$$("sat").innerHTML=AIR.SAT;
		$$("es").innerHTML=Round2(AIR.SAT-RefLo.SatT,1);
		$$("cap").innerHTML=Cooling.tons;
	
	}
	
	
	$$("stats-tod-ieer").innerHTML=PHPval.IEER2D;
	$$("stats-tod-kwt").innerHTML=Round2(PHPval.kWpT2D(),2);
	$$("savings-energy-savings").innerHTML=Round2(PHPval.EnSavings(), 3);
	$$("savings-cost-savings").innerHTML=Round2(PHPval.$Savings(),3);
	$$("savings-efficiency-increase").innerHTML=Round2(PHPval.EffIncr(),3);
	
	
	$$("eat").innerHTML=AIR.EAT;
	
	$$("control-stats-h-psi").innerHTML=RefHi.Pres;
	$$("control-stats-l-psi").innerHTML=RefLo.Pres;
	
	$$("control-stats-h-slt").innerHTML=RefHi.SatT;
	$$("control-stats-l-sst").innerHTML=RefLo.SatT;
	
	$$("control-stats-h-sc").innerHTML=RefHi.SHSC;
	$$("control-stats-l-sh").innerHTML=RefLo.SHSC;
	
	$$("control-stats-h-cs").innerHTML=$$("cs").innerHTML;
	$$("control-stats-l-es").innerHTML=$$("es").innerHTML;

}setInterval(function (){updateGaugeValues();}, RefreshRate);

*/

function buttonFeedBack(elemID) {
	if($('#'+elemID).hasClass('active')) {
		$('#'+elemID).css({color:'#0f0'});
	}
	else {
		$('#'+elemID).css({color:'#000'});
	}
}



var controllerHostname = "192.168.2.211:8181"//"97.68.149.167:8181";"192.168.2.89:8181";//"97.68.149.167"; //"192.168.2.176:8887"; 

// The number of milliseconds to wait after the page finishes loading
// before we attempt to make a WebSocket connection.
var delayBeforeWebsocket = 6000;

// The number of times the browser tries to reconnect to the Controller
var timeoutReconnectTries = 10;

// the number of milliseconds to wait in between retries
var timeoutReconnectDelay = 6000;

// The maximum number of characters that will be displayed in the log at any one time
var maximumLogCharacters = 2000;



// ----- End Settings -----


// ----- My functions -----
/*
var Xint = function(a1,x1) {
};
*/

/*	
function ID_Type(X,Y)

if($$(obj.display).tagName=="INPUT")
{$$(obj.display).value = obj.value;}else
{$$(obj.display).innerHTML = obj.value;}
*/	
// ----- End My functions -----

var BROWSER_ERROR ={
	SOCKET_ERROR : 100, 
	JSON_PARAMETER_ERROR: 101, 
	JSON_ERROR: 102,
	EXECUTE_MESSAGE_ERROR: 103,
	WEBSOCKET_ERROR: 104,
	EVENT_TYPE_ERROR: 105,
	HTML_ID_ERROR: 106,
	MESSAGE_HTML_ID_ERROR: 107
};


// Firefox temporarily used MozWebSocket (why?), anyway, consider this here.
// Since the browserSupportNativeWebSocket method evaluates the existance of
// the window.WebSocket class, this abstraction need to be done on the very top.
// please do not move this lines down.
if( window.MozWebSocket ) {
	window.WebSocket = window.MozWebSocket;
}

var socket, socket2;



var AVG = {
	LoP:    [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	HiP:    [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	DisSat: [1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	kWPton: [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	EERv:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	BTUH:   [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	tons:   [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	MFPM:   [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	Flow:   [1,1,1,1,1,1,1,1,1,1],//[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	//MFPM:   [1,1,1,1,1,1,1,1],
	NVal:   function (A)
			{var B=0; 
			 for(var x=0; x < A.length; x++){B+=A[x];}
			 B/=A.length;
			 return B;},
	NewVal: function (A, val){A.pop(); A.unshift(val);}
};


function FILTER(A, val){
	var B=0, b=0;
	b=AVG.NVal(A);
	for(var x=0; x < A.length; x++)
	{B+=(A[x]-b)*(A[x]-b);}
	B/=(A.length-1);
	B=1.96*(Math.sqrt(B))/Math.sqrt(A.length);
	AVG.NewVal(A, val);
	if(val < (b-B) || val > (b+B))
	{ return 1;}else{return 0;}
}
var STRTemp;

function OEM_limits(val,type){
	var OEMval=Number($$(type).innerHTML);
	if(val<2*OEMval && val>OEMval/2){return val;}else
	if(val>2*OEMval){return 2*OEMval;}else
	if(val<OEMval/2){return OEMval/2}
}
//setInterval(function (){STRTemp=AVG.HiP;STRTemp.toString();alert(STRTemp);}, 2000);
var latestPORTTstate;
	
	var EXE = { 
	LoP: 		function (ObjVal) {
				//var Xtemp=FILTER(AVG.LoP, ObjVal);
				//ObjVal=AVG.NVal(AVG.LoP,ObjVal);
				ObjVal=Round2(ObjVal,1);
				//if(Xtemp==0){RefLo.Pres=ObjVal; }
				RefLo.Pres=ObjVal;
				return ObjVal;},  
	SucSat: 	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				RefLo.SatT=ObjVal;
				return ObjVal;}, 
	LowTemp: 	function (ObjVal) { //LowTemp
				ObjVal=Round2(ObjVal,1);
				RefLo.FloT=ObjVal;
				return ObjVal;}, 
	degF_Lo: 	function (ObjVal) {
				ObjVal=Round2(ObjVal,1);
				RefLo.SHSC=ObjVal;
				return ObjVal;}, 
	HiP:     	function (ObjVal) {
				//var Xtemp=FILTER(AVG.HiP, ObjVal);
				ObjVal=Round2(ObjVal,1);
				//if(Xtemp==0){RefHi.Pres=ObjVal;}
				RefHi.Pres=ObjVal;
				return ObjVal;}, 
	DisSat:  	function (ObjVal) {
				ObjVal=Round2(ObjVal,1);
				RefHi.SatT=ObjVal;
				return ObjVal;}, 
	HiTemp:   	function (ObjVal) { //HiTemp
				ObjVal=Round2(ObjVal,1);
				RefHi.FloT=ObjVal;
				return ObjVal;},
	degF_Hi: 	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				RefHi.SHSC=ObjVal;
				return ObjVal;},
	Watt:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Energy.W=ObjVal;
				return ObjVal;},
	kWPton:  	function (ObjVal) { 
				var Xtemp=FILTER(AVG.kWPton, ObjVal);
				ObjVal=Round2(ObjVal,1);
				if(Xtemp==0){Energy.kWpT=ObjVal;}
				return ObjVal;},
	EERv:    	function (ObjVal) { 
				var Xtemp=FILTER(AVG.EERv, ObjVal);
				if(Xtemp==0){ 
				ObjVal=OEM_limits(ObjVal,"stats-oem-eer");
				Energy.EER=Round2(ObjVal,1);
				ObjVal/=3.412;
				Energy.COP=Round2(ObjVal,2);}
				return ObjVal;},
	BTUH:    	function (ObjVal) { 
				var Xtemp=FILTER(AVG.BTUH, ObjVal);
				ObjVal=Round2(ObjVal,1);
				if(Xtemp==0){Cooling.BTUH=ObjVal;}
				return ObjVal;},
	tons:    	function (ObjVal) { 
				var Xtemp=FILTER(AVG.tons, ObjVal);
				ObjVal=Round2(ObjVal,1);
				if(Xtemp==0){Cooling.tons=ObjVal;}
				return ObjVal;},
	Evap:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Cooling.Evap=ObjVal;
				return ObjVal;},
	MFPM:    	function (ObjVal) {
				var Xtemp=FILTER(AVG.MFPM, ObjVal);
				ObjVal=Round2(ObjVal,1);
				if(Xtemp==0){Cooling.MFPM=ObjVal;}
				return ObjVal;},
	EnergykW:   function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Energy.kW=ObjVal;
				return ObjVal;},
	hliq:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Cooling.hliq=ObjVal;
				return ObjVal;},
	hvap:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Cooling.hvap=ObjVal;
				return ObjVal;},
	Dh:      	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Cooling.Dh=ObjVal;
				return ObjVal;},
	Rho:     	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				Cooling.Rho=ObjVal;
				return ObjVal;},
	Flow:    	function (ObjVal) { 
				var Xtemp=FILTER(AVG.Flow, ObjVal);
				ObjVal=Round2(ObjVal,1);
				if(Xtemp==0){Cooling.Flow=ObjVal;}
				
				return ObjVal;},
	dP:    		function (ObjVal) { 
				ObjVal=Round2(ObjVal,2);
				Cooling.dP=ObjVal;
				return ObjVal;},
	SAT:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				AIR.SAT=ObjVal;
				return ObjVal;},
	LAT:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				AIR.LAT=ObjVal;
				return ObjVal;},
	ERH:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				AIR.ERH=ObjVal;
				return ObjVal;},
	OAT:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				AIR.OAT=ObjVal;
				return ObjVal;},
	EAT:    	function (ObjVal) { 
				ObjVal=Round2(ObjVal,1);
				AIR.EAT=ObjVal;
				return ObjVal;},
	FAN:        function (ObjVal) {
							ObjVal=Round2(ObjVal,1);
				Ctrl.FAN=ObjVal;
							},
		BLOWER:     function (ObjVal) {
							ObjVal=Round2(ObjVal,1);
				Ctrl.BLOWER=ObjVal;
							},
		DAMPER:     function (ObjVal) {
							ObjVal=Round2(ObjVal,1);
				Ctrl.DAMPER=ObjVal;
							},
		highFlowPSI: 		function(ObjVal){
								ObjVal=Round2(ObjVal,1);
								highFlowPsi = ObjVal;
							},
		latest_PORTT_state:        function(ObjVal)
										{
											latestPORTTstate = ObjVal;
										}
				
};



var mosaic = {
	executeMessage: function (obj, objString) {
		
	// This breaks down the object after has been converted from JSON,
	// very useful for debugging.
	
	// $.each(obj, function(key, value) { 
	// alert(key + ': ' + value); 
	// });
	
	
	if( obj != undefined )
	{	if( obj.event != undefined )
		{ // if no paramstring paramater, create it
			if( obj.paramstring == undefined ){obj.paramstring = "";}

			eval( obj.event + "(" + obj.paramstring + ");" );
			return;
		}
		if( obj.value != undefined)
		{	var XxX=3;
			
			XxX=eval("EXE."+obj.display+"("+obj.value+");"); // "Replacement Function"
			//Log(object.display+"|"+object.value);
			//if( $$(obj.display) == null )
			if( XxX == null )
			{
				//Browser_Error( BROWSER_ERROR.MESSAGE_HTML_ID_ERROR, "Inbound data for id named '" + obj.display + "' which was not found in HTML page" );
			 return;
			}
			/*
			if($$(obj.display).tagName=="INPUT")
			{$$(obj.display).value = obj.value;}else
			{$$(obj.display).innerHTML = obj.value;}
			 */
			return;
		}
		if( obj.error != undefined )
		{	var errorNumber;
			if( obj.number == undefined )
			{errorNumber = 0;}else
			{errorNumber = obj.number;}
			
			Controller_Error( errorNumber, obj.error );
			return; 
		}
		if( obj.heartbeat != undefined ){return;}
	}

	//If we are here, then something was quite right about the JSON message
	//Browser_Error( BROWSER_ERROR.JSON_PARAMETER_ERROR, "Unknown parameters in message from Controller: " + objString );
	}

};
//$('.ImageBorder').delay(500).animate({ 'border-color': 'Transparent'}, 100).delay(500).animate({ 'border-color': 'Red'}, 100, pulse);
function socketOnMessage2(msg)
{
	//Log("Received: "+msg.data);
	/*
	var parsed2;
	try {parsed2 = $.parseJSON( msg.data ); } 
	catch(e) 
	{	parsed2 = null;
		Browser_Error( BROWSER_ERROR.JSON_ERROR, "Invalid JSON Input: " + msg.data );
		return;
	}

	try{mosaic.executeMessage( parsed2, msg.data );}
	catch(ex){Browser_Error( BROWSER_ERROR.EXECUTE_MESSAGE_ERROR, "Error while executing message: " + ex );}*/
}
function strencode( data ) {
return unescape( encodeURIComponent( JSON.stringify( data ) ) );
}

function strdecode( data ) {
return JSON.parse( decodeURIComponent( escape ( data ) ) );
}

//      file:///C:/Documents%20and%20Settings/Darin/Desktop/HTML%20Tutorials%20and%20Experiments/Real_Tabs6_S2S.html  
function socketOnMessage(msg)
{	
		//Log("Received: "+msg.data);
	var parsed;
	try {parsed = JSON.parse( msg.data ); } 
	catch(e) 
	{	parsed = null;
		Browser_Error( BROWSER_ERROR.JSON_ERROR, "Invalid JSON Input: " + msg.data );
		return;
	}
	try{mosaic.executeMessage( parsed, msg.data );}
	catch(ex){
	Browser_Error( BROWSER_ERROR.EXECUTE_MESSAGE_ERROR, "Error while executing message: " + ex );
	}
	
	
	try{socket2.send(msg.data);}
	catch(ex){Browser_Error(BROWSER_ERROR.SOCKET_ERROR, "(2)"+ex );}
	
}



var reconnectTries = 0;
function socketOnOpen(msg)
{
	reconnectTries = 0;
	//this.readyState usually equals 1 here
	//Long_To_Controller('HTMLRfgtC', 1); Log(Y.text+"="+Y.value);
	//Long_To_Controller('HTMLPwrC', 1); Log(Y.text+"="+Y.value);
	Log("PDQ: WebSocket - Connected!");
}
	
var reconnectTries2 = 0;
function socketOnOpen2(msg)
{
	reconnectTries2 = 0;
	//this.readyState usually equals 1 here
	//Long_To_Controller('HTMLRfgtC', 1); Log(Y.text+"="+Y.value);
	//Long_To_Controller('HTMLPwrC', 1); Log(Y.text+"="+Y.value);
	Log("Android: WebSocket - Connected!");
}

function socketOnClose(msg)
{
	//this.readyState usually equals 3 here
	Log("PDQ: WebSocket - Disconnected");
	if( reconnectTries < timeoutReconnectTries )
	{
	setTimeout('websocketConnect()', timeoutReconnectDelay);
	reconnectTries++;
	Log("PDQ: WebSocket - Reconnect attempt number " + reconnectTries);
	}else
	{
	Log("PDQ: WebSocket - Connection failed after " + timeoutReconnectTries + " attempts.");
	Log("PDQ: Refresh your browser to try again");
	}
}

function socketOnClose2(msg)
{
	//this.readyState usually equals 3 here
	Log("Android:WebSocket - Disconnected");
	if( reconnectTries2 < timeoutReconnectTries )
	{
	setTimeout('websocketConnect2()', timeoutReconnectDelay);
	reconnectTries2++;
	Log("Android:WebSocket - Reconnect attempt number " + reconnectTries2);
	}else
	{
	Log("Android:WebSocket - Connection failed after " + timeoutReconnectTries + " attempts.");
	Log("Android:Refresh your browser to try again");
	}
}


function init()
{ 
	if(conDisabled) {
		setTimeout(function() { Log("Connections disabled.") }, delayBeforeWebsocket);
	}
	else {
		if(multiClient) {
			setTimeout('websocketConnect()', delayBeforeWebsocket);
			Log("PDQ: Please wait for " + delayBeforeWebsocket / 1000 + " seconds.");
			//setTimeout('websocketConnect2()', delayBeforeWebsocket);
			//Log("Android: Please wait for " + delayBeforeWebsocket / 1000 + " seconds.");
		}
		else {
			setTimeout('websocketConnect()', delayBeforeWebsocket);
			Log("PDQ: Please wait for " + delayBeforeWebsocket / 1000 + " seconds.");
			setTimeout('websocketConnect2()', delayBeforeWebsocket);
			Log("Android: Please wait for " + delayBeforeWebsocket / 1000 + " seconds.");
		}
	}
}

//var socket;

function websocketConnect()
{
	var hostname; 
	
	// Use 'controllerHostname' as the host if isn't empty (see the top of javascript_api.js)
	// Otherwise use JavaScript to detect the ip or hostname of the controller
	if( controllerHostname )
	{hostname = controllerHostname;}else
	{hostname = top.location.hostname;}
	
	var websocketUrl1 = "ws://" + hostname + "/WEBSOCKET";
	
	if(multiClient) {
		websocketUrl1 = "ws://mobiuswebdesign.com:8888/ws";
	}
	
	try{
	socket = new WebSocket(websocketUrl1);
	
	//socket.readyState usually equals 0 here
	Log("PDQ: WebSocket - Opening Connection...");
	
	socket.onopen    = socketOnOpen;
	socket.onmessage = socketOnMessage;
	socket.onclose   = socketOnClose;
	}
	catch(ex)
	{Browser_Error( BROWSER_ERROR.WEBSOCKET_ERROR, "Error when trying to use WebSockets: " + ex );}
}

function websocketConnect2()
{
	
	var  websocketUrl2="ws://mobiuswebdesign.com:8888/ws";//"ws://97.68.149.167:8887/WEBSOCKET";// "ws://192.168.2.127:8887/WEBSOCKET";
	
	try{
	//socket = new WebSocket(websocketUrl2);
	
	//socket.readyState usually equals 0 here
	Log("Adroid: WebSocket - Opening Connection..."+websocketUrl2);
	
	socket2 = new WebSocket(websocketUrl2);
		socket2.onopen    = socketOnOpen2;
		socket2.onmessage = socketOnMessage2;
		socket2.onclose   = socketOnClose2;
	}
	catch(ex)
	{Browser_Error( BROWSER_ERROR.WEBSOCKET_ERROR, "Error when trying to use WebSockets: " + ex );}
	
	
}





// This function saves the state of the websocket in a variable, disconencts
// the socket, and then waits for 2 seconds if it was previously open.
function websocketDisconnect()
{
	/*CONNECTING (numeric value 0) The connection has not yet been established.
	OPEN (numeric value 1) The WebSocket connection is established and communication is possible.
	CLOSING (numeric value 2) The connection is going through the closing handshake.
	CLOSED (numeric value 3) The connection has been closed or could not be opened.
	*/
	Log("The Code thinks the window has been unloaded");
	socket.close();
	socket2.close();
	/*var i;
	for( i = 0; i < 10; i++ )
	{
	console.log( "loop: " + socket.readyState );
	msdelay( 1000 );
	}
	while( socket.ReadyState != 3 )
	{
	console.log( socket.ReadyState );
	}

	If we think connection is open, do a busy wait for 2 seconds
	if( state != 3 )*/
	
}

// software delay in milliseconds
function msdelay(millis)
{
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); }
	while(curDate-date < millis);
}

// Instruct the browser to call these functions when the page loads and unloads
window.onunload = websocketDisconnect;
window.onload = init;



function send_json_message( message )
{
	try{socket.send( message );}
	catch(ex)
	{Browser_Error( BROWSER_ERROR.SOCKET_ERROR, ex );}
}

function Controller_Error( number, message )
{Log("Controller Error " + number + ": " + message);}

function Browser_Error( number, message )
{/*Log("Browser Error " + number + ": " + message);*/}

function send_generic ( name, value, type )
{
	var message = new Object();
	message.name = name;
	message.value = value;
	//message.type = type;
	//Log(JSON.stringify( message ));
	send_json_message( JSON.stringify( message ) );
}

function send_bridge_message( display, value)
{
	var message2 = new Object(), msg2;
	message2.display = display;
	message2.value = value;
	//Log(JSON.stringify( message ));
	msg2=JSON.stringify( message2 );
	try{socket2.send( msg2 );}
	catch(ex)
	{Browser_Error( BROWSER_ERROR.SOCKET_ERROR, ex );}
}



function Bool_To_Controller( name, value )
{	send_generic( name, value, "bool" );	}

function Long_To_Controller( name, value )
{	send_generic( name, value, "long" );	}

function Double_To_Controller( name, value )
{	send_generic( name, value, "double" );	}

function String_To_Controller( name, value )
{	send_generic( name, value, "string" );	}

function Id_Not_Found_Error( id )
{Browser_Error( BROWSER_ERROR.HTML_ID_ERROR, "Id named '" + id + "' not found in HTML page" );}

function Bool_To_Controller_Id( id )
{
	if( $$(id) == null )
	{Id_Not_Found_Error( id ); return;}else
	{Bool_To_Controller( id, $$(id).value );}
}

function Long_To_Controller_Id( id )
{
	if( $$(id) == null )
	{Id_Not_Found_Error( id ); return;}else
	{Long_To_Controller( id, parseInt($$(id).value) );}
}

function Double_To_Controller_Id( id )
{
	if( $$(id) == null )
	{Id_Not_Found_Error( id ); return;}else
	{Double_To_Controller( id, parseFloat($$(id).value) );}
}

function String_To_Controller_Id( id )
{
	if( $$(id) == null )
	{Id_Not_Found_Error( id );return;}else
	{String_To_Controller( id, $$(id).value );}
}

function Event_To_Controller()
{
	if( arguments[0] == undefined )
	return;
	
	var message = new Object();
	message.event = arguments[0];
	message.params = new Array();
	for( var i = 1; i < arguments.length; i += 1 )
	message.params.push( arguments[i] );

	send_json_message( JSON.stringify( message ) );
}





function Log(msg)
{ //var msg2=$$("log").innerHTML.substring(0,maximumLogCharacters);
	if($$("console").innerHTML.length<=(maximumLogCharacters-msg.length)) {
		$('#console').prepend('<p>'+msg+'</p>');
	}
	else {
		//$('#console').html('<p>'+msg+'</p>');
	}
	//console.log(msg);
}


function cswitch(ID, v){
					this.val        =v;
					this.id=ID;
					this.setv = function(v){
							//Log("val:"+this.val+"\tV:"+v);
							if(this.val!=v){
								if(v==1){$("#"+this.id).css("border-color","yellow");}
								if(v==0){Log(this.id+":OFF");}
									}   this.val    =v;
	};
	}

					var CurrentSwitches={
		blower: new cswitch("tab_blower",0),
		comp1: new cswitch("tab_comp1",0),
		comp2: new cswitch("tab_comp2",0),  
		fan: new cswitch("tab_fan",0),
};
//function CurrentSwitches()
//$(strs[0]+"2"+strs[1]).css("border-color","red");


var Ctrl= {
	EFS: 100, //Evaporator or Blower fan Speed, percent of full
	CFS: 100, //Condenser fan speed, percent of full
	DS:  100, // Damper State?
	CS:  0,   //Rely CS
	CC:  0,    //Relay CC
	FAN: 0,
	BLOWER: 0,
	DAMPER: 0,
	Mode:	function (RunType) {
		
			
			if(RunType==1)
			{ Long_To_Controller('CtrlMode',1);
				Set=1; Log("Set to OPT");
			}//Optimize control
			if(RunType==2)
			{ Long_To_Controller('CtrlMode',2);
				Set=2; Log("Set to MNL");
			}//Manual control
			if(RunType==3)
			{ Long_To_Controller('CtrlMode',3);
				Set=3; Log("Set to OEM");
			}//OEM control Standard
			
			}
	};
	


var RSV=0;//=0b00000000;	
	
//var BitNum=$$("tab_blower");
$$("tab_fan").onclick=function (){RelayBits("tab_fan",0)};
$$("tab_comp1").onclick=function (){RelayBits("tab_comp1",1)};
$$("tab_comp2").onclick=function (){RelayBits("tab_comp2",2)};
$$("tab_blower").onclick=function (){RelayBits("tab_blower",3)};
$$("control-charge-switch").onclick=function (){ChargeBits("control-charge-switch")};
var CSwitch;

function ChargeBits(ID)
{  CSwitch=chargeSwitchSlider.getValue();
 if(CSwitch==1)
 { RSV = (1<<4)|(RSV & ~(3<<4));}
 if(CSwitch==0)
 { RSV &= ~(3<<4);}
 if(CSwitch==-1)
 { RSV = (1<<5)|(RSV & ~(3<<4));}
 Long_To_Controller('RSV',RSV);
 //alert("RSV"+RSV);
}

//RelayBits("tab_fan",3)};
var Send3={VN:0,Val:0};
function RelayBits(ID,BitNum)
{	
	if(!$('#'+ID).hasClass('dead'))
		{
						//Send3.VN=ID;
			if($('#'+ID).hasClass('active')) 
			{
				$('#'+ID).removeClass('active');
				RSV &= ~(1<<BitNum);
				//Log("RSV="+RSV);
				Send3.Val=0;
			}
			else 
			{
				$('#'+ID).addClass('active');
				RSV |= (1<<BitNum);
				Send3.Val=1;
				//Log("RSV="+RSV);
			}
			Long_To_Controller('RSV',RSV);
			SaveButton(0,ID);
			Send3.Val=RSV;
			SaveButton(0,"RSV");
			send_bridge_message( "BUTTON", 0);
			//alert("RSV"+RSV);
		}

}


//control main page tab highlighting
$('.mode-button').click(function() {
			var id=$(this).attr("id");
	$('.mode-button').each( function() {
		$(this).removeClass('active');
		if($(this).attr("id")!=id)
		{   Send3.Val=0;
				SaveButton(0,$(this).attr("id"));
		}
		
	});
	$(this).addClass('active');
	id=$(this).attr("id");
	Send3.Val=1;
	SaveButton(0,id);
	send_bridge_message( "BUTTON", 0);
});





var url3 = "http://www.advantekinc.com/cor/ButtonStates.php";
	 function SaveButton(type,id){
	 
	 
	 Send3.VN=id;
	 if(type==1){Send3.VN="load";}
				
			var Srt="q="+JSON.stringify(Send3);
			//alert(Srt);
			jQuery.ajax({ 
				async      : false,
				type       : "POST",   				// This can also be GET
				data       : Srt,  					// Any data that you want to send to the script can go here.
													// Easiest to just create an array and put it here but you can list everything.
				//dataType   : "json",				// If you want the data to be returned as a json object then you can uncomment this.
				url        : url3,					// This can be the url var or a string.
				success    : function(data){  // If the CORS request succeeds this function will be run.
									
									if(type==1)
									{   var Bdata=JSON.parse(data); 
											if(Bdata.tab_blower==1){$('#tab_blower').addClass('active');}
											if(Bdata.tab_comp1==1){$('#tab_comp1').addClass('active');}
											if(Bdata.tab_comp2==1){$('#tab_comp2').addClass('active');}
											if(Bdata.tab_fan==1){$('#tab_fan').addClass('active');}
											RSV=Bdata.RSV;
											
							$('.mode-button').each( function(){ $(this).removeClass('active'); } );
								if(Bdata.mode_oem==1)     {$$("mode_oem").click();}
							if(Bdata.mode_manual==1)  {$$("mode_manual").click();}
							if(Bdata.mode_optimize==1){$$("mode_optimize").click();}
						
							/*
							if(Bdata.mode_oem==1)     {$("#mode_oem").addClass('active');}
							if(Bdata.mode_manual==1)  {$("#mode_manual").addClass('active');}
							if(Bdata.mode_optimize==1){$("#mode_optimize").addClass('active');}
							*/
									
											
											//alert(data);
											
									}
											
				
					
			},  
			error      : function(jqXHR, textStatus, errorThrown) {  // If the CORS request fails this function will be run.
				alert(jqXHR + " :: " + textStatus + " :: " + errorThrown); 					// Log data to the console.
				//$('#target').append(jqXHR + " :: " + textStatus + " :: " + errorThrown);  // Do something with the data.
			}
		});

	} 

function SetChoice(id)
{	var X=$$(id),
	Y=X.options[X.selectedIndex];
Log(id);
if(id==='RfgtChoice')
{	//$$('RfgtType').innerHTML=Y.text;
	Long_To_Controller('HTMLRfgtC', Y.value);
	Log(Y.text+"="+Y.value);
}
if(id==='PwrChoice')
{   //$$('PwrType').innerHTML=Y.text;
	Long_To_Controller('HTMLPwrC', Y.value);
	Log(Y.text+"="+Y.value);
}
if(id==='EF')
{  Log("EF="+X.value);
}
if(id==='CF')
{  Log("CF="+X.value);
}
}

var Send={Type: 1,
OAT: 90.1,
kW: 17.1,
Ton: 3.5,
TRate: 1,
	EERH: 10,
	EERL: 10,
	IEERH: 10,
	IEERL: 10,
	kWpTH: 1.58,
	kWpTL: 1.58
};
//Send.TRate=1/12;
var url = "http://www.advantekinc.com/cor/php_read_txt.php";	
var RefRate2=1000*30;//1000*60; 


var PHPval={
IEER: 8,
IEER2D: 8,
TonHr: 8,
kWHr: 1,
EER2D: 8,
OEM_IEER: function (){return Number($$("stats-oem-ieer").innerHTML);},//14.6,
kWpT2D:     function (){return 12/(this.IEER2D);},
BillRate:   function (){return Number($$("elUtRate").value);},
OEM_Energy: function (){return (this.IEER2D)*(this.kWHr)/(this.OEM_IEER());},
EnSavings:  function (){return (this.OEM_Energy())-(this.kWHr);},
$Savings:   function (){return (this.BillRate())*(this.EnSavings());},
EffIncr:    function (){return ((this.IEER2D)-(this.OEM_IEER()))/(this.OEM_IEER());}

};

var STR11=["NONE"], strs=[".section.savings .pid:nth-of-type(",") .threeD"];

function Foo(numb){
var jAlertMSG="";
if(numb==1){
jAlert("Negative Net Energy or Cost Savings!\nSee Savings section under Energy tab!", "Fault");
//alert("Negative Net Energy Savings!<br>See Savings section under Energy tab.");
}else
if(numb=2)
{jAlert("Negative Efficiency Increase!\nSee Savings section under Energy tab!", "Fault");}
}

function Faults(){
//alert("WOO");
STR11[0]="NONE";
//#bfd
if(PHPval.$Savings()<0.00||PHPval.EnSavings()<0.00)
{	STR11[0]="";
STR11[1]="<a onclick='Foo(1)'>[Savings!]</a>";
if(PHPval.EnSavings()<0.00)
{	$(strs[0]+"2"+strs[1]).css("border-color","red");
}else{	STR11[1]="";
		$(strs[0]+"2"+strs[1]).css("border-color","#bfd");
	 }
if(PHPval.$Savings()<0.00)
{	
	$(strs[0]+"3"+strs[1]).css("border-color","red");
}else{	STR11[0]=""; 
		$(strs[0]+"3"+strs[1]).css("border-color","#bfd");
	 }
}else{	STR11[0]=""; 
	$(strs[0]+"3"+strs[1]).css("border-color","#bfd");
	$(strs[0]+"3"+strs[1]).css("border-color","#bfd");
 }
if(PHPval.EffIncr()<0.00)
{	STR11[0]="";
STR11[2]="<a onclick='Foo(2)'>[Efficiency]</a>";
$(strs[0]+"4"+strs[1]).css("border-color","red");
}else{STR11[2]=""; $(strs[0]+"4"+strs[1]).css("border-color","#bfd");}

STR11[0]+=STR11[1]+STR11[2];
$$("comp2-faults-box").innerHTML=STR11[0];
}



var G;
setInterval(function (){myf(1,RefRate2/(1000*60*60));}, RefRate2);
setInterval(function (){Faults();}, 1000);
var PHPobj;
function myf(type, R){


Send.Type=type;
if(type==1){
Send.OAT=AIR.OAT;
Send.kW=Energy.kW;
Send.Ton=Cooling.tons;
Send.TRate=R;
Send.EERH=Number($$("stats-high-eer").innerHTML);
Send.EERL=Number($$("stats-low-eer").innerHTML);
Send.IEERH=Number($$("stats-high-ieer").innerHTML);
Send.IEERL=Number($$("stats-low-ieer").innerHTML);
Send.kWpTH=Number($$("stats-high-kwt").innerHTML);
Send.kWpTL=Number($$("stats-low-kwt").innerHTML);
}			
if(Energy.kW<0.15){ Send.Type=0; }

//This function will have to be triggered by some sort of event.
	var Srt="q="+JSON.stringify(Send);
	jQuery.ajax({  
		type       : "POST",   				// This can also be GET
		data       : Srt,  					// Any data that you want to send to the script can go here.
											// Easiest to just create an array and put it here but you can list everything.
		//dataType   : "json",				// If you want the data to be returned as a json object then you can uncomment this.
		url        : url,					// This can be the url var or a string.
		success    : function(data){  // If the CORS request succeeds this function will be run.
			//alert(data);
			PHPobj=JSON.parse(data);	// Do something with the data.
			PHPval.IEER=Round2(PHPobj.IEER,2);
			PHPval.IEER2D=Round2(PHPobj.IEER2D,2);
			PHPval.TonHr=Round2(PHPobj.TonHr,3);
			PHPval.kWHr=Round2(PHPobj.kWHr,3);
			PHPval.EER2D=Round2(PHPobj.EER2D,2);
			
			
		},  
		error      : function(jqXHR, textStatus, errorThrown) {  // If the CORS request fails this function will be run.
			alert(jqXHR + " :: " + textStatus + " :: " + errorThrown); 					// Log data to the console.
			//$('#target').append(jqXHR + " :: " + textStatus + " :: " + errorThrown);  // Do something with the data.
		}
	});

}

var Send2 = {
		VN: "0",
		Val: 0//,
		//ID: "id"
}

function GetType(id)
{   
	if( $$(id) == null )
	{
		alert("id: "+id+" not found"); 
		return null;
	}
	else
	{
		return $$(id).tagName;
	}
}

var TAG;
var SDATA,VarData;
var hold=0;

function SaveSetting(id)
{    
	if(hold==0)
	{   //Send2.VN=id;
		TAG=GetType(id);
			
		if(TAG=="INPUT") 
		{
			Send2.Val= Number($$(id).value);
		}
		else if(TAG=="SELECT")
		{
			Send2.Val= $$(id).selectedIndex;
		}
		else
		{
			alert("Other Tag. For element ID:"+id+", Tag="+TAG);
			Send2.Val=null;
		}
			//Send2.ID=id;
		if(!(Send2.Val==null))
		{
			SETTINGS(0,id);
		}
	}
	else hold=0;
}

 function LoadSetting(id)
 {    
			hold=1;
			SETTINGS(1,id);
		 
			//$$(id).value=SDATA.Val;
 }



var url2 = "http://www.advantekinc.com/cor/php_save_settings.php";

function SETTINGS(type, id)
{
	Send2.VN = id;
	
	if(type == 1)
	{
		Send2.Val = "load";
	}
	//Send2.ID=id;
	var Srt = "q="+JSON.stringify(Send2);
	//alert(Srt);
	jQuery.ajax({
					async      : false,
					type       : "POST",   				// This can also be GET
					data       : Srt,  					// Any data that you want to send to the script can go here.
														// Easiest to just create an array and put it here but you can list everything.
					//dataType   : "json",				// If you want the data to be returned as a json object then you can uncomment this.
					url        : url2,					// This can be the url var or a string.
					success    : function(data){  // If the CORS request succeeds this function will be run.
							
													if(type == 1)
													{   
															SDATA=JSON.parse(data); 
															VarData=SDATA.Val;
															
															//alert(VarData);
															if( $$(SDATA.VN) == null )
															{
																alert("id not found"); 
																TAG = null;
															}
															else
															{
																TAG = $$(SDATA.VN).tagName;
															}
															
															TAG = GetType(SDATA.VN);
															Log(SDATA.VN+"="+TAG);
															
															if(TAG == "INPUT")
															{ 
																$$(SDATA.VN).value = VarData;
															}
															else if(TAG == "SELECT")
															{
																$$(SDATA.VN).selectedIndex = SDATA.Val;/*alert("select");*/
															}
															else
															{
																alert("Other Tag. For element ID:"+SDATA.VN+", Tag="+TAG);
															}
													}								
				
												},  
					error      : function(jqXHR, textStatus, errorThrown) {  // If the CORS request fails this function will be run.
																			alert(jqXHR + " :: " + textStatus + " :: " + errorThrown); 					// Log data to the console.
																			//$('#target').append(jqXHR + " :: " + textStatus + " :: " + errorThrown);  // Do something with the data.
																		}
	});

}


	$$("oemEER").onchange=function() {$$("stats-oem-eer").innerHTML=$$("oemEER").value;}
	$$("oemIEER").onchange=function(){$$("stats-oem-ieer").innerHTML=$$("oemIEER").value;}
	$$("oemKWT").onchange=function() {$$("stats-oem-kwt").innerHTML=$$("oemKWT").value;}
	
$(document).ready(function(){
			SaveButton(1,0);
			LoadSetting("RfgtChoice");  //    msdelay(100);
			LoadSetting("PwrChoice"); //    msdelay(100);
			LoadSetting("elUtRate");  //    msdelay(100);
			LoadSetting("oemEER");   //     msdelay(100);
			LoadSetting("oemIEER");   //    msdelay(100);
			LoadSetting("oemKWT");    //    msdelay(100);
			LoadSetting("mp1");//           msdelay(100);
			LoadSetting("mp2"); //          msdelay(100);
			LoadSetting("mp3");  //           msdelay(100);
			LoadSetting("mp4");  //           msdelay(100);
			LoadSetting("mp5");  //           msdelay(100);
			LoadSetting("mp6");  //           msdelay(100);
			LoadSetting("mt1");   //          msdelay(100);
			LoadSetting("mt2");   //          msdelay(100);
			LoadSetting("mt3");   //          msdelay(100);
			LoadSetting("mt4");   //          msdelay(100);
			LoadSetting("mt5");   //          msdelay(100);
			LoadSetting("mt6");   //          msdelay(100);
			LoadSetting("mt7");   //          msdelay(100);
			LoadSetting("mt8");   //          msdelay(100);
			LoadSetting("mt9");   //          msdelay(100);
			LoadSetting("tRef");    //          msdelay(100);
			LoadSetting("fm1");   //      msdelay(100);
			LoadSetting("fb1");  //      msdelay(100);
			LoadSetting("fm2"); //msdelay(100);
			LoadSetting("fb2"); //msdelay(100);
			LoadSetting("powerM"); //msdelay(100);
			LoadSetting("powerB"); //msdelay(100);
			
			Double_To_Controller('tRef',Number($$("tRef").value));
			
});

	$$("RfgtChoice").onchange=function(){SaveSetting("RfgtChoice");}
	$$("PwrChoice").onchange=function(){SaveSetting("PwrChoice");}
	$$("elUtRate").onchange=function(){SaveSetting("elUtRate");}
	
	$$("oemEER").onchange=function(){SaveSetting("oemEER");}
	$$("oemIEER").onchange=function(){SaveSetting("oemIEER");}
	$$("oemKWT").onchange=function(){SaveSetting("oemKWT");}
	
	$$("mp1").onchange=function(){SaveSetting("mp1");}
	$$("mp2").onchange=function(){SaveSetting("mp2");}
	$$("mp3").onchange=function(){SaveSetting("mp3");}
	$$("mp4").onchange=function(){SaveSetting("mp4");}
	$$("mp5").onchange=function(){SaveSetting("mp5");}
	$$("mp6").onchange=function(){SaveSetting("mp6");}
	
	$$("mt1").onchange=function(){SaveSetting("mt1");}
	$$("mt2").onchange=function(){SaveSetting("mt2");}
	$$("mt3").onchange=function(){SaveSetting("mt3");}
	$$("mt4").onchange=function(){SaveSetting("mt4");}
	$$("mt5").onchange=function(){SaveSetting("mt5");}
	$$("mt6").onchange=function(){SaveSetting("mt6");}
	$$("mt7").onchange=function(){SaveSetting("mt7");}
	$$("mt8").onchange=function(){SaveSetting("mt8");}
	$$("mt9").onchange=function(){SaveSetting("mt9");}
	
	$$("tRef").onchange=function(){SaveSetting("tRef");}
	
	$$("fm1").onchange=function(){SaveSetting("fm1");}
	$$("fb1").onchange=function(){SaveSetting("fb1");}
	$$("fm2").onchange=function(){SaveSetting("fm2");}
	$$("fb2").onchange=function(){SaveSetting("fb2");}
	
	$$("powerM").onchange=function(){SaveSetting("powerM");}
	$$("powerB").onchange=function(){SaveSetting("powerB");}
	
	//$$("flowZero").onclick=function(){Long_To_Controller('FlowSetZero', 1);};
	$$("flowCal1").onclick=function()
	{   
		Double_To_Controller('M', $$("powerM").value);
		Double_To_Controller('B', $$("fb2").value);
	};
	
	$$("presCal").onclick=function()
	{   
			Double_To_Controller('p1off',$$("mp1").value);
			Double_To_Controller('p2off',$$("mp2").value);
			Double_To_Controller('p3off',$$("mp3").value);
			Double_To_Controller('p4off',$$("mp4").value);
			Double_To_Controller('p5off',$$("mp5").value);
			Double_To_Controller('p6off',$$("mp6").value);
	};
	
		
	$$("tempCal").onclick=function()
	{   
			//alert("tRef");
			Double_To_Controller('tRef',Number($$("tRef").value));
			//Double_To_Controller('t2off',$$("mt2").value);
			//Double_To_Controller('t3off',$$("mt3").value);
			//Double_To_Controller('t4off',$$("mt4").value);
			//Double_To_Controller('t5off',$$("mt5").value);
			//Double_To_Controller('t6off',$$("mt6").value);
			//Double_To_Controller('t7off',$$("mt7").value);
			//Double_To_Controller('t8off',$$("mt8").value);
			//Double_To_Controller('t9off',$$("mt9").value);
			
	};	
	
	$$("humidityCal1").onclick=function()
	{
		Double_To_Controller('woff',$$("hRef1").value);
	};

/*			
function ContVals(id)
{   var X=$$(id);
	Log(id);
	//Log((id!=M[0])+"||"+(id!=M[1]));
	//if(id!=M[0]||id!=M[1]){var Y=X.options[X.selectedIndex];}
	if(id=='EF')
	{  Long_To_Controller('EFhtml', X.value);
		 Log("EF="+X.value);
		 
	}
	if(id=='CF')
	{  Long_To_Controller('CFhtml', X.value);
		 Log("CF="+X.value);
	} else
	if(!(id=='EF' || id=='CF'))
	{ var x=X.options[X.selectedIndex]
	if(id=='DS')
	{	var xxx=$$('DS').selectedIndex;
		Log(xxx);
		if(x.value==0)
		{Long_To_Controller('DShtml',0);Log("DS:0");}
		if(x.value==1)
		{Long_To_Controller('DShtml',1);Log("DS:1");}
	}
	if(id=='CS')
	{	if(x.value==0)
		{Long_To_Controller('CShtml',0); Log("CS:0");}
		if(x.value==1)
		{Long_To_Controller('CShtml',1); Log("CS:1");}
	}
	if(id=='CC')
	{	if(x.value==0)
		{Long_To_Controller('CChtml',0); Log("CC:0");}
		if(x.value==1)
		{Long_To_Controller('CChtml',1); Log("CC:1");}
	}}
	
}

function CtrlModef()
{  	var X=$$('OpMode'), x=X.options[X.selectedIndex];
	var Y, y; //Y=$$(ID), y=Y.disabled
	for(var i=0; i < M.length; i++)
	{  	Y=$$(M[i]), y=Y.disabled;
		if(x.value==1)
		{Y.disabled=true;  
		 Long_To_Controller('CtrlMode',1);
		}else
		if(x.value==2)
		{Y.disabled=false;
		 Long_To_Controller('CtrlMode',2);
		 //Long_To_Controller('EFhtml', X.value);
		}
		
}	*/


function Xint(id, id2)
{   var X=[$$(id), $$(id2)];
	X[1].innerHTML = parseInt(30+15*X[0].value);
}

 
$(window).load(function() {
	// Load refrigerant type at page start
	//alert($('#RfgtChoice').val());
	$('.refrigerant-type').html($('#RfgtChoice').val());
});
   