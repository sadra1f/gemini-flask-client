# Gemini Flask Client

A Gemini client created using flask.

## Requirements

- Python 3.11
- Node v20
- Yarn Classic

## Setup

1. Copy `.env.example` file and rename it to `.env` and set your Gemini API key there:

    ```sh
    cp .env.example .env
    nano .env

    # Or

    echo "GEMINI_API_KEY=\"Your API Key\"" > .env
    ```

2. You can place your chat history in `history.json` or use its default value:

    ```sh
    nano history.json
    ```

3. Install dependencies:

    ```sh
    pip install pipenv --user

    pipenv install --dev
    yarn install
    ```

4. Build static files:

    ```sh
    pipenv run build
    ```

5. Run the server:

    ```sh
    # Development
    pipenv run dev

    # Production (experimental)
    pipenv run serve
    ```
