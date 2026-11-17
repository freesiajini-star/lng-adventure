import {renderElectronicWeighing} from './electronic-weighing.js?v=c3242010be6a';
import {OBJECT_ART} from './art-catalog.js?v=c3242010be6a';
export function renderPackage(v){return renderElectronicWeighing({label:v.label,art:OBJECT_ART[v.label]||'apple',count:v.items||1,total:v.total,container:v.box||v.unknownBox?'상자':null,one:v.one||200});}
