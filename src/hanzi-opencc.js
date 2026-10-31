import HanziWriter from 'hanzi-writer';
import OpenCC from 'opencc-js';

const simplifiedToTaiwan=OpenCC.Converter({from:'cn',to:'tw'});
const taiwanToSimplified=OpenCC.Converter({from:'tw',to:'cn'});
export function convertChineseText(text,direction='toTraditional'){
 if(typeof text!=='string')throw new TypeError('Chinese text must be a string');
 if(direction==='toTraditional')return simplifiedToTaiwan(text);
 if(direction==='toSimplified')return taiwanToSimplified(text);
 throw new RangeError('Unsupported conversion direction');
}
export function createStrokeWriter(element,character,options={}){
 if(!element)throw new TypeError('A target element is required');
 if(typeof character!=='string'||Array.from(character).length!==1)throw new TypeError('Exactly one Chinese character is required');
 return HanziWriter.create(element,character,{width:240,height:240,padding:12,showOutline:true,strokeAnimationSpeed:1,delayBetweenStrokes:260,...options});
}
export const strokeDataLicense={name:'Arphic Public License',version:'hanzi-writer-data@2.0.1',url:'https://github.com/chanind/hanzi-writer-data/blob/master/ARPHICPL.TXT'};
