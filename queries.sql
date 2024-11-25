SELECT * FROM users;
SELECT * FROM dog_pictures;

SELECT
    u.username,
    d.image_url,
    d.description,
    d.uploaded_at
FROM users u
JOIN dog_pictures d ON u.user_id = d.user_id
ORDER BY d.uploaded_at DESC;
