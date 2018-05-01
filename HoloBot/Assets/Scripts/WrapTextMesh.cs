using UnityEngine;

public class WrapTextMesh : MonoBehaviour
{
    public bool WrapOnStart;
    public float WrapWidth;

    public void Wrap(float MaxWidth)
    {
        TextMesh tm = GetComponent<TextMesh>();
        if (tm == null)
        {
            Debug.LogError("TextMesh component not found.");
            return;
        }

        Font f = tm.font;
        string str = tm.text;
        int nLastWordInd = 0;
        int nIter = 0;
        float fCurWidth = 0.0f;
        float fCurWordWidth = 0.0f;
        while (nIter < str.Length)
        {
            // get char info
            char c = str[nIter];
            CharacterInfo charInfo;
            if (!f.GetCharacterInfo(c, out charInfo))
            {
                Debug.Log(charInfo.advance.ToString("F6"));
                Debug.LogError("Unrecognized character encountered (" + (int)c + "): " + c);
                return;
            }

            if (c == '\n')
            {
                nLastWordInd = nIter;
                fCurWidth = 0.0f;
            }
            else
            {
                if (c == ' ')
                {
                    nLastWordInd = nIter; // replace this character with '/n' if breaking here
                    fCurWordWidth = 0.0f;
                }

                fCurWidth += charInfo.width;
                fCurWordWidth += charInfo.width;
                if (fCurWidth >= MaxWidth)
                {
                    str = str.Remove(nLastWordInd, 1);
                    str = str.Insert(nLastWordInd, "\n");
                    fCurWidth = fCurWordWidth;
                }
            }

            ++nIter;
        }

        tm.text = str;
    }

    // Use this for initialization
    void Start()
    {
        if (WrapOnStart)
            Wrap(WrapWidth);
    }
}