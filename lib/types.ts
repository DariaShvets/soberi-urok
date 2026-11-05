export type Stage='motivation'|'recall'|'discovery'|'practice'|'feedback'|'reflection';
export type Form='individual'|'pair'|'group'|'class';
export type Source={title:string;url:string;provider:string};
export type Method={id:string;name:string;aliases:string[];summary:string;steps:string[];stages:Stage[];forms:Form[];tags:string[];timeMin:number;timeMax:number;gradesMin:number;gradesMax:number;materials:string;result:string;check:string;sources:Source[];type:string;caution?:string;group:'method'|'filler'|'organizer';origin?:string;examples?:{english?:string;math?:string;history?:string;practical?:string}};
export type Magic={id:string;name:string;category:string;summary:string;goal:string;rules:string[];progress:string;finish:string;learning:string;check:string;examples:{english:string;math:string;history:string};pairs:string[];scope:string;minutes:number;materials:string;adapt:string;launch:string};
export type LessonEntry={id:string;methodId:string;stage:Stage;minutes:number;task:string;evidence:string};
export type Lesson={id?:string;title:string;subject:string;grade:string;duration:number;goal:string;entries:LessonEntry[];magicId:string|null;magicMinutes:number;magicPlan:string;updatedAt?:number};
export const STAGES:{id:Stage;name:string;short:string;description:string;color:string}[]=[
 {id:'motivation',name:'Включение и мотивация',short:'Включение',description:'Заинтересовать и поставить вопрос',color:'#edc3d3'},
 {id:'recall',name:'Актуализация и учебная задача',short:'Актуализация',description:'Вспомнить необходимое и определить цель',color:'#efd99c'},
 {id:'discovery',name:'Освоение нового',short:'Новое знание',description:'Исследовать и открыть способ',color:'#b9d1f2'},
 {id:'practice',name:'Применение и закрепление',short:'Практика',description:'Попробовать, объяснить и перенести',color:'#b6ddca'},
 {id:'feedback',name:'Проверка и обратная связь',short:'Обратная связь',description:'Увидеть понимание и помочь',color:'#d1c1ec'},
 {id:'reflection',name:'Итог и рефлексия',short:'Рефлексия',description:'Осмыслить результат и следующий шаг',color:'#eccab3'},
];
export const FORM_NAMES:Record<Form,string>={individual:'Индивидуально',pair:'В парах',group:'В группах',class:'Всем классом'};
export const freshLesson=():Lesson=>({title:'Новый урок',subject:'',grade:'',duration:40,goal:'',entries:[],magicId:null,magicMinutes:0,magicPlan:''});
