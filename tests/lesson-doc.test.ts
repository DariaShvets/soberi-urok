import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createLessonDoc,lessonDocFilename} from '../src/lesson-doc.ts';
import type {Lesson,Method,Magic} from '../lib/types.ts';
const readDoc=createRequire(import.meta.url)('./vendor/doc-reader.cjs');
const methods=JSON.parse(readFileSync(new URL('../data/curated.json',import.meta.url),'utf8')) as Method[];
const magic=JSON.parse(readFileSync(new URL('../data/magic.json',import.meta.url),'utf8'))[0] as Magic;
const method=methods.find(method=>method.id==='fishbone')!;
const lesson:Lesson={title:'Причины и факты',subject:'Английский язык',grade:'9',duration:40,goal:'Объяснить связь причины и факта',entries:[{id:'218b68e1-cc94-440a-9b97-5521db7b8aba',methodId:method.id,stage:'discovery',minutes:12,task:'Сравните причины.\nПриведите два факта из текста.',evidence:'Пара объясняет две связи.'}],magicId:magic.id,magicMinutes:2,magicPlan:'Найдите доказательства и завершите миссию.'};

test('Plan export is a binary Word document with intact Russian text, tasks and mechanics',()=>{
 const file=createLessonDoc(lesson,methods,magic);
 assert.equal(file.filename,'Причины и факты.doc');
 assert.equal(file.mime,'application/msword');
 assert.deepEqual([...file.bytes.slice(0,8)],[0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1]);
 const text=readDoc(file.bytes);
 for(const value of [lesson.title,lesson.subject,lesson.goal,'9','40','Освоение нового',method.name,'Сравните причины.','Приведите два факта из текста.',lesson.entries[0].evidence,method.steps[0],method.sources[0].url,magic.name,lesson.magicPlan,magic.finish])assert.ok(text.includes(value),'Missing content: '+value);
 const html=readDoc.html(file.bytes).body;
 assert.match(html,/font-weight:bold/);
 assert.match(html,/font-size:20pt/);
});

test('Empty plans and missing method references produce readable Word documents',()=>{
 const empty={...lesson,title:'',entries:[],magicId:null,magicMinutes:0,magicPlan:''};
 assert.match(readDoc(createLessonDoc(empty,[]).bytes),/План урока[\s\S]*Добавьте приёмы/);
 const fallback=readDoc(createLessonDoc(lesson,[]).bytes);
 assert.ok(fallback.includes(lesson.entries[0].task.split('\n')[1]));
 assert.ok(fallback.includes(lesson.entries[0].evidence));
});

test('Filenames are safe and special characters remain literal editable text',()=>{
 assert.equal(lessonDocFilename('  Урок / 9: А?  '),'Урок _ 9_ А_.doc');
 assert.equal(lessonDocFilename('...'),'Мой_урок.doc');
 const unsafe={...lesson,goal:'<script>alert("текст")</script> & \\ {слова} 😀\u0013'};
 const text=readDoc(createLessonDoc(unsafe,methods).bytes);
 assert.ok(text.includes('<script>alert("текст")</script> & \\ {слова} 😀'));
 assert.ok(!text.includes('\u0013'));
});
