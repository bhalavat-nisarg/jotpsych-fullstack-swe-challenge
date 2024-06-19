# Notes

## Backend Changes

### Models

- Update the `User` model in the `models.py` file (or wherever the models are defined) to include additional fields for `name`, `bio`, and `profile_pic_url`.
- These fields will store the user's name, bio, and profile picture URL.

### Register Endpoint

- Modify the `/register` endpoint to handle the additional user data (`name`, `bio`, `profile_pic_url`) in the request body.
- Create a new instance of the `User` model with the additional fields populated from the request data.
- Commit the new user to the database and generate an access token for the user.

### User Endpoint

- Update the `/user` endpoint to return the additional user data (`name`, `bio`, and `profile_pic_url`) in the response JSON.

## Frontend Changes

### Register Component

- Update the `Register.tsx` file to include input fields for `name`, `bio`, and `profilePicUrl`.
- Add state variables and event handlers for these new fields.
- Send these values along with `username` and `password` in the POST request to the `/register` endpoint.

### Profile Component

- Create a new component called `Profile.tsx` to display the user's profile data.
- In this component, fetch the user data from the `/user` endpoint using the access token stored in `localStorage`.
- Display the user's profile picture, name, username, and bio using Material-UI components like `Avatar`, `Typography`, and `Container`.
- Handle loading and error states:
  - If the user data is being fetched, display a loading spinner.
  - If there is no user data (user not authenticated), display a "User not found" message.

### General

- Make sure to update the backend `/user` endpoint to return the necessary user data (`username`, `name`, `bio`, `profile_pic_url`) in the response.
- Handle storing the access token in `localStorage` after successful login or registration on the client-side.
