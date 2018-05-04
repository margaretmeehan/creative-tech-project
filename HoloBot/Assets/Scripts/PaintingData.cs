using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class PaintingData : MonoBehaviour {

    public string paintingTitle { get; set; }
    public string artistName { get; set; }
    public int artistContentId { get; set; }
    public int paintingContentId { get; set; }
    public string paintingInfo { get; set; }
    public string paintingImageUrl { get; set; }
    public string paintingDescription { get; set; }
}
