using HoloToolkit.Unity;
using System;
using System.Collections;
using System.Collections.Generic;
using Unity3dAzure.WebSockets;
using UnityEngine;

namespace Unity3dAzure.BotFramework {
  public sealed class BotMessageUITextReceiver : UITextReceiver {

    private TextToSpeech MyTTS;

    void Start()
        {
            MyTTS = GameObject.FindGameObjectWithTag("Bot").GetComponentInParent<TextToSpeech>();
            text = "Hi, welcome to ArtBot. You can start by asking me to show you paintings by an artist, like Picasso";
            MyTTS.StartSpeaking(text);
            needsUpdated = true;
        }

        public override void OnReceivedData(object sender, EventArgs args) {
      if (args == null) {
        return;
      }

      if (args.GetType() != typeof(BotMessageEventArgs)) {
        return;
      }

      var myArgs = args as BotMessageEventArgs;

      // only update text from bot
      if (myArgs.IsBot) {
        //if(!MyTTS.IsSpeaking()){
        //  text = myArgs.Text;
        //  MyTTS.StartSpeaking(text);
        //  needsUpdated = true;
        //}
        text = myArgs.Text;
        MyTTS.StartSpeaking(text);
        needsUpdated = true;
      }
    }
  }
}
