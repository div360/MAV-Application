@echo on

call venv\Scripts\activate.bat

python manage.py migrate

python manage.py runserver
