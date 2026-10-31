'use strict';
const questions = [
['Basic information','How old are you?',['Under 18','18–20','21–25','26–30','Over 30']],
['Basic information','When did your symptoms begin?',['Less than 2 hours ago','2–6 hours ago','6–12 hours ago','12–24 hours ago','1–3 days ago','More than 3 days ago']],
['Basic information','How did the pain begin?',['Suddenly, very severe from the beginning','Suddenly, but initially mild','Gradually increased over time','Started mildly and became severe']],
['Pain characteristics','Where exactly is the pain?',['Right lower abdomen','Left lower abdomen','Centre of lower abdomen (suprapubic)','Around the belly button','Right upper abdomen','Left upper abdomen','Entire abdomen','Other']],
['Pain characteristics','How severe is your pain right now?',['0','1','2','3','4','5','6','7','8','9','10']],
['Pain characteristics','How would you describe the pain?',['Constant','Comes and goes','Cramping','Sharp/stabbing','Dull/aching','Burning','Pressure-like'],'multi'],
['Pain characteristics','Has the pain moved anywhere?',['Towards the lower right abdomen','Towards the lower left abdomen','Towards the back','Towards the groin','Towards the shoulder','It has not moved'],'multi'],
['Pain characteristics','Does anything make the pain worse?',['Walking or movement','Coughing or sneezing','Pressing on the abdomen','Urinating','Passing stool','Eating','Nothing identifiable'],'multi'],
['Pain characteristics','Has the pain been getting worse?',['Yes, progressively','Yes, but it fluctuates','No, it is improving','It remains the same']],
['Associated symptoms','Are you experiencing nausea?',['Yes','No']],
['Associated symptoms','Have you vomited?',['No','Once','2–3 times','4–5 times','More than 5 times']],
['Associated symptoms','Do you have a fever or chills?',['Yes','No','Unsure']],
['Associated symptoms','Are you experiencing any of the following?',['Dizziness','Feeling faint','Actual fainting','Unusual weakness','Cold sweats','Abdominal bloating','Loss of appetite','Shoulder-tip pain','None of these'],'multi'],
['Associated symptoms','Any vaginal symptoms?',['Vaginal bleeding or spotting','Unusual vaginal discharge','Unusual vaginal odour','Pain during intercourse','None'],'multi'],
['Associated symptoms','Any urinary symptoms?',['Burning when urinating','Frequent urination','Blood in urine','Difficulty urinating','None'],'multi'],
['Associated symptoms','Any bowel symptoms?',['Diarrhoea','Constipation','Pain when passing stool','Blood in stool','Unable to pass gas','None'],'multi'],
['Gynaecological history','When was your last menstrual period?',['Within the last 7 days','1–2 weeks ago','2–3 weeks ago','3–5 weeks ago','More than 5 weeks ago','Irregular periods / unsure']],
['Gynaecological history','Is there any possibility you could be pregnant?',['Yes','No','Unsure','Prefer not to say']],
['Gynaecological history','Are your menstrual cycles usually regular?',['Yes','No','Sometimes']],
['Gynaecological history','Have you previously been diagnosed with ovarian cysts?',['Yes','No','Unsure']],
['Gynaecological history','Have you experienced similar abdominal pain before?',['Yes, several times','Yes, once','No']],
['Gynaecological history','Are you currently using contraception?',['Combined oral contraceptive pill','Progesterone-only pill','Injection','Implant','IUD','None','Other']],
['Medical history','Have you previously had any of the following?',['Ovarian cysts','Endometriosis','Pelvic inflammatory disease','Ectopic pregnancy','Abdominal surgery','Appendicitis','Kidney stones','None'],'multi'],
['Medical history','Have you taken any medication for the pain?',['No','Paracetamol','Ibuprofen','Other']],
['Medical history','Has the medication helped?',['Completely','Partially','Not at all','Not applicable']],
['Immediate safety assessment','Are you currently able to walk normally?',['Yes','Yes, but it hurts','No, the pain prevents me']],
['Immediate safety assessment','Do you feel like you might faint?',['Yes','No']],
['Immediate safety assessment','Is your abdomen extremely tender or hard?',['Yes','No','Unsure']],
['Immediate safety assessment','Is the pain currently unbearable or rapidly worsening?',['Yes','No']]
];
const $=id=>document.getElementById(id);
let index=0,answers={},urgentSeen=false;
function petals(container,count=10,shown=10){container.innerHTML='';for(let i=0;i<count;i++){const p=document.createElement('div');p.className='petal';p.style.transform=`translate(-50%,-100%) rotate(${i*360/count}deg) scale(${i<shown?1:.12})`;p.style.opacity=i<shown?'1':'.08';container.appendChild(p)}}
petals($('heroPetals'));petals($('progressPetals'),10,0);petals($('resultPetals'));
$('year').textContent=new Date().getFullYear();
function start(){index=0;answers={};urgentSeen=false;$('results').classList.add('hidden');$('assessment').classList.remove('hidden');render();$('assessment').scrollIntoView({behavior:'smooth'})}
$('heroStart').onclick=start;$('navStart').onclick=start;$('restartQuiz').onclick=start;
$('exitQuiz').onclick=()=>{$('assessment').classList.add('hidden');$('home').scrollIntoView({behavior:'smooth'})};
function render(){const q=questions[index],a=answers[index]||[];$('sectionName').textContent=q[0].toUpperCase();$('stepCount').textContent=`${String(index+1).padStart(2,'0')} / ${questions.length}`;$('assessmentTitle').textContent=q[1];$('questionHelp').textContent=q[3]==='multi'?'Select all that apply.':'Choose one answer, or continue to skip.';const pct=Math.round(index/questions.length*100);$('progressFill').style.width=pct+'%';$('completionNumber').textContent=pct;petals($('progressPetals'),10,Math.round(pct/10));$('backBtn').disabled=index===0;$('nextBtn').textContent=index===questions.length-1?'See my petal report →':'Continue →';const area=$('options');area.innerHTML='';q[2].forEach((option,j)=>{const label=document.createElement('label');label.className='option'+(a.includes(option)?' selected':'');const input=document.createElement('input');input.type=q[3]==='multi'?'checkbox':'radio';input.name='current';input.value=option;input.checked=a.includes(option);input.onchange=()=>{if(q[3]==='multi'){let next=[...(answers[index]||[])];if(input.checked){if(option.startsWith('None'))next=[option];else{next=next.filter(x=>!x.startsWith('None'));next.push(option)}}else next=next.filter(x=>x!==option);answers[index]=next}else answers[index]=[option];renderOptionsOnly()};label.append(input,document.createTextNode(option));area.append(label)})}
function renderOptionsOnly(){document.querySelectorAll('#options .option').forEach(el=>{const input=el.querySelector('input');const selected=(answers[index]||[]).includes(input.value);input.checked=selected;el.classList.toggle('selected',selected)})}
function has(i,value){return(answers[i]||[]).includes(value)}
function hasAny(i,arr){return arr.some(x=>has(i,x))}
function emergency(){const severe=Number((answers[4]||[])[0])>=8;const sudden=has(2,'Suddenly, very severe from the beginning');const vomiting=!!(answers[10]||[]).length&&!has(10,'No');const pregnancy=hasAny(17,['Yes','Unsure']);const pain=Number((answers[4]||[])[0])>0||!!(answers[3]||[]).length;const bleeding=has(13,'Vaginal bleeding or spotting');const faint=hasAny(12,['Actual fainting','Feeling faint'])||has(26,'Yes');const shoulder=has(12,'Shoulder-tip pain')||has(6,'Towards the shoulder');return has(28,'Yes')||has(27,'Yes')||has(25,'No, the pain prevents me')||faint||(pregnancy&&(pain||bleeding||shoulder))||(sudden&&(severe||vomiting))||(severe&&vomiting)}
function warning(){if(emergency()&&!urgentSeen){urgentSeen=true;$('urgentModal').classList.remove('hidden');$('acknowledgeUrgent').focus()}}
$('acknowledgeUrgent').onclick=()=>$('urgentModal').classList.add('hidden');$('endUrgent').onclick=()=>{$('urgentModal').classList.add('hidden');$('assessment').classList.add('hidden');$('home').scrollIntoView({behavior:'smooth'})};
$('nextBtn').onclick=()=>{if(index===questions.length-1){showResults();return}index++;render();warning();$('assessment').scrollIntoView({behavior:'smooth'})};$('backBtn').onclick=()=>{if(index>0){index--;render()}};
// A non-clinical, deliberately unvalidated symptom checklist. Never interpret as disease probability.
const symptomFlags=[
()=>has(2,'Suddenly, very severe from the beginning'),
()=>Number((answers[4]||[])[0])>=7,
()=>has(8,'Yes, progressively'),
()=>has(9,'Yes'),
()=>!!(answers[10]||[]).length&&!has(10,'No'),
()=>has(11,'Yes'),
()=>hasAny(12,['Dizziness','Feeling faint','Actual fainting','Unusual weakness','Cold sweats']),
()=>hasAny(12,['Abdominal bloating','Loss of appetite']),
()=>has(12,'Shoulder-tip pain'),
()=>hasAny(13,['Vaginal bleeding or spotting','Unusual vaginal discharge','Pain during intercourse']),
()=>hasAny(14,['Burning when urinating','Blood in urine','Difficulty urinating']),
()=>hasAny(15,['Blood in stool','Unable to pass gas']),
()=>hasAny(17,['Yes','Unsure']),
()=>has(25,'No, the pain prevents me'),
()=>has(26,'Yes'),
()=>has(27,'Yes'),
()=>has(28,'Yes')
];
function showResults(){$('assessment').classList.add('hidden');$('results').classList.remove('hidden');petals($('resultPetals'));const total=questions.length,completed=Object.keys(answers).filter(k=>answers[k]?.length).length;const flags=symptomFlags.filter(fn=>fn()).length;const pct=Math.round(flags/symptomFlags.length*100);const urgent=emergency();$('symptomPercent').textContent=pct+'%';$('resultHeadline').textContent=urgent?'Please seek urgent medical care.':pct>50?'Sorry mate, you lowkey need to see a doctor':'Yipeeee';$('resultExplanation').textContent=urgent?'Some of your reported symptoms could indicate an emergency. Please seek emergency assessment now, even if your symptom indicator is below 50%.':pct>50?'You selected several symptom flags. Arrange a prompt clinical assessment. This percentage does not measure the chance of an ovarian condition.':'You completed your check-in. This is not an all-clear: ongoing, unexplained, or worsening symptoms still need medical advice.';$('emergencyResult').classList.toggle('hidden',!urgent);$('emergencyResult').textContent='URGENT: Do not delay care for a questionnaire result. Sudden severe pain, fainting, possible pregnancy with pain/bleeding, or rapidly worsening symptoms require emergency assessment.';const area=$('answerSummary');area.innerHTML='';questions.forEach((q,i)=>{const row=document.createElement('div');row.className='summary-row';const question=document.createElement('strong');question.textContent=(i+1)+'. '+q[1];const response=document.createElement('span');response.textContent=(answers[i]||[]).join('; ')||'Skipped';row.append(question,response);area.append(row)});$('results').scrollIntoView({behavior:'smooth'});}
$('downloadReport').onclick=()=>{const flags=symptomFlags.filter(fn=>fn()).length,pct=Math.round(flags/symptomFlags.length*100);const lines=['CYST HAPPENS | PERSONAL SYMPTOM REPORT','Created: '+new Date().toLocaleString(),'','EDUCATIONAL RECORD ONLY. NOT A DIAGNOSIS OR TUMOUR RISK ESTIMATE.','Symptom checklist indicator: '+pct+'% (unvalidated; not disease likelihood)','Urgent warning signs reported: '+(emergency()?'YES - seek emergency care':'Not identified by this limited questionnaire; this does not rule out an emergency'),'','RESPONSES',''];questions.forEach((q,i)=>lines.push((i+1)+'. '+q[1]+'\n'+((answers[i]||[]).join('; ')||'Skipped')+'\n'));lines.push('Seek medical care for persistent, severe, or worsening symptoms.');const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='cyst-happens-petal-report.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)};
$('clearData').onclick=()=>{answers={};index=0;urgentSeen=false;$('assessment').classList.add('hidden');$('results').classList.add('hidden');alert('Your in-session responses have been cleared. Nothing was uploaded.')};
