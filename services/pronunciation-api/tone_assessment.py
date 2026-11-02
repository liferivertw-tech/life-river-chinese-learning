from __future__ import annotations
import numpy as np

TONE_TEMPLATES={
 1:np.array([0.0,0.0,0.0,0.0,0.0]),
 2:np.array([-1.2,-0.6,0.0,0.8,1.5]),
 3:np.array([0.2,-0.8,-1.8,-1.0,0.3]),
 4:np.array([1.4,0.7,0.0,-0.9,-1.7]),
}
TONE_NAMES={1:'第一聲（陰平）',2:'第二聲（陽平）',3:'第三聲（上聲）',4:'第四聲（去聲）'}

def score_tone_contour(f0_hz:list[float],target_tone:int)->dict:
    if target_tone not in TONE_TEMPLATES: raise ValueError('target_tone must be 1, 2, 3 or 4')
    values=np.asarray([x for x in f0_hz if x and np.isfinite(x) and x>0],dtype=float)
    if values.size<5: raise ValueError('Not enough voiced pitch frames')
    points=np.interp(np.linspace(0,values.size-1,5),np.arange(values.size),values)
    median=float(np.median(points))
    contour=12*np.log2(points/median)
    template=TONE_TEMPLATES[target_tone]
    mae=float(np.mean(np.abs(contour-template)))
    score=max(0,min(100,round(100-mae*22)))
    feedback='聲調曲線接近目標，可再練習穩定度。' if score>=80 else ('部分輪廓接近目標，請放慢速度再試一次。' if score>=60 else '目前曲線與目標差異較大，建議聽示範後再練習。')
    return {'target_tone':target_tone,'target_name':TONE_NAMES[target_tone],'score':score,'contour_semitones':[round(float(x),2) for x in contour],'feedback':feedback,'assessment_type':'experimental-pitch-contour-heuristic','validated':False}
