# Dog Identifier App Backend

## Overview
A Node.js backend for an AI powered dog breed identfiying app.

---

## Technologies Used

### Backend:
- **SQL**: Used for managing user and dog image information.
- **Python**: For developing machine learning models and API logic.
- **Node.js**: Backend logic and endpoint creation.
- **AWS**: Storing user-uploaded images (S3 bucket).
- **FastAPI**: API creation to make the model callable.
- **PyTorch**: Machine learning framework used to train the CNN model.
- **Docker**: Containerizing the model for deployment.
- **Hugging Face**: Hosting the trained ML model for public access.

### Frontend:
- **React Native**: Cross-platform development for mobile and web apps.
- **TypeScript**: Typed language for robust development.
- **Firebase**: User authentication and management.
- **Expo**: Simplified testing and deployment of the React Native app.
- **Tailwind**: Styling the frontend components.

---

## Machine Learning Model

### Dataset
We used a dataset containing tens of thousands of dog photos from [Kaggle](https://www.kaggle.com/). 

### Training Process
- **Framework**: PyTorch.
- **Architecture**: Convolutional Neural Network (CNN).
- **Training Environment**: Google Colab for compute resources.
- **Performance**: Achieved over **90% accuracy** on validation data.

### Deployment
- Made the trained model callable via API using **FastAPI**.
- Containerized the API with **Docker**.
- Deployed the containerized model to [Hugging Face](https://huggingface.co/spaces/Sorei9240/dog-id-api/tree/main) for accessibility.

---

## Backend

### Database
- Created a **PostgreSQL** database to store:
  - User information.
  - Dog images and related data.

### APIs
- Developed endpoints using **Node.js**, **Axios**, and **Express**.
- Hosted the backend services on **Supabase** and **Render**.

### Image Storage
- User-uploaded images (dog photos and avatars) are stored in an **AWS S3 bucket**.
- Integrated a backend pipeline for seamless image storage and retrieval.

---

## App

### Development
- Built using **React Native**, enabling cross-platform support for mobile and web.
- Tested locally using **Expo**, which allowed real-time updates during development.
- [Link to repo](https://github.com/iretunde/DogApp)

### Authentication
- Implemented **Firebase Authentication** to:
  - Manage user sign-ups and logins.
  - Store user emails and unique identifiers.
  - Link users to their respective database entries.

### Frontend Features
- Used **TypeScript** for creating robust and type-safe component files.
- Styled with **Tailwind CSS**, providing responsive and modern UI elements.

---

## How It Works

1. **User Onboarding**:
   - Users sign up and log in using **Firebase Authentication**.
2. **Photo Upload**:
   - Users upload a dog photo via the app.
   - The image is processed and stored in an **AWS S3 bucket**.
3. **Breed Identification**:
   - The uploaded photo is sent to the model API hosted on **Hugging Face**.
   - The API returns the identified breed, which is displayed in the app.
4. **Personalized Dashboard**:
   - Users can view a history of their uploaded photos and identified breeds.

---

## Deployment
- **Backend**: Hosted on **Supabase** and **Render**.
- **Frontend**: Built with **Expo** for mobile and web platforms.

---

## Getting Started

### Prerequisites
- Node.js
- Expo CLI
- Firebase project setup
- AWS credentials for S3 bucket
