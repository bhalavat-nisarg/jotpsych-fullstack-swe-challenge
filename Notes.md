# Notes

## Backend Changes

### Models

- Updated the `User` model to include additional fields for `name`, `bio`, `profile_pic_url`, and `motto`.
- These fields will store the user's name, bio, profile picture URL, and encrypted motto.
- **Encryption**: Integrate the `cryptography` library to encrypt and decrypt the motto field.

### Register Endpoint

- Modify the `/register` endpoint to handle the additional user data (`name`, `bio`, `profile_pic_url`, `motto`) in the request body.
- Encrypt the motto before storing it in the database.
- Create a new instance of the `User` model with the additional fields populated from the request data.
- Commit the new user to the database and generate an access token for the user.

### User Endpoint

- Update the `/user` endpoint to return the additional user data (`name`, `bio`, `profile_pic_url`, and decrypted motto) in the response JSON.
- Decrypt the motto before sending it in the response.

### Middleware

- Implement a version check in the `app.before_request` to ensure the `app-version` header is `>= 1.2.0`. If the version is less, return a message prompting the user to update their client application.

### Transcription Endpoint

- Add an `/upload` endpoint to handle the audio file upload.
- Implement a function to mock sending the audio to a third-party transcription service and return a transcription.
- Save the transcription as the user's motto and encrypt it before storing it in the database.

## Frontend Changes

### APIService

- Update `APIService.ts` to include the `app-version` header with every request.
- Add methods to handle version updates and token storage.

### Register Component

- Update the `Register.tsx` file to include input fields for `name`, `bio`, `profilePicUrl`, and `motto`.
- Add state variables and event handlers for these new fields.
- Send these values along with `username` and `password` in the POST request to the `/register` endpoint.

### Home Component

- Update the `Home.tsx` file to fetch and display the user's profile data, including the decrypted motto.
- Handle loading and error states:
  - If the user data is being fetched, display a loading spinner.
  - If there is no user data (user not authenticated), display a "User not found" message.
- Display the user's profile data using Material-UI components like `Avatar`, `Typography`, and `Container`.

### Profile Component

- Create a new `Profile.tsx` component to display the user's profile data.
- Include the `Recorder` component to allow users to record up to 15 seconds of audio.
- Fetch the user data from the `/user` endpoint using the access token stored in `localStorage`.
- Display the user's profile picture, name, username, bio, and self-recorded motto using Material-UI components like `Avatar`, `Typography`, and `Container`.

### Recorder Component

- Create a `Recorder.tsx` component using the MediaRecorder API to record audio up to a maximum of 15 seconds.
- Send the recorded audio blob to the `/upload` endpoint on the backend.
- Handle recording, stopping, and uploading of the audio file.

### General

- Ensure the backend `/user` endpoint returns the necessary user data (`username`, `name`, `bio`, `profile_pic_url`, and decrypted motto) in the response.
- Handle storing the access token in `localStorage` after successful login or registration on the client-side.
- Display a message in the UI if the server responds with a version update prompt (`426` status code).
