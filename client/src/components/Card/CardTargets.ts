
export default function getTarget(type: string, special: string | null = null) : Array<string> {
  const targets = [];
  switch(type){
    case 'instant': 
      break;
    case 'magic':
      targets.push('discard');
      break;
    case 'upgrade':
    case 'downgrade':
      targets.push('enemytable');
      targets.push('ownStable');
      break;
    case 'baby':
    case 'magical':
    case 'basic':
      targets.push('ownStable');
  }
  return targets;
}