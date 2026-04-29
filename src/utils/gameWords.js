// Shared word bank for all game modes
export const EASY_WORDS = [
  'the','and','for','are','but','not','you','all','any','can','had','her','was','one','our','out','day','get','has','him',
  'his','how','man','new','now','old','see','two','way','who','boy','did','its','let','put','say','she','too','use','map',
  'sun','run','fun','big','sit','hot','cat','dog','red','box','car','end','far','ten','try','win','yes','yet','air','arm',
  'art','ask','bad','bag','ban','bar','bay','bed','bit','bus','buy','cut','eat','eye','few','fly','got','gun','hat','ice',
  'job','joy','key','kid','law','lay','leg','lie','lot','low','mad','map','mix','mom','nap','net','nor','odd','oil','own',
];

export const MEDIUM_WORDS = [
  'about','after','again','along','begin','below','bring','build','carry','catch','cause','check','clean','clear','climb',
  'close','cloud','color','comes','could','court','cover','cross','daily','dance','delta','digit','doubt','draft','drawn',
  'dream','drink','drive','earth','eight','enjoy','enter','equal','error','event','every','exist','faith','false','field',
  'fight','final','first','fixed','floor','focus','force','found','frame','front','given','glass','going','grace','grant',
  'graph','great','green','group','grown','guard','guide','happy','heart','heavy','hence','human','image','index','inner',
  'input','issue','judge','keeps','known','large','laser','later','layer','level','light','limit','local','logic','lower',
  'lucky','media','metal','might','model','money','moral','motor','mouse','moved','music','never','night','north','noted',
  'occur','offer','often','opens','order','other','outer','panel','paper','party','phase','phone','pilot','place','plain',
  'plane','plant','plays','point','power','press','price','prime','prior','proof','proud','prove','queen','query','queue',
  'quick','quiet','quite','quote','radio','range','rapid','reach','ready','realm','refer','relay','reply','reset','right',
];

export const HARD_WORDS = [
  'abstract','accuracy','achieve','algorithm','allocate','argument','assembly','bandwidth','behavior','benchmark',
  'breakdown','callback','capacity','cascading','challenge','character','checksum','circular','collision','command',
  'compiler','complex','compress','computed','concept','condition','configure','conflict','connect','constant',
  'contains','context','contract','control','convert','database','debugger','declare','default','deferred','define',
  'delegate','derived','describe','designer','dialogue','dispatch','document','dynamic','encoding','encrypt',
  'endpoint','evaluate','exception','execute','explicit','explorer','extension','external','feedback','fibonacci',
  'firmware','flexible','floating','fragment','framework','function','generate','gradient','graphics','handler',
  'hardware','hierarchy','implicit','incident','indexed','infinite','instance','integer','interface','internal',
  'interval','iterator','keyboard','language','lifetime','listener','manifest','mapping','markdown','maximum',
  'metadata','middleware','minimize','module','mutation','namespace','navigate','network','nullable','observe',
  'optimize','overflow','override','package','parallel','parameter','partition','payload','pipeline','platform',
  'pointer','polymorphic','primitive','process','protocol','provision','publish','reactive','recursive','reference',
  'register','renderer','repository','request','resolve','response','runtime','schedule','sequence','serialize',
  'session','simulate','singular','software','standard','stateless','storage','strategy','structure','subscribe',
  'symmetric','terminal','throttle','timeout','traverse','trigger','typescript','uniform','upstream','validate',
  'variable','velocity','viewport','wildcard','workflow','callback','overhead','singleton','dependency','injection',
];

/**
 * Get a random word from a difficulty-appropriate pool
 * @param {'easy'|'medium'|'hard'} difficulty
 */
export function getRandomWord(difficulty = 'medium') {
  const pool = difficulty === 'easy' ? EASY_WORDS : difficulty === 'hard' ? HARD_WORDS : MEDIUM_WORDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get a batch of unique random words
 * @param {number} count
 * @param {'easy'|'medium'|'hard'} difficulty
 */
export function getRandomWords(count, difficulty = 'medium') {
  const pool = difficulty === 'easy' ? EASY_WORDS : difficulty === 'hard' ? HARD_WORDS : MEDIUM_WORDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
