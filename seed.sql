INSERT INTO users (username, email) VALUES
    ('dog_lover1', 'dog1@email.com'),
    ('puppy_fan2', 'puppy2@email.com');


INSERT INTO dog_pictures (user_id, image_url, first_guess_breed, second_guess_breed, third_guess_breed, first_guess_confidence, second_guess_confidence, third_guess_confidence) VALUES
    (1, 'https://dog-breed-id-ml-model.s3.us-east-1.amazonaws.com/userPhotos/dog_gh.jpg'),
    (1, 'https://dog-breed-id-ml-model.s3.us-east-1.amazonaws.com/userPhotos/chi.jpg'),
    (2, 'https://dog-breed-id-ml-model.s3.us-east-1.amazonaws.com/userPhotos/images.jpeg'),
    (2, 'https://dog-breed-id-ml-model.s3.us-east-1.amazonaws.com/userPhotos/siberian-husky-dog-standing-on-grass_Edalin-Photography_Shutterstock.jpg');


