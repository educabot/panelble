#include <CurieBLE.h>

BLEPeripheral blePeripheral;

BLEService iotService("19B10000-E8F2-537E-4F6C-D104768A1214");

//Digital
BLEUnsignedCharCharacteristic     dig02("19B10002-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig03("19B10003-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig04("19B10004-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig05("19B10005-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig06("19B10006-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig07("19B10007-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig08("19B10008-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig09("19B10009-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig10("19B10010-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig11("19B10011-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig12("19B10012-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);
BLEUnsignedCharCharacteristic     dig13("19B10013-E8F2-537E-4F6C-D104768A1214", BLEWrite | BLENotify);

//PWM
BLEUnsignedCharCharacteristic     digPWM03("19B10103-E8F2-537E-4F6C-D104768A1214", BLEWrite);
BLEUnsignedCharCharacteristic     digPWM05("19B10105-E8F2-537E-4F6C-D104768A1214", BLEWrite);
BLEUnsignedCharCharacteristic     digPWM06("19B10106-E8F2-537E-4F6C-D104768A1214", BLEWrite);
BLEUnsignedCharCharacteristic     digPWM09("19B10109-E8F2-537E-4F6C-D104768A1214", BLEWrite);

//Analog
BLEUnsignedCharCharacteristic   anaA0("19B10200-E8F2-537E-4F6C-D104768A1214", BLENotify);
BLEUnsignedCharCharacteristic   anaA1("19B10201-E8F2-537E-4F6C-D104768A1214", BLENotify);
BLEUnsignedCharCharacteristic   anaA2("19B10202-E8F2-537E-4F6C-D104768A1214", BLENotify);
BLEUnsignedCharCharacteristic   anaA3("19B10203-E8F2-537E-4F6C-D104768A1214", BLENotify);
BLEUnsignedCharCharacteristic   anaA4("19B10204-E8F2-537E-4F6C-D104768A1214", BLENotify);
BLEUnsignedCharCharacteristic   anaA5("19B10205-E8F2-537E-4F6C-D104768A1214", BLENotify);

long previousMillis = 0;

int prevA0 = 0;
int prevA1 = 0;
int prevA2 = 0;
int prevA3 = 0;
int prevA4 = 0;
int prevA5 = 0;

boolean auxD02 = true;
boolean auxD03 = true;
boolean auxD04 = true;
boolean auxD05 = true;
boolean auxD06 = true;
boolean auxD07 = true;
boolean auxD08 = true;
boolean auxD09 = true;
boolean auxD10 = true;
boolean auxD11 = true;
boolean auxD12 = true;
boolean auxD13 = true;

void setup() {

  blePeripheral.setLocalName("IoT");
  blePeripheral.setAdvertisedServiceUuid(iotService.uuid());
  blePeripheral.addAttribute(iotService);

  blePeripheral.addAttribute(dig02);
  blePeripheral.addAttribute(dig03);
  blePeripheral.addAttribute(dig04);
  blePeripheral.addAttribute(dig05);
  blePeripheral.addAttribute(dig06);
  blePeripheral.addAttribute(dig07);
  blePeripheral.addAttribute(dig08);
  blePeripheral.addAttribute(dig09);
  blePeripheral.addAttribute(dig10);
  blePeripheral.addAttribute(dig11);
  blePeripheral.addAttribute(dig12);
  blePeripheral.addAttribute(dig13);

  blePeripheral.addAttribute(digPWM03);
  blePeripheral.addAttribute(digPWM05);
  blePeripheral.addAttribute(digPWM06);
  blePeripheral.addAttribute(digPWM09);

  blePeripheral.addAttribute(anaA0);
  blePeripheral.addAttribute(anaA1);
  blePeripheral.addAttribute(anaA2);
  blePeripheral.addAttribute(anaA3);
  blePeripheral.addAttribute(anaA4);
  blePeripheral.addAttribute(anaA5);

  blePeripheral.begin();

  Serial.begin(9600);


  Serial.println("101-IoT");
}

void loop() {
  BLECentral central = blePeripheral.central();

  if (central) {
    while (central.connected()) {
      if (dig02.written()) {
        pinMode(2, OUTPUT);
        digitalWrite(2, auxD02);
        auxD02 = !auxD02;
      }
      if (dig03.written()) {
        pinMode(3, OUTPUT);
        digitalWrite(3, auxD03);
        auxD03 = !auxD03;
      }
      if (dig04.written()) {
        pinMode(4, OUTPUT);
        digitalWrite(4, auxD04);
        auxD04 = !auxD04;
      }
      if (dig05.written()) {
        pinMode(5, OUTPUT);
        digitalWrite(5, auxD05);
        auxD05 = !auxD05;
      }
      if (dig06.written()) {
        pinMode(6, OUTPUT);
        digitalWrite(6, auxD06);
        auxD06 = !auxD06;
      }
      if (dig07.written()) {
        pinMode(7, OUTPUT);
        digitalWrite(7, auxD07);
        auxD07 = !auxD07;
      }
      if (dig08.written()) {
        pinMode(8, OUTPUT);
        digitalWrite(8, auxD08);
        auxD08 = !auxD08;
      }
      if (dig09.written()) {
        pinMode(9, OUTPUT);
        digitalWrite(9, auxD09);
        auxD09 = !auxD09;
      }
      if (dig10.written()) {
        pinMode(10, OUTPUT);
        digitalWrite(10, auxD10);
        auxD10 = !auxD10;
      }
      if (dig11.written()) {
        pinMode(11, OUTPUT);
        digitalWrite(11, auxD11);
        auxD11 = !auxD11;
      }
      if (dig12.written()) {
        pinMode(12, OUTPUT);
        digitalWrite(12, auxD12);
        auxD12 = !auxD12;
      }
      if (dig13.written()) {
        pinMode(13, OUTPUT);
        digitalWrite(13, auxD13);
        auxD13 = !auxD13;
      }
      /////////////  PWM  //////////
      if (digPWM03.written()) {
        pwmPinControl(digPWM03.value(), 3);
      }
      if (digPWM05.written()) {
        pwmPinControl(digPWM05.value(), 5);
      }
      if (digPWM06.written()) {
        pwmPinControl(digPWM06.value(), 6);
      }
      if (digPWM09.written()) {
        pwmPinControl(digPWM09.value(), 9);
      }

      long currentMillis = millis();
      if (currentMillis - previousMillis >= 200) {
        previousMillis = currentMillis;
        updateAnalogNoti();
        updateDigitalNoti();
      }
    }
  }
}

////////////////////////////// Digital INPUT  //////////////////////////////////////////////

void updateDigitalNoti(void) {

  if (digitalRead(2) == HIGH) {
    dig02.setValue(1);
  } else {
    dig02.setValue(0);
  }

  if (digitalRead(3) == HIGH) {
    dig03.setValue(1);
  } else {
    dig03.setValue(0);
  }

  if (digitalRead(4) == HIGH) {
    dig04.setValue(1);
  } else {
    dig04.setValue(0);
  }

  if (digitalRead(5) == HIGH) {
    dig05.setValue(1);
  } else {
    dig05.setValue(0);
  }

  if (digitalRead(6) == HIGH) {
    dig06.setValue(1);
  } else {
    dig06.setValue(0);
  }

  if (digitalRead(7) == HIGH) {
    dig07.setValue(1);
  } else {
    dig07.setValue(0);
  }

  if (digitalRead(8) == HIGH) {
    dig08.setValue(1);
  } else {
    dig08.setValue(0);
  }

  if (digitalRead(9) == HIGH) {
    dig09.setValue(1);
  } else {
    dig09.setValue(0);
  }

  if (digitalRead(10) == HIGH) {
    dig10.setValue(1);
  } else {
    dig10.setValue(0);
  }

  if (digitalRead(11) == HIGH) {
    dig11.setValue(1);
  } else {
    dig11.setValue(0);
  }

  if (digitalRead(12) == HIGH) {
    dig12.setValue(1);
  } else {
    dig12.setValue(0);
  }

  if (digitalRead(13) == HIGH) {
    dig13.setValue(1);
  } else {
    dig13.setValue(0);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// Analog INPUT  //////////////////////////////////////////////
void updateAnalogNoti(void) {

  int valA0 = analogRead(A0);
  int auxA0 = map(valA0, 0, 1023, 0, 100);
  if (auxA0 != prevA0) {
    anaA0.setValue(auxA0);
    prevA0 = auxA0;
  }

  int valA1 = analogRead(A1);
  int auxA1 = map(valA1, 0, 1023, 0, 100);
  if (auxA1 != prevA1) {
    anaA1.setValue(auxA1);
    prevA1 = auxA1;
  }

  int valA2 = analogRead(A2);
  int auxA2 = map(valA2, 0, 1023, 0, 100);
  if (auxA2 != prevA2) {
    anaA2.setValue(auxA2);
    prevA2 = auxA2;
  }

  int valA3 = analogRead(A3);
  int auxA3 = map(valA3, 0, 1023, 0, 100);
  if (auxA3 != prevA3) {
    anaA3.setValue(auxA3);
    prevA3 = auxA3;
  }

  int valA4 = analogRead(A4);
  int auxA4 = map(valA4, 0, 1023, 0, 100);
  if (auxA4 != prevA4) {
    anaA4.setValue(auxA4);
    prevA4 = auxA4;
  }

  int valA5 = analogRead(A5);
  int auxA5 = map(valA5, 0, 1023, 0, 100);
  if (auxA5 != prevA5) {
    anaA5.setValue(auxA5);
    prevA5 = auxA5;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////// PWM Pin  //////////////////////////////////////////////////
void pwmPinControl(int val, int pin) {
  Serial.print(val);
  Serial.print(" - ");
  Serial.print(pin);
  Serial.println(" PWM");
  analogWrite(pin, val);
}

//////////////////////////////////////////////////////////////////////////////////////////
boolean test = true;
////////////////////////////// Digital on/off switches ///////////////////////////////////
void digitalPinControl(int val, int pin) {
  if (val <= 0 && test) {
    
    Serial.print(pin);
    Serial.println(" Pin on");
    digitalWrite(pin, test);
    test = !test;
  } else {
    Serial.print(pin);
    Serial.println(" Pin off");
    digitalWrite(pin, test);
    test = !test;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////
