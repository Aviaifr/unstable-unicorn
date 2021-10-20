
export default function getTarget(type: string, special: string | null = null) : string {
  let targets = '';
  switch(type){
    case 'instant': 
      break;
    case 'magic':
      targets = 'discard';
      break;
    case 'upgrade':
      targets = 'upgrade';
      break;
    case 'downgrade':
      targets = 'downgrade';
      break;
    case 'baby':
    case 'magical':
    case 'basic':
      targets = 'stable';
  }
  return targets;
}