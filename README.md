# FlavorQuest

FlavorQuest is a food discovery application that allows users to explore recipes, manage their favorites, and interact with comments. It integrates with Spoonacular for recipe data and uses MongoDB for user and comment management. Cloudinary is used for storing user avatars and cover images.

## Features

- **User Management**: Users can create accounts, manage profiles, and upload avatars.
- **Recipe Discovery**: Users can search for recipes, find recipes by ingredients, and view detailed recipe information.
- **Favorites**: Users can save their favorite recipes for easy access.
- **Comments**: Users can comment on recipes and manage their comments.

## Future Plans

- **WebSocket Notifications**: We plan to implement WebSocket support for real-time notifications. This feature will provide users with instant notifications regarding new comments on their recipes and updates on their favorited recipes.


## Technologies Used

- **Backend**: Node.js with Express
- **Database**: MongoDB for storing user data, comments, and favorites
- **Recipe API**: Spoonacular API for recipe data
- **Image Storage**: Cloudinary for user avatar and cover image storage

## Setup

### Prerequisites

- Node.js
- MongoDB instance
- Cloudinary account
- Spoonacular API key

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/flavorquest.git
2. Navigate to the project directory:
   
   ```bash
   git clone https://github.com/yourusername/flavorquest.git
3. Install dependencies:

   ```bash
   npm install
4. Create a .env file in the root directory with the following variables:
   
   ```bash
   MONGO_URI=your_mongodb_uri
   CLOUDINARY_URL=your_cloudinary_url
   SPOONACULAR_BASE_URL=https://api.spoonacular.com/recipes
   SPOONACULAR_API_KEY=your_spoonacular_api_key
   
3. Start the application:

   ```bash
   Start the application
