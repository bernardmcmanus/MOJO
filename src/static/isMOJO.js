import {
  $_is,
  __$_HANDLE_MOJO
} from 'static/shared';


export default function( subject ) {
  return $_is( subject , 'object' ) && __$_HANDLE_MOJO in subject;
}



















