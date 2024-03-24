@echo on

python -m venv venv

call venv\Scripts\activate.bat

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
