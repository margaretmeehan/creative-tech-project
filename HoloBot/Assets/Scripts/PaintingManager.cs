using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using HoloToolkit.Unity.InputModule;

public class PaintingManager : MonoBehaviour, IFocusable
{
    public Shader m_HighlightShader;
    public Shader m_NoHighlightShader;
    Renderer m_Renderer;

    Color theColorToAdjust;

    public void OnFocusEnter()
    {
        theColorToAdjust.a = 1.0f;
    }

    public void OnFocusExit()
    {
        theColorToAdjust.a = 0.0f;
    }

    // Use this for initialization
    void Start () {
        theColorToAdjust = GetComponent<Renderer>().material.color;
        m_Renderer = GetComponent<Renderer>();
    }
	
	// Update is called once per frame
	void Update () {
		
	}
}
