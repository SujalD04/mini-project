
# Mini Autonomous Inventory Management & Forecasting as a Service

## Key Features & Benefits

* **Data Analysis:** Exploratory data analysis and data preparation using Python and Jupyter Notebooks.
* **Machine Learning:** Implementation of machine learning models using Python.
* **Interactive Inventory App:** A user-friendly inventory management application built with React.
* **Data Visualization:** Visualizing data using libraries such as Recharts within the React application.
* **Modern Frontend Technologies:** Utilizes React, Vite, and Tailwind CSS for a responsive and visually appealing user interface.

## Prerequisites & Dependencies

Before running this project, ensure you have the following installed:

* **Python:** (>= 3.6)
* **Node.js:** (>= 18)
* **npm:** (>= 6) or **Yarn:** (>= 1)

You'll also need the following Python libraries:

```bash
pip install pandas numpy scikit-learn matplotlib seaborn
```

And these Node.js dependencies (install within the `inventory-app` directory):

```bash
cd inventory-app
npm install
# or
yarn install
```

## Installation & Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SujalD04/mini-project.git
   cd mini-project
   ```
2. **Set up the Inventory App:**

   ```bash
   cd inventory-app
   npm install # or yarn install
   ```
3. **Run the Inventory App development server:**

   ```bash
   npm run dev # or yarn dev
   ```

   This will typically start the application at `http://localhost:5173`.
4. **Data analysis and Machine Learning:**

   - Install the required Python libraries as described in the Prerequisites.
   - Open the Jupyter Notebooks (`MiniProj.ipynb`, `MiniProjTraining.ipynb`, `MiniProjectDataPrep.ipynb`) to explore the data analysis and machine learning components.

## Usage Examples & API Documentation (if applicable)

### React Inventory App

The inventory application provides a user interface for managing inventory items.  Consult the `inventory-app/src` directory for component structure and logic. No external API is used. The application fetches data locally and manages it within the React application.

### Data Analysis & Machine Learning

Refer to the Jupyter Notebooks (`MiniProj.ipynb`, `MiniProjTraining.ipynb`, `MiniProjectDataPrep.ipynb`) for examples of data loading, processing, and model training. These notebooks contain detailed explanations and code snippets.

## Configuration Options

### React Inventory App

* Configuration options for the React application can be adjusted in the `inventory-app/vite.config.js` file.
* Styling is managed using Tailwind CSS, configurable through `inventory-app/tailwind.config.js`.

### Environment Variables

No specific environment variables are required for basic usage. If integrating with an external API, define appropriate environment variables within a `.env` file in the `inventory-app` directory.

## Project Structure

```
├── Combined_3_Categories_Processed_Data_V2.csv  # Processed data (3 categories)
├── Combined_5_Categories_Processed_Data_V3.csv  # Processed data (5 categories)
├── MiniProj.ipynb                             # Main Jupyter Notebook
├── MiniProjTraining.ipynb                     # Jupyter Notebook for model training
├── MiniProjectAi.pdf                          # Project presentation (AI portion)
├── MiniProjectDataPrep.ipynb                  # Jupyter Notebook for data preparation
├── ProcessedRetailDataset (1).csv             # Processed retail dataset
├── README.md                                  # This file
└── inventory-app/                              # React-based inventory app
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    └── public/
        ├── vite.svg
    └── src/
        ├── App.css
```

## Contributing Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, descriptive messages.
4. Submit a pull request.

Please ensure your code adheres to the established coding style and includes appropriate tests.

## License Information

This project does not currently have a specific license.  All rights are reserved by the owner.

## Acknowledgments

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Recharts](https://recharts.org/)
* [Heroicons](https://heroicons.com/)
