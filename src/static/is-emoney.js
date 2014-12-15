import { $_is } from 'static/shared';


export default function( subject ) {
  return $_is( subject , 'object' ) && 'handleE$' in subject;
}



















