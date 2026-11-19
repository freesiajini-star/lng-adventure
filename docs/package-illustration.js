import {renderElectronicWeighing} from './electronic-weighing.js?v=0ff5edc406c1';
import {OBJECT_ART} from './art-catalog.js?v=0ff5edc406c1';
export function renderPackage(v){return renderElectronicWeighing({label:v.label,art:OBJECT_ART[v.label]||'apple',count:v.items||1,total:v.total,container:v.box||v.unknownBox?'상자':null,one:v.one||200});}
