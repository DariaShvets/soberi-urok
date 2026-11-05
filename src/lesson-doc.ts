import textToDoc from '../vendor/jsdoc/text-to-doc.mjs';
import type {DocModel,DocParagraph} from '../vendor/jsdoc/text-to-doc.mjs';
import {STAGES} from '../lib/types.ts';
import type {Lesson,Method,Magic} from '../lib/types.ts';

export const WORD_MIME='application/msword';

// Keep user text as editable Unicode, without Word's field/control characters.
const clean=(value:unknown)=>String(value??'').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g,'').replace(/\r\n?/g,'\n');

export function lessonDocFilename(title:string):string{
 const stem=clean(title).trim().replace(/[\\/:*?"<>|]/g,'_').replace(/[. ]+$/g,'').slice(0,100)||'Мой_урок';
 return stem+'.doc';
}

export function createLessonDoc(lesson:Lesson,methods:Method[],magic?:Magic){
 const body:DocParagraph[]=[];
 const add=(value:unknown,size=11,bold=false,heading=false)=>{
  for(const text of clean(value).split('\n'))body.push({kind:'p',runs:[{text,font:'Arial',size,b:bold,color:0}],pp:{spA:100,spB:heading?180:0,line:276,lineMult:1,keepNext:heading,keepLines:text.length<800}});
 };
 const heading=(text:string)=>add(text,14,true,true);
 const label=(text:string)=>add(text,11,true,true);
 const map=new Map(methods.map(method=>[method.id,method]));

 add(lesson.title.trim()||'План урока',20,true,true);
 add('Предмет: '+(lesson.subject.trim()||'Не указан'));
 add('Класс: '+(lesson.grade||'Не указан'));
 add('Длительность: '+lesson.duration+' мин');
 heading('Учебный результат');
 add(lesson.goal||'Уточните ожидаемый результат.');
 heading('Маршрут урока');

 if(!lesson.entries.length)add('Добавьте приёмы и задания в конструкторе.');
 for(const [index,entry] of lesson.entries.entries()){
  const method=map.get(entry.methodId),stage=STAGES.find(stage=>stage.id===entry.stage);
  heading(`${index+1}. ${stage?.name||'Этап урока'}`);
  add(`${method?.name||'Приём'} · ${entry.minutes} мин`,12,true);
  label('Задание');
  add(entry.task||method?.summary||'Уточните задание.');
  label('Результат и проверка');
  add(entry.evidence||method?.check||'Уточните способ проверки результата.');
  if(method){
   label('Алгоритм приёма');
   method.steps.forEach((step,index)=>add(`${index+1}. ${step}`));
   if(method.materials){label('Материалы');add(method.materials);}
   if(method.sources.length){
    label('Источники');
    method.sources.forEach(source=>{add(source.provider+': '+source.title,10);add(source.url,10);});
   }
  }
 }

 if(magic){
  heading('Игровая механика');
  add(magic.name,12,true);
  add(lesson.magicPlan||magic.launch);
  label('Правила');
  magic.rules.forEach((rule,index)=>add(`${index+1}. ${rule}`));
  label('Условие завершения');
  add(magic.finish);
  add(`Ввод правил: ${lesson.magicMinutes} мин`);
 }
 add('Создано в «Собери урок». Время приёмов уточняется под материал и класс.',10);

 const model:DocModel={body,page:{width:11906,height:16838,top:1134,bottom:1134,left:1134,right:1134}};
 return {filename:lessonDocFilename(lesson.title),mime:WORD_MIME,bytes:textToDoc(model)};
}

export function downloadLessonDoc(lesson:Lesson,methods:Method[],magic?:Magic):void{
 const file=createLessonDoc(lesson,methods,magic);
 const url=URL.createObjectURL(new Blob([new Uint8Array(file.bytes).buffer],{type:file.mime}));
 const link=document.createElement('a');
 link.href=url;
 link.download=file.filename;
 link.style.display='none';
 document.body.appendChild(link);
 link.click();
 link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30_000);
}
