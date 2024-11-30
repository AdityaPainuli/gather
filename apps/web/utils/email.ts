/**
 * Email module Future scope - 
 * Can be used for creating a singleton email module that can take all the task of email handling 
 * (i.e. sending email , validation , etc)
 */


/**
 * 
 * @param email 
 * @returns boolean value for validating 
 */
export  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
