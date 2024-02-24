# Verify User Email

Added user email verification after registration using the
[SendGrid](https://sendgrid.com/) service.

You can use [TempMail](https://temp-mail.org/) to check it out.
<img src="public/screens/temp-mail.png" width="100%">

## How the verification process works

- After registration, the user receives a letter to the e-mail address specified
  during registration with a link to verify his email.

<img src="public/screens/register-vm.png" width="100%">

User will not be able to log in without email confirmation

<img src="public/screens/not-verify-email.png" width="100%">
<img src="public/screens/register-vm-false.png" width="100%">

- After following the link in the received letter, for the first time, the user
  receives

  status 200 `Email confirmed successfully`

<img src="public/screens/letter.png" width="100%">
<img src="public/screens/success.png" width="100%">
<img src="public/screens/register-vm-true.png" width="100%">

- After following the link again, the user receives an Error with the status

  404 `Email not found`

<img src="public/screens/fail.png" width="100%">

## API Endpoints

- Verification request `GET /users/verify/:verificationCode`

- Resend Verification request `POST /users/verify `

Adding a resending email to the user with a link for verification

<img src="public/screens/verify.png" width="100%">

## Usage

Use Postman to test the API endpoints by sending requests to
http://localhost:5000/api/

## License

[MIT](https://choosealicense.com/licenses/mit/)
