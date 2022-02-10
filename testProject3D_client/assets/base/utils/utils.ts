/**
 * Create by Jin on 2022.2.10
 */ 


 export namespace utils {
    export  function isValidKey(key: string | number | symbol | any, object: object): key is keyof typeof object {
        return key in object;
      }
 }

 