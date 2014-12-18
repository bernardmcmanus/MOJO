import {
  $_defineProperty,
  $_keys,
  $_ensureFunc
} from 'static/shared';


export default function( subject ) {

  $_defineProperty( subject , '__stack' , {
    value: []
  });

  $_defineProperty( subject , '__inprog' , {
    value: false,
    writable: true
  });

  $_defineProperty( subject , '__events' , {
    get: function() {
      return $_keys( subject.handlers );
    }
  });

  $_defineProperty( subject , 'handlers' , {
    value: {}
  });

  $_defineProperty( subject , 'handleE$' , {
    value: $_ensureFunc( subject.handleE$ ).bind( subject )
  });
}



















