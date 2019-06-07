import "babel-polyfill";
import TransportNodeHid from "@trustcrypto/hw-transport-node-hid";
import TransportNodeKeyboard from "@trustcrypto/hw-transport-node-hid-keyboard";
import { sign, isSupported } from "u2f-api";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
//import type Transport from "@trustcrypto/hw-transport";


const OKSETPIN = 225; //0xE1
const OKSETSDPIN = 226; //0xE2
const OKSETPDPIN = 227; //0xE3
const OKSETTIME = 228; //0xE4
const OKGETLABELS = 229; //0xE5
const OKSETSLOT = 230; //0xE6
const OKWIPESLOT = 231; //0xE7
const OKSETU2FPRIV = 232; //0xE8
const OKWIPEU2FPRIV = 233; //0xE9
const OKSETU2FCERT = 234; //0xEA
const OKWIPEU2FCERT = 235;//0xEB
const OKGETPUBKEY = 236;
const OKSIGN = 237;
const OKWIPEPRIV = 238;
const OKSETPRIV = 239;
const OKDECRYPT = 240;
const OKRESTORE = 241;
const OKFWUPDATE = 244;


test();


async function test() {
  let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  var time = [0x5C, 0xF7, 0x17, 0x43] //epoch time
  var bytes256 = new Uint8Array(128);
  bytes256.fill(1);

  //Settime USB HID
  var resulthid = await USBHIDmethod(OKSETTIME, 0, 0, 0, Uint8Array.from(time));
  console.log(resulthid.toString("ascii"));
  await wait(5000);

  //Settime USB Keyboard
  var resultkey = await USBKeyboardmethod(OKSETTIME, 0, 0, 0, Uint8Array.from(time));
  console.log(resultkey.toString("ascii"));
  await wait(5000);

  var resultkey = await USBKeyboardmethod(OKSETPRIV, 1, 2, 0, bytes256);
  console.log(resultkey.toString("ascii"));
  await wait(5000);

  //SetPRIV USB HID
  var resulthid = await USBHIDmethod(OKSETPRIV, 1, 2, 0, bytes256);
  console.log(resulthid.toString("ascii"));


}


async function USBHIDmethod(msgId, opt1, opt2, opt3, contents) { //Try USB HID
  const issupported = TransportNodeHid.isSupported();
  if (issupported) { //Send settime and get response
    try {
      var transport = await TransportNodeHid.create();
      let request = [];
      request.push(msgId, opt1, opt2, opt3, contents);
      request = Uint8Array.from(request);
      console.log("REQUEST");
      console.log(request.toString("hex"));
      var response = await transport.exchange(request);
      console.log("RESPONSE");
      console.log(response.toString("hex"));
      await transport.close();
      return response;
    } catch (error) {
      console.log("ERROR:", error);
      await transport.close();
    }
  } else {
    console.log("USBHID Transport Not Supported");
  }
}

async function USBKeyboardmethod(msgId, opt1, opt2, opt3, contents) { //Try USB HID
  const issupported = TransportNodeKeyboard.isSupported();
  if (issupported) { //Send settime and get response
    try {
      var transport = await TransportNodeKeyboard.create();
      let request = [];
      request.push(msgId, opt1, opt2, opt3, contents);
      request = Uint8Array.from(request);
      console.log("REQUEST");
      console.log(request.toString("hex"));
      var response = await transport.exchange(request);
      console.log("RESPONSE");
      console.log(response.toString("hex"));
      await transport.close();
      return response;
    } catch (error) {
      console.log("ERROR:", error);
      await transport.close();
    }
  } else {
    console.log("USBHID Transport Not Supported");
  }
}
