export const formatValidationErrors = (errors) => {
  if (!errors) return 'Invalid input';

  if (Array.isArray(errors.issues)) {
    console.log(errors.issues);
    // Collect messages as a single string
    return errors.issues.map(i => i.message).join(', ');
  }

  return JSON.stringify(errors);
};
