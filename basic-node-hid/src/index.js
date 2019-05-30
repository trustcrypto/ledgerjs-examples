import "babel-polyfill";
import TransportNodeHid from "@trustcrypto/hw-transport-node-hid";
import type Transport from "@trustcrypto/hw-transport";
//import TransportWebAuthn from "@ledgerhq/hw-transport-webauthn";
import HID from "node-hid";

async function methodA() { //Try USB HID
  const issupported = TransportNodeHid.isSupported();
  if (issupported) { //Send settime and get response
    TransportNodeHid.create().then(transport => {
      let buffer = new Uint8Array(50);
      buffer.fill(0, 0, 57);
      buffer[0] = 0x5C;
      buffer[1] = 0xEF;
      buffer[2] = 0x0C;
      buffer[3] = 0xB9; 
      transport.send(0xE4, 0, 0, 0, buffer).then(response => {
        //return transport.send(0xe0, 0x4a, 0xff, 0x00, buffer);
      });
    });
  }
}

/*
async function methodB()) { //If that doesn't work try Webauthn
//TransportWebAuthn.create().then(transport => ...)
}

async function methodA() { //If that doesn't work try USB Keyboard
}
*/

methodA().then( //Try USB HID
  result => {
    console.log(result);
  },
  e => {
    console.error(e);
    /*
    methodB().then( //If that doesn't work try Webauthn
      result => {
        console.log(result);
      },
      e => {
        console.error(e);
        methodC().then( //If that doesn't work try USB Keyboard
          result => {
            console.log(result);
          },
          e => {
            console.error(e);
          }
        );
      }
    );
    */
  }
);
