//Attach this script to your GameObject (make sure it has a Renderer component)
//Click on the GameObject. Attach your own Textures in the GameObject’s Inspector.

//This script takes your GameObject’s material and changes its Normal Map, Albedo, and Metallic properties to the Textures you attach in the GameObject’s Inspector. This happens when you enter Play Mode

using System.Collections;
using UnityEngine;

public class SetPainting : MonoBehaviour
{

    //Set these Textures in the Inspector
    //public Texture m_MainTexture;
    //Renderer m_Renderer;
    Renderer paintRenderer;
    private Object[] paintings;

    private void Awake()
    {
        paintings = Resources.LoadAll("Paintings", typeof(Texture));
        Texture painting = (Texture)paintings[Random.Range(0, paintings.Length)];
        GetComponent<Renderer>().material.mainTexture = painting;
        //if (painting.width > painting.height) GetComponentInParent<Transform>().Rotate(0, 0, 90);
        //NewPainting("https://en.wikipedia.org/wiki/Pablo_Picasso#/media/File:Old_guitarist_chicago.jpg");
    }

    // Use this for initialization
    void Start()
    {
        //Fetch the Renderer from the GameObject
        //m_Renderer = GetComponent<Renderer>();

        paintRenderer = GetComponent<Renderer>();

        //Set the Texture you assign in the Inspector as the main texture (Or Albedo)
        //m_Renderer.material.SetTexture("_MainTex", m_MainTexture);
    }

    public IEnumerator NewPainting(PaintingData data)
    {
        PaintingData paintdata = transform.parent.parent.GetComponentInParent<PaintingData>();

        paintdata.artistContentId = data.artistContentId;
        paintdata.artistName = data.artistName;
        paintdata.paintingContentId = data.paintingContentId;
        paintdata.paintingDescription = data.paintingDescription;
        paintdata.paintingImageUrl = data.paintingImageUrl;
        paintdata.paintingInfo = data.paintingInfo;
        paintdata.paintingTitle = data.paintingTitle;

        using (WWW www = new WWW(data.paintingImageUrl))
        {
            // Wait for download to complete
            yield return www;

            // assign texture
            paintRenderer.material.mainTexture = www.texture;
        }
    }
}