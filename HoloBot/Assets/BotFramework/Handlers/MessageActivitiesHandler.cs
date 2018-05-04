using HoloToolkit.Unity;
using System;
using System.Collections;
using System.Collections.Generic;
using Unity3dAzure.WebSockets;
using UnityEngine;
using Newtonsoft.Json;

namespace Unity3dAzure.BotFramework {
  public class MessageActivitiesHandler : DataHandler {

        public Renderer paintRenderer;
        private UnityEngine.Object[] paintings;
        List<SetPainting> paintSetters;
        ScanManager scanMan;
        bool needsUpdate;

        [Serializable]
        public class BotMessage
        {
            public string intent;// { get; set; }
            public string textResponse;// { get; set; }
            public List<PaintingData> jsonResponse;// { get; set; }
        }

        [Serializable]
        public class PaintingDataWrapper
        {
            public List<PaintingData> paintingDatas;
        }

        void Start()
        {
            needsUpdate = false;
            scanMan = GameObject.Find("MapManager").GetComponent<ScanManager>();
        }

        void Update()
        {
            if (needsUpdate)
            {
                for (int i = 0; i < scanMan.paintings.Count; i++)
                {
                    //scanMan.paintings[i].Rotate(0, 0, 90);
                    //paintings = Resources.LoadAll("Paintings", typeof(Texture));
                    //Texture painting = (Texture)paintings[UnityEngine.Random.Range(0, paintings.Length)];
                    Transform go = scanMan.paintings[i].Find("Painting/PaintingMic/painting_canvas");
                    SetPainting setP = go.GetComponent<SetPainting>();
                    
                    //setP.imUrl = scanMan.paintings[i].GetComponent<PaintingData>().paintingImageUrl;
                    setP.paintData = scanMan.paintingDatas[i];
                    setP.imUrl = scanMan.paintingDatas[i].paintingImageUrl;
                    setP.needsUpdate = true;
                    //setP.NewPainting(scanMan.paintings[i].GetComponent<PaintingData>().paintingImageUrl);//.material.mainTexture = painting;
                    //if (painting.width > painting.height) GetComponentInParent<Transform>().Rotate(0, 0, 90);
                    //paintings[i].Rotate(0, 0, 90);
                    //paintSetters[i].NewPainting(paintingDataWrap.paintingDatas[i]);
                }
                needsUpdate = false;
            }
            //paintings = GameObject.FindGameObjectsWithTag("Painting");
        }

        // Web Socket JSON data handler
        public override void OnData(byte[] rawData, string text, Boolean isBinary) {

      // ignore empty messages
      if (String.IsNullOrEmpty(text)) {
        return;
      }

      // parse activities message
      MessageActivities response = ParseMessageActivities(text);
      if (response.activities == null || response.activities.Length < 1) {
        Debug.LogWarning("No activities message found:\n" + text);
        return;
      }

      // Handle bot is typing status message - type: "typing"
      if (String.IsNullOrEmpty(response.activities[0].text) && string.Equals(response.activities[0].type, "typing")) {
        Debug.Log("Bot is typing...");
        return;
      }

      if (response.activities.Length > 1) {
        Debug.LogWarning("Handle case if more than 1 activity is received.");
      }

      MessageActivity message = response.activities[0];

      // decide what to do depending on message path type
      if (String.IsNullOrEmpty(message.inputHint)) {
        RaiseOnReceivedData(this, new BotMessageEventArgs(message.text, false));
      } else if (!String.IsNullOrEmpty(message.inputHint)) {
        BotMessage botMsg = ParseBotMessage(message.text);//JsonUtility.FromJson<BotMessage>(message.text); //ParseBotMessage(message.text);
        switch (botMsg.intent){
            case "Explore_artist":
                RaiseOnReceivedData(this, new BotMessageEventArgs(botMsg.textResponse, true));
                break;
            case "Explore_painting":
                RaiseOnReceivedData(this, new BotMessageEventArgs(botMsg.textResponse, true));
                break;
            case "Show":
                //string jstring = "{\"paintingDatas\":" + botMsg.jsonResponse + "}";
                //PaintingDataWrapper paintingDataWrap = JsonConvert.DeserializeObject<PaintingDataWrapper>(jstring);
                //PaintingDataWrapper paintingDataWrap = JsonUtility.FromJson<PaintingDataWrapper>(jstring);
                for (int i = 0; i < scanMan.paintings.Count; i++)
                {
                    scanMan.paintingDatas[i] = botMsg.jsonResponse[i];//paintingDataWrap.paintingDatas[i];
                    //scanMan.paintings[i].Rotate(0,0,90);
                    //paintings[i].Rotate(0, 0, 90);
                    //paintSetters[i].NewPainting(paintingDataWrap.paintingDatas[i]);
                }
                needsUpdate = true;
                RaiseOnReceivedData(this, new BotMessageEventArgs("Here are some more paintings", true));
                break;
            default:
                RaiseOnReceivedData(this, new BotMessageEventArgs("I'm sorry, I didn't catch that", true));
                break;
        }
      } else {
        Debug.LogWarning("Unhandled message type: " + message.inputHint + " message: " + message.text);
      }
    }

    #region Parse JSON body helpers

    public static MessageActivities ParseMessageActivities(string json) {
      try {
        return JsonUtility.FromJson<MessageActivities>(json);
      } catch (ArgumentException exception) {
        Debug.LogWarningFormat("Failed to parse bot message. Reason: {0} \n'{1}'", exception.Message, json);
        return null;
      }
    }

    public static BotMessage ParseBotMessage(string json)
        {
            try
            {
                return JsonConvert.DeserializeObject<BotMessage>(json);
                //return JsonUtility.FromJson<BotMessage>(json);
            }
            catch (ArgumentException exception)
            {
                Debug.LogWarningFormat("Failed to parse bot message. Reason: {0} \n'{1}'", exception.Message, json);
                return null;
            }
        }

    #endregion
  }
}
