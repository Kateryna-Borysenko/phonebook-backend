# Updating user avatars

Used multipart/form-data for file upload.

Updated the user's avatarURL field with the obtained URL.

## API Endpoint

- Updating user avatars `PATCH /api/users/avatars`

<img src="public/screens/update-avatar.png" width="100%">

---

Processed the uploaded avatar to resize it to 250x250 using the `jimp` package.

<img src="public/screens/db-avatar.png" width="100%">

Saved the user's avatar with a unique name in the public/avatars folder.

<img src="public/screens/vs-avatar.png" width="100%">

## Usage

Use Postman to test the API endpoints by sending requests to
http://localhost:5000/api/

## License

[MIT](https://choosealicense.com/licenses/mit/)
