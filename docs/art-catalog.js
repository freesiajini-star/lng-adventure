import {ADDITIONAL_ART} from './additional-art.js?v=622233be1c3b';
// ImageGen artwork is stored as independent files. Quantities and markings stay in code.
const CLEAN_ART=new Set(["plate","tap","dialScaleBody","berry","carrier-8","carrier-13","limit-16-0","carrier-1","kiwi","bathtub","sweetPotato","potato","carrot","radish","pumpkin","cabbage","limit-15-4","carrier-11"]);
export const artPath=id=>ADDITIONAL_ART[id]||`./assets/art/${id}-${CLEAN_ART.has(id)?'v2':'v1'}.webp`;
export const artImage=(id,x,y,w,h=w)=>`<image class="painted-art" href="${artPath(id)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
export const VESSEL_IDS={물통:'pitcher',물병:'waterBottle',주스병:'juiceBottle',유리컵:'glass',머그컵:'mug',머그잔:'mug',텀블러:'tumbler',유리그릇:'bowl',대접:'bowl',계량컵:'measureJug',꽃병:'vase'};
export function vesselArt(name,state='water-full'){const id=VESSEL_IDS[name]||name;return ['kettle','smallCup','milkCarton','juiceCarton'].includes(id)?id:`${id}-${state}`;}
export const OBJECT_ART={대접:'bowl-empty',주사기:'syringe',양동이:'rainBucket',욕조:'bathtub',물컵:'glass-empty',계량컵:'measureJug-empty',사과:'apple',배:'pear',귤:'mandarin',방울토마토:'tomato',토마토:'tomato',레몬:'lemon',딸기:'strawberry',키위:'kiwi',고구마:'sweetPotato',감자:'potato',당근:'carrot',무:'radish',호박:'pumpkin',배추:'cabbage',양배추:'roundCabbage',감:'persimmon',열매:'berry',참외:'koreanMelon',볼펜:'pen',지우개:'eraser',필통:'pencilCase',구슬:'marble',바둑돌:'goStone',공깃돌:'marble',골프공:'golfBall',두부:'tofu',우유:'milkCarton',주스:'juiceCarton',빵:'breadRoll',주전자:'kettle','작은 컵':'smallCup',우유갑:'milkCarton',주스갑:'juiceCarton',수첩:'limit-16-0',공책:'limit-16-0',책:'limit-2-0',그림책:'limit-6-0',동화책:'limit-6-1',책가방:'carrier-1',신발:'limit-10-1',학용품:'limit-16-4',축구공:'soccerBall',인형:'limit-2-1',장난감:'limit-2-2',풀:'glue',가위:'scissors',통조림:'limit-15-4',멜론:'melon',수박:'watermelon',자전거:'bicycle',텔레비전:'television',트럭:'truck',승용차:'car',물병:'waterBottle-water-full',물통:'pitcher-water-full',꽃병:'vase-water-half',간장:'soySauce',식용유:'cookingOil',추:'metalWeight',분동:'metalWeight','라면 국물':'soup-tomato'};
export function objectArtwork(label,x=0,y=0,w=28){const id=OBJECT_ART[label];return id?artImage(id,x-4,y-4,w+8,w+8):null;}
export function lifeArtwork(row){const i=row.index||0;switch(row.art){
 case'plant':return ['plant-lettuce','plant-tomato','plant-pepper','plant-flower'][i];
 case'watergun':return 'watergun-'+i;
 case'drink':return i===0?'paperCupSmall':i===1?'paperCupLarge':'waterBottle-water-full';
 case'tank':return'aquarium';case'fruit':return ['concentrate-strawberry','concentrate-grape','concentrate-peach','concentrate-lemon'][i];
 case'bubble':return'bubble-'+i;case'paint':return'paint';case'measure':return'measureJug-water-half';
 case'bottle':case'camp':return'waterBottle-water-full';case'rain':return'rainBucket';case'balloon':return'balloon-'+i;
 case'juice':return'glass-juice-full';case'soup':return ['soup-potato','soup-corn','soup-vegetable','soup-tomato'][i];case'rice':return'rice';case'tap':return'tap';case'ice':return'ice';case'vase':return ['vase-small','vase-round','vase-tall','vase-large'][i];case'fountain':return'fountain-'+i;case'snack':return i%2?'glass-juice-full':'glass-milk-full';default:throw Error('Missing picture: '+row.art);
 }}
