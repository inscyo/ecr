export const validations = [
    {
      field: StudentID,
      message:
        "Please ensure you have entered the student ID. This field is required for accurate identification of the student.",
    },
    {
      field: controlnumberref.current,
      message:
        "The control number is a mandatory field. Kindly input the assigned control number for proper record-keeping.",
    },
    {
      field: program,
      message:
        "To proceed, please choose a program from the available options. This information helps us tailor our services to meet your specific academic needs.",
    },
    {
      field: studentemail,
      message:
        "Ensure the email address provided is valid. A valid email is crucial for communication purposes. If unsure, double-check and confirm your email address.",
      isValid: isValidEmail,
    },
    {
      field: studentcontact,
      message:
        "Please enter a valid contact number. This ensures that we can reach you promptly if needed. Check for correct formatting and avoid any additional characters.",
      isValid: isValidPhoneNumber,
    },
    // { field: studentpurpose, message: 'Specify the purpose of your request. Providing a clear purpose helps us understand your needs better and allows for a smoother process.' },
    {
      field: studentdeliverymode,
      message:
        "Choose a preferred delivery mode for your request. This selection ensures that we can fulfill your request in the most convenient way for you.",
    },
    {
      field: studentlineaddress1,
      message:
        "Input your primary line address. This information is vital for the accurate delivery of any physical materials or documents.",
    },
    // { field: studentlineaddress2, message: 'If applicable, provide a secondary line address. This additional information assists us in case of any complexities in the delivery process.' },
    {
      field: studentprovince,
      message:
        "Select the province where you are currently located. This information aids us in understanding your geographical location for various logistical purposes.",
    },
    {
      field: studentmunicipalitycity,
      message:
        "Enter the municipality or city of your residence. This data is necessary for administrative purposes and ensuring accurate service delivery.",
    },
    {
      field: studentcountry,
      message:
        "Choose your country of residence. This information is essential for processing requests based on regional considerations and requirements.",
    },
    {
      field: studentzipcode,
      message:
        "Provide the zip code of your location. This detail helps in streamlining the delivery process and ensures accuracy in the handling of your request.",
    },
  ];