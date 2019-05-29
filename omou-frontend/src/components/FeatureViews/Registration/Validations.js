/*Validations for various text inputs*/

export let InputValidation = (input, type) => {
  switch(type){
      case "number":
          return NumberValidation(input);
      case "phone number":
          return PhoneValidation(input);
      case "email":
          return EmailValidation(input);
      case "short text":
          return ShortTextValidation(input);
      case "address":
          return AddressValidation(input);
      default:
          return false;
  }
};

// Simple Numbers (i.e. grade, age, etc.)
export let NumberValidation = (input) =>{
  return !!input.match(/^[0-9]{1,3}$/);
};

let PhoneValidation = (input) =>{
    return !!input.match(/^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$/);
};

let EmailValidation = (input) =>{
    return !!input.match(/^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/);
};

// Short input fields (i.e. name, school, city etc.)
let ShortTextValidation = (input)=>{
    return !!input.match(/([A-Za-z ]+)(" ")?([A-Za-z ]+)?(" ")?([A-Za-z ]+)?$/)
};

// Address
let AddressValidation = (input) =>{
    return !!input.match(/\d{1,5}\s\w.\s(\b\w*\b\s){1,2}\w*\./);
};